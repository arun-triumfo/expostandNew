import{j as e,H as x,L as n}from"./app-BESNPqnH.js";import{P as h}from"./PublicLayout-r1YPtawE.js";function u({blogs:r}){const o=r?.data??[],l=r?.links??[],d="/web/images/homebanner.webp",s=t=>String(t||"").replace(/<[^>]*>/g,"").trim(),g=(t,a=60)=>{const i=s(t);return i.length<=a?i:`${i.slice(0,a).trim()}...`},p=t=>{const a=s(t);return/previous|prev|laquo/i.test(a)?"Prev":/next|raquo/i.test(a)?"Next":a},b=t=>t?.category_name||t?.category||"Insights",c=r?.title||"Our Blog";return e.jsxs(h,{children:[e.jsxs(x,{children:[e.jsx("title",{children:`${c} | Expo Stand Zone`}),e.jsx("meta",{name:"description",content:"Latest exhibition, trade show, and booth design insights."}),e.jsx("link",{rel:"canonical",href:"/blog"}),e.jsx("link",{rel:"stylesheet",href:"https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css"}),e.jsx("link",{rel:"stylesheet",type:"text/css",href:"/web/css/common.css?ver=1.0.7"}),e.jsx("link",{rel:"stylesheet",type:"text/css",href:"/web/css/blog.css?ver=1.0.7"})]}),e.jsx("style",{children:`
                .blog-hero {
                    position: relative;
                    min-height: 280px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    background: linear-gradient(120deg, rgba(11, 16, 28, 0.86), rgba(11, 16, 28, 0.74)),
                        url('${d}') center / cover no-repeat;
                    text-align: center;
                }
                .blog-hero::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.28);
                }
                .blog-hero .container {
                    position: relative;
                    z-index: 1;
                }
                .blog-breadcrumb-strip {
                    background: #fff;
                    border-top: 1px solid #eceff4;
                    border-bottom: 1px solid #eceff4;
                    padding: 6px 0;
                }
                .blog-breadcrumb {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    font-size: 0.78rem;
                    color: #374151;
                    margin: 0;
                    line-height: 1.2;
                }
                .blog-breadcrumb a {
                    color: #374151;
                    text-decoration: none;
                }
                .blog-breadcrumb a:hover {
                    color: #b91c1c;
                }
                .blog-section {
                    padding: 70px 0 80px;
                    background: #f7f9fc;
                }
                .blog-content-wrap {
                    width: 100%;
                    max-width: 1360px;
                    margin-left: auto;
                    margin-right: auto;
                    padding-left: 34px;
                    padding-right: 34px;
                }
                .blog-card {
                    border: 0;
                    border-radius: 16px;
                    overflow: hidden;
                    background: #fff;
                    box-shadow: 0 8px 28px rgba(15, 23, 42, 0.08);
                    transition: transform 0.35s ease, box-shadow 0.35s ease;
                    height: 100%;
                }
                .blog-card:hover {
                    transform: translateY(-8px) scale(1.01);
                    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.16);
                }
                .blog-card-image {
                    width: 100%;
                    height: 220px;
                    object-fit: cover;
                    background: #e5e7eb;
                }
                .blog-title-clamp {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    min-height: 52px;
                    font-size: 1.05rem;
                    line-height: 1.45;
                    font-weight: 700;
                    color: #0f172a;
                }
                .blog-excerpt {
                    min-height: 48px;
                    color: #64748b;
                    font-size: 0.95rem;
                    line-height: 1.5;
                }
                .blog-category {
                    display: inline-flex;
                    padding: 6px 12px;
                    border-radius: 999px;
                    background: #ffe7e7;
                    color: #b91c1c;
                    font-size: 0.75rem;
                    font-weight: 700;
                    letter-spacing: 0.02em;
                    text-transform: uppercase;
                }
                .blog-read-btn {
                    border-radius: 10px;
                    padding: 10px 18px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    box-shadow: 0 8px 20px rgba(220, 38, 38, 0.18);
                }
                .blog-pagination {
                    margin-top: 34px;
                    display: flex;
                    justify-content: center;
                    flex-wrap: wrap;
                    gap: 10px;
                }
                .blog-pagination-link {
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
                .blog-pagination-link:hover {
                    background: #f1f5f9;
                    border-color: #cbd5e1;
                    color: #0f172a;
                }
                .blog-pagination-link.active {
                    background: #dc2626;
                    border-color: #dc2626;
                    color: #fff;
                    box-shadow: 0 10px 22px rgba(220, 38, 38, 0.25);
                }
                .blog-empty {
                    border-radius: 14px;
                    border: 1px dashed #cbd5e1;
                    background: #fff;
                    padding: 50px 20px;
                    text-align: center;
                    color: #64748b;
                }
                .blog-hero-content {
                    position: relative;
                    z-index: 1;
                    width: 100%;
                    max-width: 780px;
                    margin: 0 auto;
                    padding: 0 16px;
                }
                .blog-hero-title {
                    margin-bottom: 10px;
                    font-size: clamp(2.2rem, 5vw, 3.4rem);
                    letter-spacing: 0.04em;
                    font-weight: 800;
                    line-height: 1.1;
                    text-transform: uppercase;
                }
                .blog-hero-subtitle {
                    margin: 0;
                    color: rgba(255, 255, 255, 0.95);
                    font-size: 1.1rem;
                    font-weight: 500;
                }
                @media (max-width: 991.98px) {
                    .blog-section {
                        padding: 52px 0 60px;
                    }
                    .blog-hero {
                        min-height: 280px;
                    }
                    .blog-content-wrap {
                        padding-left: 22px;
                        padding-right: 22px;
                    }
                }
                @media (max-width: 575.98px) {
                    .blog-card-image {
                        height: 200px;
                    }
                    .blog-breadcrumb {
                        font-size: 0.72rem;
                    }
                    .blog-content-wrap {
                        padding-left: 14px;
                        padding-right: 14px;
                    }
                    .blog-hero-title {
                        margin-bottom: 8px;
                    }
                    .blog-hero-subtitle {
                        font-size: 0.95rem;
                    }
                }
            `}),e.jsx("section",{className:"blog-breadcrumb-strip",children:e.jsx("div",{className:"container",children:e.jsx("nav",{"aria-label":"breadcrumb",children:e.jsxs("div",{className:"blog-breadcrumb",children:[e.jsx(n,{href:"/",children:"Home"}),e.jsx("span",{children:"/"}),e.jsx("span",{"aria-current":"page",children:"Blog"}),r?.current_page?e.jsxs(e.Fragment,{children:[e.jsx("span",{children:"/"}),e.jsx("span",{children:"Page"}),e.jsx("span",{children:"/"}),e.jsx("span",{"aria-current":"page",children:r.current_page})]}):null]})})})}),e.jsx("section",{className:"blog-hero",children:e.jsx("div",{className:"container",children:e.jsxs("div",{className:"blog-hero-content",children:[e.jsx("h1",{className:"blog-hero-title",children:c}),e.jsx("p",{className:"blog-hero-subtitle",children:"A Global Online Portal For Exhibitor, Supplier & Organizer."})]})})}),e.jsx("section",{className:"blog-section",children:e.jsxs("div",{className:"blog-content-wrap",children:[e.jsx("div",{className:"row",children:o.length===0?e.jsx("div",{className:"col-12",children:e.jsx("div",{className:"blog-empty",children:"No blog posts available right now. Please check back soon."})}):o.map(t=>e.jsx("article",{className:"col-xl-4 col-lg-4 col-md-6 col-12 mb-4",children:e.jsxs("div",{className:"blog-card",children:[t.image?e.jsx("img",{src:`/uploads/blog/${t.image}`,alt:t.title,className:"blog-card-image",loading:"lazy"}):e.jsx("div",{className:"blog-card-image d-flex align-items-center justify-content-center text-muted",children:"No image"}),e.jsxs("div",{className:"card-body p-4 d-flex flex-column",children:[e.jsx("span",{className:"blog-category mb-3",children:b(t)}),e.jsx("h2",{className:"blog-title-clamp mb-2",children:t.title}),e.jsx("p",{className:"blog-excerpt mb-4",children:g(t.description)}),e.jsx("div",{className:"mt-auto",children:e.jsx(n,{href:`/blog/${t.slug}`,className:"btn btn-danger blog-read-btn",children:"Read More"})})]})]})},t.id))}),l.length>3?e.jsx("nav",{"aria-label":"Blog pagination",className:"blog-pagination",children:l.map((t,a)=>{const i=p(t.label);return t.url?e.jsx(n,{href:t.url,className:`blog-pagination-link ${t.active?"active":""}`,children:i},`${i}-${a}`):e.jsx("span",{className:"blog-pagination-link",style:{opacity:.45},children:i},`${i}-${a}`)})}):null]})})]})}export{u as default};
