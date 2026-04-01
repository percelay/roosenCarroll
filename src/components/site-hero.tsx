import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

import type { HeroContent } from "@/lib/content";

import { PlaceholderBlock } from "./placeholder-block";

type SiteHeroProps = {
  hero: HeroContent;
};

export function SiteHero({ hero }: SiteHeroProps) {
  return (
    <section
      id={hero.id}
      className="relative overflow-hidden rounded-shell border border-brand-strong/80 bg-[linear-gradient(135deg,#0b2034_0%,#143552_52%,#1f4a6f_100%)] shadow-card"
    >
      <div className="absolute inset-0 opacity-70">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-highlight/12 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-panel/8 blur-3xl" />
      </div>

      <div className="relative grid gap-10 px-6 py-16 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.42fr)] lg:px-12 lg:py-24">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex w-fit rounded-full border border-panel/20 bg-panel/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-panel">
            {hero.label}
          </div>

          <h1 className="max-w-[15ch] text-5xl leading-none text-panel sm:text-6xl lg:text-7xl">
            {hero.headline}
          </h1>

          {hero.subheadline ? (
            <p className="max-w-2xl text-lg leading-8 text-panel/84 sm:text-xl">
              {hero.subheadline}
            </p>
          ) : null}

          {hero.ctas.length ? (
            <div className="flex flex-wrap gap-3 pt-2">
              {hero.ctas.map((cta) => (
                <Link
                  key={cta.label}
                  href={cta.href}
                  className={cta.tone === "primary" ? "button-primary" : "button-secondary"}
                >
                  {cta.label}
                  {cta.tone === "primary" ? (
                    <ArrowRight className="size-4" />
                  ) : (
                    <ChevronRight className="size-4" />
                  )}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        {hero.placeholder ? (
          <div className="self-end">
            <PlaceholderBlock caption={hero.placeholder} tone="dark" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
