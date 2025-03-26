import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';

type Stats = {
  totalClients: number;
  totalFlights: number;
  completedFlights: number;
  unpaidFlights: number;
};

type Client = Database['public']['Tables']['clients']['Row'];
type Flight = Database['public']['Tables']['flights']['Row'] & {
  clients?: {
    first_name: string;
    last_name: string;
    email: string;
  };
};

export function useDashboardData() {
  const [stats, setStats] = useState<Stats>({
    totalClients: 0,
    totalFlights: 0,
    completedFlights: 0,
    unpaidFlights: 0,
  });
  const [recentClients, setRecentClients] = useState<Client[]>([]);
  const [unpaidFlights, setUnpaidFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { count: totalClients } = await supabase
          .from('clients')
          .select('*', { count: 'exact', head: true });

        const { count: totalFlights } = await supabase
          .from('flights')
          .select('*', { count: 'exact', head: true });

        const { count: completedFlights } = await supabase
          .from('flights')
          .select('*', { count: 'exact', head: true })
          .eq('flight_status', 'Completed');

        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const { data: recentClientsData } = await supabase
          .from('clients')
          .select('*')
          .gte('created_at', oneMonthAgo.toISOString())
          .order('created_at', { ascending: false })
          .limit(5);

        const { data: unpaidFlightsData } = await supabase
          .from('flights')
          .select(`*, clients (first_name, last_name, email)`)
          .eq('payment_status', 'Unpaid')
          .order('created_at', { ascending: false })
          .limit(5);

        setStats({
          totalClients: totalClients || 0,
          totalFlights: totalFlights || 0,
          completedFlights: completedFlights || 0,
          unpaidFlights: unpaidFlightsData?.length || 0,
        });
        setRecentClients(recentClientsData || []);
        setUnpaidFlights(unpaidFlightsData || []);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

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

  return { stats, recentClients, unpaidFlights, loading };
}