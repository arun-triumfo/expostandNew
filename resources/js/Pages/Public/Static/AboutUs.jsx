import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';

export default function AboutUs() {
    return (
        <PublicLayout>
            <Head>
                <title>About Us - Expostandzone</title>
                <meta name="description" content="Our About Us page tells the story of who we are, what we do, and why we do it. Learn more about our mission, team, and values." />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" />
                <link rel="stylesheet" type="text/css" href="/web/css/common.css?ver=1.0.7" />
                <link rel="stylesheet" type="text/css" href="/web/css/about-us.css?ver=1.0.5" />
                <link rel="stylesheet" type="text/css" href="/web/css/responsive.css?ver=1.0.5" />
            </Head>
            <section>
                <div className="mainbanner">
                    <div className="container">
                        <div className="widthmedium">
                            <div className="title">WANT TO KNOW ABOUT HISTORY</div>
                            <h1 className="hometitle">ABOUT US</h1>
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <div className="about-sec">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="content-area">
                                    <h2><span>A Global</span> Online Portal For Exhibitor, Supplier &amp; Organizer</h2>
                                    <p>Expostandzone is one of the leading global online portals for exhibitors, suppliers, and organizers. We have an extensive and reliable network of 2100+ stand builders and suppliers in 65+ countries and 400+ cities to help you connect with the best stand design company.</p>
                                    <p>Our user-friendly portal helps you contact only verified and pre-screened exhibition stand contractors and exhibitors. We follow strict parameters before registering them on our portal.</p>
                                    <p>Post your stand design specifications on our portal, and we will introduce you to the five suppliers that best match your requirements.</p>
                                    <ul>
                                        <li>Explore Expostandzone as an exhibitor to receive multiple exhibit quotes in various exhibiting cities worldwide.</li>
                                        <li>A supplier can register with Expo Stand Zone to connect with their target audience and generate more business.</li>
                                        <li>As an organizer, you can register with us to reach potential exhibitors looking to exhibit in upcoming shows.</li>
                                    </ul>
                                    <p>We have helped 10,000+ exhibitors across 800+ exhibitions worldwide to accomplish their branding and marketing goals.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
