export const CALENDLY_URL = "https://calendly.com/cracktab2025/30min";

/** `external: true` renders a plain anchor that opens in a new tab. */
export type NavLink = { label: string; href: string; external?: boolean };

export const SHOPIFY_APPS_URL = "https://aigrowthkits.app/";

// Primary menu group. Shopify Apps points at our own app site, which lives on
// its own domain, so it opens in a new tab rather than routing in-app.
export const primaryNav: NavLink[] = [
  { label: "Our Works", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Shopify Themes", href: "/themes" },
  { label: "Shopify Apps", href: SHOPIFY_APPS_URL, external: true },
  { label: "Blog", href: "/blog" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// Secondary, lighter group
export const secondaryNav: NavLink[] = [
  { label: "FAQ", href: "/faq" },
  { label: "Imprint", href: "/imprint" },
  { label: "Privacy Policy", href: "/privacy" },
];

// ------------------------------------------------------------------
//  Section 2 — Services
// ------------------------------------------------------------------
export type Service = {
  title: string;
  description: string;
  href: string;
  tag?: string;
  featured?: boolean;
};

// Homepage "glimpse" — a curated subset; the full list lives on /services.
export const services: Service[] = [
  {
    title: "Shopify Development",
    description:
      "Custom Shopify and Shopify Plus stores, built from scratch and tuned for speed. We handle everything from theme development and migrations to third-party integrations, so your store is fast, scalable, and easy to manage as you grow.",
    href: "/services/shopify-development",
    tag: "Shopify Plus Partner",
  },
  {
    title: "Shopify App Development",
    description:
      "Custom Shopify apps built to solve problems the App Store can't. Whether it's automating a manual workflow, connecting Shopify to your internal systems, or building a feature unique to your business, we design and develop apps that fit into your store without slowing it down.",
    href: "/services/shopify-app-development",
  },
  {
    title: "UI/UX Design",
    description:
      "Store design that's built to convert, not just look good. We map out user flows, wireframe key pages, and design interfaces that reduce friction at checkout — so visitors have a clear path from landing page to purchase.",
    href: "/services/ui-ux-design",
  },
  {
    title: "Ecommerce SEO",
    description:
      "Technical and on-page SEO built specifically for Shopify stores. From site structure and page speed to product page optimization and content strategy, we help your store rank for the searches that actually drive buyers, not just traffic.",
    href: "/services/ecommerce-seo",
  },
  {
    title: "Ecommerce Growth & CRO",
    description:
      "Data-driven conversion rate optimization to turn more visitors into customers. We run A/B tests, analyze funnel drop-off, and refine everything from product pages to checkout flow — so growth comes from your existing traffic, not just ad spend.",
    href: "/services/ecommerce-growth-cro",
  },
  {
    title: "Custom Business Websites",
    description:
      "Professional websites tailored to your goals — from corporate sites to landing pages and web apps. Built with clean code and a design that reflects your brand, these are made to load fast, scale easily, and support whatever comes next.",
    href: "/services/custom-business-websites",
    featured: true,
  },
];

// ------------------------------------------------------------------
//  Section 3 — Proud clients
// ------------------------------------------------------------------
export const clients: string[] = [
  "SeeTrue",
  "Collection Akhavan",
  "Die Schrothkur",
  "Notary Scheiber",
  "SEZ Group",
  "Orbes",
  "The Conscious Bar",
  "ForChics",
  "Glossier",
];

// ------------------------------------------------------------------
//  Section 4 — Stats
// ------------------------------------------------------------------
export const stats: { value: string; label: string }[] = [
  { value: "173+", label: "Stores Built" },
  { value: "8+", label: "Running Projects" },
  { value: "35+", label: "Returning Clients" },
  { value: "5", label: "Available Countries" },
];

// ------------------------------------------------------------------
//  Footer
// ------------------------------------------------------------------
export const footerColumns: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Work",
    links: [
      { label: "Our Works", href: "/work" },
      { label: "Services", href: "/services" },
      { label: "Shopify Themes", href: "/themes" },
      { label: "Shopify Apps", href: SHOPIFY_APPS_URL, external: true },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Blog", href: "/blog" },
    ],
  },
];

const PHONE = "+1 (234) 901-2506";
const PHONE_HREF = "tel:+12349012506";

/** `phone` is set on the office the number actually reaches. */
export type Office = {
  label: string;
  address: string;
  phone?: string;
  phoneHref?: string;
};

const offices: Office[] = [
  {
    label: "Bangladesh office",
    address: "24/A, Road 1, Mirpur DOHS, Dhaka - 1216",
  },
  {
    label: "US office",
    address: "6545 Market Ave N, Ste 100 Canton, OH 44721",
    phone: PHONE,
    phoneHref: PHONE_HREF,
  },
];

export const contact = { phone: PHONE, phoneHref: PHONE_HREF, offices };

export const EMAIL = "hello@cracktab.com";

// Pexels placeholder image helper (swap for real assets later).
export const pexels = (id: number, w = 900, h = 1100) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&dpr=1`;

// ------------------------------------------------------------------
//  Services — detailed content (7 service pages)
// ------------------------------------------------------------------
export type ServiceDetail = {
  slug: string;
  name: string;
  heading: string;
  intro: string;
  whoFor: string;
  whyMatters: string;
  process: string[];
  bullets: string[];
  examples: string[]; // case-study slugs featured under "Example Work"
};

export const serviceDetails: ServiceDetail[] = [
  {
    slug: "shopify-development",
    name: "Shopify Development",
    heading: "Shopify Development Services",
    intro:
      "Need a Shopify store that actually sells? Our Shopify development services cover everything from ground-up Shopify store development to complex Shopify Plus development and Shopify ecommerce development. No templates, no shortcuts — just a store built to convert.",
    whoFor:
      "Brands launching a new Shopify store, or outgrowing a DIY theme and ready for something built around their actual catalog and traffic.",
    whyMatters:
      "A slow or generic store costs you sales before a visitor even sees your products. We build every store from scratch, custom coded around your brand and your customer's path to purchase, then tuned for speed on every device. Because we handle development end to end, you get one team accountable for the result instead of piecing together freelancers.",
    process: [
      "Discovery and technical scoping",
      "Custom design and build",
      "Testing and performance tuning before launch",
    ],
    bullets: [
      "Custom theme development",
      "Shopify Plus implementation",
      "Performance optimization",
      "Mobile-first responsive design",
      "Third-party integrations",
      "Payment gateway setup",
      "Inventory management",
      "Multi-currency support",
    ],
    examples: ["seetrue-glasses", "the-conscious-bar"],
  },
  {
    slug: "shopify-app-development",
    name: "Shopify App Development",
    heading: "Shopify App Development Services",
    intro:
      "Need functionality that off-the-shelf apps can't deliver? Our Shopify app development services and custom Shopify app development services cover Shopify application development, API integrations, and automation workflows — with solutions built around exactly how you operate.",
    whoFor:
      "Stores with a workflow or feature request that no existing app quite covers, often growing brands hitting the limits of off-the-shelf tools.",
    whyMatters:
      "Generic apps solve generic problems. When your workflow doesn't fit the Shopify App Store, a custom build closes that gap without forcing your business to change how it works. We test every app against your real store traffic before launch, so reliability isn't an afterthought.",
    process: [
      "Map the exact workflow",
      "Build and test against real store data",
      "Deploy with monitoring in place",
    ],
    bullets: [
      "Custom app development",
      "API integrations",
      "Webhook implementations",
      "Admin panel customization",
      "Third-party app setup",
      "Automation workflows",
      "Data synchronization",
      "Ongoing maintenance",
    ],
    examples: ["forchics", "sez-group"],
  },
  {
    slug: "shopify-store-migration",
    name: "Shopify Store Migration",
    heading: "Shopify Store Migration Services",
    intro:
      "Moving your store from another platform doesn't have to be stressful. We handle complete migrations to Shopify while preserving your products, customer data, SEO value, and store functionality — keeping downtime to a minimum.",
    whoFor:
      "Brands moving off WooCommerce, Magento, BigCommerce, Wix, or Squarespace — especially ones worried about losing SEO rankings or customer history in the switch.",
    whyMatters:
      "A rushed migration can quietly cost you years of SEO rankings and customer history. We map every product, redirect, and page before touching anything live, so nothing gets lost in the move and your search rankings carry over instead of resetting.",
    process: [
      "Full audit of the current site",
      "Mapped migration plan with redirects",
      "Staged move with post-launch testing",
    ],
    bullets: [
      "WooCommerce migration",
      "Magento migration",
      "BigCommerce migration",
      "Wix and Squarespace migration",
      "Product and customer migration",
      "SEO preservation",
      "Redirect implementation",
      "Post-migration testing",
    ],
    examples: ["collection-akhavan", "die-schrothkur"],
  },
  {
    slug: "custom-business-websites",
    name: "Custom Business Websites",
    heading: "Custom Business Websites",
    intro:
      "Some businesses need more than an online store. We design and build professional websites tailored to your business goals — from corporate websites to landing pages and service-based businesses.",
    whoFor:
      "Service businesses, agencies, and non-ecommerce brands that need a professional site built around leads and credibility rather than a shopping cart.",
    whyMatters:
      "Not every business runs on Shopify, and that's fine — the same principles that make a store convert also make a business website earn trust and generate leads. We build every site around what your visitors need to do next, whether that's booking a call, filling out a form, or learning who you are.",
    process: [
      "Discovery on your goals and audience",
      "Design and build",
      "Launch with performance and SEO checks",
    ],
    bullets: [
      "Custom website development",
      "CMS implementation",
      "Mobile-first design",
      "SEO-friendly structure",
      "Lead generation forms",
      "Performance optimization",
      "Integrations",
      "Ongoing support",
    ],
    examples: ["sez-group", "orbes"],
  },
  {
    slug: "web-application-development",
    name: "Web Application Development",
    heading: "Web Application Development",
    intro:
      "When your business needs custom software, we build scalable web applications that improve operations, automate workflows, and deliver better experiences for your customers and team.",
    whoFor:
      "Businesses whose process has outgrown spreadsheets and off-the-shelf tools, and need something custom to manage bookings, clients, or internal operations.",
    whyMatters:
      "Off-the-shelf software eventually hits a wall — either it does too little or forces your team to work around it. A custom web application is built around your actual process, so it saves time instead of adding another tool to manage.",
    process: [
      "Map your workflow end to end",
      "Design the system architecture",
      "Build and test in stages before rollout",
    ],
    bullets: [
      "Custom web applications",
      "Client portals",
      "Admin dashboards",
      "Booking systems",
      "CRM development",
      "API integrations",
      "Database architecture",
      "Ongoing maintenance",
    ],
    examples: ["sez-group"],
  },
  {
    slug: "shopify-store-redesign",
    name: "Shopify Store Redesign",
    heading: "Shopify Store Redesign Services",
    intro:
      "If your store feels outdated or isn't converting the way it should, a redesign can make all the difference. We modernize Shopify stores with better user experiences, stronger branding, and layouts built around conversion.",
    whoFor:
      "Stores with steady traffic but underwhelming conversion, or a brand that's outgrown its original design.",
    whyMatters:
      "Traffic without conversion usually points to a design problem, not a marketing one. We start by identifying exactly where visitors are dropping off, then rebuild around fixing that — not just giving the store a new look.",
    process: [
      "Audit the current store and funnel",
      "Redesign around the drop-off points",
      "Test before full rollout",
    ],
    bullets: [
      "Store redesign strategy",
      "User experience improvements",
      "Modern visual design",
      "Navigation optimization",
      "Mobile optimization",
      "Theme upgrades",
      "Conversion-focused layouts",
      "Performance improvements",
    ],
    examples: ["orbes", "die-schrothkur"],
  },
  {
    slug: "shopify-speed-optimization",
    name: "Shopify Speed Optimization",
    heading: "Shopify Speed Optimization Services",
    intro:
      "Every second counts. We optimize your Shopify store for faster load times, improved Core Web Vitals, and a smoother shopping experience that helps reduce bounce rates and increase conversions.",
    whoFor:
      "Stores with slow load times, high bounce rates, or a growing number of apps quietly weighing the site down.",
    whyMatters:
      "A one-second delay in load time is enough to lose a meaningful share of visitors before they see your products. We audit every app, script, and image dragging your store down, then fix what's actually slowing you down instead of guessing.",
    process: [
      "Full performance audit",
      "Fix the biggest bottlenecks first",
      "Retest and report on the improvement",
    ],
    bullets: [
      "Core Web Vitals optimization",
      "Code optimization",
      "Image optimization",
      "Script optimization",
      "App performance audit",
      "Lazy loading implementation",
      "Theme optimization",
      "Speed reporting",
    ],
    examples: ["seetrue-glasses"],
  },
  {
    slug: "shopify-conversion-audit",
    name: "Shopify Conversion Audit",
    heading: "Shopify Conversion Audit",
    intro:
      "Sometimes small changes create the biggest impact. We perform comprehensive audits of your Shopify store to uncover usability issues, friction points, and missed conversion opportunities before recommending a clear roadmap.",
    whoFor:
      "Stores getting traffic but not enough sales, and unsure exactly where visitors are dropping off.",
    whyMatters:
      "Most stores lose customers at a handful of predictable points, not everywhere at once. We look at your funnel, checkout, and mobile experience together, then hand you a prioritized list instead of a vague report full of generic advice.",
    process: [
      "Review funnel, checkout, and mobile experience",
      "Prioritize the fixes with the biggest impact",
      "Hand over a clear roadmap",
    ],
    bullets: [
      "UX audit",
      "Checkout analysis",
      "Funnel analysis",
      "Heatmap review",
      "Analytics review",
      "Mobile experience audit",
      "Prioritized recommendations",
      "Conversion roadmap",
    ],
    examples: ["forchics", "the-conscious-bar"],
  },
  {
    slug: "ui-ux-design",
    name: "UI/UX Design",
    heading: "UI/UX Design Services",
    intro:
      "Your Shopify store is only as strong as its design. As a UI/UX design services company, we combine user interface design and user experience design to craft intuitive, brand-aligned experiences that reduce drop-off and increase cart conversions.",
    whoFor:
      "Brands whose store looks dated, feels inconsistent, or simply wasn't designed around how customers actually shop.",
    whyMatters:
      "Good design isn't decoration — it's the difference between a visitor who buys and one who leaves confused. We start with how people actually shop your category, then build the visual system and layout around that behavior instead of a template.",
    process: [
      "Research how your customers shop",
      "Design wireframes and visuals",
      "Test key pages before final handoff",
    ],
    bullets: [
      "User experience research",
      "Conversion rate optimization",
      "Brand identity design",
      "Wireframing and prototyping",
      "A/B testing design",
      "Accessibility compliance",
      "Visual design systems",
      "Interactive animations",
    ],
    examples: ["seetrue-glasses", "collection-akhavan"],
  },
  {
    slug: "ecommerce-seo",
    name: "Ecommerce SEO",
    heading: "Ecommerce SEO Services",
    intro:
      "Generic SEO doesn't cut it for online stores. Our ecommerce SEO service builds around how people actually shop, covering SEO for ecommerce website growth, affordable ecommerce SEO, and Shopify ecommerce SEO specifically.",
    whoFor:
      "Stores that aren't showing up for the searches that actually lead to sales, or have never had a proper SEO strategy.",
    whyMatters:
      "Ranking for the wrong keywords brings visitors who were never going to buy. We research and target the searches that lead to purchases, then structure your site so Google can actually understand what each page sells.",
    process: [
      "Technical and keyword audit",
      "On-page and content fixes",
      "Ongoing tracking and monthly reporting",
    ],
    bullets: [
      "Technical SEO audit",
      "Keyword research and strategy",
      "On-page optimization",
      "Site speed optimization",
      "Schema markup",
      "Content optimization",
      "Local SEO setup",
      "Monthly reporting",
    ],
    examples: ["the-conscious-bar", "forchics"],
  },
  {
    slug: "ecommerce-growth-cro",
    name: "Ecommerce Growth & CRO",
    heading: "Ecommerce Growth and CRO",
    intro:
      "Once your store is live, growth becomes an ongoing process. Through continuous testing, customer insights, and data-driven optimization, we help Shopify stores increase conversion rates and get more value from every visitor.",
    whoFor:
      "Stores that are live and stable, but ready to treat growth as an ongoing process instead of a one-time launch.",
    whyMatters:
      "Most stores stop improving right after launch, which is exactly when the real gains are available. We treat every page as something to test rather than a finished product, so your store keeps getting better instead of staying static.",
    process: [
      "Audit current performance",
      "Build a testing roadmap",
      "Run and report on experiments monthly",
    ],
    bullets: [
      "Conversion audits",
      "Growth roadmap",
      "A/B and split testing",
      "Landing page optimization",
      "Customer journey optimization",
      "Cart abandonment optimization",
      "Revenue tracking",
      "Monthly performance reporting",
    ],
    examples: ["seetrue-glasses", "orbes"],
  },
  {
    slug: "digital-marketing",
    name: "Digital Marketing",
    heading: "Digital Marketing Services",
    intro:
      "Great websites deserve great marketing. We help businesses generate qualified traffic, increase brand visibility, and turn visitors into customers through strategic digital campaigns.",
    whoFor:
      "Brands with a store or site ready for traffic, but no consistent system for turning that traffic into customers.",
    whyMatters:
      "Traffic on its own doesn't pay the bills — the right traffic does. We build campaigns around the customers most likely to convert, then keep adjusting based on what the data actually shows instead of running the same ads for months unchanged.",
    process: [
      "Audience and channel research",
      "Campaign build and launch",
      "Ongoing optimization based on real performance data",
    ],
    bullets: [
      "Google Ads",
      "Meta Ads",
      "Email marketing",
      "Marketing automation",
      "Content strategy",
      "Analytics and reporting",
      "Audience targeting",
      "Campaign optimization",
    ],
    examples: ["forchics", "collection-akhavan"],
  },
  {
    slug: "ecommerce-management",
    name: "Ecommerce Management",
    heading: "Ecommerce Management Services",
    intro:
      "Running an ecommerce business is a full-time job. Our ecommerce management service covers day-to-day ecommerce website management, ongoing maintenance, and complete store management — so you can focus on growing the business.",
    whoFor:
      "Founders and small teams who don't have the bandwidth to manage a store's day-to-day technical and marketing work themselves.",
    whyMatters:
      "Most store owners didn't start their business to become full-time Shopify admins. We become an extension of your team, handling the technical, marketing, and optimization work that keeps a store running smoothly — so nothing falls through the cracks while you focus on product.",
    process: [
      "Onboarding and audit",
      "Assign a dedicated manager",
      "Ongoing updates and monthly reporting",
    ],
    bullets: [
      "Dedicated project manager",
      "Theme customization",
      "Email marketing with Klaviyo",
      "UI/UX support",
      "Customer acquisition tracking",
      "A/B testing",
      "Store updates",
      "Performance monitoring",
    ],
    examples: ["the-conscious-bar", "sez-group"],
  },
  {
    slug: "branding-visual-identity",
    name: "Branding & Visual Identity",
    heading: "Branding and Visual Identity",
    intro:
      "A memorable brand builds trust long before someone becomes a customer. We create visual identities that communicate professionalism, consistency, and personality across every digital and physical touchpoint.",
    whoFor:
      "New brands needing an identity from scratch, or established ones whose branding feels inconsistent across channels.",
    whyMatters:
      "Inconsistent branding quietly erodes trust, even when customers can't say exactly why a brand feels off. We build a system, not just a logo, so your brand looks and feels the same whether someone finds you on Instagram, in an email, or on your store.",
    process: [
      "Discovery on your brand and audience",
      "Design the identity system",
      "Deliver guidelines for consistent use",
    ],
    bullets: [
      "Logo design",
      "Brand identity systems",
      "Brand guidelines",
      "Typography and color systems",
      "Marketing collateral",
      "Social media branding",
      "Packaging design",
      "Brand refresh",
    ],
    examples: ["collection-akhavan", "orbes"],
  },
  {
    slug: "ai-business-automation",
    name: "AI & Business Automation",
    heading: "AI and Business Automation",
    intro:
      "Reduce manual work and streamline your operations with intelligent automation. We build AI-powered solutions and workflow automations that help businesses save time, improve efficiency, and scale faster.",
    whoFor:
      "Teams spending real hours a week on repetitive tasks that could run in the background instead.",
    whyMatters:
      "The busywork that eats up your team's day is usually the easiest thing to automate, once someone maps it out properly. We start by identifying where your team spends repetitive hours, then build automations and AI tools that quietly handle that work in the background.",
    process: [
      "Map the repetitive workflows",
      "Build and test the automation",
      "Monitor and refine after rollout",
    ],
    bullets: [
      "AI chatbots",
      "Workflow automation",
      "CRM automation",
      "Business process automation",
      "API integrations",
      "AI assistants",
      "Reporting dashboards",
      "Ongoing optimization",
    ],
    examples: ["sez-group", "orbes"],
  },
];

// Our proven process
export const processSteps: { no: string; title: string; description: string }[] =
  [
    {
      no: "01",
      title: "Discovery & Strategy",
      description:
        "We analyze your business goals, target audience, and competitive landscape to create a comprehensive strategy.",
    },
    {
      no: "02",
      title: "Design & Planning",
      description:
        "Our team creates detailed wireframes, mockups, and technical specifications for your approval.",
    },
    {
      no: "03",
      title: "Development & Testing",
      description:
        "We build using best practices, conduct thorough testing, and optimize for performance.",
    },
    {
      no: "04",
      title: "Launch & Support",
      description:
        "We handle the launch process and provide ongoing support to ensure continued success.",
    },
  ];

export const technologies: string[] = [
  "Shopify",
  "Shopify Plus",
  "Liquid",
  "React",
  "Node.js",
  "GraphQL",
  "REST APIs",
  "Klaviyo",
  "Mailchimp",
  "Google Analytics",
  "Facebook Pixel",
  "Stripe",
];

export type Faq = { q: string; a: string };

export const servicesFaq: Faq[] = [
  {
    q: "How long does it take to build a Shopify store?",
    a: "Typically 4–8 weeks depending on complexity. Simple stores can be completed in 2–3 weeks, while complex custom builds may take 10–12 weeks.",
  },
  {
    q: "Do you provide ongoing support after launch?",
    a: "Yes. We offer various support packages including monthly maintenance, updates, and technical support to keep your store running smoothly.",
  },
  {
    q: "Can you migrate my existing store to Shopify?",
    a: "Yes. We handle complete store migrations from platforms like WooCommerce, Magento, and BigCommerce with minimal downtime.",
  },
  {
    q: "What's included in your Shopify development service?",
    a: "Custom theme development, responsive design, payment setup, app integrations, SEO optimization, and training on store management.",
  },
];

export const generalFaq: Faq[] = [
  {
    q: "What services does Cracktab offer?",
    a: "Shopify store development, Shopify custom app development, UI/UX design, ecommerce SEO, ecommerce management, custom business websites, and ecommerce growth/CRO. See the Services page for full detail.",
  },
  {
    q: "Do you only work with Shopify stores?",
    a: "Shopify is our core specialty, but we also build custom business websites and web applications for brands that need more than a Shopify storefront.",
  },
  {
    q: "Do you work with clients outside the US?",
    a: "Yes. We have offices in the US and Bangladesh, and a growing client base across Europe.",
  },
  {
    q: "How do I get a quote?",
    a: "Fill out the contact form or book a free consultation call — whichever's easier for you.",
  },
  {
    q: "Do you offer ongoing support after launch?",
    a: "Yes, through our ecommerce management service and standalone maintenance packages.",
  },
];

// ------------------------------------------------------------------
//  Our Works
// ------------------------------------------------------------------
export type CaseStudy = {
  slug: string;
  name: string;
  teaser: string; // one-liner for the Work grid
  review: string;
  reviewer: string;
  liveUrl: string; // real URL, or "" if not available yet
  brief: string;
  whatWeBuilt: string;
  features: string[];
  focusResult: string;
  img: string;
  placeholder?: boolean;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "seetrue-glasses",
    name: "SeeTrue Glasses",
    teaser: "Refined, international-ready eyewear store.",
    review:
      "Working with the team changed how customers experience our eyewear online. The site feels premium, loads fast, and our numbers show it.",
    reviewer: "Founder, SeeTrue Glasses",
    liveUrl: "https://seetrueglasses.com",
    brief:
      "SeeTrue came to us with a Shopify store that didn't match the quality of their eyewear. Product pages felt generic, browsing by style or material was clunky, and international customers had no clear way to shop in their own currency.",
    whatWeBuilt:
      "A refined Shopify Plus store with polished product photography, filtering by style, material, and price, and a multi-region, multi-currency setup for their growing international base. Checkout was shortened to match the premium, frictionless feel the brand needed.",
    features: [
      "Style, material, and price filtering",
      "Multi-region, multi-currency checkout",
      "Mobile-first responsive layout",
      "Shortened, frictionless checkout flow",
      "Trust badges and secure checkout messaging",
    ],
    focusResult:
      "We prioritized speed and clarity over decoration — a fast, easy-to-browse store still had to feel as elegant as the frames themselves. The results are reflected in the conversion, revenue, and page-speed numbers shown on this page.",
    img: "/works/seetrue.webp",
  },
  {
    slug: "the-conscious-bar",
    name: "The Conscious Bar",
    teaser: "Clean-beauty Shopify Plus store built for eco-conscious shoppers.",
    review:
      "They understood our brand from the first call. The store looks exactly how we imagined it — clean, honest, and built for people who care about what they buy.",
    reviewer: "Founder, The Conscious Bar",
    liveUrl: "https://theconsciousbar.co/",
    brief:
      "The Conscious Bar needed a Shopify Plus store that reflected their clean-beauty values without slowing down for the sake of good looks — a common trade-off in beauty ecommerce.",
    whatWeBuilt:
      "A minimalist custom theme with ingredient and benefit-based filtering, wishlist support, and multi-currency checkout for shoppers outside the US. We tightened the purchase flow to reduce cart abandonment.",
    features: [
      "Ingredient and benefit-based filtering",
      "Wishlist and save-for-later",
      "Multi-currency checkout for international shoppers",
      "Streamlined cart and checkout flow",
      "Sustainability messaging built into product pages",
    ],
    focusResult:
      "Sustainability and transparency needed to come through in the design itself, not just the product copy. Conversion and revenue have both climbed since launch, tracked in the stats shown on this page.",
    img: "/works/Theconsciousbar.png",
  },
  {
    slug: "forchics",
    name: "ForChics",
    teaser: "Vegan beauty brand rebuilt around trust and verified reviews.",
    review:
      "Our old site didn't build trust fast enough. This one does. Customers can see the reviews, the guarantee, and the results before they even scroll.",
    reviewer: "Founder, ForChics",
    liveUrl: "",
    brief:
      "ForChics needed their vegan, cruelty-free beauty line to feel as credible as it is effective — trust was the real barrier to conversion, not product quality.",
    whatWeBuilt:
      "We restructured the catalog by customer concern instead of product type, added a visible money-back guarantee, and surfaced verified before-and-after reviews above the fold. Automated email flows now handle abandoned carts and post-purchase reviews without manual work.",
    features: [
      "Catalog organized by customer concern",
      "Visible money-back guarantee",
      "Verified before-and-after review gallery",
      "Automated abandoned-cart and review-request flows",
      "Above-the-fold trust signals",
    ],
    focusResult:
      "Every design decision came back to one question — does this make a first-time visitor trust us faster. Conversion and revenue improvements are shown in the results section on this page.",
    img: "/works/ForChics.png",
  },
  {
    slug: "collection-akhavan",
    name: "Collection Akhavan",
    teaser: "A gallery-style store for handcrafted pieces.",
    review:
      "The new store finally does justice to the craftsmanship behind each piece. It feels like walking into the showroom.",
    reviewer: "Collection Akhavan",
    liveUrl: "",
    brief:
      "Collection Akhavan came to us with a catalog of handcrafted pieces that deserved more than a generic template — they needed a store that presented each item with the same care that goes into making it.",
    whatWeBuilt:
      "A Shopify store built around large-format imagery, short craftsmanship stories on every product page, and a simplified checkout that doesn't distract from browsing.",
    features: [
      "Large-format product photography",
      "Short craftsmanship story on every product page",
      "Simplified, distraction-free checkout",
      "Mobile-first gallery-style browsing",
      "Category structure built around collections",
    ],
    focusResult:
      "We treated every product page like a small gallery entry rather than a listing. Full performance numbers will be added once available.",
    img: "/works/collection-avakan.webp",
  },
  {
    slug: "die-schrothkur",
    name: "Die Schrothkur",
    teaser: "A calm, content-forward wellness store.",
    review:
      "The site finally feels as calming as what we offer. It was overdue.",
    reviewer: "Die Schrothkur",
    liveUrl: "",
    brief:
      "Die Schrothkur needed a Shopify store that communicated a wellness-first, trustworthy feel — one that could explain a less familiar treatment approach clearly to new visitors.",
    whatWeBuilt:
      "A calm, content-forward store with plain-language explanations built into the product and service pages, plus a straightforward booking or purchase flow.",
    features: [
      "Plain-language service explanations",
      "Combined booking and purchase flow",
      "Calm, content-forward visual design",
      "Clear pricing and process breakdowns",
      "Mobile-first layout for on-the-go visitors",
    ],
    focusResult:
      "Clarity mattered more than flash here — visitors needed to understand what they were buying within seconds. Full performance numbers will be added once available.",
    img: "/works/die-schrothkur.jpeg",
  },
  /* SEZ Group — hidden for now (re-enable when ready)
  {
    slug: "sez-group",
    name: "SEZ Group",
    teaser: "A large, varied catalog made simple to shop.",
    review:
      "They took a complicated catalog and made it simple to shop. Exactly what we needed.",
    reviewer: "SEZ Group",
    liveUrl: "",
    brief:
      "SEZ Group needed a Shopify store that could handle a wide, varied product catalog without overwhelming new visitors.",
    whatWeBuilt:
      "A clean category structure with smart filtering, so visitors can narrow down a large catalog quickly, plus navigation built around how customers actually search.",
    features: [
      "Smart filtering across a large catalog",
      "Simplified navigation built around search behavior",
      "Category-first browsing structure",
      "Fast search and product discovery",
      "Mobile-optimized catalog browsing",
    ],
    focusResult:
      "We focused on making a big catalog feel small and manageable from the customer's side. Full performance numbers will be added once available.",
    img: pexels(4481259, 900, 1100),
    placeholder: true,
  },
  */
  {
    slug: "orbes",
    name: "Orbes",
    teaser: "A minimal, considered store for a design-led brand.",
    review: "Simple, fast, and it actually looks like our brand now.",
    reviewer: "Orbes",
    liveUrl: "",
    brief:
      "Orbes wanted a Shopify store as minimal and considered as their product design, without it feeling empty or generic.",
    whatWeBuilt:
      "A clean, spacious layout built around strong product photography, with subtle motion and a fast, distraction-free checkout.",
    features: [
      "Spacious, minimal layout",
      "Strong, large-scale product photography",
      "Subtle motion and micro-interactions",
      "Fast, distraction-free checkout",
      "Mobile-first responsive design",
    ],
    focusResult:
      "Minimal doesn't mean boring, so we focused on small, deliberate design details that add personality without adding clutter. Full performance numbers will be added once available.",
    img: pexels(3735641, 900, 1100),
    placeholder: true,
  },
];

// ------------------------------------------------------------------
//  Canonical origin
// ------------------------------------------------------------------

/**
 * One source of truth for absolute URLs — canonical tags, OG images, the
 * sitemap and the RSS feed all build off this. Overridable per environment so
 * preview deploys don't advertise the production origin as their canonical.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://cracktab.com";

/** Absolute URL for a site-relative path. */
export const absoluteUrl = (path: string) =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

// ------------------------------------------------------------------
//  Blog (seed content — the live posts come from the database)
// ------------------------------------------------------------------
export type BlogPost = {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  img: string;
};

export const blogPosts: BlogPost[] = [
  {
    title: "How we cut a Shopify store's load time by 60%",
    excerpt:
      "A build story on the performance work behind a Shopify Plus launch — what we measured, changed, and shipped.",
    category: "Performance",
    date: "Jul 2026",
    img: pexels(11035471, 900, 600),
  },
  {
    title: "Migrating from WooCommerce to Shopify without the downtime",
    excerpt:
      "Our checklist for a clean migration: data, redirects, SEO, and the things teams forget until launch day.",
    category: "Migration",
    date: "Jun 2026",
    img: pexels(230544, 900, 600),
  },
  {
    title: "CRO experiments that actually moved revenue",
    excerpt:
      "A behind-the-scenes look at the A/B tests that worked — and the ones that didn't — across our client stores.",
    category: "Growth",
    date: "Jun 2026",
    img: pexels(669615, 900, 600),
  },
  {
    title: "Designing product pages that convert",
    excerpt:
      "From hero to add-to-cart: the UX patterns we lean on when the goal is checkout, not just clicks.",
    category: "Design",
    date: "May 2026",
    img: pexels(196645, 900, 600),
  },
  {
    title: "When a custom Shopify app beats an off-the-shelf one",
    excerpt:
      "How to know it's time to build — and what a custom app actually costs to maintain.",
    category: "Development",
    date: "May 2026",
    img: pexels(160107, 900, 600),
  },
  {
    title: "Ecommerce SEO for stores, not blogs",
    excerpt:
      "Why generic SEO advice fails online stores, and the search intent that actually leads to a purchase.",
    category: "SEO",
    date: "Apr 2026",
    img: pexels(270637, 900, 600),
  },
];

export type Social = { label: string; href: string; icon: string };

export const socials: Social[] = [
  { label: "Facebook", href: "https://facebook.com/cracktabagency", icon: "facebook" },
  { label: "Instagram", href: "https://www.instagram.com/cracktab/", icon: "instagram" },
  { label: "LinkedIn", href: "https://linkedin.com/company/cracktab", icon: "linkedin" },
  { label: "Pinterest", href: "https://pinterest.com/cracktabagency", icon: "pinterest" },
  {
    label: "YouTube",
    href: "https://youtube.com/channel/UCNb4MhdV2wfhYcR6yvqU4wQ",
    icon: "youtube",
  },
];

// ------------------------------------------------------------------
//  Homepage — services overview, testimonials, process, FAQ
// ------------------------------------------------------------------

/** Short lead-in above the homepage service list. */
export const servicesIntro =
  "As a full-service Shopify design and development agency, we handle everything from custom store builds to ongoing growth support. Explore our services below, or view all to see the full picture.";

export type Testimonial = {
  quote: string;
  name: string;
  title: string;
  brand: string;
  /** Headline results, shown as chips under the quote. */
  metrics: string[];
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Cracktab understood our values as a vegan, cruelty-free beauty brand and built a store that tells our story beautifully. Higher sales, happier customers, seamless shopping.",
    name: "Lena Roberts",
    title: "Head of Brand",
    brand: "ForChics",
    metrics: ["+200% conversion rate", "+240% revenue"],
  },
  {
    quote:
      "Cracktab turned our needs into a beautifully-optimized store that truly represents our mission. Stronger customer trust, a smoother experience, and a big jump in conversions. Couldn't have asked for a better partner.",
    name: "Lena Müller",
    title: "Founder",
    brand: "Femdisc",
    metrics: ["+200% conversion rate", "+240% revenue"],
  },
  {
    quote:
      "Cracktab completely understood what Lockeroom stands for — performance, recovery, simplicity — and built a store that delivers exactly that. Our conversion rate has doubled.",
    name: "James Carter",
    title: "Founder",
    brand: "Lockeroom",
    metrics: ["+180% conversion rate", "+220% revenue"],
  },
  {
    quote:
      "Cracktab built a stunning, high-performing store that truly represents our brand. Since launch, our conversion rate has doubled, and customer feedback has been fantastic.",
    name: "Emma Lawson",
    title: "Brand Director",
    brand: "The Conscious Bar",
    metrics: ["+150% conversion rate", "+280% revenue"],
  },
];

/**
 * Homepage process. Deliberately separate from `processSteps` (used on
 * /services) — this version is written for a first-time visitor.
 */
export const homeProcess: { no: string; title: string; description: string }[] = [
  {
    no: "01",
    title: "Discovery",
    description:
      "We start by understanding your brand, your current store (if you have one), and where things are breaking down. No generic templates — every recommendation is based on your actual goals and traffic.",
  },
  {
    no: "02",
    title: "Design",
    description:
      "We wireframe key pages and design a store that's built to convert, not just look good — mapping the user journey from landing page to checkout before a single line of code is written.",
  },
  {
    no: "03",
    title: "Development",
    description:
      "Our team builds your Shopify or Shopify Plus store from scratch, tuned for speed and scalability, with clean code that's easy to maintain and extend as you grow.",
  },
  {
    no: "04",
    title: "Launch & Growth",
    description:
      "We don't disappear after launch. From SEO to CRO to ongoing support, we stay involved to help your store keep performing as your traffic and catalog grow.",
  },
];

/** Homepage FAQ — buyer-intent questions, distinct from the fuller /faq list. */
export const homeFaq: Faq[] = [
  {
    q: "How long does a Shopify build take?",
    a: "Timelines vary by scope, but most custom Shopify stores take 4–8 weeks from kickoff to launch. Larger Shopify Plus builds or migrations can take longer — we'll give you a clear timeline after discovery.",
  },
  {
    q: "Do you work with Shopify Plus?",
    a: "Yes — we're a Shopify Plus Partner and regularly build and migrate stores on Plus for growing and enterprise brands.",
  },
  {
    q: "Can you migrate our existing store to Shopify?",
    a: "Yes, we handle migrations from platforms like WooCommerce, Magento, and BigCommerce, as well as Shopify-to-Shopify Plus upgrades, without losing SEO rankings or historical data.",
  },
  {
    q: "Do you offer ongoing support after launch?",
    a: "Yes — we offer ongoing support and growth services including SEO, CRO, and maintenance, so your store keeps improving after it goes live.",
  },
  {
    q: "What industries do you work with?",
    a: "We've built stores across beauty, wellness, fashion, food and beverage, and home goods, among others. Our approach is tailored to your brand rather than a one-size-fits-all template.",
  },
  {
    q: "Do you build custom Shopify apps too?",
    a: "Yes — if there's a workflow or feature the Shopify App Store can't handle, we design and develop custom apps that integrate directly with your store.",
  },
];
