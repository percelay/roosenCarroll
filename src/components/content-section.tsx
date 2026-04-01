import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Mail,
  MapPin,
  MessageSquareQuote,
  PanelsTopLeft,
  PhoneCall
} from "lucide-react";

import { PlaceholderBlock } from "./placeholder-block";

type ContentSectionProps = {
  id: string;
  label: string;
  title?: string | null;
  description: string[];
  placeholders?: string[];
};

function sectionIcon(label: string, title?: string | null): LucideIcon {
  const text = `${label} ${title ?? ""}`.toLowerCase();

  if (text.includes("manufacturer")) {
    return PanelsTopLeft;
  }

  if (text.includes("testimonial")) {
    return MessageSquareQuote;
  }

  if (text.includes("contact")) {
    return PhoneCall;
  }

  return Building2;
}

function placeholderTone(label: string) {
  return label.toLowerCase() === "testimonials" ? "dark" : "light";
}

function paragraphIcon(label: string): LucideIcon {
  const text = label.toLowerCase();

  if (text.includes("contact")) {
    return Mail;
  }

  if (text.includes("location")) {
    return MapPin;
  }

  return Building2;
}

export function ContentSection({
  id,
  label,
  title,
  description,
  placeholders = []
}: ContentSectionProps) {
  const Icon = sectionIcon(label, title);
  const ParagraphIcon = paragraphIcon(label);

  return (
    <section id={id} className="surface-panel p-6 sm:p-8 lg:p-12">
      <div className="max-w-3xl space-y-5">
        <div className="flex size-12 items-center justify-center rounded-full bg-brand/10 text-brand">
          <Icon className="size-5" />
        </div>

        <div className="inline-flex w-fit rounded-full border border-brand/14 bg-brand/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand">
          {label}
        </div>

        {title ? <h2 className="text-4xl leading-none text-brand sm:text-5xl">{title}</h2> : null}

        {description.length ? (
          <div className="space-y-4">
            {description.map((line) => (
              <div key={line} className="flex items-start gap-4">
                <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-canvas text-brand">
                  <ParagraphIcon className="size-4" />
                </div>
                <p className="text-base leading-8">{line}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {placeholders.length ? (
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {placeholders.map((placeholder) => (
            <PlaceholderBlock
              key={placeholder}
              caption={placeholder}
              tone={placeholderTone(label)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
