import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ user }) {
    return (
        <AdminLayout title="User details">
            <Head title={`User #${user.id}`} />

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-900">{user.name}</h2>
                <div className="flex gap-2">
                    <Link
                        href={route('admin.users.edit', user.id)}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        Edit
                    </Link>
                    <Link href={route('admin.users.index')} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                        Back to list
                    </Link>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="grid gap-6 p-6 sm:grid-cols-2">
                    <div>
                        <div className="text-xs font-medium uppercase text-slate-500">Email</div>
                        <div className="mt-1 text-slate-900">{user.email}</div>
                    </div>
                    <div>
                        <div className="text-xs font-medium uppercase text-slate-500">Phone</div>
                        <div className="mt-1 text-slate-900">{user.phone ?? '—'}</div>
                    </div>
                    <div>
                        <div className="text-xs font-medium uppercase text-slate-500">User type</div>
                        <div className="mt-1 text-slate-900">{user.usertype}</div>
                    </div>
                    <div>
                        <div className="text-xs font-medium uppercase text-slate-500">Status / verified</div>
                        <div className="mt-1 text-slate-900">
                            Status: {user.status === '1' ? 'Active' : 'Inactive'} · Verified: {user.verifystatus === '1' ? 'Yes' : 'No'}
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <div className="text-xs font-medium uppercase text-slate-500">Profile photo</div>
                        {user.profilepic ? (
                            <img
                                src={`/uploads/profilepics/${user.profilepic}`}
                                alt=""
                                className="mt-2 h-32 w-32 rounded-full border border-slate-200 object-cover"
                            />
                        ) : (
                            <div className="mt-2 text-sm text-slate-500">No image</div>
                        )}
                    </div>
                    <div className="sm:col-span-2 text-xs text-slate-500">
                        Created {user.created_at ? String(user.created_at) : '—'}
                        {user.updated_at ? ` · Updated ${String(user.updated_at)}` : ''}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
