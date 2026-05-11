import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';

export default function ContactUs() {
    return (
        <PublicLayout>
            <Head>
                <title>Contact Us - Expostandzone</title>
                <meta name="description" content="Fill the contact form, call us, or email us to discuss your exhibition stand requirements." />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" />
                <link rel="stylesheet" type="text/css" href="/web/css/common.css?ver=1.0.7" />
                <link rel="stylesheet" type="text/css" href="/web/css/contact-us.css?ver=1.0.5" />
                <link rel="stylesheet" type="text/css" href="/web/css/responsive.css?ver=1.0.5" />
            </Head>
            <section>
                <div className="mainbanner"><div className="container"><div className="widthmedium"><h1 className="hometitle">CONTACT US</h1></div></div></div>
            </section>
            <section>
                <div className="form-contact">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-4">
                                <div className="address-box">
                                    <ul>
                                        <li><div className="content"><h3>Phone Number</h3><p><a href="tel:+17169417998">+1 716 941 7998</a></p></div></li>
                                        <li><div className="content"><h3>Email Address</h3><p><a href="mailto:enquiry@expostandzone.com">enquiry@expostandzone.com</a></p></div></li>
                                        <li><div className="content"><h3>Website</h3><p><a href="https://www.expostandzone.com">www.expostandzone.com</a></p></div></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-8">
                                <div className="white-bg">
                                    <div className="heading-content">
                                        <h4>Tell Us About Your Exhibition Stand Requirements</h4>
                                        <p>Call +1 716 941 7998 or submit enquiry form below</p>
                                    </div>
                                    <form>
                                        <div className="row">
                                            <div className="col-lg-6 col-md-12"><div className="input-outer"><input type="text" placeholder="Name*" /></div></div>
                                            <div className="col-lg-6 col-md-12"><div className="input-outer"><input type="tel" placeholder="Mobile No*" /></div></div>
                                            <div className="col-lg-6 col-md-12"><div className="input-outer"><input type="email" placeholder="Email*" /></div></div>
                                            <div className="col-lg-6 col-md-12"><div className="input-outer"><input type="text" placeholder="Country Name*" /></div></div>
                                            <div className="col-lg-12"><div className="input-outer"><textarea rows="4" placeholder="Enter Message" /></div></div>
                                            <div className="col-lg-12 text-center"><input type="submit" value="SUBMIT" /></div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
