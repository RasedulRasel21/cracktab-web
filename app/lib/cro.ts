/**
 * Content for the CRO process (/how-we-work and the homepage summary), the
 * ecommerce-manager offer, and the full scope list shown on case studies.
 */

export type CroStep = {
  no: string;
  title: string;
  when: string;
  summary: string;
  what: string[];
  deliverable: string;
};

export const croSteps: CroStep[] = [
  {
    no: "01",
    title: "Audit",
    when: "Week 1",
    summary:
      "We get access to Shopify, GA4 and your ad accounts and find where the store loses money, page by page and device by device.",
    what: [
      "Funnel analysis: product view → add to cart → checkout → purchase",
      "Heatmaps and session recordings on your top pages",
      "Speed and Core Web Vitals on real mobile devices",
      "Tracking check, so every later result can be trusted",
    ],
    deliverable: "Audit report with every revenue leak, ranked",
  },
  {
    no: "02",
    title: "Research",
    when: "Week 1–2",
    summary:
      "Numbers show where shoppers drop out; research shows why. We combine both before anything is designed.",
    what: [
      "Review and support-ticket mining for objections",
      "On-site and post-purchase surveys",
      "Competitor product page and offer teardown",
      "Cart, shipping and discount logic review",
    ],
    deliverable: "Insight list: the questions shoppers can't get answered",
  },
  {
    no: "03",
    title: "Prioritise",
    when: "Week 2",
    summary:
      "Every idea becomes a written hypothesis and is scored on impact, confidence and effort, so the biggest wins go first.",
    what: [
      "One hypothesis per idea: change, reason, expected result",
      "Impact × confidence × ease scoring",
      "Quick fixes shipped straight away, bigger ideas queued as tests",
      "A roadmap you can see and comment on",
    ],
    deliverable: "Prioritised testing roadmap",
  },
  {
    no: "04",
    title: "Design & build",
    when: "Week 2–3",
    summary:
      "The same team designs the variant and codes it into your theme. No handoff to a freelancer, no layout lost in translation.",
    what: [
      "Wireframe and visual design for desktop and mobile",
      "Built as theme sections your team can edit",
      "QA on real iOS and Android devices and every browser",
      "Speed checked before it goes live",
    ],
    deliverable: "Variant ready to test",
  },
  {
    no: "05",
    title: "A/B test",
    when: "2–4 weeks per test",
    summary:
      "Traffic is split between the current page and the new one. We judge on revenue per visitor, not clicks or opinions.",
    what: [
      "Split testing on live traffic",
      "Conversion rate, average order value and revenue per visitor tracked",
      "Run until the result is reliable, not until it looks good",
      "Mobile and desktop read separately",
    ],
    deliverable: "Clear winner or loser, with the numbers",
  },
  {
    no: "06",
    title: "Roll out & learn",
    when: "After each test",
    summary:
      "Winners are built into the theme for good. Losers are written up too, because knowing what your shoppers don't want is just as useful.",
    what: [
      "Winning variant shipped permanently",
      "Learnings fed back into the roadmap",
      "Follow-up tests on the same page",
      "Old test code removed so the store stays fast",
    ],
    deliverable: "A faster, higher-converting live store",
  },
  {
    no: "07",
    title: "Report & repeat",
    when: "Every month",
    summary:
      "A plain-language monthly report: what we shipped, what moved, what we test next. Then the cycle starts again.",
    what: [
      "Monthly report and call",
      "Revenue, conversion rate and AOV trends",
      "Next month's tests agreed with you",
      "Store management tasks handled alongside",
    ],
    deliverable: "Monthly report and next month's plan",
  },
];

export const croTestAreas = [
  { title: "Product pages", body: "Price display, pack and bundle pickers, benefit chips, reviews, sticky add to cart." },
  { title: "Cart drawer & cart", body: "Free-shipping and minimum-order bars, upsells, subscription toggles, clear next steps." },
  { title: "Collections & search", body: "Filters, sorting, product cards, quick add, merchandising." },
  { title: "Homepage & navigation", body: "Offer clarity above the fold, menu structure, paths to best sellers." },
  { title: "Offers & bundles", body: "Bundle builders, tiered discounts, gift-with-purchase, auto-applied promos." },
  { title: "Subscriptions", body: "Subscribe-and-save placement, perks, frequency choice, upgrade from one-time." },
  { title: "Checkout (Shopify Plus)", body: "Checkout extensions, trust and delivery messaging, upsells after purchase." },
  { title: "Speed", body: "Image weight, app scripts, lazy loading, theme code clean-up." },
];

export const croMetrics = [
  "Conversion rate",
  "Average order value",
  "Revenue per visitor",
  "Add-to-cart rate",
  "Checkout completion",
  "Repeat purchase rate",
];

/** Ecommerce manager offer — homepage section. */
export const ecomManager = {
  eyebrow: "Your ecommerce manager",
  title: "Hire A Whole Ecommerce Team For Less Than One Hire.",
  body:
    "Instead of recruiting an ecommerce manager, a designer, a developer and a CRO analyst, hire Cracktab. We run the store day to day and make it sell more every month.",
  benefits: [
    { title: "A full team, not one person", body: "Strategy, design, Shopify development, CRO, SEO and email under one roof." },
    { title: "No hiring, no lock-in", body: "Start this month instead of after a three-month search. Month to month, cancel any time." },
    { title: "Day-to-day store operations", body: "Products, collections, promotions, apps and theme updates handled for you." },
    { title: "Subscriptions & B2B handled", body: "Subscription programmes, bundles and wholesale or Shopify Plus B2B set up and kept running." },
    { title: "Email & retention", body: "Welcome, abandoned cart, post-purchase and win-back flows that bring customers back." },
    { title: "Growth built in", body: "A monthly CRO programme tests and ships improvements, so revenue per visitor keeps climbing." },
  ],
  compare: [
    ["Time to start", "Months of recruiting", "This month"],
    ["Skills", "One person", "Design, dev, CRO, SEO, email"],
    ["Commitment", "Salary, benefits, notice", "Month to month"],
    ["A/B testing", "Rarely", "Every month"],
    ["Cover for holidays & sick days", "None", "Always"],
  ] as [string, string, string][],
};

/** Full scope shown on case studies: everything we can run for a store. */
export const fullScope = [
  { title: "CRO & A/B testing", body: "Research, hypotheses, tests and roll-outs every month." },
  { title: "Store redesign", body: "Product, collection, cart and homepage redesigned around how shoppers buy." },
  { title: "Shopify development", body: "Custom theme sections, Shopify Plus, migrations and integrations." },
  { title: "Ecommerce SEO", body: "Technical SEO, structured data, collection and product content." },
  { title: "Speed optimisation", body: "Core Web Vitals, image weight, app script clean-up." },
  { title: "Email & SMS marketing", body: "Flows and campaigns for welcome, abandoned cart, post-purchase and win-back." },
  { title: "Subscriptions", body: "Subscribe-and-save, bundle subscriptions, perks and customer portal." },
  { title: "B2B & wholesale", body: "Shopify Plus B2B, wholesale pricing, company accounts and minimums." },
  { title: "Bundles & offers", body: "Build-your-own-box, tiered discounts, gift-with-purchase, upsells." },
  { title: "Analytics & tracking", body: "GA4, conversion tracking and reporting you can trust." },
  { title: "Custom apps", body: "Private apps and integrations when the App Store can't do it." },
  { title: "Store management", body: "Day-to-day operations, launches and promotions handled for you." },
];
