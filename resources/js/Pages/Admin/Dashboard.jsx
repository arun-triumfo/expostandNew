import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Package, Users, FileText } from 'lucide-react';

export default function Dashboard({ stats }) {
    const cards = [
        { label: 'Stand builders', value: stats.standbuilders, icon: Users, tone: 'from-indigo-500 to-violet-600' },
        { label: 'Leads (quotes)', value: stats.leads, icon: FileText, tone: 'from-emerald-500 to-teal-600' },
        { label: 'Package records', value: stats.packages, icon: Package, tone: 'from-amber-500 to-orange-600' },
    ];

    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />

            <div className="mb-8">
                <p className="text-slate-600">Overview of key metrics from your existing database.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((c) => {
                    const Icon = c.icon;
                    return (
                        <div
                            key={c.label}
                            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                        >
                            <div className={`bg-gradient-to-br ${c.tone} px-5 py-4 text-white`}>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium opacity-90">{c.label}</span>
                                    <Icon className="h-6 w-6 opacity-90" />
                                </div>
                                <p className="mt-3 text-3xl font-semibold tabular-nums">{c.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </AdminLayout>
    );
}
