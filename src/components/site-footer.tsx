import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Mail, MapPin, PhoneCall } from "lucide-react";

type NavItem = {
  id: string;
  label: string;
};

type SiteFooterProps = {
  brand: string;
  navItems: NavItem[];
  contactLines: string[];
};

function contactIcon(line: string): LucideIcon {
  if (/@/.test(line)) {
    return Mail;
  }

  if (/\d/.test(line)) {
    return PhoneCall;
  }

  return MapPin;
}

export function SiteFooter({ brand, navItems, contactLines }: SiteFooterProps) {
  const hasNavigation = navItems.length > 0;
  const hasContact = contactLines.length > 0;

  return (
    <footer className="pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={[
            "grid gap-10 overflow-hidden rounded-shell border border-brand-strong/80 bg-brand-strong px-6 py-8 text-panel shadow-card sm:px-8 lg:px-12 lg:py-10",
            hasNavigation || hasContact
              ? "lg:grid-cols-[minmax(0,1.1fr)_minmax(240px,0.8fr)_minmax(280px,0.9fr)]"
              : ""
          ].join(" ")}
        >
          <div className="space-y-2">
            <p className="max-w-[22ch] font-display text-3xl uppercase leading-none tracking-[0.08em] text-panel sm:text-4xl">
              {brand}
            </p>
          </div>

          {navItems.length ? (
            <div className="space-y-3">
              <div className="flex flex-col gap-3">
                {navItems.map((item) => (
                  <Link key={item.id} href={`#${item.id}`} className="footer-link">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          {contactLines.length ? (
            <div className="space-y-3">
              <div className="space-y-3">
                {contactLines.map((line) => {
                  const Icon = contactIcon(line);

                  return (
                    <div
                      key={line}
                      className="flex items-start gap-3 rounded-[1.25rem] border border-panel/15 bg-panel/10 px-4 py-3"
                    >
                      <Icon className="mt-1 size-4 shrink-0 text-highlight" />
                      <p className="text-sm leading-7 text-panel">{line}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
