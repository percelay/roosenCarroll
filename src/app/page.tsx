import type { Metadata } from "next";

import { ContentSection } from "@/components/content-section";
import { ServicesSection } from "@/components/services-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SiteHero } from "@/components/site-hero";
import { getSiteModel } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteModel();
  const fallbackTitle = "Source Material Website";

  return {
    title: site.brand ?? fallbackTitle,
    description:
      site.hero?.subheadline ?? "A content-driven business website rendered from sourcematerial.txt."
  };
}

export default async function HomePage() {
  const site = await getSiteModel();

  if (!site.hasContent || !site.brand || !site.hero) {
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
      <SiteHeader brand={site.brand} navItems={site.navItems} cta={site.hero.ctas[0]} />

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-8 sm:px-6 lg:px-8">
        <SiteHero hero={site.hero} />

        {site.about ? (
          <ContentSection
            id={site.about.id}
            label={site.about.label}
            description={site.about.paragraphs}
          />
        ) : null}

        {site.services ? <ServicesSection section={site.services} /> : null}

        {site.manufacturers ? (
          <ContentSection
            id={site.manufacturers.id}
            label={site.manufacturers.label}
            title={site.manufacturers.title}
            description={site.manufacturers.description}
            placeholders={site.manufacturers.placeholders}
          />
        ) : null}

        {site.testimonials ? (
          <ContentSection
            id={site.testimonials.id}
            label={site.testimonials.label}
            title={site.testimonials.title}
            description={site.testimonials.description}
            placeholders={site.testimonials.placeholders}
          />
        ) : null}

        {site.contact ? (
          <ContentSection
            id={site.contact.id}
            label={site.contact.label}
            title={site.contact.title}
            description={site.contact.description}
            placeholders={site.contact.placeholders}
          />
        ) : null}
      </main>

      <SiteFooter brand={site.brand} navItems={site.navItems} contactLines={site.footerLines} />
    </>
  );
}
