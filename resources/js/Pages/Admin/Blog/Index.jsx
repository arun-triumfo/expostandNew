import TablePagination from '@/Components/Admin/TablePagination';
import AdminLayout from '@/Layouts/AdminLayout';
import { serialNumber } from '@/utils/adminTableSerial';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';

export default function Index({ blogs }) {
    const { auth } = usePage().props;
    const canDelete = auth?.admin?.can_delete === true;
    const rows = blogs?.data ?? [];

    const destroyRow = (id) => {
        if (!canDelete) {
            return;
        }
        if (!confirm('Delete this blog post? This cannot be undone.')) {
            return;
        }
        router.delete(route('admin.blog.destroy', id));
    };

    return (
        <AdminLayout title="Blog">
            <Head title="Blog" />

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">All posts</h2>
                    <p className="mt-1 text-sm text-slate-500">Records from the `article` table.</p>
                </div>
                <Link
                    href={route('admin.blog.create')}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                    <Plus className="h-4 w-4" />
                    Add blog
                </Link>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-4 py-3">#</th>
                                <th className="px-4 py-3">Title</th>
                                <th className="px-4 py-3">Slug</th>
                                <th className="px-4 py-3">Created</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                                        No blog posts found.
                                    </td>
                                </tr>
                            ) : (
                                rows.map((row, idx) => (
                                    <tr key={row.id} className="hover:bg-slate-50/80">
                                        <td className="whitespace-nowrap px-4 py-3 text-slate-600">{serialNumber(blogs, idx)}</td>
                                        <td className="px-4 py-3 font-medium text-slate-900">{row.title}</td>
                                        <td className="px-4 py-3 text-indigo-600">{row.slug}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                                            {row.created_at ? String(row.created_at) : '—'}
                                        </td>
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
                                                    href={route('admin.blog.edit', row.id)}
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

            <TablePagination pagination={blogs} />
        </AdminLayout>
    );
}
