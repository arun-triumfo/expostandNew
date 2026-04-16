import TablePagination from '@/Components/Admin/TablePagination';
import AdminLayout from '@/Layouts/AdminLayout';
import { serialNumber } from '@/utils/adminTableSerial';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';

function statusBadge(label) {
    const l = label?.toLowerCase();
    if (l === 'expired') {
        return 'bg-red-50 text-red-700 ring-red-200';
    }
    if (l === 'live') {
        return 'bg-blue-50 text-blue-700 ring-blue-200';
    }
    return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
}

export default function Index({ tradeshows }) {
    const { auth } = usePage().props;
    const canDelete = auth?.admin?.can_delete === true;
    const rows = tradeshows?.data ?? [];

    const destroyRow = (id) => {
        if (!canDelete) {
            return;
        }
        if (!confirm('Delete this trade show? This cannot be undone.')) {
            return;
        }
        router.delete(route('admin.tradeshows.destroy', id));
    };

    return (
        <AdminLayout title="Trade Shows">
            <Head title="Trade Shows" />

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">All trade shows</h2>
                    <p className="mt-1 text-sm text-slate-500">Data from `tradeshow_data` with country and city joins.</p>
                </div>
                <Link
                    href={route('admin.tradeshows.create')}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                    <Plus className="h-4 w-4" />
                    Add trade show
                </Link>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-4 py-3">#</th>
                                <th className="px-4 py-3">Fair Name</th>
                                <th className="px-4 py-3">Fair Start Date</th>
                                <th className="px-4 py-3">Fair End Date</th>
                                <th className="px-4 py-3">Fair Country</th>
                                <th className="px-4 py-3">Fair City</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Action</th>
                                <th className="px-4 py-3">Trade fair Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-4 py-10 text-center text-slate-500">
                                        No trade shows found.
                                    </td>
                                </tr>
                            ) : (
                                rows.map((row, idx) => (
                                    <tr key={row.id} className="hover:bg-slate-50/80">
                                        <td className="whitespace-nowrap px-4 py-3 text-slate-600">{serialNumber(tradeshows, idx)}</td>
                                        <td className="px-4 py-3 font-medium text-slate-900">{row.fair_name}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-slate-600">{row.fair_start_date}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-slate-600">{row.fair_end_date}</td>
                                        <td className="px-4 py-3 text-slate-600">{row.countryname ?? '—'}</td>
                                        <td className="px-4 py-3 text-slate-600">{row.cityname ?? '—'}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-slate-600">{row.tradeshowstatus}</td>
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={route('admin.tradeshows.edit', row.id)}
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
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusBadge(row.fair_status_label)}`}
                                            >
                                                {row.fair_status_label}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <TablePagination pagination={tradeshows} />
        </AdminLayout>
    );
}
