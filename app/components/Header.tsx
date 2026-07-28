"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import MenuPanel from "./MenuPanel";
import { CALENDLY_URL } from "../lib/site";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled
          ? "border-b border-line bg-black/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-360 items-center justify-between gap-2 px-5 sm:h-16 sm:px-8">
        {/* Left — hamburger */}
        <div className="flex flex-1 items-center justify-start">
          <MenuPanel />
        </div>

        {/* Center — logo */}
        <div className="flex shrink-0 items-center justify-center">
          <Logo />
        </div>

        {/* Right — Book a Call */}
        <div className="flex flex-1 items-center justify-end">
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="neon-btn inline-flex h-10 items-center justify-center rounded-full bg-accent px-4 font-display text-xs font-semibold uppercase tracking-wide text-accent-ink transition-colors hover:bg-accent-strong sm:h-11 sm:px-6 sm:text-sm"
          >
            <span className="hidden sm:inline">Book a Call</span>
            <span className="sm:hidden">Book</span>
          </a>
        </div>
      </div>
    </header>
  );
}
