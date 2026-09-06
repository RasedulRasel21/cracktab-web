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
  | "accessibility"
  | "bot"
  | "box"
  | "calendar"
  | "card"
  | "cart"
  | "chart"
  | "chat"
  | "check"
  | "code"
  | "coin"
  | "database"
  | "eye"
  | "file"
  | "flask"
  | "funnel"
  | "gauge"
  | "globe"
  | "grid"
  | "image"
  | "layout"
  | "link"
  | "list"
  | "lock"
  | "mail"
  | "megaphone"
  | "mobile"
  | "palette"
  | "pen"
  | "pin"
  | "plug"
  | "puzzle"
  | "refresh"
  | "route"
  | "scissors"
  | "search"
  | "shield"
  | "store"
  | "tag"
  | "target"
  | "type"
  | "users"
  | "webhook"
  | "wrench"
  | "zap";

export const bulletMeta: Record<string, BulletMeta> = {
  "A/B and split testing": { note: "Test, learn, repeat.", icon: "flask" },
  "A/B testing": { note: "Data over guesswork.", icon: "flask" },
  "A/B testing design": { note: "Variants built to win.", icon: "flask" },
  "AI assistants": { note: "Support that never sleeps.", icon: "bot" },
  "AI chatbots": { note: "Instant answers, any hour.", icon: "chat" },
  "API integrations": { note: "Your tools, connected.", icon: "plug" },
  "Accessibility compliance": { note: "Usable by everyone.", icon: "accessibility" },
  "Admin dashboards": { note: "Your data at a glance.", icon: "chart" },
  "Admin panel customization": { note: "Built around your workflow.", icon: "layout" },
  "Analytics and reporting": { note: "Numbers you can act on.", icon: "chart" },
  "Analytics review": { note: "What the data really says.", icon: "chart" },
  "App performance audit": { note: "Find what's slowing you.", icon: "puzzle" },
  "Audience targeting": { note: "Reach the right buyers.", icon: "target" },
  "Automation workflows": { note: "Less manual, more done.", icon: "zap" },
  "BigCommerce migration": { note: "Moved without the mess.", icon: "cart" },
  "Booking systems": { note: "Appointments, handled.", icon: "calendar" },
  "Brand guidelines": { note: "One consistent voice.", icon: "file" },
  "Brand identity design": { note: "A look that lasts.", icon: "palette" },
  "Brand identity systems": { note: "Consistent everywhere.", icon: "palette" },
  "Brand refresh": { note: "Modern, without losing you.", icon: "refresh" },
  "Business process automation": { note: "Hours back every week.", icon: "refresh" },
  "CMS implementation": { note: "Edit without a developer.", icon: "file" },
  "CRM automation": { note: "Follow-ups on autopilot.", icon: "users" },
  "CRM development": { note: "Customer data in one place.", icon: "users" },
  "Campaign optimization": { note: "Better results each round.", icon: "megaphone" },
  "Cart abandonment optimization": { note: "Win back lost carts.", icon: "cart" },
  "Checkout analysis": { note: "Where buyers drop off.", icon: "cart" },
  "Client portals": { note: "A private space for clients.", icon: "lock" },
  "Code optimization": { note: "Leaner, faster code.", icon: "code" },
  "Content optimization": { note: "Words that rank and sell.", icon: "pen" },
  "Content strategy": { note: "A plan, not just posts.", icon: "calendar" },
  "Conversion audits": { note: "Find the friction.", icon: "search" },
  "Conversion rate optimization": { note: "More sales, same traffic.", icon: "target" },
  "Conversion roadmap": { note: "Prioritized, not vague.", icon: "target" },
  "Conversion-focused layouts": { note: "Designed to sell.", icon: "layout" },
  "Core Web Vitals optimization": { note: "Google-grade performance.", icon: "gauge" },
  "Custom app development": { note: "Built for your workflow.", icon: "code" },
  "Custom theme development": { note: "Bespoke design and code.", icon: "code" },
  "Custom web applications": { note: "Software that fits you.", icon: "code" },
  "Custom website development": { note: "Built from scratch.", icon: "code" },
  "Customer acquisition tracking": { note: "Know what's working.", icon: "chart" },
  "Customer journey optimization": { note: "Smoother, start to finish.", icon: "route" },
  "Data synchronization": { note: "Always in sync.", icon: "refresh" },
  "Database architecture": { note: "Structured to scale.", icon: "database" },
  "Dedicated project manager": { note: "One point of contact.", icon: "users" },
  "Email marketing": { note: "Revenue on repeat.", icon: "mail" },
  "Email marketing with Klaviyo": { note: "Flows that convert.", icon: "mail" },
  "Funnel analysis": { note: "See every step.", icon: "funnel" },
  "Google Ads": { note: "Search intent, captured.", icon: "search" },
  "Growth roadmap": { note: "A clear path forward.", icon: "list" },
  "Heatmap review": { note: "See what they click.", icon: "eye" },
  "Image optimization": { note: "Sharp, and still fast.", icon: "image" },
  Integrations: { note: "Everything talks to everything.", icon: "plug" },
  "Interactive animations": { note: "Motion with purpose.", icon: "zap" },
  "Inventory management": { note: "Streamlined tracking.", icon: "box" },
  "Keyword research and strategy": { note: "Target what converts.", icon: "tag" },
  "Landing page optimization": { note: "Built for one action.", icon: "layout" },
  "Lazy loading implementation": { note: "Load only what's seen.", icon: "eye" },
  "Lead generation forms": { note: "Turn visits into leads.", icon: "mail" },
  "Local SEO setup": { note: "Found in your area.", icon: "pin" },
  "Logo design": { note: "A mark worth remembering.", icon: "pen" },
  "Magento migration": { note: "Moved without losing data.", icon: "store" },
  "Marketing automation": { note: "Right message, right time.", icon: "zap" },
  "Marketing collateral": { note: "On-brand, everywhere.", icon: "image" },
  "Meta Ads": { note: "Reach them where they scroll.", icon: "users" },
  "Mobile experience audit": { note: "Where mobile loses sales.", icon: "mobile" },
  "Mobile optimization": { note: "Built for small screens.", icon: "mobile" },
  "Mobile-first design": { note: "Designed for thumbs.", icon: "mobile" },
  "Mobile-first responsive design": { note: "Optimal mobile experience.", icon: "mobile" },
  "Modern visual design": { note: "Current, not trendy.", icon: "palette" },
  "Monthly performance reporting": { note: "Progress you can see.", icon: "chart" },
  "Monthly reporting": { note: "No surprises.", icon: "chart" },
  "Multi-currency support": { note: "Global reach.", icon: "globe" },
  "Navigation optimization": { note: "Find it in one click.", icon: "list" },
  "On-page optimization": { note: "Every page pulling weight.", icon: "file" },
  "Ongoing maintenance": { note: "We keep it running.", icon: "wrench" },
  "Ongoing optimization": { note: "Never done improving.", icon: "gauge" },
  "Ongoing support": { note: "Still here after launch.", icon: "wrench" },
  "Packaging design": { note: "Unboxing worth sharing.", icon: "box" },
  "Payment gateway setup": { note: "Secure transactions.", icon: "card" },
  "Performance improvements": { note: "Faster where it counts.", icon: "gauge" },
  "Performance monitoring": { note: "Problems caught early.", icon: "gauge" },
  "Performance optimization": { note: "Faster load times.", icon: "gauge" },
  "Post-migration testing": { note: "Nothing left broken.", icon: "check" },
  "Prioritized recommendations": { note: "Biggest wins first.", icon: "list" },
  "Product and customer migration": { note: "Every record moved.", icon: "database" },
  "Redirect implementation": { note: "No broken links.", icon: "link" },
  "Reporting dashboards": { note: "Your numbers, live.", icon: "chart" },
  "Revenue tracking": { note: "Know what earns.", icon: "coin" },
  "SEO preservation": { note: "Rankings survive the move.", icon: "shield" },
  "SEO-friendly structure": { note: "Built for search.", icon: "search" },
  "Schema markup": { note: "Rich results, ready.", icon: "code" },
  "Script optimization": { note: "Cut the dead weight.", icon: "scissors" },
  "Shopify Plus implementation": { note: "Enterprise solutions.", icon: "store" },
  "Site speed optimization": { note: "Seconds that sell.", icon: "gauge" },
  "Social media branding": { note: "Consistent on every feed.", icon: "users" },
  "Speed reporting": { note: "Proof it got faster.", icon: "chart" },
  "Store redesign strategy": { note: "A plan before the pixels.", icon: "file" },
  "Store updates": { note: "Always current.", icon: "refresh" },
  "Technical SEO audit": { note: "Fix what search sees.", icon: "search" },
  "Theme customization": { note: "Yours, not a template.", icon: "palette" },
  "Theme optimization": { note: "Trimmed and tuned.", icon: "layout" },
  "Theme upgrades": { note: "Current and supported.", icon: "refresh" },
  "Third-party app setup": { note: "Configured properly.", icon: "puzzle" },
  "Third-party integrations": { note: "Seamless connectivity.", icon: "plug" },
  "Typography and color systems": { note: "A system, not a guess.", icon: "type" },
  "UI/UX support": { note: "Design help on tap.", icon: "layout" },
  "UX audit": { note: "See it as they do.", icon: "search" },
  "User experience improvements": { note: "Fewer clicks, more sales.", icon: "target" },
  "User experience research": { note: "Built on real behavior.", icon: "users" },
  "Visual design systems": { note: "Consistent by design.", icon: "grid" },
  "Webhook implementations": { note: "Events, handled live.", icon: "webhook" },
  "Wireframing and prototyping": { note: "See it before we build.", icon: "layout" },
  "Wix and Squarespace migration": { note: "Off the builder, onto Shopify.", icon: "layout" },
  "WooCommerce migration": { note: "WordPress to Shopify, cleanly.", icon: "plug" },
  "Workflow automation": { note: "Set it, forget it.", icon: "zap" },
};
