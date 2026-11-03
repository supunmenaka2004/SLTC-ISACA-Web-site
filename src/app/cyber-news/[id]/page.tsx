import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  Calendar,
  Clock3,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Server,
  Building2,
} from "lucide-react";
import { notFound } from "next/navigation";
import NewsStoryCard from "@/components/NewsStoryCard";
import NewsShareButton from "@/components/NewsShareButton";
import { getReadingTimeMinutes, newsData } from "@/data/newsData";

type ArticlePageProps = {
  params: Promise<{ id: string }>;
};

function findArticle(id: string) {
  return newsData.find((article) => article.id === id);
}

export function generateStaticParams() {
  return newsData.map((article) => ({ id: article.id }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { id } = await params;
  const article = findArticle(id);

  if (!article) {
    return { title: "Article not found | ISACA Student Group" };
  }

  return {
    title: `${article.title} | Cyber News`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
    },
  };
}

export default async function CyberNewsArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  const article = findArticle(id);

  if (!article) notFound();

  const relatedArticles = newsData
    .filter((item) => item.id !== article.id && item.category === article.category)
    .concat(newsData.filter((item) => item.id !== article.id && item.category !== article.category))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#030712] pb-24 pt-28 text-white sm:pt-32">
      <article className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link
            href="/cyber-news"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Cyber News</span>
          </Link>
        </nav>

        {/* Article Header */}
        <header className="mx-auto max-w-4xl">
          {/* Metadata Kicker: Category, Date, Read Time */}
          <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            <span className="border border-cyan-500/40 bg-cyan-950/60 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-300 rounded-sm">
              {article.category}
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-400 font-normal">
              <Calendar className="h-3.5 w-3.5 text-cyan-400/80" />
              {article.publishedDate}
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-400 font-normal">
              <Clock3 className="h-3.5 w-3.5 text-cyan-400/80" />
              {getReadingTimeMinutes(article)} min read
            </span>
          </div>

          {/* Main Headline: Large and bold */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] tracking-tight text-white">
            {article.title}
          </h1>

          {/* Lead Summary: Comfortable reading size, regular weight */}
          <p className="mt-6 text-base sm:text-lg leading-relaxed text-slate-300 font-normal">
            {article.excerpt}
          </p>

          {/* Publisher & Share Row */}
          <div className="mt-7 flex flex-col gap-4 border-y border-slate-800/80 py-4 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-400 font-normal">
            <div className="inline-flex items-center gap-2">
              <Building2 className="h-4 w-4 text-cyan-400/70 shrink-0" />
              <span>
                Published by <strong className="font-semibold text-slate-200">{article.publisher}</strong>
              </span>
              {article.author && (
                <>
                  <span className="text-slate-600">·</span>
                  <span>Reporting: <strong className="font-semibold text-slate-200">{article.author}</strong></span>
                </>
              )}
            </div>
            <NewsShareButton title={article.title} />
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative mx-auto mt-8 aspect-[16/9] max-w-4xl overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900 shadow-2xl">
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            loading="eager"
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />
        </div>

        {/* Article Body Content */}
        <div className="mx-auto mt-12 max-w-3xl">

          {/* 1. Key Highlights */}
          {article.keyHighlights && article.keyHighlights.length > 0 && (
            <section
              className="mb-12 rounded-xl border border-cyan-500/25 bg-[#091122] p-6 sm:p-8 shadow-lg relative overflow-hidden"
              aria-labelledby="key-highlights-heading"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-cyan-400" />
              <h2
                id="key-highlights-heading"
                className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2.5 tracking-tight"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                Key Highlights
              </h2>
              <ul className="space-y-3 text-sm sm:text-base leading-relaxed text-slate-300 font-normal">
                {article.keyHighlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-cyan-400 font-bold shrink-0 mt-1">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 2. Full Article Sections & Detailed Explanation */}
          <div className="space-y-10 text-base sm:text-lg leading-[1.85] text-slate-300 font-normal">
            {article.sections?.length ? (
              article.sections.map((section, idx) => (
                <section key={idx} className="space-y-4">
                  {/* Section Title: Medium-large and bold */}
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                    {section.heading}
                  </h2>
                  <div className="space-y-4">
                    {section.paragraphs.map((paragraph, pIdx) => (
                      <p key={pIdx} className="text-slate-300 font-normal leading-[1.85]">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  {section.points && section.points.length > 0 && (
                    <ul className="mt-4 space-y-2.5 pl-5 text-base leading-relaxed text-slate-300">
                      {section.points.map((point, ptIdx) => (
                        <li key={ptIdx} className="list-disc marker:text-cyan-400">
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))
            ) : (
              article.content.map((paragraph, idx) => (
                <p key={idx} className="leading-[1.85]">
                  {paragraph}
                </p>
              ))
            )}
          </div>

          {/* 3. Technical Information & Attack Vectors */}
          {article.technicalInformation && article.technicalInformation.length > 0 && (
            <section
              className="mt-14 rounded-xl border border-slate-800 bg-[#070e1c] p-6 sm:p-8"
              aria-labelledby="technical-information-heading"
            >
              <div className="flex items-center gap-2.5 mb-5 text-cyan-300">
                <Cpu className="h-5 w-5 text-cyan-400" />
                <h2
                  id="technical-information-heading"
                  className="text-lg sm:text-xl font-bold text-white tracking-tight"
                >
                  Technical Information &amp; Threat Telemetry
                </h2>
              </div>
              <ul className="space-y-3.5 text-sm sm:text-base leading-relaxed text-slate-300 font-normal">
                {article.technicalInformation.map((info, idx) => {
                  const parts = info.split(":");
                  const hasLabel = parts.length > 1;
                  return (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-cyan-400 font-mono text-xs mt-1 shrink-0">[TECH]</span>
                      <div>
                        {hasLabel ? (
                          <>
                            <strong className="font-semibold text-white">{parts[0]}:</strong>
                            <span>{parts.slice(1).join(":")}</span>
                          </>
                        ) : (
                          <span>{info}</span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* 4. Affected Products or Systems */}
          {article.affectedSystems && article.affectedSystems.length > 0 && (
            <section
              className="mt-8 rounded-xl border border-slate-800 bg-[#070e1c] p-6 sm:p-8"
              aria-labelledby="affected-systems-heading"
            >
              <div className="flex items-center gap-2.5 mb-5 text-slate-200">
                <Server className="h-5 w-5 text-cyan-400" />
                <h2
                  id="affected-systems-heading"
                  className="text-lg sm:text-xl font-bold text-white tracking-tight"
                >
                  Affected Products, Protocols &amp; Infrastructure
                </h2>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-300">
                {article.affectedSystems.map((system, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-md bg-slate-900/80 border border-slate-800"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                    <span className="font-medium text-slate-200">{system}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 5. Security Recommendations */}
          {article.securityRecommendations && article.securityRecommendations.length > 0 && (
            <section
              className="mt-8 rounded-xl border-l-4 border-cyan-400 border border-slate-800 bg-[#091122] p-6 sm:p-8"
              aria-labelledby="security-recommendations-heading"
            >
              <div className="flex items-center gap-2.5 mb-4 text-cyan-300">
                <ShieldCheck className="h-5 w-5 text-cyan-400" />
                <h2
                  id="security-recommendations-heading"
                  className="text-lg sm:text-xl font-bold text-white tracking-tight"
                >
                  Defensive Security Recommendations
                </h2>
              </div>
              <ul className="space-y-3 text-sm sm:text-base leading-relaxed text-slate-300 font-normal">
                {article.securityRecommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-cyan-400 font-bold shrink-0 mt-0.5">✓</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 6. Original Source References */}
          {article.sourceUrl && (
            <aside
              className="mt-10 rounded-xl border border-slate-800/80 bg-slate-900/50 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              aria-label="Original source reference"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-400 mb-1">
                  Primary Source Reference
                </p>
                <p className="text-sm text-slate-300 font-normal">
                  Source notice published by{" "}
                  <strong className="font-semibold text-white">
                    {article.sourceName ?? article.publisher}
                  </strong>
                  .
                </p>
              </div>
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-cyan-950/80 border border-cyan-500/40 text-xs font-semibold text-cyan-300 hover:text-white hover:bg-cyan-500/20 hover:border-cyan-400 transition-colors uppercase tracking-[0.1em] shrink-0"
              >
                <span>Read Original Report</span>
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </aside>
          )}

        </div>
      </article>

      {/* 7. Related Articles Section */}
      {relatedArticles.length > 0 && (
        <section className="mx-auto mt-24 max-w-7xl border-t border-slate-800/80 px-5 pt-16 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                Continue Reading
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Related Cyber News
              </h2>
            </div>
            <Link
              href="/cyber-news"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>View All News</span>
              <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {relatedArticles.map((relatedArticle) => (
              <NewsStoryCard key={relatedArticle.id} news={relatedArticle} variant="newsroom" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
