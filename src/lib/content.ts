import { readFile } from "fs/promises";
import path from "path";
import { cache } from "react";

export type NavItem = {
  id: string;
  label: string;
};

export type HeroCta = {
  href: string;
  label: string;
  tone: "primary" | "secondary";
};

export type HeroContent = {
  id: "hero";
  label: string;
  headline: string;
  subheadline: string | null;
  primaryCta: string | null;
  secondaryCta: string | null;
  placeholder: string | null;
  ctas: HeroCta[];
};

export type AboutContent = {
  id: "about";
  label: string;
  paragraphs: string[];
};

export type ServiceItem = {
  id: string;
  label: string;
  title: string | null;
  description: string | null;
  placeholder: string | null;
};

export type ServicesContent = {
  id: "services";
  label: string;
  items: ServiceItem[];
};

export type DetailContent = {
  id: string;
  label: string;
  title: string | null;
  description: string[];
  placeholders: string[];
};

export type SiteModel = {
  hasContent: boolean;
  brand: string | null;
  hero: HeroContent | null;
  about: AboutContent | null;
  services: ServicesContent | null;
  manufacturers: DetailContent | null;
  testimonials: DetailContent | null;
  contact: DetailContent | null;
  navItems: NavItem[];
  footerLines: string[];
};

type SectionMap = Partial<Record<TopLevelSection, string[]>>;

type TopLevelSection =
  | "hero"
  | "about"
  | "services"
  | "manufacturers"
  | "testimonials"
  | "contact";

const CONTENT_FILE = path.join(process.cwd(), "sourcematerial.txt");
const TOP_LEVEL_LABELS: Array<[TopLevelSection, string]> = [
  ["hero", "Hero"],
  ["about", "About"],
  ["services", "Services"],
  ["manufacturers", "Manufacturers"],
  ["testimonials", "Testimonials"],
  ["contact", "Contact"]
];

function slugify(input: string, fallback: string) {
  const slug = input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || fallback;
}

function normalizeKey(input: string) {
  const cyrillicToLatin: Record<string, string> = {
    А: "A",
    В: "B",
    Е: "E",
    К: "K",
    М: "M",
    Н: "H",
    О: "O",
    Р: "P",
    С: "C",
    Т: "T",
    Х: "X",
    а: "a",
    е: "e",
    о: "o",
    р: "p",
    с: "c",
    т: "t",
    х: "x",
    у: "y",
    і: "i"
  };

  return input
    .split("")
    .map((character) => cyrillicToLatin[character] ?? character)
    .join("")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function splitField(line: string) {
  const separatorIndex = line.indexOf(":");

  if (separatorIndex === -1) {
    return null;
  }

  const rawKey = line.slice(0, separatorIndex).trim();
  const value = line.slice(separatorIndex + 1).trim();

  if (!rawKey || !value) {
    return null;
  }

  return {
    key: normalizeKey(rawKey),
    value
  };
}

function isPlaceholderLine(line: string) {
  return /^\[(?:[^\]]*placeholder[^\]]*)\]$/i.test(line.trim());
}

function splitTopLevelSections(lines: string[]) {
  const sections: SectionMap = {};
  let currentSection: TopLevelSection | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      continue;
    }

    const nextSection = TOP_LEVEL_LABELS.find(
      ([section]) => normalizeKey(trimmed) === section
    )?.[0];

    if (nextSection) {
      currentSection = nextSection;
      sections[currentSection] = [];
      continue;
    }

    if (!currentSection) {
      continue;
    }

    sections[currentSection]?.push(trimmed);
  }

  return sections;
}

function parseHero(lines: string[]): HeroContent | null {
  let headline: string | null = null;
  let subheadline: string | null = null;
  let primaryCta: string | null = null;
  let secondaryCta: string | null = null;
  let placeholder: string | null = null;

  for (const line of lines) {
    if (isPlaceholderLine(line)) {
      placeholder = line;
      continue;
    }

    const field = splitField(line);

    if (!field) {
      continue;
    }

    if (field.key === "headline") {
      headline = field.value;
      continue;
    }

    if (field.key === "subheadline") {
      subheadline = field.value;
      continue;
    }

    if (field.key === "primary cta") {
      primaryCta = field.value;
      continue;
    }

    if (field.key === "secondary cta") {
      secondaryCta = field.value;
    }
  }

  if (!headline) {
    return null;
  }

  const ctas: HeroCta[] = [];

  if (primaryCta) {
    ctas.push({
      href: "#contact",
      label: primaryCta,
      tone: "primary"
    });
  }

  if (secondaryCta) {
    ctas.push({
      href: "#services",
      label: secondaryCta,
      tone: "secondary"
    });
  }

  return {
    id: "hero",
    label: "Hero",
    headline,
    subheadline,
    primaryCta,
    secondaryCta,
    placeholder,
    ctas
  };
}

function parseAbout(lines: string[]): AboutContent | null {
  const paragraphs = lines.filter((line) => !isPlaceholderLine(line));

  if (!paragraphs.length) {
    return null;
  }

  return {
    id: "about",
    label: "About",
    paragraphs
  };
}

function parseServices(lines: string[]): ServicesContent | null {
  const items: ServiceItem[] = [];
  let current: ServiceItem | null = null;

  for (const line of lines) {
    if (/^service\s+\d+$/i.test(line)) {
      if (current) {
        items.push(current);
      }

      current = {
        id: slugify(line, `service-${items.length + 1}`),
        label: line,
        title: null,
        description: null,
        placeholder: null
      };
      continue;
    }

    if (!current) {
      continue;
    }

    if (isPlaceholderLine(line)) {
      current.placeholder = line;
      continue;
    }

    const field = splitField(line);

    if (!field) {
      continue;
    }

    if (field.key === "title") {
      current.title = field.value;
      continue;
    }

    if (field.key === "description") {
      current.description = field.value;
    }
  }

  if (current) {
    items.push(current);
  }

  if (!items.length) {
    return null;
  }

  return {
    id: "services",
    label: "Services",
    items
  };
}

function parseDetailSection(id: DetailContent["id"], label: string, lines: string[]): DetailContent | null {
  let title: string | null = null;
  const description: string[] = [];
  const placeholders: string[] = [];

  for (const line of lines) {
    if (isPlaceholderLine(line)) {
      placeholders.push(line);
      continue;
    }

    const field = splitField(line);

    if (!field) {
      description.push(line);
      continue;
    }

    if (field.key === "title") {
      title = field.value;
      continue;
    }

    if (field.key === "description") {
      description.push(field.value);
      continue;
    }

    if (field.key === "content placeholder") {
      placeholders.push(`[Content Placeholder: ${field.value}]`);
      continue;
    }

    description.push(field.value);
  }

  if (!title && !description.length && !placeholders.length) {
    return null;
  }

  return {
    id,
    label,
    title,
    description,
    placeholders
  };
}

function deriveSiteModel(raw: string): SiteModel {
  const normalized = raw.replace(/\r\n?/g, "\n").trim();

  if (!normalized) {
    return {
      hasContent: false,
      brand: null,
      hero: null,
      about: null,
      services: null,
      manufacturers: null,
      testimonials: null,
      contact: null,
      navItems: [],
      footerLines: []
    };
  }

  const lines = normalized.split("\n");
  const sections = splitTopLevelSections(lines);
  const hero = parseHero(sections.hero ?? []);
  const about = parseAbout(sections.about ?? []);
  const services = parseServices(sections.services ?? []);
  const manufacturers = parseDetailSection(
    "manufacturers",
    "Manufacturers",
    sections.manufacturers ?? []
  );
  const testimonials = parseDetailSection(
    "testimonials",
    "Testimonials",
    sections.testimonials ?? []
  );
  const contact = parseDetailSection("contact", "Contact", sections.contact ?? []);
  const navItems: NavItem[] = [about, services, manufacturers, testimonials, contact]
    .filter((section): section is Exclude<typeof section, null> => Boolean(section))
    .map((section) => ({
      id: section.id,
      label: section.label
    }));

  return {
    hasContent: Boolean(hero || about || services || manufacturers || testimonials || contact),
    brand: hero?.headline ?? null,
    hero,
    about,
    services,
    manufacturers,
    testimonials,
    contact,
    navItems,
    footerLines: contact?.description ?? []
  };
}

export const getSiteModel = cache(async () => {
  const raw = await readFile(CONTENT_FILE, "utf8");
  return deriveSiteModel(raw);
});
