export const CALENDLY_URL = "https://calendly.com/cracktab2025/30min";

export type NavLink = { label: string; href: string };

// Primary menu group. Shopify Themes/Apps are outbound links to the external
// theme/app stores (no page yet), so they stay parked on "#".
export const primaryNav: NavLink[] = [
  { label: "Our Works", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Shopify Themes", href: "/themes" },
  { label: "Shopify Apps", href: "#" },
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
      "Custom Shopify and Shopify Plus stores, built from scratch and tuned for speed.",
    href: "/services/shopify-development",
    tag: "Shopify Plus Partner",
  },
  {
    title: "Shopify App Development",
    description:
      "Custom Shopify apps and integrations when off-the-shelf isn't enough.",
    href: "/services/shopify-app-development",
  },
  {
    title: "UI/UX Design",
    description:
      "Design that turns visitors into customers, from wireframe to final pixel.",
    href: "/services/ui-ux-design",
  },
  {
    title: "Ecommerce SEO",
    description:
      "SEO strategy built around how people shop — the searches that lead to a purchase, not just traffic.",
    href: "/services/ecommerce-seo",
  },
  {
    title: "Ecommerce Growth & CRO",
    description:
      "Continuous testing, customer insights, and data-driven optimization to increase conversion and grow revenue.",
    href: "/services/ecommerce-growth-cro",
  },
  {
    title: "Custom Business Websites",
    description:
      "Professional websites tailored to your goals — from corporate sites to landing pages and web apps.",
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
      { label: "Shopify Apps", href: "#" },
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

export const contact = {
  phone: "+1 (234) 901-2506",
  phoneHref: "tel:+12349012506",
  offices: [
    {
      label: "Bangladesh office",
      address: "24/A, Road 1, Mirpur DOHS, Dhaka - 1216",
    },
    {
      label: "US office",
      address: "6545 Market Ave N, Ste 100 Canton, OH 44721",
    },
  ],
};

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
  bullets: string[];
};

export const serviceDetails: ServiceDetail[] = [
  {
    slug: "shopify-development",
    name: "Shopify Development",
    heading: "Shopify Development Services",
    intro:
      "Need a Shopify store that actually sells? We build stores from scratch, migrate growing brands to Shopify Plus, and handle the full range of ecommerce development that goes into a site people can actually shop on. No templates, no shortcuts — just a store built to convert.",
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
  },
  {
    slug: "shopify-app-development",
    name: "Shopify App Development",
    heading: "Shopify App Development Services",
    intro:
      "Need functionality that off-the-shelf apps just can't deliver? We build custom apps from scratch, connect your store to the tools you already run through API integrations, and automate the workflows that are currently eating up your team's time.",
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
  },
  {
    slug: "shopify-store-migration",
    name: "Shopify Store Migration",
    heading: "Shopify Store Migration Services",
    intro:
      "Moving your store from another platform doesn't have to be stressful. We handle complete migrations to Shopify while preserving your products, customer data, SEO value, and store functionality — minimizing downtime and ensuring a smooth transition.",
    bullets: [
      "WooCommerce migration",
      "Magento migration",
      "BigCommerce migration",
      "Wix & Squarespace migration",
      "Product & customer migration",
      "SEO preservation",
      "Redirect implementation",
      "Post-migration testing",
    ],
  },
  {
    slug: "shopify-store-redesign",
    name: "Shopify Store Redesign",
    heading: "Shopify Store Redesign Services",
    intro:
      "If your store feels outdated or isn't converting the way it should, a redesign can make all the difference. We modernize Shopify stores with better user experiences, stronger branding, and improved conversion-focused layouts.",
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
  },
  {
    slug: "shopify-speed-optimization",
    name: "Shopify Speed Optimization",
    heading: "Shopify Speed Optimization Services",
    intro:
      "Every second counts. We optimize your Shopify store for faster load times, improved Core Web Vitals, and a smoother shopping experience that helps reduce bounce rates and increase conversions.",
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
  },
  {
    slug: "shopify-maintenance-support",
    name: "Shopify Maintenance & Support",
    heading: "Shopify Maintenance & Support",
    intro:
      "Your store needs continuous attention to stay secure, fast, and reliable. Our maintenance plans ensure everything stays updated while giving you access to experienced Shopify developers whenever you need them.",
    bullets: [
      "Monthly maintenance",
      "Theme updates",
      "Bug fixes",
      "App updates",
      "Security monitoring",
      "Backup management",
      "Technical support",
      "Performance monitoring",
    ],
  },
  {
    slug: "shopify-conversion-audit",
    name: "Shopify Conversion Audit",
    heading: "Shopify Conversion Audit",
    intro:
      "Sometimes small changes create the biggest impact. We perform comprehensive audits of your Shopify store to uncover usability issues, friction points, and missed conversion opportunities before recommending a clear optimization roadmap.",
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
  },
  {
    slug: "ui-ux-design",
    name: "UI/UX Design",
    heading: "UI/UX Design Services",
    intro:
      "Your Shopify store is only as strong as its design. We handle both the interface and the experience side — from research and wireframes to polished visual design — creating stores that feel intuitive, strengthen your brand, and encourage customers to complete their purchase.",
    bullets: [
      "User experience research",
      "Conversion rate optimization",
      "Brand identity design",
      "Wireframing & prototyping",
      "A/B testing design",
      "Accessibility compliance",
      "Visual design systems",
      "Interactive animations",
    ],
  },
  {
    slug: "ecommerce-seo",
    name: "Ecommerce SEO",
    heading: "Ecommerce SEO Services",
    intro:
      "Generic SEO doesn't cut it for online stores. We build SEO strategies around how people actually shop — optimizing your website for the searches that lead to sales, not just traffic.",
    bullets: [
      "Technical SEO audit",
      "Keyword research & strategy",
      "On-page optimization",
      "Site speed optimization",
      "Schema markup",
      "Content optimization",
      "Local SEO setup",
      "Monthly reporting",
    ],
  },
  {
    slug: "ecommerce-growth-cro",
    name: "Ecommerce Growth & CRO",
    heading: "Shopify Ecommerce Growth & CRO",
    intro:
      "Once your store is live, growth becomes an ongoing process. Through continuous testing, customer insights, and data-driven optimization, we help Shopify stores increase conversion rates and maximize every visitor's value.",
    bullets: [
      "Conversion audits",
      "Growth roadmap",
      "A/B & split testing",
      "Landing page optimization",
      "Customer journey optimization",
      "Cart abandonment optimization",
      "Revenue tracking",
      "Monthly performance reporting",
    ],
  },
  {
    slug: "ecommerce-management",
    name: "Ecommerce Management",
    heading: "Ecommerce Management Services",
    intro:
      "Running an ecommerce business is a full-time job. We become an extension of your team, handling the day-to-day technical, marketing, and optimization work so you can focus on growing your business.",
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
  },
  {
    slug: "custom-business-websites",
    name: "Custom Business Websites",
    heading: "Custom Business Websites",
    intro:
      "Some businesses need more than an online store. We design and build professional websites tailored to your business goals — from corporate websites to landing pages and service-based businesses.",
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
  },
  {
    slug: "web-application-development",
    name: "Web Application Development",
    heading: "Web Application Development",
    intro:
      "When your business needs custom software, we build scalable web applications that improve operations, automate workflows, and deliver better experiences for your customers and team.",
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
  },
  {
    slug: "branding-visual-identity",
    name: "Branding & Visual Identity",
    heading: "Branding & Visual Identity",
    intro:
      "A memorable brand builds trust long before someone becomes a customer. We create visual identities that communicate professionalism, consistency, and personality across every digital and physical touchpoint.",
    bullets: [
      "Logo design",
      "Brand identity systems",
      "Brand guidelines",
      "Typography & color systems",
      "Marketing collateral",
      "Social media branding",
      "Packaging design",
      "Brand refresh",
    ],
  },
  {
    slug: "digital-marketing",
    name: "Digital Marketing",
    heading: "Digital Marketing Services",
    intro:
      "Great websites deserve great marketing. We help businesses generate qualified traffic, increase brand visibility, and turn visitors into customers through strategic digital campaigns.",
    bullets: [
      "Google Ads",
      "Meta Ads",
      "Email marketing",
      "Marketing automation",
      "Content strategy",
      "Analytics & reporting",
      "Audience targeting",
      "Campaign optimization",
    ],
  },
  {
    slug: "ai-business-automation",
    name: "AI & Business Automation",
    heading: "AI & Business Automation",
    intro:
      "Reduce manual work and streamline your operations with intelligent automation. We build AI-powered solutions and workflow automations that help businesses save time, improve efficiency, and scale faster.",
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
export type Work = { name: string; teaser: string; img: string };

export const works: Work[] = [
  {
    name: "The Conscious Bar",
    teaser: "Clean-beauty Shopify Plus store built for eco-conscious shoppers.",
    img: "/works/Theconsciousbar.png",
  },
  {
    name: "ForChics",
    teaser: "Vegan beauty brand rebuilt around trust and verified reviews.",
    img: "/works/ForChics.png",
  },
  {
    name: "Femdisc",
    teaser: "Educational, comparison-first store for a newer product category.",
    img: "/works/Femdisc.png",
  },
  {
    name: "Lockeroom",
    teaser: "Rehab and recovery store built around symptom-based shopping.",
    img: "/works/Lockeroom.jpg",
  },
  {
    name: "Luxe Cosmetics",
    teaser: "Premium Shopify Plus store for a luxury lash and brow line.",
    img: "/works/Luxe-cosmetics.jpg",
  },
  {
    name: "SeeTrue Glasses",
    teaser: "Refined, international-ready eyewear store.",
    img: "/works/Seetrueglasses.jpg",
  },
];

// ------------------------------------------------------------------
//  Blog (index only for now)
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
  { label: "Instagram", href: "#", icon: "instagram" },
  { label: "LinkedIn", href: "https://linkedin.com/company/cracktab", icon: "linkedin" },
  { label: "Pinterest", href: "https://pinterest.com/cracktabagency", icon: "pinterest" },
  {
    label: "YouTube",
    href: "https://youtube.com/channel/UCNb4MhdV2wfhYcR6yvqU4wQ",
    icon: "youtube",
  },
];
