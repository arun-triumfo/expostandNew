import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

function decodeHtmlEntities(input) {
    const text = String(input ?? '');
    if (typeof window === 'undefined') {
        return text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
    }
    const t = document.createElement('textarea');
    t.innerHTML = text;
    return t.value;
}

export default function Show({ country, city, nearbyCities = [], standbuilders = [] }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        country_value: country?.value || '',
        eventname: '',
        eventcity: city?.name || '',
        boothsize: '',
        boothtype: 'SQMT',
        information: '',
        fullname: '',
        emailid: '',
        phonenumber: '',
        compwebsite: '',
        privacy_accepted: false,
        uploadfile: null,
        honeypot: '',
        pageurl: typeof window !== 'undefined' ? window.location.pathname : '',
        ipaddress: '',
        phone_full: '',
    });

    const bannerTitle =
        decodeHtmlEntities(city?.bannertitle) ||
        `SEARCHING FOR AN EXHIBITION STAND BUILDER IN ${String(city?.name || '').toUpperCase()}`;
    const bannerShort = decodeHtmlEntities(city?.bannershrtext) || `Get verified stand builders for ${city?.name}, ${country?.name}.`;
    const topDesc = decodeHtmlEntities(city?.topdesc || '');
    const botDesc = decodeHtmlEntities(city?.botdesc || '');
    const submitQuote = (e) => {
        e.preventDefault();
        post(route('public.country.quote'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset(
                    'eventname',
                    'boothsize',
                    'boothtype',
                    'information',
                    'fullname',
                    'emailid',
                    'phonenumber',
                    'compwebsite',
                    'privacy_accepted',
                    'uploadfile',
                    'honeypot',
                );
                setData('eventcity', city?.name || '');
            },
        });
    };

    return (
        <PublicLayout>
            <Head>
                <title>{city?.metatitle || `Exhibition Stand Builders in ${city?.name}`}</title>
                <meta name="description" content={city?.metadesc || `Find exhibition stand builders in ${city?.name}`} />
                <link rel="canonical" href={`/${country?.value}/${city?.value}`} />
            </Head>

            <section>
                <div className="mainbanner">
                    <div className="container">
                        <div className="widthmedium">
                            <h1 className="hometitle" dangerouslySetInnerHTML={{ __html: bannerTitle }} />
                            <p dangerouslySetInnerHTML={{ __html: bannerShort }} />
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="sub-banner">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="newformbg mb-4">
                                    <h2>
                                        Get 5 Unique Proposals from Verified
                                        <br />
                                        Stand Builders for Your Exhibition Stand!
                                    </h2>
                                    <div className="fom-right">
                                        <form className="form-inner" onSubmit={submitQuote}>
                                            <input type="hidden" value={data.country_value} />
                                            <input type="hidden" value={data.pageurl} />
                                            <input type="hidden" value={data.ipaddress} />
                                            <input type="hidden" value={data.phone_full} />
                                            <input
                                                type="text"
                                                value={data.honeypot}
                                                onChange={(e) => setData('honeypot', e.target.value)}
                                                tabIndex={-1}
                                                autoComplete="off"
                                                style={{ display: 'none' }}
                                            />
                                            {flash?.success ? <div className="alert alert-success mb-3">{flash.success}</div> : null}

                                            <div className="event-details">
                                                <h3>Event Details</h3>
                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <div className="input-outer">
                                                            <input type="text" placeholder="Event Name" value={data.eventname} onChange={(e) => setData('eventname', e.target.value)} />
                                                            {errors.eventname ? <div className="error">{errors.eventname}</div> : null}
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="input-outer">
                                                            <input type="text" placeholder="Event City" value={data.eventcity} onChange={(e) => setData('eventcity', e.target.value)} />
                                                            {errors.eventcity ? <div className="error">{errors.eventcity}</div> : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="event-details">
                                                <h3>Booth Details</h3>
                                                <div className="row">
                                                    <div className="col-lg-6 d-flex">
                                                        <div className="input-outer">
                                                            <input type="text" placeholder="Stand Size" value={data.boothsize} onChange={(e) => setData('boothsize', e.target.value)} />
                                                            {errors.boothsize ? <div className="error">{errors.boothsize}</div> : null}
                                                        </div>
                                                        <select value={data.boothtype} onChange={(e) => setData('boothtype', e.target.value)}>
                                                            <option value="SQMT">SQMT</option>
                                                            <option value="SQFT">SQFT</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="custom-drop-file">
                                                            <input type="file" accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx" onChange={(e) => setData('uploadfile', e.target.files?.[0] || null)} />
                                                            <p><span>Choose File</span> File Upload (If any)</p>
                                                            {errors.uploadfile ? <div className="error">{errors.uploadfile}</div> : null}
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <textarea rows="3" placeholder="Additional Message about your Booth" value={data.information} onChange={(e) => setData('information', e.target.value)} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="event-details">
                                                <h3>Contact Details</h3>
                                                <div className="row">
                                                    <div className="col-lg-6"><div className="input-outer"><input type="text" placeholder="Full Name *" value={data.fullname} onChange={(e) => setData('fullname', e.target.value)} />{errors.fullname ? <div className="error">{errors.fullname}</div> : null}</div></div>
                                                    <div className="col-lg-6"><div className="input-outer"><input type="email" placeholder="Email id *" value={data.emailid} onChange={(e) => setData('emailid', e.target.value)} />{errors.emailid ? <div className="error">{errors.emailid}</div> : null}</div></div>
                                                    <div className="col-lg-6"><div className="input-outer"><input type="tel" placeholder="Phone Number *" value={data.phonenumber} onChange={(e) => setData('phonenumber', e.target.value)} />{errors.phonenumber ? <div className="error">{errors.phonenumber}</div> : null}</div></div>
                                                    <div className="col-lg-6"><div className="input-outer"><input type="text" placeholder="Website *" value={data.compwebsite} onChange={(e) => setData('compwebsite', e.target.value)} />{errors.compwebsite ? <div className="error">{errors.compwebsite}</div> : null}</div></div>
                                                    <div className="co-lg-12 col-md-12">
                                                        <div className="check-box-main">
                                                            <span className="check"><input type="checkbox" checked={Boolean(data.privacy_accepted)} onChange={(e) => setData('privacy_accepted', e.target.checked)} /></span>
                                                            <p>I agree to the Expostandzone&apos; <a href="/privacy-policy" target="_blank" rel="noreferrer">Privacy Policy</a> *</p>
                                                        </div>
                                                        {errors.privacy_accepted ? <div className="error text-center">{errors.privacy_accepted}</div> : null}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-center mt-2">
                                                <button type="submit" className="btn btn-danger" disabled={processing}>
                                                    {processing ? 'Submitting...' : 'Submit Requirement'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                                {topDesc ? <div className="short-bio" dangerouslySetInnerHTML={{ __html: topDesc }} /> : null}
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
                                            <div key={row.id} className="col-12 mb-3">
                                                <Link href={`/${row.slug}`} className="d-block" style={{ color: 'inherit' }}>
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
                                                                    {decodeHtmlEntities(row.about_comp || '').replace(/<[^>]+>/g, '').slice(0, 180)}
                                                                    {decodeHtmlEntities(row.about_comp || '').replace(/<[^>]+>/g, '').length > 180 ? '...' : ''}
                                                                </p>
                                                                <p className="mb-0" style={{ fontWeight: 700 }}>
                                                                    {row.cityname}, {row.countryname}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))}
                                        {!standbuilders.length ? <p className="text-muted px-3">No stand builders found.</p> : null}
                                    </div>
                                </div>
                                {botDesc ? <div className="short-bio mt-4" dangerouslySetInnerHTML={{ __html: botDesc }} /> : null}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

