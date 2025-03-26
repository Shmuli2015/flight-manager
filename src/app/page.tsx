'use client';

import StatsCard from '@/components/Dashboard/StatsCard';
import RecentClients from '@/components/Dashboard/RecentClients';
import UnpaidFlights from '@/components/Dashboard/UnpaidFlights';
import { useDashboardData } from '@/hooks/useDashboardData';
import Loading from '@/components/Loading';

export default function DashboardPage() {
  const { stats, recentClients, unpaidFlights, loading } = useDashboardData();

  if (loading) return <Loading text="Loading dashboard..." />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon="Users"
          title="Total Clients"
          value={stats.totalClients}
        />
        <StatsCard
          icon="Plane"
          title="Total Flights"
          value={stats.totalFlights}
        />
        <StatsCard
          icon="CheckCircle"
          title="Completed Flights"
          value={stats.completedFlights}
        />
        <StatsCard
          icon="CreditCard"
          title="Unpaid Flights"
          value={stats.unpaidFlights}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentClients clients={recentClients} />
        <UnpaidFlights flights={unpaidFlights} />
      </div>
    </div>
  );
}