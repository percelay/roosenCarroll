import Link from "next/link";
import { ArrowRight } from "lucide-react";

type NavItem = {
  id: string;
  label: string;
};

type HeaderCta = {
  href: string;
  label: string;
};

type SiteHeaderProps = {
  brand: string;
  navItems: NavItem[];
  cta?: HeaderCta;
};

export function SiteHeader({ brand, navItems, cta }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="surface-panel flex flex-wrap items-center gap-4 px-4 py-4 sm:px-6">
          <Link href="#top" className="min-w-0 flex-1">
            <span className="block max-w-[16ch] font-display text-2xl uppercase tracking-[0.1em] text-brand sm:text-3xl">
              {brand}
            </span>
          </Link>

          {navItems.length ? (
            <nav aria-label="Primary" className="flex flex-wrap items-center justify-center gap-2">
              {navItems.map((item) => (
                <Link key={item.id} href={`#${item.id}`} className="nav-link">
                  {item.label}
                </Link>
              ))}
            </nav>
          ) : null}

          {cta ? (
            <Link href={cta.href} className="button-primary whitespace-nowrap">
              {cta.label}
              <ArrowRight className="size-4" />
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
