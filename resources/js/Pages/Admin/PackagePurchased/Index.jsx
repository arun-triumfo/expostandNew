import TablePagination from '@/Components/Admin/TablePagination';
import AdminLayout from '@/Layouts/AdminLayout';
import { serialNumber } from '@/utils/adminTableSerial';
import { Head, usePage } from '@inertiajs/react';

function packageBadgeClass(packagecolor) {
    if (!packagecolor || typeof packagecolor !== 'string') {
        return 'bg-indigo-50 text-indigo-800 ring-indigo-200';
    }
    const c = packagecolor.trim();
    if (c.includes('success') || c.includes('green')) {
        return 'bg-emerald-50 text-emerald-800 ring-emerald-200';
    }
    if (c.includes('warning') || c.includes('yellow')) {
        return 'bg-amber-50 text-amber-900 ring-amber-200';
    }
    if (c.includes('danger') || c.includes('red')) {
        return 'bg-rose-50 text-rose-800 ring-rose-200';
    }
    if (c.includes('info') || c.includes('blue')) {
        return 'bg-sky-50 text-sky-800 ring-sky-200';
    }
    return 'bg-slate-100 text-slate-800 ring-slate-200';
}

export default function Index({ purchases }) {
    const { flash } = usePage().props;
    const rows = purchases?.data ?? [];

    return (
        <AdminLayout title="Package purchased">
            <Head title="Package purchased" />

            {flash?.success ? (
                <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{flash.success}</div>
            ) : null}
            {flash?.error ? (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{flash.error}</div>
            ) : null}

            <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">Package purchased detail</h2>
                <p className="mt-1 text-sm text-slate-500">Records from `buypackagemodels` (same as legacy admin).</p>
            </div>

            <div className="w-full max-w-none overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-[900px] divide-y divide-slate-200 text-left text-sm">
                        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-4 py-3">S.N.</th>
                                <th className="px-4 py-3">Package</th>
                                <th className="px-4 py-3">Amount</th>
                                <th className="px-4 py-3">Customer email</th>
                                <th className="px-4 py-3">Customer name</th>
                                <th className="px-4 py-3">Order ID</th>
                                <th className="px-4 py-3">Purchase date</th>
                                <th className="px-4 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                                        No package purchases found.
                                    </td>
                                </tr>
                            ) : (
                                rows.map((row, idx) => (
                                    <tr key={row.id} className="align-top hover:bg-slate-50/80">
                                        <td className="whitespace-nowrap px-4 py-3 text-slate-600">{serialNumber(purchases, idx)}</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${packageBadgeClass(row.packagecolor)}`}
                                            >
                                                {row.packagename ?? '—'}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-slate-800">{row.amount ?? '—'}</td>
                                        <td className="max-w-[220px] break-all px-4 py-3 text-slate-700">{row.customer_email ?? '—'}</td>
                                        <td className="px-4 py-3 text-slate-800">{row.customer_name ?? '—'}</td>
                                        <td className="max-w-[200px] break-all px-4 py-3 font-mono text-xs text-slate-700">
                                            {row.payment_order_id ?? '—'}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-600">
                                            {row.created_at
                                                ? String(row.created_at).slice(0, 19).replace('T', ' ')
                                                : row.created_date ?? '—'}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-800">{row.status ?? '—'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <TablePagination pagination={purchases} />
        </AdminLayout>
    );
}
