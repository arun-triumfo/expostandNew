import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const NAV_SECTIONS = [
    { id: 'shortbio', label: 'Overview' },
    { id: 'Services', label: 'Services' },
    { id: 'ServiceLocations', label: 'Service Locations' },
    { id: 'reviews', label: 'Reviews' },
];

const BUSINESS_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@(?!gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|rediffmail\.com|googlemail\.com|icloud\.com|live\.com|msn\.com)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}$/i;

function decodeHtmlEntities(input) {
    const text = String(input ?? '');
    if (typeof window === 'undefined') {
        return text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
    }
    const t = document.createElement('textarea');
    t.innerHTML = text;
    return t.value;
}

function StarRow({ label, value, onChange }) {
    return (
        <div className="mb-3">
            <div className="font-weight-bold small mb-1">{label}</div>
            <div className="d-flex align-items-center flex-wrap" style={{ gap: 2 }}>
                {[1, 2, 3, 4, 5].map((n) => (
                    <button
                        key={n}
                        type="button"
                        className="btn btn-link p-0 m-0 border-0"
                        style={{ lineHeight: 1 }}
                        onClick={() => onChange(n)}
                        aria-label={`${n} of 5 stars`}
                    >
                        <i
                            className={`fa ${n <= value ? 'fa-star text-warning' : 'fa-star-o text-secondary'}`}
                            style={{ fontSize: '1.4rem' }}
                        />
                    </button>
                ))}
                <span className="small text-muted ml-1">{value}/5</span>
            </div>
        </div>
    );
}

export default function Show({ standbuilder, reviews = [], reviewStats = {}, captchaSiteKey = '' }) {
    const { flash, csrf_token: csrfToken } = usePage().props;
    const [recaptchaClientError, setRecaptchaClientError] = useState('');
    const [activeNavId, setActiveNavId] = useState('shortbio');
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewFormError, setReviewFormError] = useState('');
    const [reviewFormSuccess, setReviewFormSuccess] = useState('');
    const [reviewForm, setReviewForm] = useState({
        reviewer_name: '',
        reviewer_email: '',
        review_title: '',
        review_text: '',
        design_rating: 0,
        quality_rating: 0,
        project_rating: 0,
        cost_rating: 0,
        accept_guidelines: false,
    });

    const stats = {
        count: reviewStats?.count ?? 0,
        overall: reviewStats?.overall ?? 0,
        design: reviewStats?.design ?? 0,
        quality: reviewStats?.quality ?? 0,
        project: reviewStats?.project ?? 0,
        cost: reviewStats?.cost ?? 0,
    };

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
        'g-recaptcha-response': '',
    });

    const scrollToSection = useCallback((sectionId, { openReview } = {}) => {
        if (typeof window === 'undefined') {
            return;
        }
        const el = document.getElementById(sectionId);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveNavId(sectionId);
            if (openReview) {
                setReviewModalOpen(true);
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return undefined;
        }
        const hash = window.location.hash?.replace('#', '');
        if (hash && document.getElementById(hash)) {
            setActiveNavId(hash);
            window.setTimeout(() => {
                document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
        return undefined;
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return undefined;
        }
        const offset = 140;
        const onScroll = () => {
            let current = NAV_SECTIONS[0].id;
            for (const { id } of NAV_SECTIONS) {
                const el = document.getElementById(id);
                if (!el) {
                    continue;
                }
                const top = el.getBoundingClientRect().top + window.scrollY;
                if (window.scrollY + offset >= top) {
                    current = id;
                }
            }
            setActiveNavId(current);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (typeof document === 'undefined') {
            return undefined;
        }
        document.body.style.overflow = reviewModalOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [reviewModalOpen]);

    const closeReviewModal = () => {
        setReviewModalOpen(false);
        setReviewFormError('');
        setReviewFormSuccess('');
    };

    const resetReviewForm = () => {
        setReviewForm({
            reviewer_name: '',
            reviewer_email: '',
            review_title: '',
            review_text: '',
            design_rating: 0,
            quality_rating: 0,
            project_rating: 0,
            cost_rating: 0,
            accept_guidelines: false,
        });
    };

    const submitReview = async (e) => {
        e.preventDefault();
        setReviewFormError('');
        setReviewFormSuccess('');

        if (!reviewForm.accept_guidelines) {
            setReviewFormError('Please read and accept the Review & Rating Guidelines before submitting.');
            return;
        }
        if (![reviewForm.design_rating, reviewForm.quality_rating, reviewForm.project_rating, reviewForm.cost_rating].every((r) => r >= 1 && r <= 5)) {
            setReviewFormError('Please provide a rating (1–5) for each category.');
            return;
        }
        if (!BUSINESS_EMAIL_REGEX.test(String(reviewForm.reviewer_email || '').trim())) {
            setReviewFormError('Please use a business email address. Free providers (Gmail, Yahoo, etc.) are not accepted.');
            return;
        }

        setReviewSubmitting(true);
        try {
            const sid = standbuilder?.id;
            const email = String(reviewForm.reviewer_email).trim();
            const checkUrl = `/api/check-review/${sid}/${encodeURIComponent(email)}`;
            const checkRes = await axios.get(checkUrl, { headers: { Accept: 'application/json' } });
            if (checkRes.data?.exists) {
                setReviewFormError('You have already submitted a review for this standbuilder.');
                setReviewSubmitting(false);
                return;
            }
        } catch {
            /* duplicate check is optional; continue */
        }

        try {
            const payload = {
                standbuilder_id: standbuilder.id,
                reviewer_name: reviewForm.reviewer_name.trim(),
                reviewer_email: reviewForm.reviewer_email.trim(),
                review_title: reviewForm.review_title.trim(),
                review_text: reviewForm.review_text.trim(),
                design_rating: reviewForm.design_rating,
                quality_rating: reviewForm.quality_rating,
                project_rating: reviewForm.project_rating,
                cost_rating: reviewForm.cost_rating,
            };
            const res = await axios.post(route('submit.review'), payload, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
            });
            if (res.data?.success) {
                setReviewFormSuccess(res.data.message || 'Thank you! Please check your email to verify your review.');
                resetReviewForm();
            } else {
                setReviewFormError(res.data?.message || 'Could not submit your review.');
            }
        } catch (err) {
            const msg = err.response?.data?.message
                || (err.response?.data?.errors && Object.values(err.response.data.errors).flat().join(' '))
                || 'Could not submit your review. Please try again.';
            setReviewFormError(msg);
        } finally {
            setReviewSubmitting(false);
        }
    };

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
        post(route('public.country.quote'), {
            forceFormData: true,
            preserveScroll: true,
            transform: (payload) => ({ ...payload, 'g-recaptcha-response': recaptchaToken }),
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
                    'g-recaptcha-response',
                );
                setData('eventcity', standbuilder?.cityname || '');
                if (typeof window !== 'undefined') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    if (window.grecaptcha && captchaSiteKey) {
                        window.grecaptcha.reset();
                    }
                }
            },
        });
    };

    const title = standbuilder?.metatitle || `${standbuilder?.companyname} | Trade Show Booth Design`;
    const description = standbuilder?.metadesc || `Explore ${standbuilder?.companyname} profile, services, and locations.`;

    const renderOverallStars = () => {
        const o = stats.overall;
        const stars = [];
        for (let i = 1; i <= 5; i += 1) {
            if (i <= Math.floor(o)) {
                stars.push(<i key={i} className="fa fa-star text-warning" />);
            } else if (i === Math.ceil(o) && o - Math.floor(o) >= 0.5) {
                stars.push(<i key={i} className="fa fa-star-half-o text-warning" />);
            } else {
                stars.push(<i key={i} className="fa fa-star-o text-muted" />);
            }
        }
        return stars;
    };

    return (
        <PublicLayout>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <link rel="canonical" href={`/${standbuilder?.slug}`} />
                {captchaSiteKey ? <script src="https://www.google.com/recaptcha/api.js" async defer /> : null}
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
                                        {NAV_SECTIONS.map(({ id, label }) => (
                                            <li key={id}>
                                                <a
                                                    href={`#${id}`}
                                                    className={activeNavId === id ? 'active' : ''}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        scrollToSection(id);
                                                    }}
                                                >
                                                    {label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="short-bio sb-profile-section" id="shortbio" style={{ scrollMarginTop: '6rem' }}>
                                    <p dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(standbuilder?.about_comp || '') }} />
                                </div>
                                <div className="short-bio sb-profile-section" id="Services" style={{ scrollMarginTop: '6rem' }}>
                                    <h3>SERVICES</h3>
                                    <div className="List-wrap">
                                        <ul className="list-unstyled">
                                            {(standbuilder?.services ?? []).map((s, i) => (
                                                <li key={i}><span><i className="fa fa-check-square-o" aria-hidden="true" /></span> {s}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="short-bio sb-profile-section" id="ServiceLocations" style={{ scrollMarginTop: '6rem' }}>
                                    <h3>LOCATION</h3>
                                    <div className="List-wrap">
                                        <ul className="list-unstyled">
                                            {(standbuilder?.business_scope_countries ?? []).map((c, i) => (
                                                <li key={i}><span><i className="fa fa-map-marker" aria-hidden="true" /></span> {c}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="reviews sb-profile-section" id="reviews" style={{ scrollMarginTop: '6rem' }}>
                                    <div className="top-area d-flex justify-content-between align-items-center">
                                        <h3 className="mb-0">Reviews</h3>
                                        <div className="writereview">
                                            <button
                                                type="button"
                                                className="btn btn-link p-0 border-0 writereview-btn"
                                                onClick={() => scrollToSection('reviews', { openReview: true })}
                                            >
                                                Write a review
                                            </button>
                                        </div>
                                    </div>
                                    <div className="recommended-sec mt-3">
                                        <div className="row">
                                            <div className="col-lg-3">
                                                <div className="rt-box">
                                                    <h3>{stats.overall.toFixed(1)}</h3>
                                                    <p>out of 5.0</p>
                                                    <div className="small">{renderOverallStars()}</div>
                                                </div>
                                            </div>
                                            <div className="col-lg-9">
                                                <div className="comment-rating">
                                                    <ul>
                                                        <li><p>Design Creativity &amp; Customization</p><span className="text-muted">{stats.design.toFixed(1)}</span></li>
                                                        <li><p>Quality of Workmanship &amp; Materials</p><span className="text-muted">{stats.quality.toFixed(1)}</span></li>
                                                        <li><p>Project Management &amp; Timely Execution</p><span className="text-muted">{stats.project.toFixed(1)}</span></li>
                                                        <li><p>Cost Efficiency</p><span className="text-muted">{stats.cost.toFixed(1)}</span></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {(reviews ?? []).map((rev) => (
                                        <div className="amanda-booked mt-4 pt-3 border-top" key={rev.id}>
                                            <div className="d-flex flex-wrap align-items-start">
                                                <div className="mr-3 mb-2">
                                                    <img src="/web/images/userprofile.webp" alt="" width="56" height="56" className="rounded-circle" style={{ objectFit: 'cover' }} />
                                                </div>
                                                <div className="flex-grow-1">
                                                    <h4 className="h6 mb-1" style={{ color: '#222' }}>
                                                        {rev.reviewer_name}
                                                        {' '}
                                                        <span className="text-muted small font-weight-normal">— {rev.created_at}</span>
                                                    </h4>
                                                    <div className="mb-1">
                                                        {[1, 2, 3, 4, 5].map((i) => (
                                                            <i
                                                                key={i}
                                                                className={`fa ${i <= Math.floor(rev.average) ? 'fa-star text-warning' : i === Math.ceil(rev.average) && rev.average - Math.floor(rev.average) >= 0.5 ? 'fa-star-half-o text-warning' : 'fa-star-o text-muted'}`}
                                                            />
                                                        ))}
                                                        <span className="text-muted small ml-1">{rev.average.toFixed(1)}</span>
                                                    </div>
                                                    <h5 className="h6 mt-2" style={{ color: '#ae1b2c' }}>{rev.review_title}</h5>
                                                    <p className="mb-2" style={{ color: '#333', whiteSpace: 'pre-wrap' }}>{rev.review_text}</p>
                                                    {rev.standbuilder_reply ? (
                                                        <div className="p-2 mt-2" style={{ background: '#f5f5f5', borderRadius: 6 }}>
                                                            <strong>Standbuilder&apos;s reply:</strong>
                                                            <br />
                                                            {rev.standbuilder_reply}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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
                                    <p>I agree to Expostandzone&apos;s <a href="/privacy-policy" target="_blank" rel="noreferrer">Privacy Policy</a> *</p>
                                </div>
                                {captchaSiteKey ? (
                                    <div className="mt-2 mb-1">
                                        <div className="g-recaptcha" data-sitekey={captchaSiteKey} />
                                    </div>
                                ) : null}
                                {recaptchaClientError ? <div className="error">{recaptchaClientError}</div> : null}
                                {errors['g-recaptcha-response'] ? <div className="error">{errors['g-recaptcha-response']}</div> : null}
                                {errors.privacy_accepted ? <div className="error">{errors.privacy_accepted}</div> : null}
                                <input type="submit" value={processing ? 'Sending...' : 'Send Request'} disabled={processing} />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {reviewModalOpen ? (
                <>
                    <div
                        className="modal-backdrop fade show"
                        style={{ zIndex: 1040 }}
                        aria-hidden="true"
                        onClick={closeReviewModal}
                    />
                    <div className="modal fade show" role="dialog" aria-modal="true" style={{ display: 'block', zIndex: 1050 }} tabIndex={-1}>
                        <div className="modal-dialog modal-lg modal-dialog-scrollable" role="document">
                            <div className="modal-content">
                                <div className="modal-header border-bottom">
                                    <h5 className="modal-title">Write a Review</h5>
                                    <button type="button" className="close" aria-label="Close" onClick={closeReviewModal}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={submitReview}>
                                        <StarRow label="Design Creativity & Customization" value={reviewForm.design_rating} onChange={(v) => setReviewForm((s) => ({ ...s, design_rating: v }))} />
                                        <StarRow label="Quality of Workmanship & Materials" value={reviewForm.quality_rating} onChange={(v) => setReviewForm((s) => ({ ...s, quality_rating: v }))} />
                                        <StarRow label="Project Management & Timely Execution" value={reviewForm.project_rating} onChange={(v) => setReviewForm((s) => ({ ...s, project_rating: v }))} />
                                        <StarRow label="Cost Efficiency" value={reviewForm.cost_rating} onChange={(v) => setReviewForm((s) => ({ ...s, cost_rating: v }))} />

                                        <div className="form-group">
                                            <label className="small font-weight-bold">Your name *</label>
                                            <input className="form-control" required value={reviewForm.reviewer_name} onChange={(e) => setReviewForm((s) => ({ ...s, reviewer_name: e.target.value }))} />
                                        </div>
                                        <div className="form-group">
                                            <label className="small font-weight-bold">Review title *</label>
                                            <input className="form-control" required value={reviewForm.review_title} onChange={(e) => setReviewForm((s) => ({ ...s, review_title: e.target.value }))} />
                                        </div>
                                        <div className="form-group">
                                            <label className="small font-weight-bold">Business email *</label>
                                            <input type="email" className="form-control" required value={reviewForm.reviewer_email} onChange={(e) => setReviewForm((s) => ({ ...s, reviewer_email: e.target.value }))} />
                                            <small className="text-muted">Use your company email (not Gmail, Yahoo, etc.).</small>
                                        </div>
                                        <div className="form-group">
                                            <label className="small font-weight-bold">Your review *</label>
                                            <textarea className="form-control" rows={4} required value={reviewForm.review_text} onChange={(e) => setReviewForm((s) => ({ ...s, review_text: e.target.value }))} />
                                        </div>
                                        <div className="form-check mb-3">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="acceptGuidelines"
                                                checked={reviewForm.accept_guidelines}
                                                onChange={(e) => setReviewForm((s) => ({ ...s, accept_guidelines: e.target.checked }))}
                                            />
                                            <label className="form-check-label small" htmlFor="acceptGuidelines">
                                                I have read and accept the{' '}
                                                <a href={route('review.guidelines')} target="_blank" rel="noreferrer">Review &amp; Rating Guidelines</a>
                                            </label>
                                        </div>
                                        {reviewFormError ? <div className="alert alert-danger py-2">{reviewFormError}</div> : null}
                                        {reviewFormSuccess ? <div className="alert alert-success py-2">{reviewFormSuccess}</div> : null}
                                        <div className="d-flex justify-content-end flex-wrap" style={{ gap: 8 }}>
                                            <button type="button" className="btn btn-outline-secondary" onClick={closeReviewModal}>Close</button>
                                            <button type="submit" className="btn btn-primary" disabled={reviewSubmitting}>
                                                {reviewSubmitting ? 'Submitting…' : 'Submit review'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </PublicLayout>
    );
}
