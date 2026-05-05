import PublicLayout from '@/Layouts/PublicLayout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const stripHtml = (value) => String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const formatDateShort = (value) => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatCountdownTarget = (value) => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    const month = d.toLocaleDateString('en-US', { month: 'long' });
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${month} ${day}, ${year}`;
};

export default function Show({ tradeshow, captchaSiteKey = '' }) {
    const [recaptchaClientError, setRecaptchaClientError] = useState('');
    const { data, setData, post, processing, errors } = useForm({
        country_value: '',
        eventname: tradeshow?.name || '',
        eventcity: tradeshow?.cityname || '',
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
        country_code: '',
        'g-recaptcha-response': '',
    });

    useEffect(() => {
        let iti = null;
        let timer = null;
        const attachPhoneInput = () => {
            const input = document.querySelector('#phonenumber');
            if (!input || typeof window === 'undefined' || !window.intlTelInput) return false;
            iti = window.intlTelInput(input, {
                initialCountry: 'auto',
                preferredCountries: ['in', 'us', 'gb', 'de', 'fr', 'it', 'es', 'ae'],
                utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.11/build/js/utils.js',
                separateDialCode: true,
                nationalMode: false,
                autoPlaceholder: 'aggressive',
                geoIpLookup: (callback) => {
                    fetch('https://ipapi.co/json/')
                        .then((res) => res.json())
                        .then((result) => callback((result?.country_code || 'us').toLowerCase()))
                        .catch(() => callback('us'));
                },
            });
            const syncPhoneData = () => {
                try {
                    const fullNumber = iti?.getNumber() || input.value || '';
                    const dialCode = iti?.getSelectedCountryData()?.dialCode || '';
                    setData('phone_full', fullNumber);
                    setData('country_code', dialCode);
                } catch {
                    setData('phone_full', input.value || '');
                }
            };
            input.addEventListener('input', (e) => setData('phonenumber', e.target.value));
            input.addEventListener('countrychange', syncPhoneData);
            input.addEventListener('blur', syncPhoneData);
            setTimeout(syncPhoneData, 150);
            return true;
        };

        if (!attachPhoneInput()) {
            timer = setInterval(() => {
                if (attachPhoneInput()) {
                    clearInterval(timer);
                }
            }, 300);
        }
        return () => {
            if (timer) clearInterval(timer);
            if (iti?.destroy) iti.destroy();
        };
    }, [setData]);

    const submitQuote = (e) => {
        e.preventDefault();
        const recaptchaToken =
            captchaSiteKey && typeof window !== 'undefined' && window.grecaptcha
                ? window.grecaptcha.getResponse()
                : '';
        if (captchaSiteKey && !recaptchaToken) {
            setRecaptchaClientError('Please complete the reCAPTCHA verification.');
            return;
        }
        setRecaptchaClientError('');
        post(route('public.country.quote'), {
            forceFormData: true,
            preserveScroll: true,
            transform: (payload) => ({
                ...payload,
                'g-recaptcha-response': recaptchaToken,
            }),
        });
    };

    const eventDateLine = `${formatDateShort(tradeshow?.start_date)} - ${formatDateShort(tradeshow?.end_date)}`;
    const cleanDetails = stripHtml(tradeshow?.details || '');
    const bannerShort = cleanDetails.split(' ').slice(0, 16).join(' ');
    const countdownTarget = formatCountdownTarget(tradeshow?.start_date);

    return (
        <PublicLayout>
            <Head>
                <title>{tradeshow?.meta_title || tradeshow?.name}</title>
                <meta name="description" content={tradeshow?.meta_desc || ''} />
                <link rel="canonical" href={`/trade-shows/${tradeshow?.slug}`} />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" />
                <link rel="stylesheet" type="text/css" href="/web/css/common.css?ver=1.0.7" />
                <link rel="stylesheet" type="text/css" href="/web/css/trade-show-details.css?ver=1.0.9" />
                <link rel="stylesheet" type="text/css" href="/web/css/responsive.css?ver=1.0.5" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.11/build/css/intlTelInput.css" />
                <script src="https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.11/build/js/intlTelInput.min.js" />
                {captchaSiteKey ? <script src="https://www.google.com/recaptcha/api.js" async defer /> : null}
            </Head>

            <section>
                <div className="mainbanner">
                    <div className="container">
                        <div className="widthmedium">
                            <h1 className="hometitle">{tradeshow?.name}</h1>
                            <p>{bannerShort}</p>
                        </div>
                        <div className="business-conference-sec">
                            <div className="row">
                                <div className="col-lg-4">
                                    <div className="Business-box">
                                        <div className="content">
                                            <div className="icon">
                                                <img
                                                    src={tradeshow?.logo ? `/uploads/tradeshow/${tradeshow.logo}` : '/web/images/noimage.webp'}
                                                    width="225"
                                                    height="225"
                                                    alt={tradeshow?.logo_alt || tradeshow?.name}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-8">
                                    <div className="event-right">
                                        <div className="row">
                                            <div className="col-lg-5">
                                                <div className="left-content">
                                                    <div className="figure">
                                                        <div className="left-content">
                                                            <ul>
                                                                <li><p className="counter-box" id="counteventday">0</p><p>Days</p></li>
                                                                <li><p className="counter-box" id="counteventhour">0</p><p>Hours</p></li>
                                                                <li><p className="counter-box" id="counteventminut">0</p><p>Minutes</p></li>
                                                                <li><p className="counter-box" id="counteventsec">0</p><p>Second</p></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-7">
                                                <div className="right-content">
                                                    <h2>About {tradeshow?.name}</h2>
                                                    <div className="time">
                                                        <p>Date : {eventDateLine}</p>
                                                        <p>Location : {tradeshow?.cityname}, {tradeshow?.countryname}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="not-organizers-ticker" aria-label="Notice">
                <div className="not-organizers-ticker-wrap">
                    <span className="not-organizers-ticker-text">
                        Expostandzone.com is not the organiser of this event; for tickets, space booking, visa assistance, or related queries, please contact the event organiser directly.
                    </span>
                    <span className="not-organizers-ticker-text" aria-hidden="true">
                        Expostandzone.com is not the organiser of this event; for tickets, space booking, visa assistance, or related queries, please contact the event organiser directly.
                    </span>
                </div>
            </div>

            <section>
                <div className="gray-bg">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="event-info">
                                    <div className="content-area">
                                        <h2>Event Information</h2>
                                        <div dangerouslySetInnerHTML={{ __html: tradeshow?.details || '' }} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 fom-sticky">
                                <form onSubmit={submitQuote}>
                                    <input
                                        type="text"
                                        value={data.honeypot}
                                        onChange={(e) => setData('honeypot', e.target.value)}
                                        tabIndex={-1}
                                        autoComplete="off"
                                        style={{ display: 'none' }}
                                    />
                                    <div className="fom-right">
                                        <div className="header-bx">Contact For Booth Design &amp; Fabrication Services</div>
                                        <h2>Event Details</h2>
                                        <div className="col-lg-12 col-md-12">
                                            <div className="input-outer">
                                                <input type="text" placeholder="Event Name" value={data.eventname} onChange={(e) => setData('eventname', e.target.value)} />
                                                {errors.eventname ? <div className="error">{errors.eventname}</div> : null}
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12">
                                            <div className="input-outer">
                                                <input type="text" placeholder="Event City" value={data.eventcity} onChange={(e) => setData('eventcity', e.target.value)} />
                                                {errors.eventcity ? <div className="error">{errors.eventcity}</div> : null}
                                            </div>
                                        </div>

                                        <h2>Booth Details</h2>
                                        <div className="col-lg-12 d-flex">
                                            <div className="input-outer">
                                                <input type="text" placeholder="Stand Size" value={data.boothsize} onChange={(e) => setData('boothsize', e.target.value)} />
                                            </div>
                                            <select value={data.boothtype} onChange={(e) => setData('boothtype', e.target.value)}>
                                                <option value="SQMT">SQMT</option>
                                                <option value="SQFT">SQFT</option>
                                            </select>
                                        </div>
                                        <div className="col-lg-12 col-md-12">
                                            <div className="custom-drop-file">
                                                <input type="file" accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx" onChange={(e) => setData('uploadfile', e.target.files?.[0] || null)} />
                                                <p><span>Choose File</span> File Upload (If any)</p>
                                            </div>
                                        </div>
                                        <div className="co-lg-12 col-md-12">
                                            <textarea
                                                rows="3"
                                                placeholder="Additional Message about your Booth"
                                                value={data.information}
                                                onChange={(e) => setData('information', e.target.value)}
                                            />
                                        </div>

                                        <h2>Contact Details</h2>
                                        <div className="col-lg-12 col-md-12"><div className="input-outer"><input type="text" placeholder="Full Name *" value={data.fullname} onChange={(e) => setData('fullname', e.target.value)} /></div></div>
                                        <div className="col-lg-12 col-md-12"><div className="input-outer"><input type="email" placeholder="Email id*" value={data.emailid} onChange={(e) => setData('emailid', e.target.value)} /></div></div>
                                        <div className="col-lg-12 col-md-12"><div className="input-outer"><input id="phonenumber" type="tel" placeholder="Phone Number *" defaultValue={data.phonenumber} /></div></div>
                                        <div className="col-lg-12 col-md-12"><div className="input-outer"><input type="text" placeholder="Website*" value={data.compwebsite} onChange={(e) => setData('compwebsite', e.target.value)} /></div></div>
                                        {captchaSiteKey ? (
                                            <div className="col-lg-12 col-md-12">
                                                <div className="g-recaptcha" data-sitekey={captchaSiteKey} style={{ marginBottom: 15 }} />
                                            </div>
                                        ) : null}
                                        {recaptchaClientError ? <div className="col-lg-12"><div className="error">{recaptchaClientError}</div></div> : null}
                                        {errors['g-recaptcha-response'] ? <div className="col-lg-12"><div className="error">{errors['g-recaptcha-response']}</div></div> : null}

                                        <div className="co-lg-12 col-md-12">
                                            <div className="check-box-main">
                                                <span className="check">
                                                    <input
                                                        type="checkbox"
                                                        checked={Boolean(data.privacy_accepted)}
                                                        onChange={(e) => setData('privacy_accepted', e.target.checked)}
                                                    />
                                                </span>
                                                <p>By submitting a form on Expostandzone.com, you agree to this <a href="/privacy-policy" target="_blank" rel="noreferrer">Privacy Policy</a></p>
                                            </div>
                                        </div>
                                        <div className="co-lg-12 col-md-12">
                                            <input type="submit" value={processing ? 'Sending...' : 'Send Request'} disabled={processing} />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        (function() {
                            var countDownDate = new Date("${countdownTarget}").getTime();
                            if (!countDownDate || Number.isNaN(countDownDate)) return;
                            setInterval(function() {
                                var now = new Date().getTime();
                                var distance = countDownDate - now;
                                if (distance <= 0) return;
                                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                                var d = document.getElementById('counteventday');
                                var h = document.getElementById('counteventhour');
                                var m = document.getElementById('counteventminut');
                                var s = document.getElementById('counteventsec');
                                if (d) d.textContent = days;
                                if (h) h.textContent = hours;
                                if (m) m.textContent = minutes;
                                if (s) s.textContent = seconds;
                            }, 1000);
                        })();
                    `,
                }}
            />
        </PublicLayout>
    );
}

