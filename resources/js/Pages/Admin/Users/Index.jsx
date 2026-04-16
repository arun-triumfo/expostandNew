import TablePagination from '@/Components/Admin/TablePagination';
import AdminLayout from '@/Layouts/AdminLayout';
import { serialNumber } from '@/utils/adminTableSerial';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, Pencil, Search } from 'lucide-react';
import { useState } from 'react';

export default function Index({ users, stats, filters, usertypeOptions }) {
    const { flash } = usePage().props;
    const rows = users?.data ?? [];
    const [search, setSearch] = useState(filters?.search ?? '');
    const [usertype, setUsertype] = useState(filters?.usertype ?? '');
    const [status, setStatus] = useState(filters?.status ?? '');
    const [verifystatus, setVerifystatus] = useState(filters?.verifystatus ?? '');

    const applyFilters = (e) => {
        e?.preventDefault();
        router.get(
            route('admin.users.index'),
            {
                search: search || undefined,
                usertype: usertype || undefined,
                status: status === '' ? undefined : status,
                verifystatus: verifystatus === '' ? undefined : verifystatus,
            },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AdminLayout title="Site users">
            <Head title="Site users" />

            {flash?.success ? (
                <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{flash.success}</div>
            ) : null}
            {flash?.error ? (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{flash.error}</div>
            ) : null}

            <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">User management</h2>
                <p className="mt-1 text-sm text-slate-500">Public registrations (`usermasters`) — same scope as legacy `admin/users`.</p>
            </div>

            {stats && (
                <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: 'Total', value: stats.totalUsers },
                        { label: 'Active', value: stats.activeUsers },
                        { label: 'Verified', value: stats.verifiedUsers },
                        { label: 'Stand builders', value: stats.standbuilders },
                        { label: 'Exhibitors', value: stats.exhibitors },
                        { label: 'Agencies', value: stats.agencies },
                        { label: 'Organisers', value: stats.organisers },
                        { label: 'Hostess agencies', value: stats.hostessagencies },
                    ].map((s) => (
                        <div key={s.label} className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{s.label}</div>
                            <div className="mt-1 text-2xl font-semibold text-slate-900">{s.value}</div>
                        </div>
                    ))}
                </div>
            )}

            <form onSubmit={applyFilters} className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:flex-wrap lg:items-end">
                <div className="min-w-[180px] flex-1">
                    <label className="text-xs font-medium text-slate-600">Search</label>
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Name, email, phone…"
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />
                </div>
                <div className="min-w-[140px]">
                    <label className="text-xs font-medium text-slate-600">User type</label>
                    <select
                        value={usertype}
                        onChange={(e) => setUsertype(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    >
                        <option value="">All</option>
                        {(usertypeOptions ?? []).map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="min-w-[120px]">
                    <label className="text-xs font-medium text-slate-600">Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    >
                        <option value="">All</option>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                    </select>
                </div>
                <div className="min-w-[140px]">
                    <label className="text-xs font-medium text-slate-600">Verified</label>
                    <select
                        value={verifystatus}
                        onChange={(e) => setVerifystatus(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    >
                        <option value="">All</option>
                        <option value="1">Verified</option>
                        <option value="0">Not verified</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900"
                >
                    <Search className="h-4 w-4" />
                    Apply
                </button>
            </form>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-4 py-3">S.N.</th>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Phone</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Verified</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                rows.map((row, idx) => (
                                    <tr key={row.id} className="hover:bg-slate-50/80">
                                        <td className="whitespace-nowrap px-4 py-3 text-slate-600">{serialNumber(users, idx)}</td>
                                        <td className="px-4 py-3 font-medium text-slate-900">{row.name}</td>
                                        <td className="px-4 py-3 text-slate-600">{row.email}</td>
                                        <td className="px-4 py-3 text-slate-600">{row.phone ?? '—'}</td>
                                        <td className="px-4 py-3 text-slate-600">{row.usertype}</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                                                    row.status_label === 'Active'
                                                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                                                        : 'bg-slate-100 text-slate-600 ring-slate-200'
                                                }`}
                                            >
                                                {row.status_label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-600">{row.verified_label}</td>
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={route('admin.users.show', row.id)}
                                                    className="inline-flex rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                                                    title="View"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={route('admin.users.edit', row.id)}
                                                    className="inline-flex rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                                                    title="Edit"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <TablePagination pagination={users} />
        </AdminLayout>
    );
}
