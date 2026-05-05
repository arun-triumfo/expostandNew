import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ blog, related = [] }) {
    const excerpt = String(blog?.description || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 150);

    return (
        <PublicLayout>
            <Head>
                <title>{blog?.meta_title || blog?.title}</title>
                <meta name="description" content={blog?.meta_desc || ''} />
                <link rel="canonical" href={`/blog/${blog?.slug}`} />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" />
                <link rel="stylesheet" type="text/css" href="/web/css/common.css?ver=1.0.7" />
                <link rel="stylesheet" type="text/css" href="/web/css/blog-details.css?ver=1.0.7" />
                <link rel="stylesheet" type="text/css" href="/web/css/responsive.css?ver=1.0.5" />
            </Head>

            <section>
                <div className="mainbanner">
                    <div className="container">
                        <div className="widthmedium">
                            <h1 className="hometitle">{blog?.title}</h1>
                            {excerpt ? <p>{excerpt}</p> : null}
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="sub-banner">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="sub-ban-inner">
                                    {blog?.image ? <img src={`/uploads/blog/${blog.image}`} alt={blog.title} loading="lazy" /> : null}
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="fom-right">
                                    <div className="header-bx">Contact For Booth Design &amp; Fabrication Services</div>
                                    <h2>Event Details</h2>
                                    <div className="col-lg-12 col-md-12"><div className="input-outer"><input type="text" placeholder="Event Name" /></div></div>
                                    <div className="col-lg-12 col-md-12"><div className="input-outer"><input type="text" placeholder="Event City" /></div></div>
                                    <h2>Booth Details</h2>
                                    <div className="col-lg-12 d-flex">
                                        <div className="input-outer"><input type="text" placeholder="Stand Size" /></div>
                                        <select defaultValue="SQMT">
                                            <option value="SQMT">SQMT</option>
                                            <option value="SQFT">SQFT</option>
                                        </select>
                                    </div>
                                    <div className="col-lg-12 col-md-12">
                                        <div className="custom-drop-file">
                                            <input type="file" />
                                            <p><span>Choose File</span> File Upload (If any)</p>
                                        </div>
                                    </div>
                                    <div className="co-lg-12 col-md-12"><textarea rows="3" placeholder="Additional Message about your Booth" /></div>
                                    <h2>Contact Details</h2>
                                    <div className="col-lg-12 col-md-12"><div className="input-outer"><input type="text" placeholder="Full Name *" /></div></div>
                                    <div className="col-lg-12 col-md-12"><div className="input-outer"><input type="email" placeholder="Email id*" /></div></div>
                                    <div className="col-lg-12 col-md-12"><div className="input-outer"><input type="tel" placeholder="+91 81234 56789" /></div></div>
                                    <div className="col-lg-12 col-md-12"><div className="input-outer"><input type="text" placeholder="Website*" /></div></div>
                                    <div className="co-lg-12 col-md-12">
                                        <div className="check-box-main">
                                            <span className="check"><input type="checkbox" /></span>
                                            <p>I agree to the Expostandzone&apos; <a href="/privacy-policy">Privacy Policy</a> *</p>
                                        </div>
                                    </div>
                                    <div className="co-lg-12 col-md-12"><input type="submit" value="Send Request" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="blog-gray-sec">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="gray-left">
                                    <div className="top-title">Blog &gt; {blog?.title}</div>
                                    <div className="content-sec" dangerouslySetInnerHTML={{ __html: blog?.description || '' }} />
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="white-right-sec">
                                    <div className="latest-posts">
                                        <h3>Latest Posts</h3>
                                        <ul>
                                            {related.map((r) => (
                                                <li key={r.slug}>
                                                    <Link href={`/blog/${r.slug}`}>
                                                        {r.image ? (
                                                            <div className="listing_sec">
                                                                <div className="logo-content-main">
                                                                    <div className="figure">
                                                                        <img src={`/uploads/blog/${r.image}`} alt={r.title} loading="lazy" />
                                                                    </div>
                                                                    <div className="content">
                                                                        <h4>{r.title}</h4>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <p>{r.title}</p>
                                                        )}
                                                        {r.created_date ? <span className="date">{r.created_date}</span> : null}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

