import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';

export default function PrivacyPolicy() {
    return (
        <PublicLayout>
            <Head>
                <title>Privacy Policy</title>
                <meta name="robots" content="noindex, nofollow" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" />
                <link rel="stylesheet" type="text/css" href="/web/css/common.css?ver=1.0.7" />
                <link rel="stylesheet" type="text/css" href="/web/css/privacy-policy.css?ver=1.0.5" />
                <link rel="stylesheet" type="text/css" href="/web/css/responsive.css?ver=1.0.5" />
            </Head>
            <section>
                <div className="mainbanner">
                    <div className="container">
                        <div className="widthmedium">
                            <h1 className="hometitle">PRIVACY POLICY</h1>
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <div className="body-container-area">
                    <div className="container">
                        <div className="content-area">
                            <p><b>Expo Stand Zone Pvt Ltd</b> (the Company), herein after referred as Expo Stand Zone.</p>
                            <p><b>Object &amp; field of application</b></p>
                            <p>These general conditions govern access, use, and navigation of all domains that belong to Expo Stand Zone and any content published on those domains.</p>
                            <p><b>Intellectual/industrial property right</b></p>
                            <p>Expo Stand Zone is the legal holder of rights pertaining to the exploitation/use of intellectual and industrial property for the group domains and associated content.</p>
                            <p><b>Access</b></p>
                            <p>Access to group domains is free by default, while some services may require prior contracting and payment under specific conditions.</p>
                            <p><b>Use of the page</b></p>
                            <p>Users must provide accurate information while registering and are responsible for safeguarding account credentials and avoiding misuse.</p>
                            <p><b>License referring to the communications</b></p>
                            <p>By submitting information through our domains, users confirm rights to share that content and accept responsibility for the legality and originality of communications.</p>
                            <p><b>Guarantees and Responsibilities</b></p>
                            <p>Expo Stand Zone does not guarantee uninterrupted operation, complete absence of defects, or immunity from harmful components across all services.</p>
                            <p><b>Links to other Web Sites</b></p>
                            <p>Third-party links are provided for convenience. Expo Stand Zone does not control or guarantee third-party content, products, or services.</p>
                            <p><b>Cookies</b></p>
                            <p>We may use cookies for session continuity, security, and basic analytics. Users can manage cookie preferences in browser settings.</p>
                            <p><b>Details treatment</b></p>
                            <p>Personal data is processed to deliver requested services, improve platform quality, and communicate relevant updates in line with applicable regulations.</p>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
