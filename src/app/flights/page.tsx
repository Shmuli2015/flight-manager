'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

type Flight = Database['public']['Tables']['flights']['Row'];
type Client = Database['public']['Tables']['clients']['Row'];

const flightSchema = z.object({
  client_id: z.string().min(1, 'Client is required'),
  flight_date: z.string().min(1, 'Flight date is required'),
  cost_type: z.enum(['Paid', 'Free']),
  charged_amount: z.number().min(0, 'Amount must be positive'),
  currency: z.enum(['₪', '$']),
  amount_due: z.number().min(0, 'Amount must be positive'),
  payment_status: z.enum(['Paid', 'Unpaid']),
  flight_status: z.enum(['Upcoming', 'Completed', 'Canceled']),
});

type FlightFormData = z.infer<typeof flightSchema>;

export default function FlightsPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<Flight['flight_status'] | 'all'>('all');
  const [filterPayment, setFilterPayment] = useState<Flight['payment_status'] | 'all'>('all');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FlightFormData>({
    resolver: zodResolver(flightSchema),
  });

  useEffect(() => {
    fetchFlights();
    fetchClients();

    const flightsSubscription = supabase
      .channel('flights_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'flights' }, fetchFlights)
      .subscribe();

    const clientsSubscription = supabase
      .channel('clients_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, fetchClients)
      .subscribe();

    return () => {
      flightsSubscription.unsubscribe();
      clientsSubscription.unsubscribe();
    };
  }, []);

  const fetchFlights = async () => {
    try {
      const { data, error } = await supabase
        .from('flights')
        .select('*')
        .order('flight_date', { ascending: true });

      if (error) throw error;
      setFlights(data || []);
    } catch (error) {
      console.error('Error fetching flights:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('first_name', { ascending: true });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const onSubmit = async (data: FlightFormData) => {
    try {
      const { error } = await supabase.from('flights').insert([data]);

      if (error) throw error;

      reset();
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding flight:', error);
    }
  };

  const filteredFlights = flights.filter((flight) => {
    const client = clients.find((c) => c.id === flight.client_id);
    const matchesSearch =
      client?.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client?.last_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || flight.flight_status === filterStatus;
    const matchesPayment = filterPayment === 'all' || flight.payment_status === filterPayment;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Flights</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {showAddForm ? 'Cancel' : 'Add Flight'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="client_id" className="block text-sm font-medium text-gray-700">
                Client
              </label>
              <select
                id="client_id"
                {...register('client_id')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.first_name} {client.last_name}
                  </option>
                ))}
              </select>
              {errors.client_id && (
                <p className="mt-1 text-sm text-red-600">{errors.client_id.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="flight_date" className="block text-sm font-medium text-gray-700">
                Flight Date
              </label>
              <input
                type="datetime-local"
                id="flight_date"
                {...register('flight_date')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.flight_date && (
                <p className="mt-1 text-sm text-red-600">{errors.flight_date.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="cost_type" className="block text-sm font-medium text-gray-700">
                Cost Type
              </label>
              <select
                id="cost_type"
                {...register('cost_type')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="Paid">Paid</option>
                <option value="Free">Free</option>
              </select>
              {errors.cost_type && (
                <p className="mt-1 text-sm text-red-600">{errors.cost_type.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="charged_amount" className="block text-sm font-medium text-gray-700">
                Charged Amount
              </label>
              <input
                type="number"
                id="charged_amount"
                step="0.01"
                {...register('charged_amount', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.charged_amount && (
                <p className="mt-1 text-sm text-red-600">{errors.charged_amount.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                Currency
              </label>
              <select
                id="currency"
                {...register('currency')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="₪">₪</option>
                <option value="$">$</option>
              </select>
              {errors.currency && (
                <p className="mt-1 text-sm text-red-600">{errors.currency.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="amount_due" className="block text-sm font-medium text-gray-700">
                Amount Due
              </label>
              <input
                type="number"
                id="amount_due"
                step="0.01"
                {...register('amount_due', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.amount_due && (
                <p className="mt-1 text-sm text-red-600">{errors.amount_due.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="payment_status" className="block text-sm font-medium text-gray-700">
                Payment Status
              </label>
              <select
                id="payment_status"
                {...register('payment_status')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
              {errors.payment_status && (
                <p className="mt-1 text-sm text-red-600">{errors.payment_status.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="flight_status" className="block text-sm font-medium text-gray-700">
                Flight Status
              </label>
              <select
                id="flight_status"
                {...register('flight_status')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
                <option value="Canceled">Canceled</option>
              </select>
              {errors.flight_status && (
                <p className="mt-1 text-sm text-red-600">{errors.flight_status.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Flight
            </button>
          </div>
        </form>
      )}

      <div className="mt-6">
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <input
            type="text"
            placeholder="Search flights..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as Flight['flight_status'] | 'all')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
            <option value="Canceled">Canceled</option>
          </select>
          <select
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value as Flight['payment_status'] | 'all')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="all">All Payment Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredFlights.map((flight) => {
              const client = clients.find((c) => c.id === flight.client_id);
              return (
                <li key={flight.id}>
                  <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-indigo-600 truncate">
                        {client?.first_name} {client?.last_name}
                      </div>
                      <div className="ml-2 flex-shrink-0 flex space-x-2">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            flight.payment_status === 'Paid'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {flight.payment_status}
                        </span>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            flight.flight_status === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : flight.flight_status === 'Canceled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {flight.flight_status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <svg
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {new Date(flight.flight_date).toLocaleString()}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <svg
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {flight.charged_amount} {flight.currency}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <svg
                          className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {flight.amount_due} {flight.currency} due
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
} 