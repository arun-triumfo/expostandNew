import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';

function BuilderCard({ row }) {
    return (
        <div className="col-12 mb-3">
            <div className="card border-0 shadow-sm" style={{ borderRadius: 10 }}>
                <div className="card-body d-flex align-items-start" style={{ gap: 20 }}>
                    <div
                        style={{
                            width: 160,
                            minWidth: 160,
                            height: 160,
                            borderRadius: 10,
                            border: '1px solid #eee',
                            overflow: 'hidden',
                            background: '#fff',
                        }}
                    >
                        <img
                            src={row.complogo ? `/uploads/standbuilder/${row.complogo}` : '/web/images/noimage.webp'}
                            alt={row.companyname}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            loading="lazy"
                        />
                    </div>
                    <div>
                        <h3 className="h5 mb-2" style={{ fontWeight: 700 }}>{row.companyname}</h3>
                        <p className="mb-2 text-muted" style={{ maxWidth: 760 }}>
                            {(row.about_comp || '').replace(/<[^>]+>/g, '').slice(0, 180)}
                            {(row.about_comp || '').length > 180 ? '...' : ''}
                        </p>
                        <p className="mb-0" style={{ fontWeight: 700 }}>{row.cityname}, {row.countryname}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Show({ country, cities = [], standbuilders = [] }) {
    const title = country?.metatitle || `Trade Show Booth Builders in ${country?.name} | ExpoStandZone`;
    const description =
        country?.metadesc ||
        `Find verified exhibition stand builders in ${country?.name}. Get multiple proposals and compare trusted booth design companies.`;

    return (
        <PublicLayout>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <link rel="canonical" href={`/${country?.value}`} />
                <link rel="stylesheet" type="text/css" href="/web/css/stand-builder-country.css?ver=1.0.8" />
                <link rel="stylesheet" type="text/css" href="/web/css/responsive.css?ver=1.0.5" />
            </Head>

            <section>
                <div className="mainbanner">
                    <div className="container">
                        <div className="widthmedium">
                            <h1 className="hometitle">
                                {country?.bannertitle || `MOST TRUSTED TRADE SHOW BOOTH BUILDERS IN ${String(country?.name || '').toUpperCase()}`}
                            </h1>
                            <p>
                                {country?.bannershrtext ||
                                    `Find the best trade show booth design companies in ${country?.name} to deliver unforgettable brand experiences.`}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="sub-banner">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="newformbg">
                                    <h2>
                                        Get 5 Unique Proposals from Verified
                                        <br />
                                        Stand Builders for Your Exhibition Stand!
                                    </h2>
                                    <div className="fom-right">
                                        <div className="form-inner">
                                            <div className="event-details">
                                                <h3>Event Details</h3>
                                            </div>
                                            <div className="event-details">
                                                <h3>Booth Details</h3>
                                            </div>
                                            <div className="event-details">
                                                <h3>Contact Details</h3>
                                            </div>
                                            <div className="text-center mt-2">
                                                <Link href="/contact-us" className="btn btn-danger">
                                                    Submit Requirement
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="services-area">
                                    <h3>Services Area </h3>
                                    <ul>
                                        {cities.map((c) => (
                                            <li key={c.value}>
                                                <Link href={`/${country?.value}/${c.value}`}>{c.name}</Link>
                                            </li>
                                        ))}
                                        {!cities.length ? <li><em>No cities available</em></li> : null}
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-12">
                                {country?.topdesc ? <div className="short-bio" dangerouslySetInnerHTML={{ __html: country.topdesc }} /> : null}

                                <div className="city-box">
                                    <h3>
                                        TOP TRADE SHOW BOOTH & DISPLAY DESIGN COMPANIES IN{' '}
                                        <span>{String(country?.name || '').toUpperCase()}</span>
                                    </h3>
                                </div>
                                <div className="standbuildercountry">
                                    <div className="row">
                                        {standbuilders.map((row) => (
                                            <BuilderCard key={row.id} row={row} />
                                        ))}
                                        {!standbuilders.length ? <p className="text-muted px-3">No stand builders found.</p> : null}
                                    </div>
                                </div>
                                {country?.botdesc ? <div className="short-bio mt-4" dangerouslySetInnerHTML={{ __html: country.botdesc }} /> : null}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

