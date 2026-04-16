import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';

export default function Show({ tradeshow }) {
    return (
        <PublicLayout>
            <Head>
                <title>{tradeshow?.meta_title || tradeshow?.name}</title>
                <meta name="description" content={tradeshow?.meta_desc || ''} />
                <link rel="canonical" href={`/trade-shows/${tradeshow?.slug}`} />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" />
                <link rel="stylesheet" type="text/css" href="/web/css/common.css?ver=1.0.7" />
                <link rel="stylesheet" type="text/css" href="/web/css/tradeshow.css?ver=1.0.7" />
            </Head>

            <section className="py-5">
                <div className="container">
                    <h1 className="h3 mb-3">{tradeshow?.name}</h1>
                    {tradeshow?.logo ? (
                        <img src={`/uploads/tradeshow/${tradeshow.logo}`} alt={tradeshow.logo_alt || tradeshow.name} className="img-fluid mb-4" />
                    ) : null}
                    <p className="text-muted">
                        {tradeshow?.cityname}, {tradeshow?.countryname} | {tradeshow?.start_date} - {tradeshow?.end_date}
                    </p>
                    <div dangerouslySetInnerHTML={{ __html: tradeshow?.details || '' }} />
                </div>
            </section>
        </PublicLayout>
    );
}

