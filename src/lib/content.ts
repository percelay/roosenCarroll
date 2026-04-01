import { readFile } from "fs/promises";
import path from "path";
import { cache } from "react";

export type ContentBlock =
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "list";
      items: string[];
    }
  | {
      type: "quote";
      text: string;
    }
  | {
      type: "placeholder";
      caption: string;
    };

export type SiteSectionKind = "general" | "services" | "testimonials" | "contact";

export type SiteSection = {
  id: string;
  heading: string | null;
  level: number;
  kind: SiteSectionKind;
  blocks: ContentBlock[];
  sourceLines: string[];
};

export type SiteModel = {
  hasContent: boolean;
  title: string | null;
  heroBlocks: ContentBlock[];
  sections: SiteSection[];
  navItems: Array<{
    id: string;
    label: string;
  }>;
  ctas: Array<{
    href: string;
    label: string;
    tone: "primary" | "secondary";
  }>;
  contactLines: string[];
};

type WorkingSection = {
  heading: string | null;
  level: number;
  lines: string[];
};

const CONTENT_FILE = path.join(process.cwd(), "sourcematerial.txt");
const HEADING_RE = /^(#{1,6})\s+(.+)$/;
const LIST_RE = /^([-*•]|\d+\.)\s+(.+)$/;
const QUOTE_RE = /^>\s+(.+)$/;
const PLACEHOLDER_RE =
  /^(?:\[(?:[^\]]*\b(?:image|photo|visual|placeholder|rendering)\b[^\]]*)\]|(?:image|photo|visual|placeholder|rendering)\s*:.*)$/i;
const EMAIL_RE = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const PHONE_RE = /\b(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}\b/;
const ADDRESS_RE =
  /\b\d{1,6}\s+[A-Za-z0-9.'-]+(?:\s+[A-Za-z0-9.'-]+){0,5}\s(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Court|Ct|Boulevard|Blvd|Way|Parkway|Pkwy)\b/i;

function slugify(input: string, fallback: string) {
  const slug = input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || fallback;
}

function dedupe<T>(items: T[]) {
  return Array.from(new Set(items));
}

function isContactLine(line: string) {
  return EMAIL_RE.test(line) || PHONE_RE.test(line) || ADDRESS_RE.test(line);
}

function isMeaningfulLine(line: string) {
  return line.trim().length > 0;
}

function parseBlocks(lines: string[]): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  let paragraphBuffer: string[] = [];
  let listBuffer: string[] = [];
  let quoteBuffer: string[] = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length) {
      blocks.push({
        type: "paragraph",
        text: paragraphBuffer.join(" ")
      });
      paragraphBuffer = [];
    }
  };

  const flushList = () => {
    if (listBuffer.length) {
      blocks.push({
        type: "list",
        items: [...listBuffer]
      });
      listBuffer = [];
    }
  };

  const flushQuote = () => {
    if (quoteBuffer.length) {
      blocks.push({
        type: "quote",
        text: quoteBuffer.join(" ")
      });
      quoteBuffer = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      flushQuote();
      continue;
    }

    if (PLACEHOLDER_RE.test(trimmed)) {
      flushParagraph();
      flushList();
      flushQuote();

      blocks.push({
        type: "placeholder",
        caption: trimmed.replace(/^\[|\]$/g, "")
      });

      continue;
    }

    const listMatch = trimmed.match(LIST_RE);

    if (listMatch) {
      flushParagraph();
      flushQuote();
      listBuffer.push(listMatch[2].trim());
      continue;
    }

    const quoteMatch = trimmed.match(QUOTE_RE);

    if (quoteMatch) {
      flushParagraph();
      flushList();
      quoteBuffer.push(quoteMatch[1].trim());
      continue;
    }

    flushList();
    flushQuote();
    paragraphBuffer.push(trimmed);
  }

  flushParagraph();
  flushList();
  flushQuote();

  return blocks;
}

function buildSections(rawSections: WorkingSection[]) {
  const usedIds = new Map<string, number>();

  return rawSections
    .filter((section) => section.heading || section.lines.some(isMeaningfulLine))
    .map((section, index) => {
      const sourceLabel = section.heading ?? `section-${index + 1}`;
      const baseId = slugify(sourceLabel, `section-${index + 1}`);
      const seenCount = usedIds.get(baseId) ?? 0;
      usedIds.set(baseId, seenCount + 1);
      const id = seenCount ? `${baseId}-${seenCount + 1}` : baseId;

      return {
        id,
        heading: section.heading,
        level: section.level,
        sourceLines: section.lines.filter(isMeaningfulLine),
        blocks: parseBlocks(section.lines)
      };
    });
}

function classifySection(section: Omit<SiteSection, "kind">): SiteSectionKind {
  const heading = (section.heading ?? "").toLowerCase();
  const combinedText = section.sourceLines.join(" ").toLowerCase();
  const hasQuotes = section.blocks.some((block) => block.type === "quote");
  const listItemCount = section.blocks
    .filter((block): block is Extract<ContentBlock, { type: "list" }> => block.type === "list")
    .reduce((total, block) => total + block.items.length, 0);

  if (
    /\b(testimonial|testimonials|review|reviews|client|clients)\b/.test(heading) ||
    hasQuotes
  ) {
    return "testimonials";
  }

  if (
    /\b(contact|reach|connect|location|locations)\b/.test(heading) ||
    section.sourceLines.some(isContactLine)
  ) {
    return "contact";
  }

  if (
    /\b(service|services|solutions|products|materials|capabilities|capability|specialties|specialty|offerings|expertise|what we do)\b/.test(
      heading
    ) ||
    (listItemCount >= 3 && !/\b(testimonial|review|contact)\b/.test(combinedText))
  ) {
    return "services";
  }

  return "general";
}

function extractContactLines(sections: SiteSection[]) {
  const prioritized = sections.flatMap((section) => {
    if (section.kind !== "contact") {
      return [];
    }

    return section.blocks.flatMap((block) => {
      if (block.type === "paragraph") {
        return [block.text];
      }

      if (block.type === "list") {
        return block.items;
      }

      return [];
    });
  });

  if (prioritized.length) {
    return dedupe(prioritized);
  }

  return dedupe(
    sections.flatMap((section) =>
      section.sourceLines.filter((line) => isContactLine(line.trim()))
    )
  );
}

function deriveSiteModel(raw: string): SiteModel {
  const trimmed = raw.replace(/\r\n?/g, "\n").trim();

  if (!trimmed) {
    return {
      hasContent: false,
      title: null,
      heroBlocks: [],
      sections: [],
      navItems: [],
      ctas: [],
      contactLines: []
    };
  }

  const lines = trimmed.split("\n");
  const containsMarkdownHeadings = lines.some((line) => HEADING_RE.test(line.trim()));

  if (!containsMarkdownHeadings) {
    const nonEmptyLines = lines.map((line) => line.trim()).filter(Boolean);
    const title = nonEmptyLines[0] ?? null;
    const heroBlocks = parseBlocks(lines.slice(1));

    return {
      hasContent: Boolean(title || heroBlocks.length),
      title,
      heroBlocks,
      sections: [],
      navItems: [],
      ctas: [],
      contactLines: heroBlocks.flatMap((block) => {
        if (block.type === "list") {
          return block.items.filter(isContactLine);
        }

        if (block.type === "paragraph" && isContactLine(block.text)) {
          return [block.text];
        }

        return [];
      })
    };
  }

  const stagedSections: WorkingSection[] = [];
  let current: WorkingSection = {
    heading: null,
    level: 0,
    lines: []
  };

  for (const line of lines) {
    const trimmedLine = line.trim();
    const headingMatch = trimmedLine.match(HEADING_RE);

    if (headingMatch) {
      if (current.heading || current.lines.some(isMeaningfulLine)) {
        stagedSections.push(current);
      }

      current = {
        heading: headingMatch[2].trim(),
        level: headingMatch[1].length,
        lines: []
      };

      continue;
    }

    current.lines.push(line);
  }

  if (current.heading || current.lines.some(isMeaningfulLine)) {
    stagedSections.push(current);
  }

  const leadSection =
    stagedSections[0] && stagedSections[0].heading === null ? stagedSections[0] : null;
  const headedSections = buildSections(stagedSections.filter((section) => section.heading !== null));
  const heroSection = headedSections[0] ?? null;
  const title = heroSection?.heading ?? null;
  const heroBlocks = [
    ...(leadSection ? parseBlocks(leadSection.lines) : []),
    ...(heroSection ? heroSection.blocks : [])
  ];
  const bodySections = headedSections
    .slice(heroSection ? 1 : 0)
    .map((section) => ({
      ...section,
      kind: classifySection(section)
    }));
  const navItems = bodySections
    .filter((section) => section.heading)
    .map((section) => ({
      id: section.id,
      label: section.heading as string
    }));
  const primaryTarget =
    bodySections.find((section) => section.kind === "services" && section.heading) ??
    bodySections.find((section) => section.heading);
  const secondaryTarget =
    bodySections.find(
      (section) => section.kind === "contact" && section.heading && section.id !== primaryTarget?.id
    ) ??
    bodySections.find((section) => section.heading && section.id !== primaryTarget?.id);
  const ctas: SiteModel["ctas"] = [];

  if (primaryTarget?.heading) {
    ctas.push({
      href: `#${primaryTarget.id}`,
      label: primaryTarget.heading,
      tone: "primary"
    });
  }

  if (secondaryTarget?.heading) {
    ctas.push({
      href: `#${secondaryTarget.id}`,
      label: secondaryTarget.heading,
      tone: "secondary"
    });
  }

  return {
    hasContent: Boolean(title || heroBlocks.length || bodySections.length),
    title,
    heroBlocks,
    sections: bodySections,
    navItems,
    ctas,
    contactLines: extractContactLines(bodySections)
  };
}

export const getSiteModel = cache(async () => {
  const raw = await readFile(CONTENT_FILE, "utf8");
  return deriveSiteModel(raw);
});
