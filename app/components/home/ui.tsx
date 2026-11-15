import type { ReactNode } from "react";

/** Small caps label with a lime dot — used above every section title. */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted sm:text-xs ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-accent ring-1 ring-[#141413]/15" />
      {children}
    </span>
  );
}

/** Eyebrow + H2 + intro paragraph, optionally centred. */
export function SectionHead({
  eyebrow,
  title,
  body,
  center = false,
  className = "",
}: {
  eyebrow: string;
  title: string;
  body?: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={`${center ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,3.1rem)] font-semibold leading-[1.06] tracking-tight text-foreground">
        {title}
      </h2>
      {body && (
        <p className={`mt-5 text-base leading-relaxed text-muted sm:text-lg ${center ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
          {body}
        </p>
      )}
    </div>
  );
}

/** Generic phone shell; children fill the screen. */
export function PhoneFrame({
  children,
  className = "",
  notch = true,
}: {
  children: ReactNode;
  className?: string;
  notch?: boolean;
}) {
  return (
    <div
      className={`relative rounded-[2.4rem] bg-[#111] p-[7px] shadow-[0_30px_60px_-20px_rgba(20,20,19,0.35),0_0_0_1px_rgba(255,255,255,0.06)_inset] ${className}`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[1.95rem] bg-white">
        {notch && (
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-2 z-20 h-[18px] w-[34%] -translate-x-1/2 rounded-full bg-[#111]"
          />
        )}
        {children}
      </div>
    </div>
  );
}
