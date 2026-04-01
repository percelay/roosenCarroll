import type { Metadata } from "next";

import { ContentSection } from "@/components/content-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SiteHero } from "@/components/site-hero";
import { getSiteModel } from "@/lib/content";

const HERO_IMAGE_SRC = "/4d3232b9-6aea-421c-ae94-1893386cf922.jpg";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteModel();
  const fallbackTitle = "Source Material Website";
  const paragraph = site.heroBlocks.find((block) => block.type === "paragraph");

  return {
    title: site.title ?? fallbackTitle,
    description:
      paragraph?.text ?? "A content-driven business website rendered from sourcematerial.txt."
  };
}

export default async function HomePage() {
  const site = await getSiteModel();

  if (!site.hasContent || !site.title) {
    return (
      <main className="mx-auto flex min-h-screen max-w-5xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <section className="surface-panel w-full p-8 sm:p-10 lg:p-12">
          <div className="space-y-5">
            <div className="inline-flex w-fit rounded-full border border-brand/15 bg-brand/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand">
              Source Material Required
            </div>
            <h1 className="text-4xl leading-none text-brand sm:text-5xl">
              <code className="font-mono text-[0.82em] normal-case tracking-normal">
                sourcematerial.txt
              </code>{" "}
              is empty.
            </h1>
            <p className="max-w-2xl">
              Save the approved copy into that file and this site will render directly from it
              without adding, rewriting, or summarizing any messaging.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <>
      <SiteHeader brand={site.title} navItems={site.navItems} cta={site.ctas[0]} />

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-8 sm:px-6 lg:px-8">
        <SiteHero
          title={site.title}
          blocks={site.heroBlocks}
          ctas={site.ctas.slice(0, 2)}
          imageSrc={HERO_IMAGE_SRC}
        />

        {site.sections.map((section) => (
          <ContentSection key={section.id} section={section} />
        ))}
      </main>

      <SiteFooter brand={site.title} navItems={site.navItems} contactLines={site.contactLines} />
    </>
  );
}
