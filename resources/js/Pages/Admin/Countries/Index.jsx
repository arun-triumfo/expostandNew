import TablePagination from '@/Components/Admin/TablePagination';
import AdminLayout from '@/Layouts/AdminLayout';
import { serialNumber } from '@/utils/adminTableSerial';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function Index({ countries, filters }) {
    const { flash, auth } = usePage().props;
    const canDelete = auth?.admin?.can_delete === true;
    const rows = countries?.data ?? [];
    const [q, setQ] = useState(filters?.search ?? '');

    const runSearch = (e) => {
        e?.preventDefault();
        router.get(route('admin.countries.index'), { search: q || undefined }, { preserveState: true, replace: true });
    };

    const destroyRow = (id) => {
        if (!canDelete) {
            return;
        }
        if (!confirm('Delete this country? Cities or trade shows linked to it will block deletion.')) {
            return;
        }
        router.delete(route('admin.countries.destroy', id));
    };

    return (
        <AdminLayout title="Countries">
            <Head title="Countries" />

            {flash?.success ? (
                <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{flash.success}</div>
            ) : null}
            {flash?.error ? (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{flash.error}</div>
            ) : null}

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">Country listing</h2>
                    <p className="mt-1 text-sm text-slate-500">Master data from `countrytables`.</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Link
                        href={route('admin.countries.create')}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                    >
                        <Plus className="h-4 w-4" />
                        Add country
                    </Link>
                    <form onSubmit={runSearch} className="flex max-w-md gap-0 overflow-hidden rounded-lg border border-slate-200 shadow-sm">
                        <input
                            type="search"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Search country, continent…"
                            className="min-w-0 flex-1 border-0 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500/30"
                        />
                        <button
                            type="submit"
                            className="inline-flex items-center gap-1 border-l border-slate-200 bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900"
                        >
                            <Search className="h-4 w-4" />
                            Search
                        </button>
                    </form>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-4 py-3">S.N.</th>
                                <th className="px-4 py-3">Continent</th>
                                <th className="px-4 py-3">Country name</th>
                                <th className="px-4 py-3">Banner title</th>
                                <th className="px-4 py-3">Selected standbuilders</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                                        No countries found.
                                    </td>
                                </tr>
                            ) : (
                                rows.map((row, idx) => (
                                    <tr key={row.id} className="hover:bg-slate-50/80">
                                        <td className="whitespace-nowrap px-4 py-3 text-slate-600">{serialNumber(countries, idx)}</td>
                                        <td className="px-4 py-3 text-slate-700">{row.continent}</td>
                                        <td className="px-4 py-3 font-medium text-slate-900">{row.name}</td>
                                        <td className="px-4 py-3 text-slate-600">{row.bannertitle ?? '—'}</td>
                                        <td className="px-4 py-3 text-slate-600">{row.standbuilder_count ?? 0}</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                                                    row.status_label === 'Active'
                                                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                                                        : 'bg-slate-100 text-slate-600 ring-slate-200'
                                                }`}
                                            >
                                                {row.status_label}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={route('admin.countries.edit', row.id)}
                                                    className="inline-flex rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                                                    title="Edit"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                {canDelete ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => destroyRow(row.id)}
                                                        className="inline-flex rounded-lg border border-slate-200 p-2 text-red-600 transition hover:border-red-200 hover:bg-red-50"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                ) : null}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <TablePagination pagination={countries} />
        </AdminLayout>
    );
}
