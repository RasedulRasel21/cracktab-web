import Image from "next/image";
import Link from "next/link";
import BookCallButton from "../BookCallButton";
import Accordion from "../Accordion";
import { shopifyApps, appHref, APPS_HUB_PATH } from "../../lib/apps";
import { apps, close, faq, services } from "./content";
import { Eyebrow, SectionHead } from "./ui";

export function HomeApps() {
  return (
    <section className="py-14 sm:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead eyebrow={apps.eyebrow} title={apps.title} body={apps.body} />
          <Link
            href={APPS_HUB_PATH}
            className="inline-flex h-12 shrink-0 items-center justify-center self-start rounded-full border border-foreground px-6 font-display text-sm font-semibold uppercase tracking-wide text-foreground transition-colors hover:bg-foreground hover:text-background lg:self-auto"
          >
            {apps.cta} →
          </Link>
        </div>
        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {shopifyApps.map((app) => {
            const link = appHref(app);
            const inner = (
              <>
                <div className="flex items-center gap-3">
                  <Image src={`/apps/${app.slug}/icon.png`} alt="" width={48} height={48} className="h-12 w-12 rounded-xl" />
                  <span className="rounded-full bg-[var(--cream-2)] px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted">
                    {app.badge}
                  </span>
                </div>
                <p className="mt-5 font-display text-lg font-semibold leading-tight text-foreground">{app.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{app.line}</p>
              </>
            );
            return (
              <li key={app.slug}>
                {link ? (
                  <a
                    href={link.href}
                    {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="block h-full rounded-2xl border border-line bg-surface p-5 transition-all hover:-translate-y-1 hover:border-foreground"
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="h-full rounded-2xl border border-line bg-surface p-5">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function HomeServices() {
  return (
    <section className="py-14 sm:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
        <div className="rounded-[2rem] border border-line bg-surface p-7 sm:p-12">
          <SectionHead eyebrow={services.eyebrow} title={services.title} body={services.body} />
          <ul className="mt-10 flex flex-wrap gap-2.5">
            {services.items.map((s) => (
              <li key={s.label}>
                <Link
                  href={s.href}
                  className="inline-flex items-center rounded-full border border-line bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-foreground"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/services" className="mt-8 inline-flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wide text-foreground underline-offset-4 hover:underline">
            {services.cta} →
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HomeFaqCream() {
  return (
    <section className="py-14 sm:py-24 lg:py-28">
      <div className="mx-auto grid w-full max-w-360 grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,3.1rem)] font-semibold leading-[1.06] tracking-tight text-foreground">
            Questions Before You Book.
          </h2>
        </div>
        <div className="cream-acc">
          <Accordion items={faq} />
        </div>
      </div>
    </section>
  );
}

export function HomeClose() {
  return (
    <section className="px-5 pb-20 sm:px-8 sm:pb-28">
      <div className="relative mx-auto w-full max-w-360 overflow-hidden rounded-[2rem] bg-accent px-7 py-14 text-accent-ink sm:px-14 sm:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/30 blur-3xl" />
        <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70">{close.eyebrow}</span>
            <h2 className="mt-4 font-display text-[clamp(2rem,4.6vw,3.6rem)] font-bold leading-[1.02] tracking-tight">{close.title}</h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed opacity-80 sm:text-lg">{close.body}</p>
          </div>
          <div>
            <p className="text-sm font-semibold">What you&apos;ll leave with:</p>
            <ol className="mt-4 space-y-3">
              {close.leaveWith.map((t, i) => (
                <li key={t} className="flex gap-3 text-sm sm:text-base">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#141413] text-xs font-bold text-accent">
                    {i + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ol>
            <BookCallButton className="mt-8 inline-flex h-13 w-full items-center justify-center rounded-full bg-[#141413] px-8 font-display text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-black sm:w-auto">
              {close.primaryCta}
            </BookCallButton>
          </div>
        </div>
      </div>
    </section>
  );
}
