/**
 * Homepage copy — kept in one place so wording can be edited without
 * touching layout. Numbers here must stay evidenced: anything still in
 * [BRACKETS] is a placeholder that needs a real figure before launch.
 */

export const hero = {
  /** H1 for SEO, shown as the small line above the headline. */
  h1: "Shopify CRO Agency",
  /** The big visual headline (not the H1). */
  headline: "Helping DTC brands turn more visitors into revenue",
  lead:
    "We find exactly where your shoppers stall — product page, cart, checkout or the offer itself — then A/B test the fix on live traffic and keep only what earns more.",
  support:
    "173 Shopify stores built and optimised for DTC brands across the US, UK, EU and Australia, plus 5 apps of our own on the Shopify App Store. Every change is judged on revenue per visitor, not on how good the redesign looks.",
  credentials: ["Shopify Partner", "7 years on Shopify", "35+ returning clients"],
  primaryCta: "Get a free CRO audit",
  secondaryCta: "See the numbers",
};

export const whoFor =
  "Cracktab is the Shopify CRO partner for DTC brands doing $250K to $10M+ a year. We combine structured experiments, in-house design and development, and apps we built ourselves to turn your existing traffic into more customers.";

export const clientNames = [
  "The Conscious Bar",
  "Pürishh",
  "Greenwood Leather",
  "Luxe Cosmetics",
  "ForChics",
  "SeeTrue",
  "Die Schrothkur",
  "Collection Akhavan",
  "Notary Scheiber",
];

/** Real mobile screenshots of client stores — mostly product pages. */
export const phoneScreens = [
  { src: "/home/screens/tcb-pdp.jpg", store: "The Conscious Bar", page: "Product page" },
  { src: "/home/screens/purishh-pdp.jpg", store: "Pürishh", page: "Product page" },
  { src: "/home/screens/tcb-home.jpg", store: "The Conscious Bar", page: "Homepage" },
  { src: "/home/screens/greenwood-pdp.jpg", store: "Greenwood Leather", page: "Product page" },
  { src: "/home/screens/greenwood-collection.jpg", store: "Greenwood Leather", page: "Collection page" },
  { src: "/home/screens/luxe-pdp.jpg", store: "Luxe Cosmetics", page: "Product page" },
  { src: "/home/screens/tcb-drawer.jpg", store: "The Conscious Bar", page: "Cart drawer" },
  { src: "/home/screens/forchics-pdp.jpg", store: "ForChics", page: "Product page" },
  { src: "/home/screens/purishh-home.jpg", store: "Pürishh", page: "Homepage" },
  { src: "/home/screens/seetrue-pdp.jpg", store: "SeeTrue", page: "Product page" },
  { src: "/home/screens/luxe-cart.jpg", store: "Luxe Cosmetics", page: "Cart page" },
  { src: "/home/screens/schrothkur-pdp.jpg", store: "Die Schrothkur", page: "Product page" },
  { src: "/home/screens/akhavan-home.jpg", store: "Collection Akhavan", page: "Homepage" },
];

export const proof = {
  eyebrow: "Proof, not promises",
  title: "Real Store. Real Dashboard. No Mock-Ups.",
  body:
    "A screen recording from the Shopify admin of a DTC food brand on a Cracktab CRO retainer. Nothing staged, nothing rounded up — the brand name is withheld.",
  stats: [
    { value: "$1.79M", label: "Sales in the last 30 days", delta: "+38%" },
    { value: "360.7K", label: "Sessions in the last 30 days", delta: "+28%" },
    { value: "20.6K", label: "Orders in the last 30 days", delta: null },
    { value: "4.42%", label: "Conversion rate on the day recorded", delta: null },
  ],
};

export const problem = {
  eyebrow: "The leak",
  title: "More Traffic Won't Fix A Store That Doesn't Convert.",
  body:
    "At a 2% conversion rate, 98 of every 100 visitors you paid for leave with nothing. Doubling ad spend doubles the cost of that leak. Fixing the store doesn't — and the fix keeps paying on every visitor after it.",
};

export const oneTeam = {
  eyebrow: "Before vs after · The Conscious Bar",
  title: "Same Product. Same Traffic. A Page Built To Sell.",
  body:
    "Real screenshots from The Conscious Bar. Before is their live product page; after is the page our team researched, designed and coded. Drag the handle to compare, then switch between desktop, mobile and the cart drawer.",
};

export const method = {
  eyebrow: "What we actually ship",
  title: "Real Widgets From Real Product Pages And Carts.",
  body:
    "The blocks we build into client themes most often, with real products and prices from The Conscious Bar, Luxe Cosmetics, ForChics and Pürishh. Every one is a working demo: tap, toggle and add to see what it does for the shopper.",
};

export const builder = {
  eyebrow: "Built in-house · The Conscious Bar",
  title: "When Your Theme Can't Do It, We Build It.",
  body:
    "Bundle builders, subscription pickers, gift flows and free-shipping bars, built straight into the theme instead of bolted on with five apps. This is the build-your-own-box flow we made for The Conscious Bar. Try it.",
};

export const apps = {
  eyebrow: "Our Shopify apps",
  title: "We Don't Wait For The Right App. We Build It.",
  body:
    "Five apps live on the Shopify App Store, each one started as a fix for a client. When the tool your store needs doesn't exist, we write it instead of working around it.",
  cta: "Browse the apps",
};

export const services = {
  eyebrow: "Beyond CRO",
  title: "Launch, Migrate, Redesign, Scale. Same Team, Same Standard.",
  body:
    "Most brands come to us because traffic arrives and orders don't. Others are launching, outgrowing a DIY theme or leaving WooCommerce. We do that work too — built the same way, tested the same way, by the same people.",
  items: [
    { label: "Ecommerce management & CRO", href: "/services/ecommerce-growth-cro" },
    { label: "Shopify & Shopify Plus development", href: "/services/shopify-development" },
    { label: "Store migration & redesign", href: "/services/shopify-development" },
    { label: "Custom theme sections", href: "/services/shopify-app-development" },
    { label: "Custom Shopify apps", href: "/services/shopify-app-development" },
    { label: "SEO, speed & email", href: "/services/ecommerce-growth-cro" },
  ],
  cta: "See all services",
};

export const faq = [
  {
    q: "What does a Shopify CRO agency actually do?",
    a: "We find the points where shoppers drop out of your store, design and code changes that remove the friction, then A/B test those changes on real traffic. Only the versions that earn more revenue per visitor stay live.",
  },
  {
    q: "How much traffic do I need before testing makes sense?",
    a: "As a rule of thumb, around 30,000 sessions a month gives tests time to reach a clear answer. Below that we focus on research-led fixes and conversion basics first — the free audit tells you which side of the line you're on.",
  },
  {
    q: "How quickly will I see results?",
    a: "Research and the first test usually go live within the first two to three weeks. Most tests need two to four weeks of traffic to reach a reliable result, so the first winners are typically shipped in month two.",
  },
  {
    q: "Do you design and code the tests yourselves?",
    a: "Yes. Research, design, Shopify development and testing all happen in one team, so there is no handoff between a strategist, a designer and a developer.",
  },
  {
    q: "Is there a long contract?",
    a: "No. We work month to month, and you can cancel any time.",
  },
  {
    q: "Do you work with Shopify Plus?",
    a: "Yes. We work on Shopify and Shopify Plus, including checkout extensibility, B2B and multi-market stores.",
  },
];

export const close = {
  eyebrow: "Free CRO audit",
  title: "See What Your Store Could Earn From The Traffic It Already Gets.",
  body:
    "A free 30-minute call. We walk through your store with you, live, and show you the first things we'd test. No obligation, no pitch deck.",
  leaveWith: [
    "Where your store is losing sales, and why",
    "The first three tests we'd run, each with a target number",
    "A straight answer on whether you're ready to test yet",
  ],
  primaryCta: "Get a free CRO audit",
};
