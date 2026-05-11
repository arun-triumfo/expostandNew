import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';

const faqs = [
    {
        q: 'How should I select a stand supplier?',
        a: 'Place your requirement on our portal. We shortlist suitable vendors and share proposals so you can compare and choose.',
    },
    {
        q: 'Will Expostandzone provide local suppliers?',
        a: 'Yes. We prioritize trusted local suppliers. If needed, we also suggest outstation vendors with strong local delivery capability.',
    },
    {
        q: 'How should I get the best quotation for my stand?',
        a: 'Share your brief with stand size, goals, and budget. You will receive multiple competitive proposals to evaluate.',
    },
    {
        q: 'Do I have any obligations?',
        a: 'No mandatory obligation. You can review and compare quotations before making your decision.',
    },
    {
        q: 'How is the stand cost calculated?',
        a: 'Cost depends on booth size, open sides, structure, graphics, lighting, materials, and service scope.',
    },
];

export default function Faq() {
    return (
        <PublicLayout>
            <Head>
                <title>FAQ - Expostandzone</title>
                <meta name="description" content="Discover answers to commonly asked questions on a wide range of topics with our comprehensive FAQ section." />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" />
                <link rel="stylesheet" type="text/css" href="/web/css/common.css?ver=1.0.7" />
                <link rel="stylesheet" type="text/css" href="/web/css/faq.css?ver=1.0.5" />
                <link rel="stylesheet" type="text/css" href="/web/css/responsive.css?ver=1.0.5" />
            </Head>
            <section>
                <div className="mainbanner"><div className="container"><div className="widthmedium"><h1 className="hometitle">FAQ</h1></div></div></div>
            </section>
            <section>
                <div className="find-pan-sec">
                    <div className="container">
                        <div className="accordion">
                            {faqs.map((item, idx) => (
                                <details className="accordion-item" key={item.q} open={idx === 0}>
                                    <summary className="accordion-item-header">{item.q}</summary>
                                    <div className="accordion-item-body">
                                        <div className="accordion-item-body-content"><p>{item.a}</p></div>
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
