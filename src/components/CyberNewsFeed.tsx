"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Search, ShieldCheck, FileText, Sparkles } from "lucide-react";
import { newsCategories, newsData, NewsItem } from "@/data/newsData";
import NewsStoryCard from "@/components/NewsStoryCard";
import TrendingNewsTicker from "@/components/TrendingNewsTicker";

export default function CyberNewsFeed() {
  const [articlesList, setArticlesList] = useState<NewsItem[]>(newsData);
  const [categoriesList, setCategoriesList] = useState<string[]>(["All News", ...newsCategories]);
  const [activeCategory, setActiveCategory] = useState("All News");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    async function loadLiveData() {
      try {
        const res = await fetch("/api/public/site-data", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.news && data.news.length > 0) {
            setArticlesList(data.news);
          }
          if (data.newsCategories && data.newsCategories.length > 0) {
            setCategoriesList(["All News", ...data.newsCategories]);
          }
        }
      } catch {}
    }
    loadLiveData();
  }, []);

  const featuredArticle = articlesList.find((article) => article.featured) ?? articlesList[0];
  const categories = categoriesList;

  const matchingArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return articlesList.filter((article) => {
      const matchesCategory = activeCategory === "All News" || article.category === activeCategory;
      const matchesQuery =
        !normalizedQuery ||
        `${article.title} ${article.excerpt} ${article.category} ${article.publisher} ${article.author ?? ""}`
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query, articlesList]);

  const showFeatured = activeCategory === "All News" && query.trim().length === 0;
  const listedArticles = matchingArticles.filter(
    (article) => !showFeatured || article.id !== featuredArticle?.id,
  );
  const visibleArticles = listedArticles.slice(0, visibleCount);

  function selectCategory(category: string) {
    setActiveCategory(category);
    setVisibleCount(6);
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] pb-24 pt-28 text-[var(--text-white)] sm:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <header className="mb-6 border-b border-white/10 pb-6 sm:mb-8 sm:pb-7">
          <div>
            <h1 className="text-4xl font-semibold tracking-[-0.055em] sm:text-5xl lg:text-[3.75rem]">
              Cyber <span className="text-[var(--cyan-accent)]">News</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-slate)] sm:text-base">
              Articles, research insights, and technological developments published by ISACA members.
            </p>
          </div>
        </header>

        {/* Cinematic Horizontal Scrolling News Ticker (Live data linked) */}
        <TrendingNewsTicker articles={articlesList} />

        {/* Featured Story Full-Width Banner (KEPT UNCHANGED) */}
        {showFeatured && featuredArticle && (
          <motion.section
            aria-label="Featured cybersecurity story"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mb-14 overflow-hidden rounded-xl border border-[var(--border-card)] bg-[var(--bg-section)]"
          >
            <article className="group relative isolate flex min-h-[440px] sm:min-h-[480px] lg:min-h-[500px] overflow-hidden bg-[var(--bg-section)]">
              <Image
                src={featuredArticle.image}
                alt={featuredArticle.imageAlt}
                fill
                loading="eager"
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="-z-20 object-cover transition-transform duration-700 group-hover:scale-[1.025]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-gradient-to-t from-[var(--bg-main)]/95 via-[var(--bg-main)]/65 to-[var(--bg-main)]/10"
              />
              <div className="mt-auto w-full max-w-4xl p-6 sm:p-10 lg:p-12">
                <div className="mb-3.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.16em] sm:text-[11px]">
                  <span className="border border-[var(--cyan-accent)]/40 bg-[var(--cyan-accent)]/10 px-2.5 py-1.5 text-[var(--cyan-accent)] rounded-xs">
                    {featuredArticle.category}
                  </span>
                  <span className="text-[var(--text-slate)]">{featuredArticle.publishedDate}</span>
                </div>
                <h2 className="max-w-4xl text-2xl sm:text-3xl lg:text-4xl xl:text-[2.65rem] font-bold leading-[1.15] tracking-[-0.04em] text-white">
                  {featuredArticle.title}
                </h2>
                <p className="mt-3.5 line-clamp-2 max-w-3xl text-sm leading-6 text-[var(--text-slate)] sm:text-base sm:leading-7">
                  {featuredArticle.excerpt}
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs text-[var(--text-muted)] font-medium">
                    Published by {featuredArticle.publisher}
                  </span>
                  <Link
                    href={`/cyber-news/${featuredArticle.id}`}
                    className="inline-flex items-center gap-2 border border-[var(--cyan-accent)] bg-[var(--cyan-accent)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--bg-main)] transition-colors hover:bg-transparent hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cyan-accent)]"
                  >
                    Read full story <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          </motion.section>
        )}

        {/* Human Editorial Newsroom Section */}
        <section aria-labelledby="latest-stories-heading" id="latest-stories" className="scroll-mt-24">
          
          {/* Editorial Masthead Bar */}
          <div className="mb-8 flex flex-col gap-5 border-b border-white/[0.08] pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--cyan-accent)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--cyan-accent)] animate-pulse" />
                <span>ISACA Editorial Newsroom · Dispatches</span>
              </div>
              <h2 id="latest-stories-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Cybersecurity <span className="text-[var(--cyan-accent)]">Dispatches &amp; Reports</span>
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                Curated research papers, vulnerability analyses, and field advisories from our student chapter.
              </p>
            </div>

            {/* Editorial Search Bar */}
            <div className="flex items-center gap-3">
              <label className="flex h-11 w-full items-center gap-3 rounded-lg border border-white/[0.12] bg-[#091122]/90 px-3.5 text-slate-400 transition-colors focus-within:border-[var(--cyan-accent)] focus-within:bg-[#0c162d] lg:w-72 shadow-inner">
                <Search className="h-4 w-4 shrink-0 text-[var(--cyan-accent)]" aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setVisibleCount(6);
                  }}
                  placeholder="Search dispatches & keywords..."
                  aria-label="Search news stories"
                  className="h-full min-w-0 flex-1 bg-transparent text-xs sm:text-sm text-white outline-none placeholder:text-slate-500"
                />
              </label>
            </div>
          </div>

          {/* Curated Category Filter Tabs */}
          <div className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none" aria-label="Filter stories by topic">
            {categories.map((category) => {
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => selectCategory(category)}
                  className={`shrink-0 rounded-md border px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? "border-[var(--cyan-accent)] bg-[var(--cyan-accent)] text-[#030712] shadow-[0_0_15px_rgba(0,240,255,0.25)]"
                      : "border-white/[0.08] bg-[#0c1426]/70 text-slate-300 hover:border-cyan-400/40 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* News Stories Grid */}
          {visibleArticles.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleArticles.map((article) => (
                <NewsStoryCard key={article.id} news={article} variant="newsroom" />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-white/[0.08] bg-[#0c1426]/60 py-16 text-center">
              <FileText className="h-8 w-8 text-slate-500 mx-auto mb-3" />
              <p className="text-base font-semibold text-white">No dispatches match your query</p>
              <p className="mt-1 text-sm text-slate-400">Try selecting another topic or clearing search terms.</p>
            </div>
          )}

          {/* Load More Button */}
          {visibleArticles.length < listedArticles.length && (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + 6)}
                className="inline-flex items-center gap-2 rounded-md border border-cyan-500/40 bg-cyan-950/40 px-7 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300 transition-colors hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-white cursor-pointer"
              >
                <span>Load More Reports</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </section>

        {/* Human Editorial Callout: Student Research & Advisory Desk */}
        <section
          className="mt-20 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-[#091122] via-[#060c18] to-[#040812] p-8 sm:p-12 shadow-2xl relative overflow-hidden"
          aria-label="Contribute research to ISACA editorial desk"
        >
          {/* Subtle Ambient Corner Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 rounded-xs bg-cyan-950/80 border border-cyan-500/40 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span>Call For Academic Submissions</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
                Publish Your Security Research With <span className="text-[var(--cyan-accent)]">ISACA</span>
              </h3>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-300 font-normal">
                Are you an SLTC student researching cloud misconfigurations, zero-day threat telemetry, or cryptographic algorithms? Submit your research manuscripts or threat advisories to our student editorial review panel for publication.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>Reviewed and edited by the SLTC ISACA Student Group Academic Editorial Board</span>
              </div>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-3.5">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-[var(--cyan-accent)] text-[#030712] font-bold text-xs uppercase tracking-[0.14em] transition-all hover:bg-white shadow-[0_0_20px_rgba(0,240,255,0.25)]"
              >
                <span>Submit Research</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about-us"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md border border-white/15 bg-white/5 text-slate-200 font-semibold text-xs uppercase tracking-[0.14em] transition-colors hover:bg-white/10 hover:text-white"
              >
                <span>About Editorial Desk</span>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
