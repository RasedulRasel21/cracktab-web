import { bulletMeta, type IconName } from "./serviceBullets";

/**
 * Per-service copy for the "What's included" cards.
 *
 * `bulletMeta` is keyed by label alone, so a shared bullet reads the same
 * everywhere. That isn't always right: "API integrations" means something
 * different on App Development than it does on AI & Automation. These
 * per-service notes take precedence; the short shared note is the fallback.
 */
export const serviceBulletNotes: Record<string, Record<string, string>> = {
  "shopify-development": {
    "Custom theme development":
      "Fully custom Liquid theme built for your brand — no recycled templates, no design limitations.",
    "Shopify Plus implementation":
      "Advanced checkout customization, multi-currency, and B2B/wholesale setup for high-volume brands.",
    "Performance optimization":
      "Optimized images, code, and assets for faster load times and better Core Web Vitals scores.",
    "Mobile-first responsive design":
      "Every layout designed mobile-first, since most Shopify shoppers browse and buy on their phones.",
    "Third-party integrations":
      "Connect your store to Klaviyo, ERP, CRM, and other tools your business already runs on.",
    "Payment gateway setup":
      "Secure, PCI-compliant payment setup supporting the gateways your customers actually want to use.",
    "Inventory management":
      "Real-time inventory tracking and sync across sales channels, so you never oversell.",
    "Multi-currency support":
      "Sell in multiple currencies and languages to reach international customers without extra apps.",
  },

  "shopify-app-development": {
    "Custom app development":
      "A fully custom Shopify app built around your exact business logic — not a generic plugin forced to fit.",
    "API integrations":
      "Connect Shopify to your CRM, ERP, fulfillment, or any external system through secure, reliable API integrations.",
    "Webhook implementations":
      "Real-time webhook triggers that react instantly to orders, inventory changes, and customer events as they happen.",
    "Admin panel customization":
      "Custom admin dashboards and controls that let your team manage the app exactly the way you work — no extra clicks.",
    "Third-party app setup":
      "Expert setup and configuration of third-party Shopify apps, so every integration works correctly from day one.",
    "Automation workflows":
      "Automate repetitive tasks — order tagging, inventory updates, notifications — so your team can focus on growth, not busywork.",
    "Data synchronization":
      "Keep product, inventory, and customer data synced accurately across Shopify and every connected platform.",
    "Ongoing maintenance":
      "Continued monitoring, updates, and bug fixes after launch, so your custom app stays reliable as Shopify and your business evolve.",
  },

  "shopify-store-migration": {
    "WooCommerce migration":
      "Full migration of products, orders, and customer data from WooCommerce to Shopify — no manual re-entry, no lost history.",
    "Magento migration":
      "We handle complex Magento catalogs, custom attributes, and multi-store setups with a clean, complete move to Shopify.",
    "BigCommerce migration":
      "Migrate your full BigCommerce catalog, customer accounts, and order history to Shopify without disrupting live sales.",
    "Wix and Squarespace migration":
      "Move beyond website-builder limitations with a full migration to Shopify's ecommerce-first platform — built to scale.",
    "Product and customer migration":
      "Every product, variant, image, customer profile, and order record transferred accurately — nothing left behind.",
    "SEO preservation":
      "We preserve your existing SEO value — meta data, URL structure, and content — so your rankings don't take a hit post-migration.",
    "Redirect implementation":
      "Complete 301 redirect mapping from old URLs to new ones, protecting your rankings and eliminating 404 errors.",
    "Post-migration testing":
      "Thorough testing of every page, product, and checkout flow after launch to confirm nothing broke in the move.",
  },

  "custom-business-websites": {
    "Custom website development":
      "A fully custom-built website designed around your business — no page-builder templates or generic layouts.",
    "CMS implementation":
      "A content management system set up so your team can update pages, text, and images without touching code.",
    "Mobile-first design":
      "Every layout designed mobile-first, since most visitors will find and browse your site on a phone.",
    "SEO-friendly structure":
      "Clean site architecture, proper heading structure, and technical SEO foundations built in from day one.",
    "Lead generation forms":
      "Strategically placed contact and lead forms designed to convert visitors into inquiries, not just page views.",
    "Performance optimization":
      "Optimized code and assets for fast load times — because slow sites lose visitors before they even see your content.",
    Integrations:
      "Connect your website to the CRM, email marketing, and business tools you already use, so nothing runs in silos.",
    "Ongoing support":
      "Continued support after launch — updates, fixes, and improvements — so your site keeps working as your business grows.",
  },

  "web-application-development": {
    "Custom web applications":
      "Fully custom web applications built around how your business actually operates — not adapted from a generic template.",
    "Client portals":
      "Secure, branded portals where your clients can log in, view information, and interact with your business directly.",
    "Admin dashboards":
      "Custom dashboards that bring your key data and controls into one place, so your team can manage operations without digging through spreadsheets.",
    "Booking systems":
      "Custom booking and scheduling systems built around your services, availability, and customer flow.",
    "CRM development":
      "A custom CRM built around how your team actually sells and manages relationships — not a generic tool you have to work around.",
    "API integrations":
      "Connect your application to the external tools and services your business depends on through secure, reliable API integrations.",
    "Database architecture":
      "Well-structured, scalable database design that keeps your data organized and performant as your application grows.",
    "Ongoing maintenance":
      "Continued monitoring, updates, and fixes after launch, so your application stays reliable and secure as your business evolves.",
  },

  "shopify-store-redesign": {
    "Store redesign strategy":
      "A clear redesign strategy based on your audit findings — so every design decision is tied to a real conversion goal, not guesswork.",
    "User experience improvements":
      "Streamlined navigation and page flows that reduce friction and make it easier for customers to find products and complete purchases.",
    "Modern visual design":
      "A refreshed visual identity that feels current and on-brand, without chasing short-lived design trends that date quickly.",
    "Navigation optimization":
      "Simplified menus and category structure so customers can find what they're looking for in fewer clicks, not more.",
    "Mobile optimization":
      "A mobile-first redesign, since most of your traffic and sales likely come from phones, not desktop.",
    "Theme upgrades":
      "Upgrade from outdated or unsupported themes to a current, actively maintained foundation built for Shopify's latest features.",
    "Conversion-focused layouts":
      "Product and collection pages laid out around proven conversion principles — clear CTAs, trust signals, and reduced friction at checkout.",
    "Performance improvements":
      "Faster load times on the pages that matter most — product, collection, and checkout — where speed has the biggest impact on conversion.",
  },

  "shopify-speed-optimization": {
    "Core Web Vitals optimization":
      "Optimize for Google's Core Web Vitals — LCP, CLS, and INP — improving both user experience and your store's search ranking potential.",
    "Code optimization":
      "Clean up bloated Liquid code, remove unused CSS and JavaScript, and streamline your theme's codebase for faster rendering.",
    "Image optimization":
      "Compress and properly size every image on your store, cutting load time significantly without sacrificing visual quality.",
    "Script optimization":
      "Identify and remove unnecessary or duplicate scripts, and defer non-critical ones, so your pages render faster.",
    "App performance audit":
      "Audit every installed app for its impact on load time — since apps are one of the most common hidden causes of a slow Shopify store.",
    "Lazy loading implementation":
      "Implement lazy loading so images and content below the fold load only when needed, speeding up initial page render.",
    "Theme optimization":
      "Streamline your theme's structure and remove unused code and features that are quietly slowing your store down.",
    "Speed reporting":
      "A clear before-and-after performance report with real metrics, so you can see the exact impact of the optimization work.",
  },

  "shopify-conversion-audit": {
    "UX audit":
      "A full walkthrough of your store from a first-time visitor's perspective, identifying friction, confusion, and anything slowing down the path to purchase.",
    "Checkout analysis":
      "A detailed look at your checkout flow to find exactly where and why customers abandon their cart before completing a purchase.",
    "Funnel analysis":
      "A step-by-step breakdown of your buying funnel, from landing page to order confirmation, showing where visitors lose momentum.",
    "Heatmap review":
      "Analysis of real user behavior — where visitors click, scroll, and hesitate — to reveal what's working and what's being ignored.",
    "Analytics review":
      "A deep dive into your store's analytics to separate real conversion problems from noise, backed by actual visitor data.",
    "Mobile experience audit":
      "A dedicated mobile review, since most Shopify traffic is mobile — checking for the friction points unique to smaller screens.",
    "Prioritized recommendations":
      "Every finding ranked by expected impact, so you can act on the highest-value fixes first instead of guessing where to start.",
    "Conversion roadmap":
      "A clear, actionable roadmap you can hand to your own team or use with us to implement — no generic advice, just specific next steps.",
  },

  "ui-ux-design": {
    "User experience research":
      "We study how your specific customers browse, compare, and buy — so design decisions are based on evidence, not assumptions.",
    "Conversion rate optimization":
      "Layout and flow decisions made to turn more of your existing visitors into buyers, without needing to spend more on traffic.",
    "Brand identity design":
      "A visual identity — color, type, tone — built to hold up as your store grows, not just look good on launch day.",
    "Wireframing and prototyping":
      "Clickable prototypes of key pages so you can react to the real flow before a single line of code gets written.",
    "A/B testing design":
      "Alternate versions of key pages designed specifically to be tested against each other, not just styled differently.",
    "Accessibility compliance":
      "Design that works for people using screen readers, keyboard navigation, or assistive tech — not an afterthought bolted on later.",
    "Visual design systems":
      "A reusable set of components and styles so every new page you add matches, without redesigning from scratch each time.",
    "Interactive animations":
      "Micro-interactions that guide attention and signal feedback — not motion for its own sake.",
  },

  "ecommerce-seo": {
    "Technical SEO audit":
      "A full crawl of your store to catch indexing errors, broken links, and structural issues that keep Google from ranking pages it should.",
    "Keyword research and strategy":
      "We identify the exact terms your buyers search — not just high-volume keywords, but ones that actually lead to a sale.",
    "On-page optimization":
      "Titles, headers, meta descriptions, and internal links tuned on every key page so none of them are dead weight in search.",
    "Site speed optimization":
      "Faster load times on the pages that matter most — because slow pages lose both rankings and buyers before they see your products.",
    "Schema markup":
      "Structured data added so your products can show star ratings, price, and stock status directly in search results.",
    "Content optimization":
      "Product and category copy rewritten to rank for the terms buyers use, without turning into keyword-stuffed filler.",
    "Local SEO setup":
      "Google Business Profile and local signals optimized so nearby buyers find you before they find a competitor.",
    "Monthly reporting":
      "A clear monthly breakdown of rankings, traffic, and what we're working on next — no jargon, no guessing where your budget went.",
  },

  "ecommerce-growth-cro": {
    "Conversion audits":
      "Regular check-ins on your funnel to catch new friction as your store, traffic, and products change over time.",
    "Growth roadmap":
      "A living, prioritized list of what to test next — updated as we learn, not a static plan set once and forgotten.",
    "A/B and split testing":
      "Controlled experiments on real traffic so changes are proven to work before they become permanent.",
    "Landing page optimization":
      "Pages built around a single goal — signup, purchase, download — stripped of anything that competes with it.",
    "Customer journey optimization":
      "Friction reduced at every step from first visit to repeat purchase, not just the pages that get the most traffic.",
    "Cart abandonment optimization":
      "Fixes and flows aimed at the point where most stores lose the most revenue — the cart and checkout.",
    "Revenue tracking":
      "Every test tied to actual revenue impact, not vanity metrics like clicks or time on page.",
    "Monthly performance reporting":
      "A plain-language monthly report on what moved, what we're testing next, and why — no dashboard required.",
  },

  "digital-marketing": {
    "Google Ads":
      "Campaigns built to catch buyers already searching for what you sell — Search, Shopping, and Performance Max, managed and refined weekly.",
    "Meta Ads":
      "Facebook and Instagram campaigns targeting the customers most likely to convert, not just the broadest possible audience.",
    "Email marketing":
      "Flows and campaigns that turn existing customers into repeat buyers — abandoned cart, post-purchase, and win-back sequences included.",
    "Marketing automation":
      "Triggered messages based on customer behavior, so the right offer reaches the right person without manual work on your end.",
    "Content strategy":
      "A content calendar tied to what your customers are actually searching for and responding to — not just a posting schedule.",
    "Analytics and reporting":
      "Clear reporting on what's driving revenue by channel, so budget decisions are based on data, not guesswork.",
    "Audience targeting":
      "Audiences built from real purchase behavior and intent signals, so ad spend reaches people likely to buy, not just likely to click.",
    "Campaign optimization":
      "Ongoing testing and adjustment of creative, targeting, and bids, so performance improves round over round instead of plateauing.",
  },

  "ecommerce-management": {
    "Dedicated project manager":
      "One person who knows your store and coordinates every task across design, marketing, and development — no re-explaining your business to a new specialist each time.",
    "Theme customization":
      "Ongoing adjustments to your store's design as your brand and catalog evolve — not a one-time build you're stuck with.",
    "Email marketing with Klaviyo":
      "Abandoned cart, post-purchase, and win-back flows built and maintained in Klaviyo to keep revenue coming from customers you already have.",
    "UI/UX support":
      "Design changes and fixes handled as they come up, without needing to scope and hire for a separate project every time.",
    "Customer acquisition tracking":
      "Clear visibility into which channels are actually bringing in paying customers, so spend goes where it's earning.",
    "A/B testing":
      "Ongoing tests on key pages so changes are proven before they become permanent, not just a hunch.",
    "Store updates":
      "Regular updates to apps, themes, and store settings so nothing breaks quietly or falls out of date.",
    "Performance monitoring":
      "Continuous tracking of speed and uptime so issues are caught and fixed before they cost you sales.",
  },

  "branding-visual-identity": {
    "Logo design":
      "A custom logo built around your brand's story — distinctive enough to recognize instantly, and flexible enough to work at any size.",
    "Brand identity systems":
      "A complete visual system — logo, color, type, and imagery — designed to work together across every touchpoint, not just your website.",
    "Brand guidelines":
      "A reference document that shows exactly how your brand should look and sound, so anyone on your team (or any freelancer) gets it right.",
    "Typography and color systems":
      "Defined fonts, colors, and usage rules — so your brand never looks slightly “off” depending on who's designing it.",
    "Marketing collateral":
      "Templates and assets for the marketing materials you actually use — from email headers to ad creative — all matching your new identity.",
    "Social media branding":
      "Profile, cover, and post templates designed to keep your brand recognizable across Instagram, TikTok, and wherever else you show up.",
    "Packaging design":
      "Packaging that reflects your brand identity and gives customers a reason to post their unboxing — not just a box, but part of the experience.",
    "Brand refresh":
      "For brands that need an update, not a reinvention — we modernize what's not working while keeping the recognition you've already built.",
  },

  "ai-business-automation": {
    "AI chatbots":
      "A chatbot trained on your business that answers customer questions instantly — day or night — without pulling your team away from other work.",
    "Workflow automation":
      "We connect your tools and automate the repetitive steps between them, so tasks that used to need a person now just happen.",
    "CRM automation":
      "Automated lead follow-ups, status updates, and reminders inside your CRM — so nothing slips through the cracks because someone forgot.",
    "Business process automation":
      "We identify and automate the manual processes eating into your team's week, freeing up hours for work that actually needs a human.",
    "API integrations":
      "We connect the tools you already use so data flows between them automatically, instead of someone copying and pasting between apps.",
    "AI assistants":
      "A custom AI assistant that handles routine requests, questions, or tasks — giving your team an always-on layer of support.",
    "Reporting dashboards":
      "Live dashboards that pull your data automatically, so you always have current numbers without building a report by hand.",
    "Ongoing optimization":
      "We continue monitoring and improving your automations after launch, so they keep getting more useful as your business changes.",
  },
};

/** Icon + note for a bullet, preferring this service's own copy. */
export function bulletCopy(
  slug: string,
  label: string,
): { note: string; icon: IconName } | undefined {
  const meta = bulletMeta[label];
  if (!meta) return undefined;
  return {
    icon: meta.icon,
    note: serviceBulletNotes[slug]?.[label] ?? meta.note,
  };
}
