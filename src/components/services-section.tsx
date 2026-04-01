import type { LucideIcon } from "lucide-react";
import {
  ClipboardList,
  HardHat,
  PanelsTopLeft,
  ShieldCheck,
  Wrench
} from "lucide-react";

import type { ServicesContent } from "@/lib/content";

import { PlaceholderBlock } from "./placeholder-block";

type ServicesSectionProps = {
  section: ServicesContent;
};

function serviceIcon(title: string | null, index: number): LucideIcon {
  const text = (title ?? "").toLowerCase();

  if (text.includes("estimating") || text.includes("budgeting")) {
    return ClipboardList;
  }

  if (text.includes("distribution")) {
    return PanelsTopLeft;
  }

  if (text.includes("security") || text.includes("access")) {
    return ShieldCheck;
  }

  if (text.includes("support") || text.includes("market")) {
    return Wrench;
  }

  const icons = [HardHat, ClipboardList, PanelsTopLeft, ShieldCheck, Wrench];
  return icons[index % icons.length];
}

export function ServicesSection({ section }: ServicesSectionProps) {
  return (
    <section id={section.id} className="surface-panel p-6 sm:p-8 lg:p-12">
      <div className="max-w-3xl space-y-5">
        <div className="flex size-12 items-center justify-center rounded-full bg-brand/10 text-brand">
          <HardHat className="size-5" />
        </div>

        <div className="inline-flex w-fit rounded-full border border-brand/14 bg-brand/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand">
          {section.label}
        </div>

        <h2 className="text-4xl leading-none text-brand sm:text-5xl">{section.label}</h2>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {section.items.map((item, index) => {
          const Icon = serviceIcon(item.title, index);

          return (
            <article
              key={item.id}
              className="rounded-[1.75rem] border border-line/80 bg-canvas/70 p-6 transition-colors duration-200 hover:border-brand/45 hover:bg-panel"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="inline-flex w-fit rounded-full border border-brand/14 bg-panel px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand">
                    {item.label}
                  </div>
                  <div className="flex size-11 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <Icon className="size-5" />
                  </div>
                </div>

                {item.title ? (
                  <h3 className="text-3xl leading-none text-brand">{item.title}</h3>
                ) : null}

                {item.description ? <p className="text-base leading-8">{item.description}</p> : null}

                {item.placeholder ? <PlaceholderBlock caption={item.placeholder} /> : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
