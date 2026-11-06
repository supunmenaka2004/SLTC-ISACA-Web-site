/**
 * High-Performance Client-Side Site Data Cache & Image Preloader
 * Eliminates duplicate network waterfalls, enables instant (0ms) tab switching,
 * and preloads images into browser memory.
 */

export interface PublicSiteData {
  theme?: any;
  siteSettings?: any;
  homepage?: any;
  aboutContent?: any;
  team?: any[];
  committee?: any[];
  projects?: any[];
  news?: any[];
  newsCategories?: string[];
}

let memoryCache: PublicSiteData | null = null;
let lastFetchTime = 0;
let inFlightPromise: Promise<PublicSiteData | null> | null = null;
const listeners = new Set<(data: PublicSiteData) => void>();

function preloadImages(data: PublicSiteData) {
  if (typeof window === "undefined") return;

  const urlsToPreload: string[] = [];

  // Preload committee member photos
  data.committee?.forEach((m) => {
    if (m.image && typeof m.image === "string") {
      urlsToPreload.push(m.image);
    }
  });

  // Preload team photos
  data.team?.forEach((t) => {
    if (t.image && typeof t.image === "string") {
      urlsToPreload.push(t.image);
    }
  });

  // Preload news images
  data.news?.slice(0, 10).forEach((n) => {
    if (n.image && typeof n.image === "string") {
      urlsToPreload.push(n.image);
    }
  });

  // Preload logos
  if (data.theme?.logo?.mainLogo) urlsToPreload.push(data.theme.logo.mainLogo);
  if (data.theme?.logo?.transparentLogo) urlsToPreload.push(data.theme.logo.transparentLogo);

  // Silently preload in background
  urlsToPreload.forEach((url) => {
    try {
      const img = new Image();
      img.decoding = "async";
      img.src = url;
    } catch {}
  });
}

export async function getPublicSiteData(forceRefresh = false): Promise<PublicSiteData | null> {
  const now = Date.now();

  // Instant Memory Return if fresh within 4 seconds and not forced
  if (!forceRefresh && memoryCache && now - lastFetchTime < 4000) {
    return memoryCache;
  }

  // Deduplicate concurrent in-flight requests across multiple components
  if (inFlightPromise) {
    return inFlightPromise;
  }

  inFlightPromise = (async () => {
    try {
      const res = await fetch("/api/public/site-data", {
        cache: "no-store",
        headers: { "x-requested-with": "site-data-client" },
      });
      if (res.ok) {
        const data: PublicSiteData = await res.json();
        memoryCache = data;
        lastFetchTime = Date.now();
        preloadImages(data);
        listeners.forEach((fn) => fn(data));
        return data;
      }
    } catch (e) {
      console.warn("Background site-data fetch warning:", e);
    } finally {
      inFlightPromise = null;
    }
    return memoryCache;
  })();

  // If we already have stale data in memory, return it instantly while background request runs!
  if (memoryCache && !forceRefresh) {
    return memoryCache;
  }

  return inFlightPromise;
}

export function subscribeSiteData(callback: (data: PublicSiteData) => void): () => void {
  listeners.add(callback);
  if (memoryCache) {
    callback(memoryCache);
  }
  return () => {
    listeners.delete(callback);
  };
}
