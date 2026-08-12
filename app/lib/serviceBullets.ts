/**
 * "What's included" card content.
 *
 * `serviceDetails[].bullets` are plain labels, and the same label recurs across
 * services (120 bullets, 116 unique). Keying the note + icon off the label here
 * — rather than duplicating them per service — keeps a shared bullet like
 * "API integrations" reading identically wherever it appears.
 *
 * Anything missing from this map falls back to the label alone, so adding a new
 * bullet to a service never breaks the card grid.
 */
export type BulletMeta = { note: string; icon: IconName };

export type IconName =
  | "box"
  | "calendar"
  | "card"
  | "cart"
  | "chart"
  | "code"
  | "database"
  | "file"
  | "gauge"
  | "globe"
  | "image"
  | "layout"
  | "link"
  | "mail"
  | "megaphone"
  | "mobile"
  | "palette"
  | "plug"
  | "refresh"
  | "search"
  | "shield"
  | "store"
  | "target"
  | "users"
  | "wrench"
  | "zap";

export const bulletMeta: Record<string, BulletMeta> = {
  "A/B and split testing": { note: "Test, learn, repeat.", icon: "target" },
  "A/B testing": { note: "Data over guesswork.", icon: "target" },
  "A/B testing design": { note: "Variants built to win.", icon: "target" },
  "AI assistants": { note: "Support that never sleeps.", icon: "zap" },
  "AI chatbots": { note: "Instant answers, any hour.", icon: "zap" },
  "API integrations": { note: "Your tools, connected.", icon: "plug" },
  "Accessibility compliance": { note: "Usable by everyone.", icon: "users" },
  "Admin dashboards": { note: "Your data at a glance.", icon: "chart" },
  "Admin panel customization": { note: "Built around your workflow.", icon: "code" },
  "Analytics and reporting": { note: "Numbers you can act on.", icon: "chart" },
  "Analytics review": { note: "What the data really says.", icon: "chart" },
  "App performance audit": { note: "Find what's slowing you.", icon: "gauge" },
  "Audience targeting": { note: "Reach the right buyers.", icon: "target" },
  "Automation workflows": { note: "Less manual, more done.", icon: "zap" },
  "BigCommerce migration": { note: "Moved without the mess.", icon: "refresh" },
  "Booking systems": { note: "Appointments, handled.", icon: "calendar" },
  "Brand guidelines": { note: "One consistent voice.", icon: "file" },
  "Brand identity design": { note: "A look that lasts.", icon: "palette" },
  "Brand identity systems": { note: "Consistent everywhere.", icon: "palette" },
  "Brand refresh": { note: "Modern, without losing you.", icon: "palette" },
  "Business process automation": { note: "Hours back every week.", icon: "zap" },
  "CMS implementation": { note: "Edit without a developer.", icon: "file" },
  "CRM automation": { note: "Follow-ups on autopilot.", icon: "zap" },
  "CRM development": { note: "Customer data in one place.", icon: "users" },
  "Campaign optimization": { note: "Better results each round.", icon: "megaphone" },
  "Cart abandonment optimization": { note: "Win back lost carts.", icon: "cart" },
  "Checkout analysis": { note: "Where buyers drop off.", icon: "cart" },
  "Client portals": { note: "A private space for clients.", icon: "users" },
  "Code optimization": { note: "Leaner, faster code.", icon: "code" },
  "Content optimization": { note: "Words that rank and sell.", icon: "file" },
  "Content strategy": { note: "A plan, not just posts.", icon: "file" },
  "Conversion audits": { note: "Find the friction.", icon: "target" },
  "Conversion rate optimization": { note: "More sales, same traffic.", icon: "target" },
  "Conversion roadmap": { note: "Prioritized, not vague.", icon: "target" },
  "Conversion-focused layouts": { note: "Designed to sell.", icon: "layout" },
  "Core Web Vitals optimization": { note: "Google-grade performance.", icon: "gauge" },
  "Custom app development": { note: "Built for your workflow.", icon: "plug" },
  "Custom theme development": { note: "Bespoke design and code.", icon: "code" },
  "Custom web applications": { note: "Software that fits you.", icon: "code" },
  "Custom website development": { note: "Built from scratch.", icon: "code" },
  "Customer acquisition tracking": { note: "Know what's working.", icon: "chart" },
  "Customer journey optimization": { note: "Smoother, start to finish.", icon: "target" },
  "Data synchronization": { note: "Always in sync.", icon: "refresh" },
  "Database architecture": { note: "Structured to scale.", icon: "database" },
  "Dedicated project manager": { note: "One point of contact.", icon: "users" },
  "Email marketing": { note: "Revenue on repeat.", icon: "mail" },
  "Email marketing with Klaviyo": { note: "Flows that convert.", icon: "mail" },
  "Funnel analysis": { note: "See every step.", icon: "chart" },
  "Google Ads": { note: "Search intent, captured.", icon: "megaphone" },
  "Growth roadmap": { note: "A clear path forward.", icon: "target" },
  "Heatmap review": { note: "See what they click.", icon: "search" },
  "Image optimization": { note: "Sharp, and still fast.", icon: "image" },
  Integrations: { note: "Everything talks to everything.", icon: "plug" },
  "Interactive animations": { note: "Motion with purpose.", icon: "palette" },
  "Inventory management": { note: "Streamlined tracking.", icon: "box" },
  "Keyword research and strategy": { note: "Target what converts.", icon: "search" },
  "Landing page optimization": { note: "Built for one action.", icon: "layout" },
  "Lazy loading implementation": { note: "Load only what's seen.", icon: "gauge" },
  "Lead generation forms": { note: "Turn visits into leads.", icon: "mail" },
  "Local SEO setup": { note: "Found in your area.", icon: "globe" },
  "Logo design": { note: "A mark worth remembering.", icon: "palette" },
  "Magento migration": { note: "Moved without losing data.", icon: "refresh" },
  "Marketing automation": { note: "Right message, right time.", icon: "zap" },
  "Marketing collateral": { note: "On-brand, everywhere.", icon: "file" },
  "Meta Ads": { note: "Reach them where they scroll.", icon: "megaphone" },
  "Mobile experience audit": { note: "Where mobile loses sales.", icon: "mobile" },
  "Mobile optimization": { note: "Built for small screens.", icon: "mobile" },
  "Mobile-first design": { note: "Designed for thumbs.", icon: "mobile" },
  "Mobile-first responsive design": { note: "Optimal mobile experience.", icon: "mobile" },
  "Modern visual design": { note: "Current, not trendy.", icon: "palette" },
  "Monthly performance reporting": { note: "Progress you can see.", icon: "chart" },
  "Monthly reporting": { note: "No surprises.", icon: "chart" },
  "Multi-currency support": { note: "Global reach.", icon: "globe" },
  "Navigation optimization": { note: "Find it in one click.", icon: "layout" },
  "On-page optimization": { note: "Every page pulling weight.", icon: "search" },
  "Ongoing maintenance": { note: "We keep it running.", icon: "wrench" },
  "Ongoing optimization": { note: "Never done improving.", icon: "refresh" },
  "Ongoing support": { note: "Still here after launch.", icon: "wrench" },
  "Packaging design": { note: "Unboxing worth sharing.", icon: "box" },
  "Payment gateway setup": { note: "Secure transactions.", icon: "card" },
  "Performance improvements": { note: "Faster where it counts.", icon: "gauge" },
  "Performance monitoring": { note: "Problems caught early.", icon: "gauge" },
  "Performance optimization": { note: "Faster load times.", icon: "gauge" },
  "Post-migration testing": { note: "Nothing left broken.", icon: "shield" },
  "Prioritized recommendations": { note: "Biggest wins first.", icon: "target" },
  "Product and customer migration": { note: "Every record moved.", icon: "refresh" },
  "Redirect implementation": { note: "No broken links.", icon: "link" },
  "Reporting dashboards": { note: "Your numbers, live.", icon: "chart" },
  "Revenue tracking": { note: "Know what earns.", icon: "chart" },
  "SEO preservation": { note: "Rankings survive the move.", icon: "shield" },
  "SEO-friendly structure": { note: "Built for search.", icon: "search" },
  "Schema markup": { note: "Rich results, ready.", icon: "code" },
  "Script optimization": { note: "Cut the dead weight.", icon: "code" },
  "Shopify Plus implementation": { note: "Enterprise solutions.", icon: "store" },
  "Site speed optimization": { note: "Seconds that sell.", icon: "gauge" },
  "Social media branding": { note: "Consistent on every feed.", icon: "palette" },
  "Speed reporting": { note: "Proof it got faster.", icon: "gauge" },
  "Store redesign strategy": { note: "A plan before the pixels.", icon: "layout" },
  "Store updates": { note: "Always current.", icon: "refresh" },
  "Technical SEO audit": { note: "Fix what search sees.", icon: "search" },
  "Theme customization": { note: "Yours, not a template.", icon: "palette" },
  "Theme optimization": { note: "Trimmed and tuned.", icon: "gauge" },
  "Theme upgrades": { note: "Current and supported.", icon: "refresh" },
  "Third-party app setup": { note: "Configured properly.", icon: "plug" },
  "Third-party integrations": { note: "Seamless connectivity.", icon: "plug" },
  "Typography and color systems": { note: "A system, not a guess.", icon: "palette" },
  "UI/UX support": { note: "Design help on tap.", icon: "palette" },
  "UX audit": { note: "See it as they do.", icon: "search" },
  "User experience improvements": { note: "Fewer clicks, more sales.", icon: "target" },
  "User experience research": { note: "Built on real behavior.", icon: "users" },
  "Visual design systems": { note: "Consistent by design.", icon: "palette" },
  "Webhook implementations": { note: "Events, handled live.", icon: "plug" },
  "Wireframing and prototyping": { note: "See it before we build.", icon: "layout" },
  "Wix and Squarespace migration": { note: "Off the builder, onto Shopify.", icon: "refresh" },
  "WooCommerce migration": { note: "WordPress to Shopify, cleanly.", icon: "refresh" },
  "Workflow automation": { note: "Set it, forget it.", icon: "zap" },
};
