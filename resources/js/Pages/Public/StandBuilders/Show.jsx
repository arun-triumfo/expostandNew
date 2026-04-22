import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';

function decodeHtmlEntities(input) {
    const text = String(input ?? '');
    if (typeof window === 'undefined') {
        return text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
    }
    const t = document.createElement('textarea');
    t.innerHTML = text;
    return t.value;
}

export default function Show({ standbuilder }) {
    const title = standbuilder?.metatitle || `${standbuilder?.companyname} | Trade Show Booth Design`;
    const description = standbuilder?.metadesc || `Explore ${standbuilder?.companyname} profile, services, and locations.`;

    return (
        <PublicLayout>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <link rel="canonical" href={`/${standbuilder?.slug}`} />
                <link rel="stylesheet" type="text/css" href="/web/css/standbuilder.css?ver=1.0.7" />
            </Head>

            <section className="py-4">
                <div className="container">
                    <div className="Breadcrumb mb-2">
                        <ul>
                            <li><Link href="/">Home</Link></li>
                            <li><a href="#"> {standbuilder?.companyname}</a></li>
                        </ul>
                    </div>
                    <h1 className="h3 mb-3" style={{ fontFamily: 'Roboto Condensed, Arial, sans-serif', fontWeight: 700 }}>
                        {standbuilder?.companyname}
                    </h1>
                    <div className="row align-items-start">
                        <div className="col-lg-4 col-md-5 mb-3">
                            <div className="border rounded p-3 bg-white">
                                <img
                                    src={standbuilder?.complogo ? `/uploads/standbuilder/${standbuilder.complogo}` : '/web/images/noimage.webp'}
                                    alt={standbuilder?.companyname}
                                    className="img-fluid"
                                    style={{ width: '100%', maxHeight: 280, objectFit: 'contain' }}
                                />
                            </div>
                        </div>
                        <div className="col-lg-8 col-md-7 mb-3">
                            <div className="border rounded p-3 bg-white h-100">
                                {standbuilder?.found_year ? <p className="mb-1">Founded : {standbuilder.found_year}</p> : null}
                                <p className="mb-2"><strong>{standbuilder?.cityname}</strong> , <strong>{standbuilder?.countryname}</strong></p>
                                <div className="mb-3">
                                    <span className="badge badge-secondary mr-2">Overview</span>
                                </div>
                                <ul className="nav nav-tabs mb-3">
                                    <li className="nav-item"><span className="nav-link active">Overview</span></li>
                                    <li className="nav-item"><span className="nav-link">Services</span></li>
                                    <li className="nav-item"><span className="nav-link">Service Locations</span></li>
                                    <li className="nav-item"><span className="nav-link">Reviews</span></li>
                                </ul>
                                <div dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(standbuilder?.about_comp || '') }} />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 border rounded p-3 bg-white">
                        <h2 className="h5 mb-3">SERVICES</h2>
                        <div className="d-flex flex-wrap">
                            {(standbuilder?.services ?? []).map((s, i) => (
                                <span key={i} className="badge badge-light border mr-2 mb-2">{s}</span>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 border rounded p-3 bg-white">
                        <h2 className="h5 mb-3">LOCATION</h2>
                        <div className="d-flex flex-wrap">
                            {(standbuilder?.business_scope_countries ?? []).map((c, i) => (
                                <span key={i} className="badge badge-light border mr-2 mb-2">{c}</span>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 border rounded p-3 bg-white">
                        <h2 className="h5 mb-3">Reviews</h2>
                        <p className="mb-1"><strong>0.0</strong> out of 5.0</p>
                        <p className="text-muted mb-0">Design Creativity & Customization, Quality of Workmanship & Materials, Project Management & Timely Execution, Cost Efficiency</p>
                    </div>

                    <div className="mt-4 border rounded p-3 bg-white">
                        <h2 className="h5 mb-3">Contact For Booth Design & Fabrication Services</h2>
                        <div className="row">
                            <div className="col-md-6 mb-2"><strong>Owner:</strong> {standbuilder?.ownername || '—'}</div>
                            <div className="col-md-6 mb-2"><strong>Email:</strong> {standbuilder?.email || '—'}</div>
                            <div className="col-md-6 mb-2"><strong>Phone:</strong> {standbuilder?.phone || '—'}</div>
                            <div className="col-md-6 mb-2"><strong>Website:</strong> {standbuilder?.compweb || '—'}</div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

