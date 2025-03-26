'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';
import { Users, Plane, CheckCircle, CreditCard } from 'lucide-react';

type Stats = {
  totalClients: number;
  totalFlights: number;
  completedFlights: number;
  unpaidClients: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalClients: 0,
    totalFlights: 0,
    completedFlights: 0,
    unpaidClients: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total clients
        const { count: totalClients } = await supabase
          .from('clients')
          .select('*', { count: 'exact', head: true });

        // Get total flights
        const { count: totalFlights } = await supabase
          .from('flights')
          .select('*', { count: 'exact', head: true });

        // Get completed flights
        const { count: completedFlights } = await supabase
          .from('flights')
          .select('*', { count: 'exact', head: true })
          .eq('flight_status', 'Completed');

        // Get unpaid clients
        const { data: unpaidFlights } = await supabase
          .from('flights')
          .select('client_id')
          .eq('payment_status', 'Unpaid');

        const unpaidClientIds = unpaidFlights?.map(flight => flight.client_id) || [];

        const { count: unpaidClients } = await supabase
          .from('clients')
          .select('*', { count: 'exact', head: true })
          .eq('service_type', 'Paid')
          .in('id', unpaidClientIds);

        setStats({
          totalClients: totalClients || 0,
          totalFlights: totalFlights || 0,
          completedFlights: completedFlights || 0,
          unpaidClients: unpaidClients || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Subscribe to changes
    const clientsSubscription = supabase
      .channel('clients_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, fetchStats)
      .subscribe();

    const flightsSubscription = supabase
      .channel('flights_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'flights' }, fetchStats)
      .subscribe();

    return () => {
      clientsSubscription.unsubscribe();
      flightsSubscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow-lg rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <Users className="h-8 w-8 text-indigo-500" />
            <div className="flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Total Clients</dt>
                <dd className="text-xl font-semibold text-gray-900">{stats.totalClients}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <Plane className="h-8 w-8 text-indigo-500" />
            <div className="flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Total Flights</dt>
                <dd className="text-xl font-semibold text-gray-900">{stats.totalFlights}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div className="flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Completed Flights</dt>
                <dd className="text-xl font-semibold text-gray-900">{stats.completedFlights}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <CreditCard className="h-8 w-8 text-red-500" />
            <div className="flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Unpaid Clients</dt>
                <dd className="text-xl font-semibold text-gray-900">{stats.unpaidClients}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}