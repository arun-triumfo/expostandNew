import { Link, router, usePage } from '@inertiajs/react';
import { CalendarRange, ClipboardList, Globe, LayoutDashboard, LogOut, MapPin, Menu, Newspaper, Package, Store, Users, X } from 'lucide-react';
import { useState } from 'react';

const nav = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Quotations', href: '/quotation', icon: ClipboardList },
    { name: 'Package purchased', href: '/package-purchased', icon: Package },
    { name: 'Stand builders', href: '/standbuilders', icon: Store },
    { name: 'Countries', href: '/admin/view-country', icon: Globe },
    { name: 'Cities', href: '/admin/view-city', icon: MapPin },
    { name: 'Site users', href: '/admin/users', icon: Users },
    { name: 'Trade Shows', href: '/admin/view-tradeshow', icon: CalendarRange },
    { name: 'Blog', href: '/admin/view-blog', icon: Newspaper },
];

export default function AdminLayout({ title, children }) {
    const { auth } = usePage().props;
    const admin = auth?.admin;
    const [open, setOpen] = useState(false);

    const logout = () => {
        router.post(route('admin.logout'));
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <div
                className={`fixed inset-0 z-40 bg-slate-900/40 transition lg:hidden ${open ? 'block' : 'hidden'}`}
                onClick={() => setOpen(false)}
                aria-hidden="true"
            />

            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-slate-200 bg-white shadow-sm transition duration-200 ease-out lg:translate-x-0 ${
                    open ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4">
                    <Link href="/admin/dashboard" className="text-lg font-semibold tracking-tight text-slate-900">
                        ExpoStandZone
                    </Link>
                    <button type="button" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(false)}>
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <nav className="space-y-1 p-3">
                    {nav.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                            >
                                <Icon className="h-5 w-5 shrink-0 text-indigo-500" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            <div className="min-w-0 w-full lg:pl-64">
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                            onClick={() => setOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <h1 className="text-base font-semibold text-slate-900">{title}</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="hidden text-sm text-slate-600 sm:inline">{admin?.name}</span>
                        <button
                            type="button"
                            onClick={logout}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </div>
                </header>

                <main className="w-full max-w-none p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
