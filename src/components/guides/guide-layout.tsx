import React from "react";
import Link from "next/link";
import { GoldDivider } from "@/components/layout/gold-divider";
import { JsonLd, getBreadcrumbListSchema, getArticleSchema, getFAQPageSchema } from "@/lib/seo/schema";
import { SEO_CONFIG } from "@/lib/seo-config";
import { Calendar, User, Clock, ShieldCheck, ArrowRight, HelpCircle, BookOpen } from "lucide-react";

export interface GuideFAQ {
  question: string;
  directAnswer: string;
  detail?: string;
}

export interface GuideLayoutProps {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  readTime: string;
  publishDate: string;
  lastUpdatedDate: string;
  image?: string;
  keyTakeaways: string[];
  faqs: GuideFAQ[];
  relatedGemsHref?: string;
  relatedGemsLabel?: string;
  children: React.ReactNode;
}

export function GuideLayout({
  slug,
  title,
  subtitle,
  description,
  readTime,
  publishDate,
  lastUpdatedDate,
  image = "/isuru_images/blue1.webp",
  keyTakeaways,
  faqs,
  relatedGemsHref = "/gems",
  relatedGemsLabel = "Explore Certified Ceylon Gemstones",
  children,
}: GuideLayoutProps) {
  const guideUrl = `/guides/${slug}`;

  const breadcrumbSchema = getBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "Gemological Guides", url: "/guides" },
    { name: title, url: guideUrl },
  ]);

  const articleSchema = getArticleSchema({
    title,
    description,
    url: guideUrl,
    image,
    datePublished: publishDate,
    dateModified: lastUpdatedDate,
    authorName: SEO_CONFIG.founders[2].name,
  });

  const faqSchema = getFAQPageSchema(
    faqs.map((f) => ({
      question: f.question,
      answer: f.detail ? `${f.directAnswer} ${f.detail}` : f.directAnswer,
    }))
  );

  return (
    <article className="min-h-screen bg-[#FAF6EE] text-[#2B2B2B] py-10 sm:py-16">
      <JsonLd data={[breadcrumbSchema, articleSchema, faqSchema]} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs text-[#2B2B2B]/60 flex items-center space-x-2">
          <Link href="/" className="hover:text-[#5E0F1E] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/guides" className="hover:text-[#5E0F1E] transition-colors">
            Guides
          </Link>
          <span>/</span>
          <span className="text-[#80601C] font-medium truncate max-w-[240px] sm:max-w-none">
            {title}
          </span>
        </nav>

        {/* Header Section with single H1 */}
        <header className="space-y-5 border-b border-[#B8924A]/25 pb-8">
          <div className="inline-flex items-center gap-2">
            <span className="w-5 h-px bg-[#B8924A]" />
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.26em] text-[#80601C]">
              {SEO_CONFIG.brand.name} · Gemological Authority
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#5E0F1E] font-normal leading-[1.18] tracking-tight">
            {title}
          </h1>

          <p className="font-serif text-lg sm:text-xl text-[#2B2B2B]/85 italic leading-relaxed">
            {subtitle}
          </p>

          {/* Meta byline */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs text-[#2B2B2B]/70">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#B8924A]" />
              <span>By {SEO_CONFIG.founders[2].name} (NGJA Reg: {SEO_CONFIG.brand.licenseNumber})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#B8924A]" />
              <span>Last updated: <time dateTime={lastUpdatedDate}>{lastUpdatedDate}</time></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#B8924A]" />
              <span>{readTime} read</span>
            </div>
          </div>
        </header>

        {/* Key Takeaways Callout Box */}
        {keyTakeaways && keyTakeaways.length > 0 && (
          <aside
            aria-label="Key Takeaways"
            className="p-5 sm:p-6 rounded-lg bg-[#F5EFE0] border border-[#B8924A]/40 shadow-sm space-y-3"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#80601C]" />
              <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#80601C]">
                Key Gemological Takeaways
              </h2>
            </div>
            <ul className="space-y-2 text-sm text-[#2B2B2B]/85">
              {keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-[#80601C] mt-1 shrink-0 font-bold">•</span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {/* Main Article Content */}
        <div className="prose prose-stone max-w-none space-y-8 leading-relaxed text-[#2B2B2B]/90 font-sans text-base sm:text-[17px]">
          {children}
        </div>

        <GoldDivider withOrnament className="my-10" />

        {/* Visible AEO FAQ Section */}
        <section aria-labelledby="guide-faq-heading" className="space-y-6 pt-2">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-[#80601C]" />
            <h2
              id="guide-faq-heading"
              className="font-serif text-2xl sm:text-3xl text-[#5E0F1E] font-normal"
            >
              Frequently Asked Questions & Expert Answers
            </h2>
          </div>
          <p className="text-sm text-[#2B2B2B]/75 leading-relaxed">
            Direct, verified answers on this topic compiled by our gemological team in Ratnapura and Colombo.
          </p>

          <div className="space-y-4 pt-2">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="p-5 sm:p-6 rounded-md bg-[#FDFBF7] border border-[#B8924A]/30 shadow-xs space-y-3"
              >
                <h3 className="font-serif text-lg sm:text-xl text-[#5E0F1E] font-medium leading-snug">
                  {faq.question}
                </h3>
                {/* 40-60 word direct answer styled prominently for AEO */}
                <p className="text-sm sm:text-base text-[#2B2B2B] font-medium leading-relaxed bg-[#FAF6EE] p-3.5 rounded border-l-2 border-[#80601C]">
                  {faq.directAnswer}
                </p>
                {faq.detail && (
                  <p className="text-sm text-[#2B2B2B]/80 leading-relaxed pt-1">
                    {faq.detail}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Author Credential Bio Box */}
        <section
          aria-label="Author Profile"
          className="p-6 rounded-lg bg-[#1A1410] text-[#FAF6EE] space-y-3 border border-[#B8924A]/30"
        >
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#D4AF67] font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Author & Gemological Curator</span>
          </div>
          <h3 className="font-serif text-xl font-normal text-[#FAF6EE]">
            {SEO_CONFIG.founders[2].name}
          </h3>
          <p className="text-xs sm:text-sm text-[#FAF6EE]/80 leading-relaxed">
            Uththiya is a third-generation Sri Lankan gem merchant and certified gemologist from Ratnapura. Officially licensed under National Gem and Jewellery Authority License <strong>{SEO_CONFIG.brand.licenseNumber}</strong>, he oversees rough parcel grading at the alluvial pit heads and directs the lapidary cutting atelier for Isuru Ceylon Gems.
          </p>
        </section>

        {/* CTA to view inventory or book consultation */}
        <section className="p-6 sm:p-8 rounded-xl bg-gradient-to-r from-[#5E0F1E] to-[#3B0711] text-[#FAF6EE] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="font-serif text-xl sm:text-2xl font-normal">
              Acquire Certified Natural Gemstones
            </h3>
            <p className="text-xs sm:text-sm text-[#FAF6EE]/80 max-w-md">
              View our authentic unheated Ceylon sapphires, rubies, and collector stones direct from Ratnapura.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              href={relatedGemsHref}
              className="inline-flex items-center justify-center gap-2 bg-[#B8924A] hover:bg-[#D4AF67] text-[#0A1A14] px-6 py-3 rounded-full text-xs uppercase tracking-wider font-semibold transition-all duration-200 shadow-sm"
            >
              <span>{relatedGemsLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-[#FAF6EE] border border-white/25 px-5 py-3 rounded-full text-xs uppercase tracking-wider font-medium transition-all duration-200"
            >
              <span>Private Concierge</span>
            </Link>
          </div>
        </section>
      </div>
    </article>
  );
}
