import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function Stub({ title }) {
    return (
        <AdminLayout title={title}>
            <Head title={title} />
            <div className="mx-auto max-w-lg rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950">
                <p className="font-semibold">{title}</p>
                <p className="mt-3 text-amber-900/80">
                    This screen is not fully migrated yet. Open the{' '}
                    <Link href={route('quotation')} className="font-medium text-indigo-700 underline">
                        quotation list
                    </Link>{' '}
                    for lead management.
                </p>
            </div>
        </AdminLayout>
    );
}
