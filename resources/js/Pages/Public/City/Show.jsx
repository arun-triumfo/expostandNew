import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ country, city, nearbyCities = [], standbuilders = [] }) {
    return (
        <PublicLayout>
            <Head>
                <title>{city?.metatitle || `Exhibition Stand Builders in ${city?.name}`}</title>
                <meta name="description" content={city?.metadesc || `Find exhibition stand builders in ${city?.name}`} />
                <link rel="canonical" href={`/${country?.value}/${city?.value}`} />
                <link rel="stylesheet" type="text/css" href="/web/css/stand-builder-country.css?ver=1.0.8" />
                <link rel="stylesheet" type="text/css" href="/web/css/responsive.css?ver=1.0.5" />
            </Head>

            <section>
                <div className="mainbanner">
                    <div className="container">
                        <div className="widthmedium">
                            <h1 className="hometitle">
                                {city?.bannertitle || `SEARCHING FOR AN EXHIBITION STAND BUILDER IN ${String(city?.name || '').toUpperCase()}`}
                            </h1>
                            <p>{city?.bannershrtext || `Get verified stand builders for ${city?.name}, ${country?.name}.`}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="sub-banner">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                {city?.topdesc ? <div className="short-bio" dangerouslySetInnerHTML={{ __html: city.topdesc }} /> : null}
                                <div className="services-area mb-4">
                                    <h3>Nearby Cities</h3>
                                    <ul>
                                        {nearbyCities.map((c) => (
                                            <li key={c.value}>
                                                <Link href={`/${country?.value}/${c.value}`}>{c.name}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="city-box">
                                    <h3>
                                        TOP TRADE SHOW BOOTH & DISPLAY DESIGN COMPANIES IN{' '}
                                        <span>{String(city?.name || '').toUpperCase()}</span>
                                    </h3>
                                </div>
                                <div className="standbuildercountry">
                                    <div className="row">
                                        {standbuilders.map((row) => (
                                            <div key={row.id} className="col-lg-4 col-md-6 mb-3">
                                                <div className="card h-100">
                                                    <img
                                                        src={row.complogo ? `/uploads/standbuilder/${row.complogo}` : '/web/images/noimage.webp'}
                                                        alt={row.companyname}
                                                        className="card-img-top"
                                                        style={{ height: 180, objectFit: 'cover' }}
                                                        loading="lazy"
                                                    />
                                                    <div className="card-body">
                                                        <h3 className="h6">{row.companyname}</h3>
                                                        <p className="text-muted mb-1">
                                                            {row.cityname}, {row.countryname}
                                                        </p>
                                                        <span className="badge badge-secondary">{row.packgaename}</span>
                                                    </div>
                                                    <div className="card-footer bg-white">
                                                        <Link href={`/${row.slug}`} className="btn btn-sm btn-danger">
                                                            View Profile
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {!standbuilders.length ? <p className="text-muted px-3">No stand builders found.</p> : null}
                                    </div>
                                </div>
                                {city?.botdesc ? <div className="short-bio mt-4" dangerouslySetInnerHTML={{ __html: city.botdesc }} /> : null}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

