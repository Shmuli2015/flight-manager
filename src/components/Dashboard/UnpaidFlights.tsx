import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Flight {
    id: string;
    clients?: {
        first_name: string;
        last_name: string;
        email: string;
    };
}

interface UnpaidFlightsProps {
    flights: Flight[];
}

export default function UnpaidFlights({ flights }: UnpaidFlightsProps) {
    const router = useRouter();

    return (
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-5">Unpaid Flights</h2>
            <div className="space-y-4">
                {flights.length > 0 ? flights.map((flight) => (
                    <div
                        key={flight.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition duration-200 shadow-sm border border-gray-200"
                        onClick={() => router.push(`/flights/${flight.id}`)}
                    >
                        <div>
                            <p className="font-medium text-gray-900 text-lg">
                                {flight.clients ? `${flight.clients.first_name} ${flight.clients.last_name}` : 'Unknown Client'}
                            </p>
                            <p className="text-sm text-gray-600">Flight ID: {flight.id}</p>
                        </div>
                        <span className="text-sm text-red-500 font-medium bg-red-100 px-3 py-1 rounded-full">Unpaid</span>
                    </div>
                )) : (
                    <div className="flex justify-center">
                        <p className="text-sm text-gray-500">No unpaid flights</p>
                    </div>
                )}
                <div className="flex justify-center">
                    <Link href="/flights" className="text-blue-600 hover:underline text-sm font-medium mt-4">View All</Link>
                </div>
            </div>
        </div>
    );
}