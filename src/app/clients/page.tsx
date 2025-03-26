'use client';

import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';
import { useClients } from '@/hooks/useClients';
import { Plus } from 'lucide-react';
import ClientList from '@/components/Clients/ClientList';
import ClientSearch from '@/components/Clients/ClientSearch';

export default function ClientsPage() {
  const router = useRouter();
  const { clients, loading, searchTerm, setSearchTerm } = useClients();

  if (loading) return <Loading text="Loading clients..." />;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">Client Management</h1>
        <button
          onClick={() => router.push('/clients/add')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center cursor-pointer">
          Add New Client
          <Plus className="ml-2 h-5 w-5" />
        </button>
      </div>

      <div className="mt-6">
        <ClientSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <ClientList clients={clients} />
      </div>
    </div>
  );
}