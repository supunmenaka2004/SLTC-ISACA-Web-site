"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { newsCategories, newsData } from "@/data/newsData";
import NewsStoryCard from "@/components/NewsStoryCard";
import TrendingNewsTicker from "@/components/TrendingNewsTicker";

const threatTopics = [
  "Threat Research",
  "High Profile Threats",
  "Vulnerability Intelligence",
  "Cyber Attacks",
  "Data Breaches",
  "Malware & Ransomware",
  "AI Security",
  "Cloud Security",
];

export default function CyberNewsFeed() {
  const [activeCategory, setActiveCategory] = useState("All News");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);
  const featuredArticle = newsData.find((article) => article.featured) ?? newsData[0];
  const secondaryStories = newsData
    .filter((article) => article.id !== featuredArticle?.id)
    .slice(0, 3);
  const categories = ["All News", "Technology", ...newsCategories];

  const matchingArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return newsData.filter((article) => {
      const matchesCategory = activeCategory === "All News" || article.category === activeCategory;
      const matchesQuery =
        !normalizedQuery ||
        `${article.title} ${article.excerpt} ${article.category} ${article.publisher}`
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  const showFeatured = activeCategory === "All News" && query.trim().length === 0;
  const listedArticles = matchingArticles.filter(
    (article) => !showFeatured || article.id !== featuredArticle?.id,
  );
  const visibleArticles = listedArticles.slice(0, visibleCount);

  function selectCategory(category: string) {
    setActiveCategory(category);
    setVisibleCount(4);
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] pb-24 pt-28 text-[var(--text-white)] sm:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <header className="mb-6 border-b border-white/10 pb-6 sm:mb-8 sm:pb-7">
          <div className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--cyan-accent)] sm:text-[11px]">
            <span>SLTC ISACA</span>
            <span className="text-[var(--text-muted)]">/</span>
            <span className="text-[var(--text-muted)]">Cyber News</span>
          </div>
          <div>
            <h1 className="text-4xl font-semibold tracking-[-0.055em] sm:text-5xl lg:text-[3.75rem]">
              Cyber <span className="text-[var(--cyan-accent)]">News</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-slate)] sm:text-base">
              Articles, research insights, and technological developments published by ICASA members.
            </p>
          </div>
        </header>

        {/* Cinematic Horizontal Scrolling News Ticker (Image Backgrounds + Text Overlay) */}
        <TrendingNewsTicker />

        {/* Featured Split Hero Section (Unit 42 Inspired) */}
        {showFeatured && featuredArticle && (
          <motion.section
            aria-label="Featured cybersecurity stories"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mb-14 grid overflow-hidden border border-[var(--border-card)] bg-[var(--bg-section)] lg:h-[clamp(430px,48vh,480px)] lg:grid-cols-[minmax(0,1.95fr)_minmax(250px,1fr)]"
          >
            <article className="group relative isolate flex min-h-[470px] overflow-hidden bg-[var(--bg-section)] sm:min-h-[530px] lg:min-h-0">
              <Image
                src={featuredArticle.image}
                alt={featuredArticle.imageAlt}
                fill
                loading="eager"
                sizes="(max-width: 767px) 100vw, (max-width: 1279px) 64vw, 850px"
                className="-z-20 object-cover transition-transform duration-700 group-hover:scale-[1.025]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-gradient-to-t from-[var(--bg-main)]/95 via-[var(--bg-main)]/65 to-[var(--bg-main)]/10"
              />
              <div className="mt-auto w-full max-w-3xl p-5 sm:p-8 lg:p-10">
                <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.15em] sm:text-[11px]">
                  <span className="border border-[var(--cyan-accent)]/40 bg-[var(--cyan-accent)]/10 px-2.5 py-1.5 text-[var(--cyan-accent)]">
                    {featuredArticle.category}
                  </span>
                  <span className="text-[var(--text-slate)]">{featuredArticle.publishedDate}</span>
                </div>
                <h2 className="max-w-3xl text-[1.7rem] font-bold leading-[1.12] tracking-[-0.04em] sm:text-3xl lg:text-[2.55rem] text-white">
                  {featuredArticle.title}
                </h2>
                <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-6 text-[var(--text-slate)] sm:text-[15px] sm:leading-7">
                  {featuredArticle.excerpt}
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs text-[var(--text-muted)]">{featuredArticle.publisher}</span>
                  <Link
                    href={`/cyber-news/${featuredArticle.id}`}
                    className="inline-flex items-center gap-2 border border-[var(--cyan-accent)] bg-[var(--cyan-accent)] px-4 py-2.5 text-xs font-semibold text-[var(--bg-main)] transition-colors hover:bg-transparent hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cyan-accent)]"
                  >
                    Read full story <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>

            <div className="grid divide-y divide-[var(--border-card)] border-t border-[var(--border-card)] lg:min-h-0 lg:grid-rows-3 lg:border-l lg:border-t-0">
              {secondaryStories.map((story) => (
                <Link
                  key={story.id}
                  href={`/cyber-news/${story.id}`}
                  className="group grid min-h-32 grid-cols-[40%_minmax(0,1fr)] items-stretch transition-colors hover:bg-white/[0.035] lg:min-h-0"
                >
                  <div className="relative min-h-32 overflow-hidden bg-[var(--bg-card)] lg:min-h-0">
                    <Image
                      src={story.image}
                      alt={story.imageAlt}
                      fill
                      sizes="(max-width: 767px) 40vw, (max-width: 1279px) 16vw, 220px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex min-w-0 flex-col justify-center p-3 sm:p-4">
                    <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] font-semibold uppercase tracking-[0.12em]">
                      <span className="text-[var(--cyan-accent)]">{story.category}</span>
                      <span className="text-[var(--text-muted)]">{story.publishedDate}</span>
                    </div>
                    <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-white transition-colors group-hover:text-[var(--cyan-accent)] sm:text-sm">
                      {story.title}
                    </h3>
                    <span className="mt-1 block truncate text-[9px] text-[var(--text-muted)]">{story.publisher}</span>
                    <span className="mt-1 inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-[var(--cyan-accent)]">
                      Read full story <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {/* Stories Listing Section */}
        <section aria-labelledby="latest-stories-heading" id="latest-stories" className="scroll-mt-24">
          <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--cyan-accent)]">
                SLTC ISACA · Insights &amp; Publications
              </p>
              <h2 id="latest-stories-heading" className="text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
                Latest Cybersecurity News
              </h2>
            </div>
            <label className="flex h-11 w-full items-center gap-3 rounded-md border border-[var(--border-card)] bg-[var(--bg-section)] px-3.5 text-[var(--text-muted)] transition-colors focus-within:border-[var(--cyan-accent)] lg:max-w-xs">
              <Search className="h-4 w-4 shrink-0 text-[var(--cyan-accent)]" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setVisibleCount(4);
                }}
                placeholder="Search stories"
                aria-label="Search news stories"
                className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[var(--text-muted)]"
              />
            </label>
          </div>

          <div className="mb-7 flex gap-2 overflow-x-auto pb-2" aria-label="Filter stories by topic">
            {categories.map((category) => {
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => selectCategory(category)}
                  className={`shrink-0 rounded-full border px-3.5 py-2 text-[11px] font-medium transition-colors cursor-pointer ${
                    isActive
                      ? "border-[var(--cyan-accent)] bg-[var(--cyan-accent)] text-[var(--bg-main)]"
                      : "border-[var(--border-card)] bg-[var(--bg-section)] text-[var(--text-slate)] hover:border-[var(--border-hover)] hover:text-white"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {visibleArticles.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleArticles.map((article) => (
                <NewsStoryCard key={article.id} news={article} variant="newsroom" />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-[var(--border-card)] bg-[var(--bg-section)] py-14 text-center">
              <p className="text-base font-medium text-white">No stories found</p>
              <p className="mt-2 text-sm text-[var(--text-muted)]">Try another keyword or topic.</p>
            </div>
          )}

          {visibleArticles.length < listedArticles.length && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + 4)}
                className="rounded-md border border-[var(--border-card)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-slate)] transition-colors hover:border-[var(--border-hover)] hover:text-white cursor-pointer"
              >
                Load more stories <ArrowRight className="ml-2 inline h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </section>

        {/* Threat Intelligence Explore Coverage Topics */}
        <section className="mt-16 border-t border-white/10 pt-10 sm:mt-20" aria-labelledby="threat-topics-heading">
          <div className="mb-4 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--cyan-accent)]">
            <span className="h-px w-7 bg-[var(--cyan-accent)]" />
            <span>Explore coverage</span>
          </div>
          <h2 id="threat-topics-heading" className="mb-5 text-xl font-semibold tracking-tight sm:text-2xl">
            Threat Intelligence
          </h2>
          <div className="flex flex-wrap gap-2">
            {threatTopics.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => {
                  selectCategory(topic);
                  document.getElementById("latest-stories")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                aria-pressed={activeCategory === topic}
                className={`rounded-full border px-3.5 py-2 text-xs transition-colors cursor-pointer ${
                  activeCategory === topic
                    ? "border-[var(--cyan-accent)] bg-[var(--cyan-accent)] text-[var(--bg-main)]"
                    : "border-[var(--border-card)] bg-[var(--bg-section)] text-[var(--text-slate)] hover:border-[var(--border-hover)] hover:text-white"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
