import type { Faq } from "./site";

/**
 * Every Cracktab Shopify app, in hub order. The hub grid, the footer column,
 * the sitemap and the per-app pages all read from this list.
 *
 * Copy comes from the content team's docs: "Shopify Apps Hub — Build
 * Instructions" for the cards and hub sections, and each app's
 * "Cracktab.com App Page" doc for its page.
 */

export const AI_GROWTH_KITS_URL = "https://aigrowthkits.app";

export const APPS_HUB_PATH = "/shopify-apps";

export type AppFeature = { title: string; body: string };

export type AppComparisonRow = { label: string; ours: string; theirs: string };

/** Everything the shared app page template needs. */
export type AppPage = {
  /** Without the brand — the root layout's title template appends it. */
  seoTitle: string;
  metaDescription: string;
  eyebrow: string;
  heading: string;
  subhead: string;
  /** App Store listing, without UTM params — see installUrl(). */
  appStoreUrl: string;
  /** Optional until the demo store exists. The button is hidden when empty. */
  demoUrl?: string;
  demoLabel: string;
  /**
   * The demo video: a YouTube id, or a self-hosted file (a public path, with
   * optional WebVTT captions). The video block is hidden when both are empty.
   */
  videoId?: string;
  videoFile?: { src: string; captions?: string };
  videoHeading: string;
  problems: string[];
  features: AppFeature[];
  steps: string[];
  whoFor?: string[];
  /** Optional extra statement, e.g. AI SEO's "Why it's free". */
  note?: { heading: string; quote: string };
  comparison?: { oursLabel: string; theirsLabel: string; rows: AppComparisonRow[] };
  faq: Faq[];
  /** `supportLine` leads into a "Book a call with Cracktab." link. */
  finalCta: { heading: string; supportLine?: string };
  /** Slugs of the apps in the "Other Cracktab apps" row. */
  otherApps: string[];
};

export type ShopifyApp = {
  slug: string;
  name: string;
  badge: string;
  line: string;
  chips: string[];
  /** Free to install — drives the `offers` price 0 in the hub schema. */
  free: boolean;
  /** Off-site home (AI Growth Kits). The card links out instead of to a page. */
  externalUrl?: string;
  /** Featured card — spans two grid columns from tablet up. */
  featured?: boolean;
  /**
   * Whether /shopify-apps/<slug> is live. Off until the app's page doc is
   * final: the card, footer and sitemap skip the link so nothing points at a
   * 404. Flip it on together with adding `page` below.
   */
  pageLive: boolean;
  page?: AppPage;
};

export const shopifyApps: ShopifyApp[] = [
  {
    slug: "ai-growth-kits",
    name: "AI Growth Kits",
    badge: "Flagship · CRO suite",
    line: "Six growth kits in one install: upsells, bundles, reviews, forms, AI SEO and analytics.",
    chips: ["Upsells", "Bundles", "Reviews", "Forms", "AI SEO", "Analytics"],
    free: false,
    externalUrl: AI_GROWTH_KITS_URL,
    featured: true,
    pageLive: false,
  },
  {
    slug: "ai-seo",
    name: "Cracktab AI SEO",
    badge: "Free",
    line: "Compress images, fix meta tags and alt text, and schedule AI blog posts.",
    chips: ["Image optimization", "Meta tags", "Alt text", "AI blogs"],
    free: true,
    pageLive: true,
    page: {
      seoTitle: "Free Shopify SEO App: Image Optimizer, Alt Text & Meta",
      metaDescription:
        "Cracktab AI SEO is a free Shopify app with no limits. Compress images, fix meta descriptions, add alt text and schedule AI blog posts.",
      eyebrow: "Shopify app · Free",
      heading: "Free Shopify SEO app, with no limits",
      subhead:
        "Cracktab AI SEO finds missing meta tags, compresses heavy images, adds alt text and schedules AI blog posts. No paid plan. No caps.",
      appStoreUrl: "https://apps.shopify.com/cracktab-seo-booster",
      demoLabel: "View the demo store",
      videoHeading: "Watch a full SEO cleanup on a demo store",
      problems: [
        "Missing meta descriptions mean Google writes your snippet for you.",
        "3 MB product photos make mobile pages crawl.",
        "Images without alt text are invisible to image search.",
      ],
      features: [
        {
          title: "Find every SEO gap in one scan",
          body: "The audit lists products and collections with missing, duplicate or too-long meta titles and descriptions, so you know exactly what to fix.",
        },
        {
          title: "Fix meta tags in bulk",
          body: "Select products, review AI suggestions, edit what you want and save. No theme code.",
        },
        {
          title: "Compress images with one click",
          body: "Optimize All shrinks images over 1 MB while keeping them sharp, so pages load faster.",
        },
        {
          title: "Alt text for every photo",
          body: "Describe images for search engines and screen readers from one screen.",
        },
        {
          title: "AI blog posts on a schedule",
          body: "Draft posts around your products, edit them in your voice and set a publish date.",
        },
        {
          title: "A checklist that tells you what's next",
          body: "Plain-language tasks, ordered by impact.",
        },
      ],
      steps: [
        "Install from the Shopify App Store (about 30 seconds).",
        "Run the scan and open the checklist.",
        "Fix issues in bulk, then check back weekly as you add products.",
      ],
      whoFor: [
        "New stores setting up SEO for the first time",
        "Growing catalogs where SEO fell behind",
        "Stores with big lifestyle photos",
        "Agencies and freelancers cleaning up client stores",
      ],
      note: {
        heading: "Why it's free",
        quote:
          "We built Cracktab AI SEO from the checklists our agency runs on client stores. We keep it free so any merchant can cover the basics without a budget.",
      },
      comparison: {
        oursLabel: "Cracktab AI SEO",
        theirsLabel: "Typical freemium SEO apps",
        rows: [
          { label: "Price", ours: "Free", theirs: "Free plan, then monthly fee" },
          { label: "Image limit", ours: "None", theirs: "Often capped per month" },
          { label: "Bulk meta fixes", ours: "Yes", theirs: "Often paid" },
          { label: "Alt text", ours: "Yes", theirs: "Varies" },
          { label: "AI blog scheduling", ours: "Yes", theirs: "Rare or paid" },
        ],
      },
      faq: [
        {
          q: "Is it really free?",
          a: "Yes. There's no paid plan and no limit on products or images.",
        },
        {
          q: "Will compressing images lower quality?",
          a: "The optimizer targets large files and keeps them visually sharp. You can review results before and after.",
        },
        {
          q: "Does it change my theme?",
          a: "No theme code edits are needed for meta tags or alt text.",
        },
        {
          q: "Should I publish AI blog posts as-is?",
          a: "No. Treat them as drafts, check facts and add your own voice.",
        },
        {
          q: "Can it guarantee rankings?",
          a: "No tool can. It fixes the on-page basics search engines look for.",
        },
      ],
      finalCta: {
        heading: "Clean up your Shopify SEO today",
        supportLine: "Need a full SEO strategy?",
      },
      otherApps: ["conversion-rate-optimizer", "widgetly-reviews", "ai-growth-kits"],
    },
  },
  {
    slug: "conversion-rate-optimizer",
    name: "Conversion Rate Optimizer",
    badge: "Free",
    line: "20+ no-code conversion blocks with revenue tracked per block.",
    chips: ["Upsells", "Timers", "Trust badges", "Shipping bar"],
    free: true,
    pageLive: false,
  },
  {
    slug: "widgetly-reviews",
    name: "Widgetly Reviews",
    badge: "Free",
    line: "Photo reviews, shopper Q&A and AI import from your old reviews app.",
    chips: ["Photo reviews", "Q&A", "AI import", "Klaviyo"],
    free: true,
    pageLive: false,
  },
  {
    slug: "custom-diamond-ring-builder",
    name: "Custom Diamond Ring Builder",
    badge: "Jewelry",
    line: "Let shoppers build their own ring: setting, diamond, metal and size, step by step.",
    chips: [],
    free: false,
    pageLive: true,
    // Copy comes from the live App Store listing, the listing instructions
    // doc, and the FAQ and setup guide on aigrowthkits.app. There is no
    // cracktab.com page doc for this app yet.
    page: {
      seoTitle: "Custom Diamond Ring Builder | Live Ring Pricing for Shopify",
      metaDescription:
        "Let shoppers build made-to-order diamond rings on your product page, priced live from your own rate sheet. Free plan for up to 5 ring products.",
      eyebrow: "Shopify app · Free plan available",
      heading: "Custom Diamond Ring Builder",
      subhead:
        "Sell made-to-order diamond rings online. Shoppers pick each stone and see your price update live.",
      appStoreUrl: "https://apps.shopify.com/custom-ring-creator",
      demoLabel: "View demo store",
      videoFile: {
        src: "/apps/custom-diamond-ring-builder/video.mp4",
        captions: "/apps/custom-diamond-ring-builder/video.vtt",
      },
      videoHeading: "Shoppers build and price a diamond ring live",
      problems: [
        "Made-to-order diamond rings have a different price for every stone combination, which standard product variants can't handle.",
        "Your shoppers want to design their ring and see the price now.",
        "Price-on-request makes them wait, and some don't come back.",
      ],
      features: [
        {
          title: "Build and price a ring on the product page",
          body: "Shoppers choose origin, shape, carat, color, clarity and ring size, and the total updates as they go.",
        },
        {
          title: "Your rate sheet becomes live pricing",
          body: "Upload your diamond rate sheet as a CSV, or add and edit stones by hand. The whole file is checked before anything is saved.",
        },
        {
          title: "Only stones you have priced are shown",
          body: "Only combinations you have priced are shown, so no one orders a stone you can't supply.",
        },
        {
          title: "A ring photo for every carat weight",
          body: "Assign a photo to each carat weight for a shape. A carat left blank falls back to the product photo.",
        },
        {
          title: "Match the selector to your theme",
          body: "Restyle the selector to match your theme: colors, layout, pills or dropdowns. A live preview shows the result before you save.",
        },
        {
          title: "Every spec lands on the Shopify order",
          body: "Every choice is saved on the cart and order, ready for your workshop.",
        },
      ],
      steps: [
        "Install Custom Diamond Ring Builder from the Shopify App Store and approve the permissions.",
        "Load your diamond prices: upload your rate sheet as a CSV.",
        "Add the selector to your theme and place a test order.",
      ],
      faq: [
        {
          q: "What format does the price sheet need?",
          a: "A CSV file with a header row and these columns: shape, origin, carat, colour, clarity, price. An image_url column is optional.",
        },
        {
          q: "How is the ring total calculated?",
          a: "The total is the ring's base price plus the price of the selected stone. It is calculated on the app's server from your price data, and again when the ring is added to the cart.",
        },
        {
          q: "Does the specification reach the order?",
          a: "Yes. Shape, diamond origin, carat, color, clarity, ring size and the diamond price are saved as line item properties, so they appear in the cart and on the order in your Shopify admin.",
        },
        {
          q: "Why is a carat, color or clarity missing from the selector?",
          a: "The selector only offers combinations that have a price. If a stone is missing, add a row for that shape, origin, carat, color and clarity to your price data.",
        },
        {
          q: "Does it work with my theme?",
          a: "The selector is a theme app block, which you add to the product template in the theme editor, so no theme code changes are needed.",
        },
        {
          q: "What does each plan include?",
          a: "Free covers up to 5 ring products and 3 diamond shapes. Studio covers up to 25 ring products with unlimited shapes, custom diamond origins and ring size lists. Atelier adds unlimited ring products and custom CSS. Current prices and trial length are shown on the app's Shopify App Store listing.",
        },
      ],
      finalCta: { heading: "Build it. Price it. Live." },
      otherApps: ["ai-seo", "conversion-rate-optimizer", "ai-growth-kits"],
    },
  },
];

export const appPath = (app: ShopifyApp) => `${APPS_HUB_PATH}/${app.slug}`;

/** Apps whose cracktab.com page is live. */
export const appsWithPages = () =>
  shopifyApps.filter(
    (app): app is ShopifyApp & { page: AppPage } => app.pageLive && !!app.page,
  );

/**
 * Where an app's card links: its page when live, aigrowthkits.app for AI
 * Growth Kits, otherwise nowhere yet.
 */
export function appHref(app: ShopifyApp): { href: string; external: boolean } | null {
  if (app.externalUrl) return { href: app.externalUrl, external: true };
  if (app.pageLive && app.page) return { href: appPath(app), external: false };
  return null;
}

/**
 * App Store link with the UTM convention from the hub doc, so Partner
 * Dashboard listing analytics show which page and position sent the install.
 */
export function installUrl(app: ShopifyApp & { page: AppPage }, position: "hero" | "footer") {
  const params = new URLSearchParams({
    utm_source: "cracktab.com",
    utm_medium: "app_page",
    utm_campaign: app.slug,
    utm_content: position,
  });
  return `${app.page.appStoreUrl}?${params.toString()}`;
}

/**
 * Image slots per app, as public paths without extension. A slot renders only
 * when a matching file exists under public/ (see findPublicAsset).
 *
 *  • icon       — app icon (square, from the App Store listing)
 *  • card       — small UI vignette for the hub card
 *  • hero       — App Store feature image, 1600×900
 *  • feature-N  — App Store screenshot for feature row N (1-based), 1600×900
 *  • video      — click-to-play thumbnail for the walkthrough, 1280×720
 */
export const appAsset = (slug: string, slot: string) => `/apps/${slug}/${slot}`;

export const hubFaq: Faq[] = [
  {
    q: "Are these apps free?",
    a: "Cracktab AI SEO, Conversion Rate Optimizer and Widgetly Reviews are free to install. AI Growth Kits has its own plans on aigrowthkits.app.",
  },
  {
    q: "Will they slow down my store?",
    a: "Storefront blocks load through Shopify theme app extensions and only on the pages where you add them.",
  },
  {
    q: "Do they work with my theme?",
    a: "They work with Online Store 2.0 themes, including Dawn and Horizon. Add blocks from the theme editor.",
  },
  {
    q: "Who do I contact for help?",
    a: "Use the support link on each app page or email the support address in the app listing.",
  },
];

export const appPicker: { goal: string; app: string }[] = [
  { goal: "Get found on Google and speed up images", app: "ai-seo" },
  { goal: "Add upsells, urgency and trust without code", app: "conversion-rate-optimizer" },
  { goal: "Collect photo reviews and answer questions", app: "widgetly-reviews" },
  {
    goal: "Run upsells, bundles, reviews, forms, SEO and analytics in one app",
    app: "ai-growth-kits",
  },
];

export const agencyReasons: { title: string; body: string }[] = [
  { title: "Built from client work.", body: "Every feature started as a fix we made on a real store." },
  {
    title: "No-code by default.",
    body: "Blocks live in the theme editor, so you change them without a developer.",
  },
  { title: "Real support.", body: "You talk to the people who built the app." },
];
