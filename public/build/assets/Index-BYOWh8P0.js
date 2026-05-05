import{r as g,j as e,H as f,L as n,b}from"./app-D4Gq3OAH.js";import{P as u}from"./PublicLayout-CM3-X9pi.js";function v({tradeshows:i,filters:c}){const d=i?.data??[],s=i?.links??[],[o,l]=g.useState(c?.search??""),p="/web/images/tradeshowbanner.webp",x=a=>String(a||"").replace(/<[^>]*>/g,"").trim(),h=a=>{const t=x(a);return/previous|prev|laquo/i.test(t)?"Prev":/next|raquo/i.test(t)?"Next":t},m=a=>{const t=a.fair_start_date||a.start_date,r=a.fair_end_date||a.end_date;return t&&r?`${t} - ${r}`:t||r||"Dates to be announced"};return e.jsxs(u,{children:[e.jsxs(f,{children:[e.jsx("title",{children:"Trade Shows | Expo Stand Zone"}),e.jsx("meta",{name:"description",content:"Upcoming trade shows and exhibitions worldwide."}),e.jsx("link",{rel:"canonical",href:"/trade-shows"}),e.jsx("link",{rel:"stylesheet",href:"https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css"}),e.jsx("link",{rel:"stylesheet",type:"text/css",href:"/web/css/common.css?ver=1.0.7"}),e.jsx("link",{rel:"stylesheet",type:"text/css",href:"/web/css/tradeshow.css?ver=1.0.7"})]}),e.jsx("style",{children:`
                .trade-breadcrumb-strip {
                    background: #fff;
                    border-top: 1px solid #eceff4;
                    border-bottom: 1px solid #eceff4;
                    padding: 6px 0;
                }
                .trade-breadcrumb {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    font-size: 0.78rem;
                    color: #374151;
                    margin: 0;
                    line-height: 1.2;
                }
                .trade-breadcrumb a {
                    color: #374151;
                    text-decoration: none;
                }
                .trade-breadcrumb a:hover {
                    color: #b91c1c;
                }
                .trade-hero {
                    position: relative;
                    min-height: 280px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    text-align: center;
                    background: linear-gradient(120deg, rgba(11, 16, 28, 0.86), rgba(11, 16, 28, 0.74)),
                        url('${p}') center / cover no-repeat;
                }
                .trade-hero::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.28);
                }
                .trade-hero .container {
                    position: relative;
                    z-index: 1;
                }
                .trade-hero-content {
                    width: 100%;
                    max-width: 780px;
                    margin: 0 auto;
                    padding: 0 16px;
                }
                .trade-hero-title {
                    margin-bottom: 10px;
                    font-size: clamp(2.2rem, 5vw, 3.4rem);
                    letter-spacing: 0.04em;
                    font-weight: 800;
                    line-height: 1.1;
                    text-transform: uppercase;
                }
                .trade-hero-subtitle {
                    margin: 0;
                    color: rgba(255, 255, 255, 0.95);
                    font-size: 1.1rem;
                    font-weight: 500;
                }
                .trade-section {
                    padding: 60px 0 80px;
                    background: #f7f9fc;
                }
                .trade-content-wrap {
                    width: 100%;
                    max-width: 1360px;
                    margin-left: auto;
                    margin-right: auto;
                    padding-left: 34px;
                    padding-right: 34px;
                }
                .trade-search-panel {
                    background: #fff;
                    border-radius: 16px;
                    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
                    padding: 16px;
                    margin-bottom: 28px;
                }
                .trade-search-input {
                    height: 48px;
                    border-radius: 12px 0 0 12px;
                    border: 1px solid #dbe2eb;
                    padding: 0 14px;
                }
                .trade-search-btn {
                    border-radius: 0 12px 12px 0;
                    padding: 0 18px;
                    font-weight: 600;
                }
                .trade-card {
                    border: 0;
                    border-radius: 16px;
                    background: #fff;
                    box-shadow: 0 8px 28px rgba(15, 23, 42, 0.08);
                    transition: transform 0.35s ease, box-shadow 0.35s ease;
                    height: 100%;
                    padding: 14px;
                }
                .trade-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 16px 36px rgba(15, 23, 42, 0.14);
                }
                .trade-card-row {
                    display: flex;
                    align-items: center;
                    gap: 22px;
                }
                .trade-card-image-wrap {
                    width: 150px;
                    min-width: 150px;
                    height: 140px;
                    border-radius: 10px;
                    border: 1px solid #d7dce3;
                    background: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 10px;
                }
                .trade-card-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 8px;
                    background: #f1f5f9;
                }
                .trade-title {
                    margin-bottom: 7px;
                    font-size: 1.45rem;
                    line-height: 1.4;
                    font-weight: 700;
                    color: #0f172a;
                }
                .trade-meta {
                    color: #4b5563;
                    margin-bottom: 4px;
                    font-size: 1rem;
                }
                .trade-date {
                    color: #6b7280;
                    font-size: 0.95rem;
                    margin-bottom: 8px;
                }
                .trade-category {
                    color: #4b5563;
                    margin-bottom: 0;
                    font-size: 1rem;
                }
                .trade-content {
                    flex: 1;
                    min-width: 0;
                }
                .trade-action {
                    width: 170px;
                    min-width: 170px;
                    display: flex;
                    justify-content: flex-end;
                }
                .trade-detail-btn {
                    border-radius: 10px;
                    min-width: 124px;
                    height: 44px;
                    font-size: 0.9rem;
                    font-weight: 700;
                    letter-spacing: 0.02em;
                }
                .trade-empty {
                    border-radius: 14px;
                    border: 1px dashed #cbd5e1;
                    background: #fff;
                    padding: 50px 20px;
                    text-align: center;
                    color: #64748b;
                }
                .trade-pagination {
                    margin-top: 34px;
                    display: flex;
                    justify-content: center;
                    flex-wrap: wrap;
                    gap: 10px;
                }
                .trade-pagination-link {
                    min-width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    border: 1px solid #e2e8f0;
                    background: #fff;
                    color: #334155;
                    font-weight: 600;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    text-decoration: none !important;
                    padding: 0 12px;
                    transition: all 0.25s ease;
                }
                .trade-pagination-link:hover {
                    background: #f1f5f9;
                    border-color: #cbd5e1;
                    color: #0f172a;
                }
                .trade-pagination-link.active {
                    background: #dc2626;
                    border-color: #dc2626;
                    color: #fff;
                    box-shadow: 0 10px 22px rgba(220, 38, 38, 0.25);
                }
                @media (max-width: 991.98px) {
                    .trade-content-wrap {
                        padding-left: 22px;
                        padding-right: 22px;
                    }
                    .trade-card-row {
                        gap: 16px;
                    }
                    .trade-card-image-wrap {
                        width: 130px;
                        min-width: 130px;
                        height: 118px;
                    }
                    .trade-title {
                        font-size: 1.2rem;
                    }
                    .trade-action {
                        width: auto;
                        min-width: 140px;
                    }
                }
                @media (max-width: 575.98px) {
                    .trade-content-wrap {
                        padding-left: 14px;
                        padding-right: 14px;
                    }
                    .trade-breadcrumb {
                        font-size: 0.72rem;
                    }
                    .trade-hero-subtitle {
                        font-size: 0.95rem;
                    }
                    .trade-card {
                        padding: 12px;
                    }
                    .trade-card-row {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    .trade-card-image-wrap {
                        width: 100%;
                        min-width: 100%;
                        height: 180px;
                    }
                    .trade-card-image {
                        object-fit: contain;
                    }
                    .trade-action {
                        width: 100%;
                        min-width: 100%;
                        justify-content: flex-start;
                        margin-top: 6px;
                    }
                }
            `}),e.jsx("section",{className:"trade-breadcrumb-strip",children:e.jsx("div",{className:"container",children:e.jsx("nav",{"aria-label":"breadcrumb",children:e.jsxs("div",{className:"trade-breadcrumb",children:[e.jsx(n,{href:"/",children:"Home"}),e.jsx("span",{children:"/"}),e.jsx("span",{"aria-current":"page",children:"Trade Shows"}),i?.current_page?e.jsxs(e.Fragment,{children:[e.jsx("span",{children:"/"}),e.jsx("span",{children:"Page"}),e.jsx("span",{children:"/"}),e.jsx("span",{"aria-current":"page",children:i.current_page})]}):null]})})})}),e.jsx("section",{className:"trade-hero",children:e.jsx("div",{className:"container",children:e.jsxs("div",{className:"trade-hero-content",children:[e.jsx("h1",{className:"trade-hero-title",children:"Trade Shows"}),e.jsx("p",{className:"trade-hero-subtitle",children:"Discover upcoming exhibitions, fairs, and global events for your business growth."})]})})}),e.jsx("section",{className:"trade-section",children:e.jsxs("div",{className:"trade-content-wrap",children:[e.jsx("form",{className:"trade-search-panel",onSubmit:a=>{a.preventDefault(),b.get("/trade-shows",{search:o||void 0},{preserveState:!0,replace:!0})},children:e.jsxs("div",{className:"input-group",children:[e.jsx("input",{className:"form-control trade-search-input",value:o,onChange:a=>l(a.target.value),placeholder:"Search trade show name","aria-label":"Search trade show"}),e.jsx("div",{className:"input-group-append",children:e.jsx("button",{className:"btn btn-danger trade-search-btn",type:"submit",children:"Search"})})]})}),e.jsx("div",{className:"row",children:d.length===0?e.jsx("div",{className:"col-12",children:e.jsx("div",{className:"trade-empty",children:"No trade shows found for your search."})}):d.map(a=>e.jsx("article",{className:"col-12 mb-4",children:e.jsx("div",{className:"trade-card",children:e.jsxs("div",{className:"trade-card-row",children:[e.jsx("div",{className:"trade-card-image-wrap",children:a.fair_logo||a.logo?e.jsx("img",{src:`/uploads/tradeshow/${a.fair_logo||a.logo}`,alt:a.fair_name||a.name,className:"trade-card-image",loading:"lazy"}):e.jsx("div",{className:"trade-card-image d-flex align-items-center justify-content-center text-muted",children:"No image"})}),e.jsxs("div",{className:"trade-content",children:[e.jsx("p",{className:"trade-date",children:m(a)}),e.jsx("h2",{className:"trade-title",children:a.fair_name||a.name}),e.jsxs("p",{className:"trade-meta",children:[a.cityname||"City TBA",", ",a.countryname||"Country TBA"]}),e.jsx("p",{className:"trade-category",children:a.fair_category||a.category||"Business & Industry"})]}),e.jsx("div",{className:"trade-action",children:e.jsx(n,{href:`/trade-shows/${a.slug}`,className:"btn btn-danger trade-detail-btn",children:"VIEW DETAILS"})})]})})},a.id))}),s.length>3?e.jsx("nav",{"aria-label":"Trade show pagination",className:"trade-pagination",children:s.map((a,t)=>{const r=h(a.label);return a.url?e.jsx(n,{href:a.url,className:`trade-pagination-link ${a.active?"active":""}`,children:r},`${r}-${t}`):e.jsx("span",{className:"trade-pagination-link",style:{opacity:.45},children:r},`${r}-${t}`)})}):null]})})]})}export{v as default};
