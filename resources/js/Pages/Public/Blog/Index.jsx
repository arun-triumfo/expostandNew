import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ blogs }) {
    return (
        <PublicLayout>
            <Head>
                <title>Blog | Expo Stand Zone</title>
                <meta name="description" content="Latest exhibition, trade show, and booth design insights." />
                <link rel="canonical" href="/blog" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" />
                <link rel="stylesheet" type="text/css" href="/web/css/common.css?ver=1.0.7" />
                <link rel="stylesheet" type="text/css" href="/web/css/blog.css?ver=1.0.7" />
            </Head>

            <section className="py-5">
                <div className="container">
                    <h1 className="h3 mb-4">Blog</h1>
                    <div className="row">
                        {(blogs?.data ?? []).map((row) => (
                            <div key={row.id} className="col-lg-4 col-md-6 mb-4">
                                <div className="card h-100 border-0 shadow-sm">
                                    {row.image ? (
                                        <img src={`/uploads/blog/${row.image}`} alt={row.title} className="card-img-top" style={{ height: 220, objectFit: 'cover' }} />
                                    ) : null}
                                    <div className="card-body">
                                        <h2 className="h6 mb-2">{row.title}</h2>
                                        <p className="text-muted small mb-3">{(row.description || '').replace(/<[^>]*>/g, '').slice(0, 140)}...</p>
                                        <Link href={`/blog/${row.slug}`} className="btn btn-sm btn-danger">Read More</Link>
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

