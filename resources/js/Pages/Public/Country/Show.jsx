import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

function decodeHtmlEntities(input) {
    const text = String(input ?? '');
    if (typeof window === 'undefined') {
        return text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
    }
    const t = document.createElement('textarea');
    t.innerHTML = text;
    return t.value;
}

function BuilderCard({ row }) {
    const cleanAbout = decodeHtmlEntities(row.about_comp || '').replace(/<[^>]+>/g, '');

    return (
        <div className="col-12 mb-3">
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
                                {cleanAbout.slice(0, 180)}
                                {cleanAbout.length > 180 ? '...' : ''}
                            </p>
                            <p className="mb-0" style={{ fontWeight: 700 }}>{row.cityname}, {row.countryname}</p>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default function Show({ country, cities = [], standbuilders = [], captchaSiteKey = '' }) {
    const { flash } = usePage().props;
    const [recaptchaClientError, setRecaptchaClientError] = useState('');
    const { data, setData, post, processing, errors, reset } = useForm({
        country_value: country?.value || '',
        eventname: '',
        eventcity: '',
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
        'g-recaptcha-response': '',
    });

    const title = country?.metatitle || `Trade Show Booth Builders in ${country?.name} | ExpoStandZone`;
    const description =
        country?.metadesc ||
        `Find verified exhibition stand builders in ${country?.name}. Get multiple proposals and compare trusted booth design companies.`;
    const bannerTitle =
        decodeHtmlEntities(country?.bannertitle) ||
        `MOST TRUSTED TRADE SHOW BOOTH BUILDERS IN ${String(country?.name || '').toUpperCase()}`;
    const bannerShort =
        decodeHtmlEntities(country?.bannershrtext) ||
        `Find the best trade show booth design companies in ${country?.name} to deliver unforgettable brand experiences.`;
    const topDesc = decodeHtmlEntities(country?.topdesc || '');
    const botDesc = decodeHtmlEntities(country?.botdesc || '');

    const submitQuote = (e) => {
        e.preventDefault();
        const recaptchaToken = captchaSiteKey && typeof window !== 'undefined' && window.grecaptcha
            ? window.grecaptcha.getResponse()
            : '';
        if (captchaSiteKey && !recaptchaToken) {
            setRecaptchaClientError('Please complete the reCAPTCHA verification.');
            return;
        }
        setRecaptchaClientError('');
        // Keep submit behavior close to legacy page while using Inertia form handling.
        post(route('public.country.quote'), {
            forceFormData: true,
            preserveScroll: true,
            transform: (payload) => ({ ...payload, 'g-recaptcha-response': recaptchaToken }),
            onSuccess: () => {
                reset(
                    'eventname',
                    'eventcity',
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
                    'g-recaptcha-response',
                );
                if (typeof window !== 'undefined') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    if (window.grecaptcha && captchaSiteKey) {
                        window.grecaptcha.reset();
                    }
                }
            },
        });
    };

    return (
        <PublicLayout>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <link rel="canonical" href={`/${country?.value}`} />
                {captchaSiteKey ? <script src="https://www.google.com/recaptcha/api.js" async defer /> : null}
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
                                <div className="newformbg">
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
                                                            <input
                                                                type="text"
                                                                placeholder="Event Name"
                                                                value={data.eventname}
                                                                onChange={(e) => setData('eventname', e.target.value)}
                                                            />
                                                            {errors.eventname ? <div className="error">{errors.eventname}</div> : null}
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="input-outer">
                                                            <input
                                                                type="text"
                                                                placeholder="Event City"
                                                                value={data.eventcity}
                                                                onChange={(e) => setData('eventcity', e.target.value)}
                                                            />
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
                                                            <input
                                                                type="text"
                                                                placeholder="Stand Size"
                                                                value={data.boothsize}
                                                                onChange={(e) => setData('boothsize', e.target.value)}
                                                            />
                                                            {errors.boothsize ? <div className="error">{errors.boothsize}</div> : null}
                                                        </div>
                                                        <select value={data.boothtype} onChange={(e) => setData('boothtype', e.target.value)}>
                                                            <option value="SQMT">SQMT</option>
                                                            <option value="SQFT">SQFT</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="custom-drop-file">
                                                            <input
                                                                type="file"
                                                                accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx"
                                                                onChange={(e) => setData('uploadfile', e.target.files?.[0] || null)}
                                                            />
                                                            <p><span>Choose File</span> File Upload (If any)</p>
                                                            {errors.uploadfile ? <div className="error">{errors.uploadfile}</div> : null}
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <textarea
                                                            rows="3"
                                                            placeholder="Additional Message about your Booth"
                                                            value={data.information}
                                                            onChange={(e) => setData('information', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="event-details">
                                                <h3>Contact Details</h3>
                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <div className="input-outer">
                                                            <input
                                                                type="text"
                                                                placeholder="Full Name *"
                                                                value={data.fullname}
                                                                onChange={(e) => setData('fullname', e.target.value)}
                                                            />
                                                            {errors.fullname ? <div className="error">{errors.fullname}</div> : null}
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="input-outer">
                                                            <input
                                                                type="email"
                                                                placeholder="Email id *"
                                                                value={data.emailid}
                                                                onChange={(e) => setData('emailid', e.target.value)}
                                                            />
                                                            {errors.emailid ? <div className="error">{errors.emailid}</div> : null}
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="input-outer">
                                                            <input
                                                                type="tel"
                                                                placeholder="Phone Number *"
                                                                value={data.phonenumber}
                                                                onChange={(e) => setData('phonenumber', e.target.value)}
                                                            />
                                                            {errors.phonenumber ? <div className="error">{errors.phonenumber}</div> : null}
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="input-outer">
                                                            <input
                                                                type="text"
                                                                placeholder="Website *"
                                                                value={data.compwebsite}
                                                                onChange={(e) => setData('compwebsite', e.target.value)}
                                                            />
                                                            {errors.compwebsite ? <div className="error">{errors.compwebsite}</div> : null}
                                                        </div>
                                                    </div>
                                                    <div className="co-lg-12 col-md-12">
                                                        <div className="check-box-main">
                                                            <span className="check">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={Boolean(data.privacy_accepted)}
                                                                    onChange={(e) => setData('privacy_accepted', e.target.checked)}
                                                                />
                                                            </span>
                                                            <p>
                                                                I agree to the Expostandzone&apos;{' '}
                                                                <a href="/privacy-policy" target="_blank" rel="noreferrer">Privacy Policy</a> *
                                                            </p>
                                                        </div>
                                                        {captchaSiteKey ? (
                                                            <div className="mt-2 mb-1">
                                                                <div className="g-recaptcha" data-sitekey={captchaSiteKey} />
                                                            </div>
                                                        ) : null}
                                                        {recaptchaClientError ? <div className="error text-center">{recaptchaClientError}</div> : null}
                                                        {errors['g-recaptcha-response'] ? <div className="error text-center">{errors['g-recaptcha-response']}</div> : null}
                                                        {errors.privacy_accepted ? <div className="error text-center">{errors.privacy_accepted}</div> : null}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-center mt-2">
                                                <button type="submit" className="btn btn-danger" disabled={processing}>
                                                    {processing ? 'Submitting...' : 'Submit Requirement'}
                                                </button>
                                            </div>
                                            {Object.keys(errors).length > 0 ? (
                                                <div className="alert alert-danger mt-3 mb-0">Please correct highlighted fields and try again.</div>
                                            ) : null}
                                        </form>
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
                                {topDesc ? <div className="short-bio" dangerouslySetInnerHTML={{ __html: topDesc }} /> : null}

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
                                {botDesc ? <div className="short-bio mt-4" dangerouslySetInnerHTML={{ __html: botDesc }} /> : null}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

