import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Client {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    created_at: string;
}

interface RecentClientsProps {
    clients: Client[];
}

export default function RecentClients({ clients }: RecentClientsProps) {
    const router = useRouter();

    return (
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-5">Recent Clients</h2>
            <div className="space-y-4">
                {clients.length > 0 ? clients.map((client) => (
                    <div
                        key={client.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition duration-200 shadow-sm border border-gray-200"
                        onClick={() => router.push(`/clients/${client.id}`)}
                    >
                        <div>
                            <p className="font-medium text-gray-900 text-lg">{`${client.first_name} ${client.last_name}`}</p>
                            <p className="text-sm text-gray-600">{client.email}</p>
                        </div>
                        <span className="text-sm text-gray-500 font-medium">{new Date(client.created_at).toLocaleDateString()}</span>
                    </div>
                )) : (
                    <div className="flex justify-center">
                        <p className="text-sm text-gray-500">No recent clients</p>
                    </div>
                )}
                <div className="flex justify-center">
                    <Link href="/clients" className="text-blue-600 hover:underline text-sm font-medium mt-4">View All</Link>
                </div>
            </div>
        </div>
    );
}