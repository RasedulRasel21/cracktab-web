/**
 * Per-app privacy policies, served at /privacy/<slug>. Each App Store listing
 * links its own page here (the listing form rejects URLs containing
 * "shopify", so these live under /privacy, not /shopify-apps).
 *
 * The shared sections (rights, security, contact…) are in the page; this file
 * holds what differs per app: what it collects, why, and who else sees it.
 */

export type DataGroup = { heading: string; items: string[] };

export type AppPrivacy = {
  slug: string;
  name: string;
  /** One paragraph: what the app does with data, in plain words. */
  summary: string;
  collect: DataGroup[];
  use: string[];
  providers: { name: string; purpose: string }[];
  retention: string[];
  /** Shown only for apps that store shoppers' personal information. */
  shoppers?: string;
};

export const PRIVACY_UPDATED = "October 27, 2026";
export const PRIVACY_EMAIL = "privacy@cracktab.com";

const storeInfo: DataGroup = {
  heading: "Store information",
  items: [
    "Your store's domain and basic store details",
    "The access token Shopify issues when you install the app, and the email of the staff member who installed it",
    "Your app settings and preferences",
  ],
};

export const appPrivacy: AppPrivacy[] = [
  {
    slug: "ai-seo",
    name: "Cracktab AI SEO",
    summary:
      "Cracktab AI SEO reads your store's products and content to find SEO issues, and writes the fixes you approve back to Shopify. It works with store content only: it does not collect your customers' personal information.",
    collect: [
      storeInfo,
      {
        heading: "Product and store content",
        items: [
          "Product titles, descriptions, images and image alt text",
          "SEO titles and meta descriptions for products, collections and pages",
          "Blog posts the app creates or schedules, and images you upload for them",
          "Theme files, read to check things like H1, canonical and title tags",
        ],
      },
      {
        heading: "Usage",
        items: [
          "Scan results, your SEO score and which fixes were applied",
          "How many AI blog posts you have used this month",
        ],
      },
    ],
    use: [
      "Scan your store and show what to fix in the SEO checklist",
      "Write meta descriptions and blog posts with AI when you ask for them",
      "Compress product images and save the smaller versions to your store",
      "Fill missing image alt text",
      "Publish scheduled blog posts at the time you choose",
    ],
    providers: [
      { name: "Shopify", purpose: "reading and updating your store content through the Shopify APIs" },
      {
        name: "AI provider",
        purpose:
          "product details, topics and keywords are sent to a third-party AI model to write meta descriptions and blog posts. No customer data is sent",
      },
      { name: "Cloud hosting and database providers", purpose: "running the app and storing its data" },
    ],
    retention: [
      "Your data is kept while the app is installed.",
      "When you uninstall, Shopify asks us to erase your store's data and we delete it. Changes already saved to your store (meta descriptions, alt text, images, blog posts) stay in your store, because they are your content.",
    ],
  },
  {
    slug: "conversion-rate-optimizer",
    name: "Conversion Rate Optimizer",
    summary:
      "Conversion Rate Optimizer adds blocks such as upsells, countdown timers, stock indicators and trust badges to your theme, and reports how each block performs. It counts widget views and clicks; it does not ask shoppers for names, emails or addresses.",
    collect: [
      storeInfo,
      {
        heading: "Product and store content",
        items: [
          "Product titles, prices, images, variants and inventory levels, used by upsell, cross-sell and stock blocks",
          "The settings of each block you add in the theme editor",
        ],
      },
      {
        heading: "Widget analytics",
        items: [
          "Widget events from your storefront: which block was shown or clicked, on which page, and when",
          "Order totals for orders linked to a block, to report conversions and revenue per block",
        ],
      },
    ],
    use: [
      "Show the right products, timers and stock levels in your blocks",
      "Report impressions, clicks, conversions and revenue per block in the app",
      "Troubleshoot problems you report to us",
    ],
    providers: [
      { name: "Shopify", purpose: "reading products and orders, and serving the blocks through theme app extensions" },
      { name: "Cloud hosting and database providers", purpose: "running the app and storing its data" },
    ],
    retention: [
      "Your data is kept while the app is installed.",
      "When you uninstall, Shopify asks us to erase your store's data and we delete it, including the analytics.",
    ],
  },
  {
    slug: "widgetly-reviews",
    name: "Widgetly Reviews",
    summary:
      "Widgetly Reviews collects product reviews and questions from your shoppers, shows them on your store, and can email customers after a purchase to ask for a review. Because reviews come from people, it stores some of your customers' personal information on your behalf.",
    collect: [
      storeInfo,
      {
        heading: "Reviews and questions from shoppers",
        items: [
          "Reviewer name and email, star rating, review title and text, and whether they recommend the product",
          "Photos and videos shoppers attach to a review",
          "Questions shoppers ask, with their name and email, and your answers",
          "Helpful votes on reviews, stored with a random browser token, not a name or email",
        ],
      },
      {
        heading: "Orders, for review requests",
        items: [
          "For paid orders: order number, customer name and email, and the products bought, so a review request can be sent if you turn this on",
        ],
      },
      {
        heading: "Email settings",
        items: [
          "The sender name and email you set up, and the SMTP password or Resend API key you enter so the app can send review requests from your address",
        ],
      },
      {
        heading: "Imported reviews",
        items: [
          "Review files you upload to import (CSV, JSON or text). The file is read once to extract the reviews and is not kept; the imported reviews are stored like any other review",
        ],
      },
    ],
    use: [
      "Show approved reviews, photos, videos and Q&A on your store",
      "Let you approve, reject, feature and answer reviews and questions in the app",
      "Send review request emails after a purchase, if you turn this on",
      "Read review files you import and turn them into reviews",
    ],
    providers: [
      { name: "Shopify", purpose: "reading products, orders and customers, and serving the review blocks through theme app extensions" },
      { name: "DigitalOcean", purpose: "hosting the app and its database" },
      {
        name: "Anthropic",
        purpose:
          "files you import are sent to Anthropic's Claude AI to extract the review details. Only files you choose to import are sent",
      },
      {
        name: "Your email provider (SMTP) or Resend",
        purpose: "sending review request emails, using the account you connect",
      },
    ],
    retention: [
      "Reviews, questions and settings are kept while the app is installed.",
      "When you uninstall, all of your store's data is deleted, including reviews, questions, review requests and email settings.",
      "When a customer asks to be deleted, Shopify tells us and we delete that customer's reviews, questions and review requests. When a customer asks for their data, we prepare it for you through Shopify.",
    ],
    shoppers:
      "If you left a review or asked a question on a store that uses Widgetly Reviews, that store is responsible for your information and we process it on its behalf. To see, correct or delete it, contact the store, or email us and we will help the store respond.",
  },
];

export const findAppPrivacy = (slug: string) => appPrivacy.find((app) => app.slug === slug);
