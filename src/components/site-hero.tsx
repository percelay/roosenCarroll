import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

import type { ContentBlock } from "@/lib/content";

type HeroCta = {
  href: string;
  label: string;
  tone: "primary" | "secondary";
};

type SiteHeroProps = {
  title: string;
  blocks: ContentBlock[];
  ctas: HeroCta[];
  imageSrc: string;
};

function getHeroParagraphs(blocks: ContentBlock[]) {
  return blocks.filter((block): block is Extract<ContentBlock, { type: "paragraph" }> => block.type === "paragraph");
}

function getHeroListItems(blocks: ContentBlock[]) {
  return blocks.flatMap((block) => (block.type === "list" ? block.items : []));
}

export function SiteHero({ title, blocks, ctas, imageSrc }: SiteHeroProps) {
  const paragraphs = getHeroParagraphs(blocks);
  const listItems = getHeroListItems(blocks);
  const hasAsideContent = listItems.length > 0;

  return (
    <section
      id="top"
      className="relative overflow-hidden rounded-shell border border-line/70 shadow-card"
    >
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(11,32,52,0.96)_0%,rgba(11,32,52,0.86)_40%,rgba(11,32,52,0.58)_100%)]" />
      </div>

      <div
        className={[
          "relative grid gap-10 px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24",
          hasAsideContent ? "lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.45fr)]" : ""
        ].join(" ")}
      >
        <div className="max-w-3xl space-y-6">
          <h1 className="max-w-[14ch] text-5xl leading-none text-panel sm:text-6xl lg:text-7xl">
            {title}
          </h1>

          {paragraphs.length ? (
            <div className="space-y-4">
              {paragraphs.map((block, index) => (
                <p
                  key={`${block.type}-${index}`}
                  className="max-w-2xl text-lg leading-8 text-panel/85 sm:text-xl"
                >
                  {block.text}
                </p>
              ))}
            </div>
          ) : null}

          {ctas.length ? (
            <div className="flex flex-wrap gap-3 pt-2">
              {ctas.map((cta) => (
                <Link
                  key={cta.href}
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

        {listItems.length ? (
          <div className="surface-panel self-end bg-brand-strong/60 p-6 backdrop-blur-md">
            <div className="space-y-3">
              {listItems.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-panel/20 bg-panel/10 px-4 py-3 text-sm leading-7 text-panel transition-colors duration-200 hover:bg-panel/15"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
