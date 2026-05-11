import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';

export default function RefundPolicy() {
    return (
        <PublicLayout>
            <Head>
                <title>Refund Policy</title>
                <meta name="robots" content="noindex, nofollow" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" />
                <link rel="stylesheet" type="text/css" href="/web/css/common.css?ver=1.0.7" />
                <link rel="stylesheet" type="text/css" href="/web/css/return-policy.css?ver=1.0.5" />
                <link rel="stylesheet" type="text/css" href="/web/css/responsive.css?ver=1.0.5" />
            </Head>
            <section>
                <div className="mainbanner">
                    <div className="container"><div className="widthmedium"><h1 className="hometitle">REFUND POLICY</h1></div></div>
                </div>
            </section>
            <section>
                <div className="terms-condition-sec">
                    <div className="container">
                        <div className="content-area">
                            <h2>What&apos;s in these terms?</h2>
                            <p>Expostandzone.com has a non-refund policy for all offered packages. Annual package fees are non-refundable under any circumstance.</p>
                            <p>Lead replacement can be considered in cases where:</p>
                            <ul>
                                <li>The exhibition date has already passed</li>
                                <li>The exhibition is canceled</li>
                                <li>The lead is counterfeit</li>
                                <li>There is an error in lead details from our end</li>
                            </ul>
                            <p>For any query regarding refund policy, contact <a href="mailto:enquiry@expostandzone.com">enquiry@expostandzone.com</a>.</p>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
