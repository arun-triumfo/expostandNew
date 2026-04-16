import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

function fieldClass(err) {
    return `mt-1 w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
        err ? 'border-red-300 bg-red-50/50' : 'border-slate-200'
    }`;
}

export default function Edit({ user, usertypeOptions }) {
    const { data, setData, post, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone ?? '',
        usertype: user.usertype,
        status: user.status,
        verifystatus: user.verifystatus,
        password: '',
        profilepic: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.users.update', user.id), { forceFormData: true });
    };

    return (
        <AdminLayout title="Edit user">
            <Head title="Edit user" />

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-900">Edit user</h2>
                <div className="flex gap-2">
                    <Link href={route('admin.users.show', user.id)} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                        View profile
                    </Link>
                    <Link href={route('admin.users.index')} className="text-sm font-medium text-slate-600 hover:text-slate-800">
                        ← Users list
                    </Link>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-800">Account</div>
                    <div className="grid gap-5 p-6 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className="text-sm font-medium text-slate-700">Profile image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('profilepic', e.target.files?.[0] ?? null)}
                                className={fieldClass(errors.profilepic)}
                            />
                            {errors.profilepic && <p className="mt-1 text-xs text-red-600">{errors.profilepic}</p>}
                            {user.profilepic ? (
                                <img
                                    src={`/uploads/profilepics/${user.profilepic}`}
                                    alt=""
                                    className="mt-3 h-24 w-24 rounded-full border border-slate-200 object-cover"
                                />
                            ) : null}
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">Full name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={fieldClass(errors.name)}
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={fieldClass(errors.email)}
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">Phone</label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className={fieldClass(errors.phone)}
                            />
                            {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">New password</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Leave blank to keep current"
                                autoComplete="new-password"
                                className={fieldClass(errors.password)}
                            />
                            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">User type</label>
                            <select
                                value={data.usertype}
                                onChange={(e) => setData('usertype', e.target.value)}
                                className={fieldClass(errors.usertype)}
                            >
                                {(usertypeOptions ?? []).map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>
                            {errors.usertype && <p className="mt-1 text-xs text-red-600">{errors.usertype}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">Status</label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className={fieldClass(errors.status)}
                            >
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">Verification</label>
                            <select
                                value={data.verifystatus}
                                onChange={(e) => setData('verifystatus', e.target.value)}
                                className={fieldClass(errors.verifystatus)}
                            >
                                <option value="1">Verified</option>
                                <option value="0">Not verified</option>
                            </select>
                        </div>
                        <div className="sm:col-span-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                            >
                                {processing ? 'Saving…' : 'Save changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
