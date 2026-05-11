import{j as e,H as c,L as a}from"./app-BESNPqnH.js";import{P as d}from"./PublicLayout-r1YPtawE.js";function o({blog:s,related:t=[]}){const i=String(s?.description||"").replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim().slice(0,150);return e.jsxs(d,{children:[e.jsxs(c,{children:[e.jsx("title",{children:s?.meta_title||s?.title}),e.jsx("meta",{name:"description",content:s?.meta_desc||""}),e.jsx("link",{rel:"canonical",href:`/blog/${s?.slug}`}),e.jsx("link",{rel:"stylesheet",href:"https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css"}),e.jsx("link",{rel:"stylesheet",type:"text/css",href:"/web/css/common.css?ver=1.0.7"}),e.jsx("link",{rel:"stylesheet",type:"text/css",href:"/web/css/blog-details.css?ver=1.0.7"}),e.jsx("link",{rel:"stylesheet",type:"text/css",href:"/web/css/responsive.css?ver=1.0.5"})]}),e.jsx("style",{children:`
                .blog-detail-top-row {
                    align-items: flex-start;
                    position: relative;
                }
                .blog-detail-top-row .sub-ban-inner {
                    width: 100%;
                }
                .blog-detail-top-row .sub-ban-inner img {
                    width: 100%;
                    display: block;
                }
                .blog-detail-form.fom-right {
                    margin-top: 0 !important;
                    position: relative;
                    top: auto;
                }
                @media (min-width: 992px) {
                    .blog-detail-top-row > .col-lg-8 {
                        flex: 0 0 66.666667%;
                        max-width: 66.666667%;
                    }
                    .blog-detail-top-row > .col-lg-4 {
                        position: absolute;
                        top: 0;
                        right: 0;
                        flex: 0 0 33.333333%;
                        max-width: 33.333333%;
                    }
                    .blog-gray-sec { margin-top: 0; }
                }
                @media (max-width: 991.98px) {
                    .blog-detail-top-row > .col-lg-4 {
                        position: static;
                    }
                    .blog-gray-sec {
                        margin-top: 0;
                    }
                }
            `}),e.jsx("section",{children:e.jsx("div",{className:"mainbanner",children:e.jsx("div",{className:"container",children:e.jsxs("div",{className:"widthmedium",children:[e.jsx("h1",{className:"hometitle",children:s?.title}),i?e.jsx("p",{children:i}):null]})})})}),e.jsx("section",{children:e.jsx("div",{className:"sub-banner",children:e.jsx("div",{className:"container",children:e.jsxs("div",{className:"row blog-detail-top-row",children:[e.jsx("div",{className:"col-lg-8",children:e.jsx("div",{className:"sub-ban-inner",children:s?.image?e.jsx("img",{src:`/uploads/blog/${s.image}`,alt:s.title,loading:"lazy"}):null})}),e.jsx("div",{className:"col-lg-4",children:e.jsxs("div",{className:"fom-right blog-detail-form",children:[e.jsx("div",{className:"header-bx",children:"Contact For Booth Design & Fabrication Services"}),e.jsx("h2",{children:"Event Details"}),e.jsx("div",{className:"col-lg-12 col-md-12",children:e.jsx("div",{className:"input-outer",children:e.jsx("input",{type:"text",placeholder:"Event Name"})})}),e.jsx("div",{className:"col-lg-12 col-md-12",children:e.jsx("div",{className:"input-outer",children:e.jsx("input",{type:"text",placeholder:"Event City"})})}),e.jsx("h2",{children:"Booth Details"}),e.jsxs("div",{className:"col-lg-12 d-flex",children:[e.jsx("div",{className:"input-outer",children:e.jsx("input",{type:"text",placeholder:"Stand Size"})}),e.jsxs("select",{defaultValue:"SQMT",children:[e.jsx("option",{value:"SQMT",children:"SQMT"}),e.jsx("option",{value:"SQFT",children:"SQFT"})]})]}),e.jsx("div",{className:"col-lg-12 col-md-12",children:e.jsxs("div",{className:"custom-drop-file",children:[e.jsx("input",{type:"file"}),e.jsxs("p",{children:[e.jsx("span",{children:"Choose File"})," File Upload (If any)"]})]})}),e.jsx("div",{className:"co-lg-12 col-md-12",children:e.jsx("textarea",{rows:"3",placeholder:"Additional Message about your Booth"})}),e.jsx("h2",{children:"Contact Details"}),e.jsx("div",{className:"col-lg-12 col-md-12",children:e.jsx("div",{className:"input-outer",children:e.jsx("input",{type:"text",placeholder:"Full Name *"})})}),e.jsx("div",{className:"col-lg-12 col-md-12",children:e.jsx("div",{className:"input-outer",children:e.jsx("input",{type:"email",placeholder:"Email id*"})})}),e.jsx("div",{className:"col-lg-12 col-md-12",children:e.jsx("div",{className:"input-outer",children:e.jsx("input",{type:"tel",placeholder:"+91 81234 56789"})})}),e.jsx("div",{className:"col-lg-12 col-md-12",children:e.jsx("div",{className:"input-outer",children:e.jsx("input",{type:"text",placeholder:"Website*"})})}),e.jsx("div",{className:"co-lg-12 col-md-12",children:e.jsxs("div",{className:"check-box-main",children:[e.jsx("span",{className:"check",children:e.jsx("input",{type:"checkbox"})}),e.jsxs("p",{children:["I agree to the Expostandzone' ",e.jsx("a",{href:"/privacy-policy",children:"Privacy Policy"})," *"]})]})}),e.jsx("div",{className:"co-lg-12 col-md-12",children:e.jsx("input",{type:"submit",value:"Send Request"})})]})})]})})})}),e.jsx("section",{children:e.jsx("div",{className:"blog-gray-sec",children:e.jsx("div",{className:"container",children:e.jsxs("div",{className:"row",children:[e.jsx("div",{className:"col-lg-8",children:e.jsxs("div",{className:"gray-left",children:[e.jsxs("div",{className:"top-title",children:["Blog > ",s?.title]}),e.jsx("div",{className:"content-sec",dangerouslySetInnerHTML:{__html:s?.description||""}})]})}),e.jsx("div",{className:"col-lg-4",children:e.jsx("div",{className:"white-right-sec",children:e.jsxs("div",{className:"latest-posts",children:[e.jsx("h3",{children:"Latest Posts"}),e.jsx("ul",{children:t.map(l=>e.jsx("li",{children:e.jsx(a,{href:`/blog/${l.slug}`,children:l.image?e.jsx("div",{className:"listing_sec",children:e.jsxs("div",{className:"logo-content-main",children:[e.jsx("div",{className:"figure",children:e.jsx("img",{src:`/uploads/blog/${l.image}`,alt:l.title,loading:"lazy"})}),e.jsx("div",{className:"content",children:e.jsx("h4",{children:l.title})})]})}):e.jsx("p",{children:l.title})})},l.slug))})]})})})]})})})})]})}export{o as default};
