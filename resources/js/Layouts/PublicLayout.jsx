import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function PublicLayout({ children }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const id = 'gtm-expostandzone';
        if (document.getElementById(id)) {
            return;
        }
        const s = document.createElement('script');
        s.id = id;
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=GTM-MCNN97H';
        document.head.appendChild(s);
        window.dataLayer = window.dataLayer || [];
        function gtag() {
            window.dataLayer.push(arguments);
        }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', 'GTM-MCNN97H');
    }, []);

    useEffect(() => {
        document.body.classList.toggle('mobile-nav-open', mobileMenuOpen);
        return () => document.body.classList.remove('mobile-nav-open');
    }, [mobileMenuOpen]);

    return (
        <div id="legacy-root" className="legacy-root">
            <Head />
            <div className="topheader">
                <div className="container">
                    <div className="logo">
                        <Link href="/">
                            <img
                                src="/web/images/logo.png"
                                width="300"
                                height="97"
                                alt="Expostandzone"
                                loading="eager"
                                decoding="async"
                                style={{ maxWidth: '300px', height: 'auto' }}
                            />
                        </Link>
                    </div>
                    <button
                        type="button"
                        className={`public-mobile-toggle ${mobileMenuOpen ? 'is-open' : ''}`}
                        aria-expanded={mobileMenuOpen}
                        aria-label="Toggle menu"
                        onClick={() => setMobileMenuOpen((s) => !s)}
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                    <div className="infocontainer">
                        <div className="phonecontainer">
                            <ul>
                                <li>
                                    <a href="mailto:enquiry@expostandzone.com?body=Hello,%0D%0AWe kindly request you to provide us with as much information as possible. This will greatly assist us in preparing a tailored proposal that meets your specific needs.%0D%0APlease include the following details:%0D%0A%0D%0A%0D%0AYour Name:%0D%0AEmail ID:%0D%0AContact Number:%0D%0AEvent Name:%0D%0AEvent Date:%0D%0AEvent City:%0D%0ABooth Size:%0D%0ABudget in Your Mind:%0D%0ACompany Name:%0D%0AWebsite:%0D%0AYour Country:%0D%0A%0D%0AThank you for your cooperation. We look forward to receiving the necessary information to create a successful proposal for you.%0D%0A%0D%0A,&subject=Getme 5 Quotations">
                                        enquiry@expostandzone.com
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className={`loginbtnbg public-mobile-nav ${mobileMenuOpen ? 'is-open' : ''}`}>
                            <ul>
                                <li>
                                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                        Login{' '}
                                        <span>
                                            <img
                                                src="/web/images/register.png"
                                                width="35"
                                                height="33"
                                                alt=""
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        </span>
                                    </Link>
                                </li>
                                <li className="mobilenone">
                                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                                        Register{' '}
                                        <span>
                                            <img
                                                src="/web/images/login.png"
                                                width="35"
                                                height="33"
                                                alt=""
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        </span>
                                    </Link>
                                </li>
                                <li className="web-view">
                                    <a href="/getquote" className="getquotebtn" onClick={() => setMobileMenuOpen(false)}>
                                        GET FREE QUOTE{' '}
                                        <span>
                                            <img
                                                src="/web/images/comment.png"
                                                width="35"
                                                height=""
                                                alt=""
                                            />
                                        </span>
                                    </a>
                                </li>
                                <li className="web-view">
                                    <a
                                        href="https://wa.me/17754018989?text=Hello%20I%20want%20to%20know%20more"
                                        className="btn btn-success"
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <i className="fa fa-whatsapp" /> Chat on WhatsApp
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            {children}
            <footer>
                <div className="footertop">
                    <div className="container">
                        <ul>
                            <li>
                                <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                            </li>
                            <li>
                                <a href="/about-us">About Us</a>
                            </li>
                            <li>
                                <a href="/trade-shows">Trade Shows</a>
                            </li>
                            <li>
                                <a href="/blog">Blog</a>
                            </li>
                            <li>
                                <a href="/contact-us">Contact Us</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="footer">
                    <div className="container">
                        <div className="footerimgcontainer">
                            <img src="/web/images/footerbg.webp" width="" height="" alt="" />
                            <div className="footeroverlay">
                                <div className="footerinner">
                                    <h2 className="footertitle">Are you an exhibition stand builder?</h2>
                                    <p>List your company on our portal and expand your business.</p>
                                    <div className="footerquotebtn">
                                        <div className="getstarted">
                                            <a href="/register">REGISTER NOW</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="footerbottom">
                            <h2 className="bottitle">HELP & SUPPORT</h2>
                            <div className="bottommenu">
                                <ul>
                                    <li>
                                        <a href="/return-policy">Refund Policy</a>
                                    </li>
                                    <li>
                                        <a href="/faq">faq</a>
                                    </li>
                                    <li>
                                        <a href="/terms-and-condition">Terms and Conditions</a>
                                    </li>
                                    <li>
                                        <a href="/review-guidelines">Review Guidelines</a>
                                    </li>
                                    <li>
                                        <a href="tel:+1 716 941 7998">
                                            <i className="fa fa-phone" /> +1 716 941 7998
                                        </a>
                                    </li>
                                    <li>
                                        <a href="mailto:enquiry@expostandzone.com?body=Hello,%0D%0AWe kindly request you to provide us with as much information as possible. This will greatly assist us in preparing a tailored proposal that meets your specific needs.%0D%0APlease include the following details:%0D%0A%0D%0A%0D%0AYour Name:%0D%0AEmail ID:%0D%0AContact Number:%0D%0AEvent Name:%0D%0AEvent Date:%0D%0AEvent City:%0D%0ABooth Size:%0D%0ABudget in Your Mind:%0D%0ACompany Name:%0D%0AWebsite:%0D%0AYour Country:%0D%0A%0D%0AThank you for your cooperation. We look forward to receiving the necessary information to create a successful proposal for you.%0D%0A%0D%0A,&subject=Getme 5 Quotations">
                                            <i className="fa fa-envelope" /> enquiry@expostandzone.com
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="copyright">
                                Copyright © {new Date().getFullYear()}{' '}
                                <Link href="/">Expo Stand Zone Pvt. Ltd.</Link>{' '}
                                <a href="/privacy-policy">Privacy Policy</a>
                            </div>
                            <div className="footersocial">
                                <ul>
                                    <li>
                                        <a
                                            href="https://www.linkedin.com/company/expostand-zone/"
                                            rel="nofollow noreferrer"
                                            target="_blank"
                                        >
                                            <img
                                                src="/web/images/linkedin.png"
                                                alt="linkedin"
                                                width="32"
                                                height="32"
                                            />
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://twitter.com/expostandzone/" rel="nofollow noreferrer" target="_blank">
                                            <img
                                                src="/web/images/twitter2.png"
                                                alt="twitter"
                                                width="32"
                                                height="32"
                                            />
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://www.facebook.com/expostandzone/"
                                            rel="nofollow noreferrer"
                                            target="_blank"
                                        >
                                            <img src="/web/images/fb.png" alt="facebook" width="32" height="32" />
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://www.instagram.com/Expostandzone/"
                                            rel="nofollow noreferrer"
                                            target="_blank"
                                        >
                                            <img src="/web/images/ig.webp" alt="instagram" width="32" height="32" />
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://pinterest.com/expostandzone/" rel="nofollow noreferrer" target="_blank">
                                            <img src="/web/images/pin.webp" alt="pinterest" width="32" height="32" />
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
