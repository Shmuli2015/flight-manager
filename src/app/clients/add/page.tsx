'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useClients } from '@/hooks/useClients';

const clientSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  birthday: z.string().min(1, 'Birthday is required'),
  client_group_id: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

export default function AddClientPage() {
  const router = useRouter();
  const { addOnClient } = useClients();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  });

  const onSubmit = async (data: ClientFormData) => {
    await addOnClient(data);
    router.push('/clients');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Client</h1>
              <p className="mt-1 text-sm text-gray-500">Fill in the client's information below.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="first_name"
                    {...register('first_name')}
                    className={`block w-full rounded-lg px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 shadow-sm ${errors.first_name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                      }`}
                  />
                </div>
                {errors.first_name && (
                  <p className="mt-2 text-sm text-red-600">{errors.first_name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="last_name"
                    {...register('last_name')}
                    className={`block w-full rounded-lg px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 shadow-sm ${errors.last_name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                      }`}
                  />
                </div>
                {errors.last_name && (
                  <p className="mt-2 text-sm text-red-600">{errors.last_name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className={`block w-full rounded-lg px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 shadow-sm ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                      }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <div className="mt-1">
                  <input
                    type="tel"
                    id="phone"
                    {...register('phone')}
                    className={`block w-full rounded-lg px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 shadow-sm ${errors.phone ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                      }`}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">
                  Birthday
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    id="birthday"
                    {...register('birthday')}
                    className={`block w-full rounded-lg px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 shadow-sm ${errors.birthday ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                      }`}
                  />
                </div>
                {errors.birthday && (
                  <p className="mt-2 text-sm text-red-600">{errors.birthday.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="client_group_id" className="block text-sm font-medium text-gray-700">
                  Client Group
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="client_group_id"
                    {...register('client_group_id')}
                    className={`block w-full rounded-lg px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 shadow-sm ${errors.client_group_id ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                      }`}
                  />
                </div>
                {errors.client_group_id && (
                  <p className="mt-2 text-sm text-red-600">{errors.client_group_id.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push('/clients')}
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  'Add Client'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 