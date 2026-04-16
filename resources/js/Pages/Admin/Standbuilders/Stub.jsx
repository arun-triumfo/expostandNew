import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function Stub({ title, userId }) {
    return (
        <AdminLayout title={title}>
            <Head title={title} />
            <div className="mx-auto max-w-lg rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950">
                <p className="font-semibold">{title}</p>
                {userId != null && userId !== '' ? (
                    <p className="mt-2 text-amber-900/90">
                        User id: <span className="font-mono">{userId}</span>
                    </p>
                ) : null}
                <p className="mt-3 text-amber-900/80">
                    Full create / edit / view forms from the legacy admin are not wired in this build yet. Use the listing at{' '}
                    <Link href={route('standbuilders')} className="font-medium text-indigo-700 underline">
                        /standbuilders
                    </Link>{' '}
                    for management actions that are available.
                </p>
            </div>
        </AdminLayout>
    );
}
