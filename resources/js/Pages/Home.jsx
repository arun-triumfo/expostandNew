import PublicLayout from '@/Layouts/PublicLayout';
import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import Select from 'react-select';

const selectStyles = {
    control: (base) => ({
        ...base,
        border: '1px solid #E9ECEF',
        background: '#f3f3f3',
        minHeight: 54,
        borderRadius: '40px 0 0 40px',
        boxShadow: 'none',
        paddingLeft: 6,
        '&:hover': { borderColor: '#E9ECEF' },
    }),
    singleValue: (base) => ({
        ...base,
        color: '#757585',
        lineHeight: '46px',
    }),
    placeholder: (base) => ({ ...base, color: '#757585' }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    menu: (base) => ({ ...base, zIndex: 9999, borderRadius: 12, overflow: 'hidden', marginTop: 8 }),
    menuList: (base) => ({ ...base, maxHeight: 320, paddingTop: 6, paddingBottom: 6 }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? '#A7262F' : 'white',
        color: state.isFocused ? 'white' : '#333',
        fontSize: '16px',
        padding: '10px 16px',
    }),
};

export default function Home({ countrydata = [], citydata = [], appUrl }) {
    const baseUrl = appUrl || '';

    const [countryLimit, setCountryLimit] = useState(24);
    const [cityValue, setCityValue] = useState('');

    const cityOptions = useMemo(
        () =>
            citydata.map((row) => ({
                value: `${row.id}|${row.countryid}`,
                label: row.name,
            })),
        [citydata],
    );

    const orgJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Expo Stand Zone',
        url: `${baseUrl}/`,
        image: `${baseUrl}/web/images/homebanner.webp`,
        logo: `${baseUrl}/web/images/logo.png`,
        telephone: '+1 716 941 7998',
        address: {
            '@type': 'PostalAddress',
            StreetAddress: 'Orinda St',
            AddressRegion: 'Mountain View California',
            PostalCode: '90001',
            AddressCountry: 'US',
        },
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+1 716 941 7998',
            contactType: 'Customer Service',
            contactOption: 'Toll-Free',
            areaServed: 'US',
            availableLanguage: 'en',
        },
        sameAs: [
            'https://www.facebook.com/expostandzone',
            'https://twitter.com/expostandzone',
            'https://www.instagram.com/Expostandzone/',
            'https://www.linkedin.com/company/expostand-zone',
            'https://pinterest.com/expostandzone',
        ],
    };

    return (
        <PublicLayout>
            <Head>
                <title>Find Top Exhibition Stand Builders for Trade Shows Worldwide</title>
                <meta
                    name="description"
                    content="Choose from over 2,100 verified exhibition stand design and build companies serving trade shows and events worldwide. Get 5 Unique Quotations."
                />
                <link rel="canonical" href={`${baseUrl}/`} />
                <link rel="icon" type="image/png" href="https://www.expostandzone.com/web/images/favicon.png" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@100..900&display=swap"
                    rel="stylesheet"
                />
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css"
                />
                <link rel="stylesheet" type="text/css" href="/web/css/home.css?ver=1.0.7" />
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
                />
                <meta
                    property="og:title"
                    content="Exhibition Stand Builders & Contractor | Exhibition Stand Design Companies"
                />
                <meta
                    property="og:description"
                    content="ExpoStandZone is a leading global online portal for exhibitors, suppliers & organisers.  Get connected to potential suppliers & exhibiters in different cities across the world"
                />
                <meta property="og:url" content="https://www.expostandzone.com" />
                <meta property="og:site_name" content="Expostandzone" />
                <meta property="og:image" content="https://www.expostandzone.com/web/images/homebanner.webp" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:site" content="https://www.expostandzone.com" />
                <meta
                    name="twitter:title"
                    content="Exhibition Stand Builders & Contractor Portal | Exhibition Stand Design Companies"
                />
                <meta
                    name="twitter:description"
                    content="ExpoStandZone is a leading global online portal for exhibitors, suppliers & organisers.  Get connected to potential suppliers & exhibiters in different cities across the world."
                />
                <meta name="twitter:image" content="https://www.expostandzone.com/web/images/homebanner.webp" />
                <script type="application/ld+json">{JSON.stringify(orgJsonLd)}</script>
            </Head>

            <section>
                <div className="mainbanner">
                    <div className="container">
                        <div className="widthmedium">
                            <h1 className="hometitle">
                                ARE YOU LOOKING FOR <br />
                                EXHIBITION STAND BUILDER?
                            </h1>
                            <p>
                                Get 5 proposals from proven and verified suppliers, analyze them, and select the best
                                deal for your exhibition stand.
                            </p>
                            <div className="searchbg">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        router.post('/searchcity', { cityvalue: cityValue });
                                    }}
                                >
                                    <Select
                                        inputId="eventcity"
                                        options={cityOptions}
                                        placeholder="In which city do you need the stand?"
                                        isClearable
                                        isSearchable
                                        classNamePrefix="expo-city"
                                        className="home-city-select"
                                        styles={selectStyles}
                                        onChange={(opt) => setCityValue(opt ? opt.value : '')}
                                        menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                                        menuPosition="fixed"
                                    />
                                    <input type="submit" name="submit" value="SEARCH" />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="howwework">
                    <div className="container">
                        <div className="widthmedium text-center">
                            <h2 className="maintitle">HOW WE WORK</h2>
                            <div className="shrtdesc">
                                <p>
                                    Expo Stand Zone simplifies the exhibition stand design and build process in just
                                    three easy steps. Check it out below!
                                </p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4 col-md-6 col-12">
                                <div className="cardwrapper">
                                    <div className="numbers">1</div>
                                    <div className="icon">
                                        <img
                                            src="/web/images/requirement-home1.webp"
                                            width="55"
                                            height="55"
                                            alt=""
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="title">
                                        TELL US YOUR BOOTH
                                        <br /> REQUIREMENTS
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-12">
                                <div className="cardwrapper">
                                    <div className="numbers">2</div>
                                    <div className="icon">
                                        <img
                                            src="/web/images/agreement-home2.webp"
                                            width="55"
                                            height="55"
                                            alt=""
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="title">
                                        GET UP TO FIVE QUOTES <br /> FROM SUPPLIERS
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-12">
                                <div className="cardwrapper">
                                    <div className="numbers">3</div>
                                    <div className="icon">
                                        <img
                                            src="/web/images/compare-home2.webp"
                                            width="55"
                                            height="55"
                                            alt=""
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="title">
                                        COMPARE & SELECT <br /> BEST PROPOSALS
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="sectiontop">
                    <div className="container">
                        <div className="widthmedium text-center">
                            <h2 className="maintitle">EXHIBITION STANDS WORLDWIDE</h2>
                            <div className="shrtdesc">
                                <p>
                                    At Expo Stand Zone, we simplify your trade show experience by bringing together best
                                    industry-leading exhibition stand contractors, exhibition stand builders, trade show
                                    booth builders, custom exhibition stand builders and contractors—along with trusted
                                    catering services, hostess agencies, AV providers, and more—all under one roof.
                                </p>
                                <p>
                                    As a global exhibition stand design company, we have a list of trusted service
                                    providers from across the globe, known for delivering outstanding quality and
                                    reliability.
                                </p>
                                <p>
                                    We vetted carefully every partner while on boarding on our platform, which ensures
                                    brands elevation effortlessly and saving valuable time as well as resources. So, not
                                    to wait more and consult with our experts, they will help in sharing best quotes
                                    which is absolutely free. Unlock a world of hassle-free exhibition planning with
                                    Expo stand zone.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="countrylistbg">
                    <div className="container">
                        <div className="widthmedium text-center">
                            <h2 className="maintitle">IN WHICH COUNTRY DO YOU NEED THE STAND?</h2>
                            <div className="shrtdesc">
                                <p>We connect you with top exhibition stand builders across 65+ countries.</p>
                            </div>
                        </div>
                        <div className="row">
                            {countrydata.slice(0, countryLimit).map((row) => (
                                <div key={row.value} className="col-lg-2 col-md-3 col-6 loading-divtwo" style={{ display: 'block' }}>
                                    <div className="countrylist">
                                        <a href={`/${row.value}`}>{row.name}</a>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {countrydata.length > 24 && (
                            <div className="viewmore load-two">
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setCountryLimit((n) => {
                                            const next = n + 24;
                                            return next >= countrydata.length ? countrydata.length : next;
                                        });
                                    }}
                                >
                                    {countryLimit >= countrydata.length ? 'No More Available' : 'VIEW MORE COUNTRIES'}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section>
                <div className="countwrapper">
                    <div className="container">
                        <div className="row">
                            {[
                                ['2100+', 'STAND BUILDERS'],
                                ['65+', 'COUNTRIES'],
                                ['400+', 'CITIES'],
                                ['8,000+', 'TRADE SHOWS'],
                                ['10,000+', 'HAPPY EXHIBITORS'],
                                ['500,000+', 'SQ. M. OF EXHIBITION SPACE COVERED'],
                                ['24/7', 'CUSTOMER SUPPORT'],
                                ['99%', 'CLIENT SATISFACTION RATE'],
                            ].map(([num, label]) => (
                                <div key={label} className="col-lg-3 col-md-6 col-6">
                                    <div className="column">
                                        <span className="wraphead">{num}</span>
                                        <p>{label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="seosection">
                    <div className="container">
                        <div className="displaycat">
                            <div className="row">
                                <div className="col-lg-5 col-sm-12">
                                    <div className="figure">
                                        <img src="/web/images/port19.webp" width="" height="" alt="" loading="lazy" />
                                        <div className="figabsolute">
                                            <div className="icon">
                                                <img
                                                    src="/web/images/exhibitoricon.webp"
                                                    width="300"
                                                    height="300"
                                                    alt=""
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="figtitle">FOR EXHIBITORS</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-7 col-sm-12">
                                    <div className="caption transformnow">
                                        <div className="shrtdesc">
                                            <p>
                                                Expo Stand Zone Pvt. Ltd. connects you with highly screened and verified
                                                stand builders to help you build your trade show booth cost-effectively.
                                                We allocate five local stand builders familiar with local rules and
                                                regulations, ensuring a seamless and compliant setup. They provide
                                                competitive quotations directly, allowing you to compare and choose the
                                                best fit for your budget and requirements. With Expo Stand Zone Pvt.
                                                Ltd., you can save time by accessing pre-verified builders, ensure
                                                compliance with exhibition guidelines, and receive multiple
                                                cost-effective proposals to make an informed decision.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="displaycat">
                            <div className="row">
                                <div className="col-lg-5 col-sm-12">
                                    <div className="figure">
                                        <img src="/web/images/port19.webp" width="" height="" alt="" loading="lazy" />
                                        <div className="figabsolute">
                                            <div className="icon">
                                                <img
                                                    src="/web/images/stanbldricon.webp"
                                                    width="300"
                                                    height="300"
                                                    alt=""
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="figtitle">FOR STAND BUILDERS</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-7 col-sm-12">
                                    <div className="caption transformnow">
                                        <div className="shrtdesc">
                                            <p>
                                                Registering on ExpoStandZone.com offers stand builders global exposure,
                                                direct access to qualified leads, and the chance to expand across
                                                industries and locations. Showcase your expertise with a professional
                                                profile, gain trust through verified credentials, and connect directly
                                                with exhibitors to negotiate projects. Whether local or international,
                                                our platform provides a cost-effective way to boost visibility, secure
                                                more projects, and build long-term client relationships. Don’t miss
                                                out—register today and elevate your stand-building business!
                                            </p>
                                        </div>
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
