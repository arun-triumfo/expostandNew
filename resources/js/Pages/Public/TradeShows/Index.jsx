import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ tradeshows, filters }) {
    const [search, setSearch] = useState(filters?.search ?? '');

    return (
        <PublicLayout>
            <Head>
                <title>Trade Shows | Expo Stand Zone</title>
                <meta name="description" content="Upcoming trade shows and exhibitions worldwide." />
                <link rel="canonical" href="/trade-shows" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" />
                <link rel="stylesheet" type="text/css" href="/web/css/common.css?ver=1.0.7" />
                <link rel="stylesheet" type="text/css" href="/web/css/tradeshow.css?ver=1.0.7" />
            </Head>

            <section className="py-5">
                <div className="container">
                    <h1 className="h3 mb-4">Trade Shows</h1>
                    <form
                        className="mb-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            router.get('/trade-shows', { search: search || undefined }, { preserveState: true, replace: true });
                        }}
                    >
                        <div className="input-group">
                            <input className="form-control" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search fair name" />
                            <div className="input-group-append">
                                <button className="btn btn-danger" type="submit">Search</button>
                            </div>
                        </div>
                    </form>

                    <div className="row">
                        {(tradeshows?.data ?? []).map((row) => (
                            <div key={row.id} className="col-lg-4 col-md-6 mb-4">
                                <div className="card h-100 border-0 shadow-sm">
                                    {row.fair_logo || row.logo ? (
                                        <img src={`/uploads/tradeshow/${row.fair_logo || row.logo}`} alt={row.fair_name || row.name} className="card-img-top" style={{ height: 220, objectFit: 'cover' }} />
                                    ) : null}
                                    <div className="card-body">
                                        <h2 className="h6">{row.fair_name || row.name}</h2>
                                        <p className="text-muted mb-1">{row.cityname}, {row.countryname}</p>
                                        <p className="text-muted small">{row.fair_start_date || row.start_date} - {row.fair_end_date || row.end_date}</p>
                                        <Link href={`/trade-shows/${row.slug}`} className="btn btn-sm btn-danger">View Detail</Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

