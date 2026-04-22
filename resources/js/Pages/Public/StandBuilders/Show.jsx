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

export default function Show({ standbuilder }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        country_value: standbuilder?.country_value || '',
        eventname: '',
        eventcity: standbuilder?.cityname || '',
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
                setData('eventcity', standbuilder?.cityname || '');
            },
        });
    };

    const title = standbuilder?.metatitle || `${standbuilder?.companyname} | Trade Show Booth Design`;
    const description = standbuilder?.metadesc || `Explore ${standbuilder?.companyname} profile, services, and locations.`;

    return (
        <PublicLayout>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <link rel="canonical" href={`/${standbuilder?.slug}`} />
            </Head>
            <section>
                <div className="mainbanner" />
            </section>

            <section className="readyset-sect">
                <div className="sub-banner">
                    <div className="container">
                        <div className="Breadcrumb mb-2 text-center">
                            <ul>
                                <li><Link href="/"><i className="fa fa-home" /></Link></li>
                                <li><a href="#"> {standbuilder?.companyname}</a></li>
                            </ul>
                        </div>
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="sub-ban-inner">
                                    <div className="company-profile">
                                        <div className="figure">
                                            <img
                                                src={standbuilder?.complogo ? `/uploads/standbuilder/${standbuilder.complogo}` : '/web/images/noimage.webp'}
                                                alt={standbuilder?.companyname}
                                                className="img-fluid"
                                            />
                                        </div>
                                        <div className="content">
                                            <div className="title">{standbuilder?.companyname}</div>
                                            {standbuilder?.found_year ? <p>Founded : <span>{standbuilder.found_year}</span></p> : null}
                                            <p><span><i className="fa fa-map-marker" /> {standbuilder?.cityname} , {standbuilder?.countryname}</span></p>
                                        </div>
                                    </div>
                                </div>
                                <div className="city-box">
                                    <ul>
                                        <li><a className="active" href="#shortbio">Overview</a></li>
                                        <li><a href="#Services">Services</a></li>
                                        <li><a href="#ServiceLocations">Service Locations</a></li>
                                        <li><a href="#reviews">Reviews</a></li>
                                    </ul>
                                </div>
                                <div className="short-bio" id="shortbio">
                                    <p dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(standbuilder?.about_comp || '') }} />
                                </div>
                                <div className="short-bio" id="Services">
                                    <h3>SERVICES</h3>
                                    <div className="List-wrap">
                                        <ul className="list-unstyled">
                                            {(standbuilder?.services ?? []).map((s, i) => (
                                                <li key={i}><span><i className="fa fa-check-square-o" aria-hidden="true" /></span> {s}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="short-bio" id="ServiceLocations">
                                    <h3>LOCATION</h3>
                                    <div className="List-wrap">
                                        <ul className="list-unstyled">
                                            {(standbuilder?.business_scope_countries ?? []).map((c, i) => (
                                                <li key={i}><span><i className="fa fa-map-marker" aria-hidden="true" /></span> {c}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="reviews" id="reviews">
                                    <div className="top-area d-flex justify-content-between align-items-center">
                                        <h3 className="mb-0">Reviews</h3>
                                        <div className="writereview"><a href="#">Write a review</a></div>
                                    </div>
                                    <div className="recommended-sec mt-3">
                                        <div className="row">
                                            <div className="col-lg-3">
                                                <div className="rt-box">
                                                    <h3>0.0</h3>
                                                    <p>out of 5.0</p>
                                                </div>
                                            </div>
                                            <div className="col-lg-9">
                                                <div className="comment-rating">
                                                    <ul>
                                                        <li><p>Design Creativity &amp; Customization</p><span className="text-muted">0.0</span></li>
                                                        <li><p>Quality of Workmanship &amp; Materials</p><span className="text-muted">0.0</span></li>
                                                        <li><p>Project Management &amp; Timely Execution</p><span className="text-muted">0.0</span></li>
                                                        <li><p>Cost Efficiency</p><span className="text-muted">0.0</span></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 fom-sticky">
                                <form onSubmit={submitQuote} className="fom-right">
                                <div className="header-bx">Contact For Booth Design &amp; Fabrication Services</div>
                                <input type="hidden" value={data.country_value} />
                                <input type="hidden" value={data.pageurl} />
                                <input type="hidden" value={data.ipaddress} />
                                <input type="hidden" value={data.phone_full} />
                                <input type="text" value={data.honeypot} onChange={(e) => setData('honeypot', e.target.value)} tabIndex={-1} autoComplete="off" style={{ display: 'none' }} />
                                {flash?.success ? <div className="alert alert-success mb-3">{flash.success}</div> : null}
                                <h2>Event Details</h2>
                                <div className="input-outer"><input type="text" placeholder="Event Name *" value={data.eventname} onChange={(e) => setData('eventname', e.target.value)} /></div>
                                {errors.eventname ? <div className="error">{errors.eventname}</div> : null}
                                <div className="input-outer"><input type="text" placeholder="Event City *" value={data.eventcity} onChange={(e) => setData('eventcity', e.target.value)} /></div>
                                {errors.eventcity ? <div className="error">{errors.eventcity}</div> : null}
                                <h2>Booth Details</h2>
                                <div className="d-flex">
                                    <div className="input-outer"><input type="text" placeholder="Stand Size *" value={data.boothsize} onChange={(e) => setData('boothsize', e.target.value)} /></div>
                                    <select value={data.boothtype} onChange={(e) => setData('boothtype', e.target.value)}>
                                        <option value="SQMT">SQMT</option>
                                        <option value="SQFT">SQFT</option>
                                    </select>
                                </div>
                                {errors.boothsize ? <div className="error">{errors.boothsize}</div> : null}
                                <div className="custom-drop-file">
                                    <input type="file" accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx" onChange={(e) => setData('uploadfile', e.target.files?.[0] || null)} />
                                    <p><span>Choose File</span> File Upload (If any)</p>
                                </div>
                                {errors.uploadfile ? <div className="error">{errors.uploadfile}</div> : null}
                                <textarea rows="3" placeholder="Additional Message about your Booth" value={data.information} onChange={(e) => setData('information', e.target.value)} />
                                <h2>Contact Details</h2>
                                <div className="input-outer"><input type="text" placeholder="Full Name *" value={data.fullname} onChange={(e) => setData('fullname', e.target.value)} /></div>
                                {errors.fullname ? <div className="error">{errors.fullname}</div> : null}
                                <div className="input-outer"><input type="email" placeholder="Email id *" value={data.emailid} onChange={(e) => setData('emailid', e.target.value)} /></div>
                                {errors.emailid ? <div className="error">{errors.emailid}</div> : null}
                                <div className="input-outer"><input type="tel" placeholder="Phone Number *" value={data.phonenumber} onChange={(e) => setData('phonenumber', e.target.value)} /></div>
                                {errors.phonenumber ? <div className="error">{errors.phonenumber}</div> : null}
                                <div className="input-outer"><input type="text" placeholder="Website *" value={data.compwebsite} onChange={(e) => setData('compwebsite', e.target.value)} /></div>
                                {errors.compwebsite ? <div className="error">{errors.compwebsite}</div> : null}
                                <div className="check-box-main">
                                    <span className="check"><input type="checkbox" checked={Boolean(data.privacy_accepted)} onChange={(e) => setData('privacy_accepted', e.target.checked)} /></span>
                                    <p>I agree to the Expostandzone&apos; <a href="/privacy-policy" target="_blank" rel="noreferrer">Privacy Policy</a> *</p>
                                </div>
                                {errors.privacy_accepted ? <div className="error">{errors.privacy_accepted}</div> : null}
                                <input type="submit" value={processing ? 'Sending...' : 'Send Request'} disabled={processing} />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

