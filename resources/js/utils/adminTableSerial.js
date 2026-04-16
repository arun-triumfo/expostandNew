/**
 * Laravel paginator from Inertia may expose meta at root or under `.meta`.
 */
export function serialNumber(paginator, index) {
    const p = paginator ?? {};
    const meta = p.meta ?? p;
    const currentPage = Number(meta?.current_page ?? p.current_page ?? 1);
    const perPage = Number(meta?.per_page ?? p.per_page ?? 15);
    const page = Number.isFinite(currentPage) ? currentPage : 1;
    const size = Number.isFinite(perPage) ? perPage : 15;
    return (page - 1) * size + index + 1;
}
