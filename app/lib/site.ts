export const CALENDLY_URL = "https://calendly.com/cracktab2025/30min";

export type NavLink = { label: string; href: string };

// Primary menu group (from the brief)
export const primaryNav: NavLink[] = [
  { label: "Our Works", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Shopify Themes", href: "/themes" },
  { label: "Shopify Apps", href: "/apps" },
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

export const services: Service[] = [
  {
    title: "Shopify Development",
    description:
      "Custom Shopify and Shopify Plus stores, built from scratch and tuned for speed.",
    href: "/services/shopify-development",
    tag: "Shopify Plus Partner",
  },
  {
    title: "Custom Business Websites",
    description:
      "Custom business and marketing websites for brands that need more than Shopify.",
    href: "/services/business-websites",
  },
  {
    title: "UI/UX Design",
    description:
      "Design that turns visitors into customers, from wireframe to final pixel.",
    href: "/services/ui-ux-design",
  },
  {
    title: "Shopify App Development",
    description:
      "Custom Shopify apps and integrations when off-the-shelf isn't enough.",
    href: "/services/app-development",
  },
  {
    title: "eCommerce Growth + CRO",
    description:
      "Once audits and the roadmap are complete, CRO and A/B split testing become key drivers of growth. We continuously test and optimise your site — refining the experience, improving conversion, and maximising ROI with every data-driven experiment.",
    href: "/services/growth-cro",
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
      { label: "Shopify Apps", href: "/apps" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
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
