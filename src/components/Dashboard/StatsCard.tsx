import { Users, Plane, CheckCircle, CreditCard, LucideIcon } from 'lucide-react';

interface StatsCardProps {
    icon: keyof typeof icons;
    title: string;
    value: number;
}

const icons: { [key: string]: React.ReactElement<React.ComponentProps<LucideIcon>> } = {
    Users: <Users className="h-10 w-10 text-indigo-600" />,
    Plane: <Plane className="h-10 w-10 text-indigo-600" />,
    CheckCircle: <CheckCircle className="h-10 w-10 text-green-500" />,
    CreditCard: <CreditCard className="h-10 w-10 text-red-500" />,
};

export default function StatsCard({ icon, title, value }: StatsCardProps) {
    return (
        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between space-x-6 hover:shadow-2xl transition-shadow duration-300 ease-in-out flex-col sm:flex-row">
            <div className="flex items-center sm:space-x-6 flex-col sm:flex-row">
                {icons[icon]}
                <div className="flex-1 mt-4 sm:mt-0">
                    <dl className="text-center sm:text-left">
                        <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</dt>
                        <dd className="mt-1 text-3xl font-bold text-gray-900">{value}</dd>
                    </dl>
                </div>
            </div>
        </div>
    );
}