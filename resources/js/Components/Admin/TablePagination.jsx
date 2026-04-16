import { Link } from '@inertiajs/react';

export default function TablePagination({ pagination }) {
    if (!pagination?.links || pagination.links.length <= 3) {
        return null;
    }

    return (
        <nav className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 text-sm text-slate-600">
            <div>
                {pagination.meta?.from != null && pagination.meta?.to != null && (
                    <span>
                        Showing <strong>{pagination.meta.from}</strong>–<strong>{pagination.meta.to}</strong> of{' '}
                        <strong>{pagination.meta.total}</strong>
                    </span>
                )}
            </div>
            <div className="flex flex-wrap gap-1">
                {pagination.links.map((link, i) => (
                    <Link
                        key={i}
                        href={link.url || '#'}
                        preserveScroll
                        onClick={(e) => {
                            if (!link.url) {
                                e.preventDefault();
                            }
                        }}
                        className={`min-w-[2.25rem] rounded-lg px-3 py-1.5 text-center transition ${
                            link.active
                                ? 'bg-indigo-600 text-white'
                                : link.url
                                  ? 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
                                  : 'cursor-not-allowed opacity-40'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </nav>
    );
}
