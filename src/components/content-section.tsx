import type { LucideIcon } from "lucide-react";
import {
  Building2,
  HardHat,
  Mail,
  MapPin,
  PackageSearch,
  PanelsTopLeft,
  PhoneCall,
  Quote,
  ShieldCheck,
  Warehouse
} from "lucide-react";

import type { ContentBlock, SiteSection } from "@/lib/content";

import { PlaceholderBlock } from "./placeholder-block";

type ContentSectionProps = {
  section: SiteSection;
};

function sectionIcon(section: SiteSection): LucideIcon {
  const label = `${section.heading ?? ""} ${section.sourceLines.join(" ")}`.toLowerCase();

  if (/\b(material|product|supply|supplies|inventory)\b/.test(label)) {
    return Warehouse;
  }

  if (/\b(door|frame|glass|window|opening|interior)\b/.test(label)) {
    return PanelsTopLeft;
  }

  if (/\b(safety|compliance|reliable|reliability|quality)\b/.test(label)) {
    return ShieldCheck;
  }

  if (section.kind === "services") {
    return HardHat;
  }

  if (section.kind === "testimonials") {
    return Quote;
  }

  if (section.kind === "contact") {
    return PhoneCall;
  }

  return Building2;
}

function itemIcon(item: string, index: number): LucideIcon {
  const text = item.toLowerCase();

  if (/\b(material|product|supply|supplies|inventory)\b/.test(text)) {
    return Warehouse;
  }

  if (/\b(door|frame|glass|window|opening|interior)\b/.test(text)) {
    return PanelsTopLeft;
  }

  if (/\b(quality|reliable|reliability|support|service)\b/.test(text)) {
    return ShieldCheck;
  }

  const fallbackIcons = [HardHat, PackageSearch, PanelsTopLeft, Warehouse, ShieldCheck];
  return fallbackIcons[index % fallbackIcons.length];
}

function contactIcon(line: string): LucideIcon {
  if (/@/.test(line)) {
    return Mail;
  }

  if (/\d/.test(line)) {
    return PhoneCall;
  }

  return MapPin;
}

function getParagraphs(blocks: ContentBlock[]) {
  return blocks.filter((block): block is Extract<ContentBlock, { type: "paragraph" }> => block.type === "paragraph");
}

function getLists(blocks: ContentBlock[]) {
  return blocks.filter((block): block is Extract<ContentBlock, { type: "list" }> => block.type === "list");
}

function getQuotes(blocks: ContentBlock[]) {
  return blocks.filter((block): block is Extract<ContentBlock, { type: "quote" }> => block.type === "quote");
}

function getPlaceholders(blocks: ContentBlock[]) {
  return blocks.filter(
    (block): block is Extract<ContentBlock, { type: "placeholder" }> => block.type === "placeholder"
  );
}

export function ContentSection({ section }: ContentSectionProps) {
  const Icon = sectionIcon(section);
  const paragraphs = getParagraphs(section.blocks);
  const lists = getLists(section.blocks);
  const quotes = getQuotes(section.blocks);
  const placeholders = getPlaceholders(section.blocks);
  const listItems = lists.flatMap((block) => block.items);

  return (
    <section id={section.id} className="surface-panel p-6 sm:p-8 lg:p-12">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-3xl space-y-5">
          <div className="flex size-12 items-center justify-center rounded-full bg-brand/10 text-brand">
            <Icon className="size-5" />
          </div>

          {section.heading ? (
            <h2 className="text-4xl leading-none text-brand sm:text-5xl">{section.heading}</h2>
          ) : null}

          {paragraphs.length ? (
            <div className="space-y-4">
              {paragraphs.map((block, index) => (
                <p key={`${section.id}-paragraph-${index}`}>{block.text}</p>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {listItems.length ? (
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {listItems.map((item, index) => {
            const ItemIcon = section.kind === "contact" ? contactIcon(item) : itemIcon(item, index);

            return (
              <div
                key={`${section.id}-item-${index}`}
                className="rounded-[1.5rem] border border-line/80 bg-canvas/70 p-5 transition-colors duration-200 hover:border-brand/50 hover:bg-panel"
              >
                <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <ItemIcon className="size-5" />
                </div>
                <p className="text-base leading-7 text-ink">{item}</p>
              </div>
            );
          })}
        </div>
      ) : null}

      {quotes.length ? (
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {quotes.map((quote, index) => (
            <blockquote
              key={`${section.id}-quote-${index}`}
              className="rounded-[1.75rem] border border-line/80 bg-[linear-gradient(180deg,rgba(20,53,82,0.06)_0%,rgba(255,255,255,0.88)_100%)] p-6"
            >
              <Quote className="mb-5 size-7 text-accent" />
              <p className="text-lg leading-8 text-ink">{quote.text}</p>
            </blockquote>
          ))}
        </div>
      ) : null}

      {placeholders.length ? (
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {placeholders.map((placeholder, index) => (
            <PlaceholderBlock
              key={`${section.id}-placeholder-${index}`}
              caption={placeholder.caption}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
