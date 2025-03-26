import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/supabase';
import { toast } from 'sonner';

type Client = Database['public']['Tables']['clients']['Row'];

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const mockData: Client[] = [
    {
      id: '1',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      birthday: '1990-01-01',
      client_group_id: '1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@example.com',
      phone: '098-765-4321',
      birthday: '1985-05-15',
      client_group_id: '2',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    // Commented out the real API call and using mock data for now
    setClients(mockData);
    setLoading(false);

    // const fetchClients = async () => {
    //   try {
    //     const { data, error } = await supabase
    //       .from('clients')
    //       .select('*')
    //       .order('created_at', { ascending: false });

    //     if (error) throw error;
    //     setClients(data || []);
    //   } catch (error) {
    //     console.error('Error fetching clients:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // fetchClients();
  }, []);

  const addOnClient = async (data: any) => {
    try {
      const { error } = await supabase.from('clients').insert([data]);

      if (error) throw error;
      toast.success('Client added successfully');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Error adding client');
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    clients: filteredClients,
    loading,
    showAddForm,
    setShowAddForm,
    searchTerm,
    setSearchTerm,
    addOnClient,
  };
}
