import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';

export default function Terms() {
    return (
        <PublicLayout>
            <Head>
                <title>Terms and Conditions</title>
                <meta name="description" content="Terms and conditions for using Expo Stand Zone platform and services." />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" />
                <link rel="stylesheet" type="text/css" href="/web/css/common.css?ver=1.0.7" />
                <link rel="stylesheet" type="text/css" href="/web/css/terms-and-condition.css?ver=1.0.5" />
                <link rel="stylesheet" type="text/css" href="/web/css/responsive.css?ver=1.0.5" />
            </Head>
            <section>
                <div className="mainbanner"><div className="container"><div className="widthmedium"><h1 className="hometitle">TERMS &amp; CONDITIONS</h1></div></div></div>
            </section>
            <section>
                <div className="terms-condition-sec">
                    <div className="container">
                        <div className="content-area">
                            <h2>1. Introduction</h2>
                            <p>These terms govern your access and use of Expo Stand Zone and related services. By using the platform, you agree to these terms.</p>
                            <h2>2. Account and Use</h2>
                            <p>Users must provide accurate details and are responsible for account security and all activities performed using their account.</p>
                            <h2>3. Service Terms</h2>
                            <p>Stand builders and exhibitors agree to communicate in good faith and use leads and platform services only for legitimate business purposes.</p>
                            <h2>4. Payments</h2>
                            <p>Subscription and package terms are governed by selected plans and applicable invoices or agreements.</p>
                            <h2>5. Intellectual Property</h2>
                            <p>All platform content, branding, and software are protected by applicable intellectual property laws.</p>
                            <h2>6. Liability</h2>
                            <p>Expo Stand Zone is not liable for indirect or consequential losses resulting from platform use or inability to access services.</p>
                            <h2>7. Contact</h2>
                            <p>For legal or policy queries, contact <a href="mailto:enquiry@expostandzone.com">enquiry@expostandzone.com</a>.</p>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
