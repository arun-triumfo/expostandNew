import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ blog, related = [] }) {
    return (
        <PublicLayout>
            <Head>
                <title>{blog?.meta_title || blog?.title}</title>
                <meta name="description" content={blog?.meta_desc || ''} />
                <link rel="canonical" href={`/blog/${blog?.slug}`} />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" />
                <link rel="stylesheet" type="text/css" href="/web/css/common.css?ver=1.0.7" />
                <link rel="stylesheet" type="text/css" href="/web/css/blog.css?ver=1.0.7" />
            </Head>

            <section className="py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <h1 className="h3 mb-3">{blog?.title}</h1>
                            {blog?.image ? <img src={`/uploads/blog/${blog.image}`} alt={blog.title} className="img-fluid mb-3" /> : null}
                            <div dangerouslySetInnerHTML={{ __html: blog?.description || '' }} />
                        </div>
                        <div className="col-lg-4">
                            <h2 className="h5 mb-3">Recent Posts</h2>
                            <div className="list-group">
                                {related.map((r) => (
                                    <Link key={r.slug} href={`/blog/${r.slug}`} className="list-group-item list-group-item-action">
                                        {r.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

