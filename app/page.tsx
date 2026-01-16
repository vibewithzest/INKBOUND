'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { MangaProvider, SearchResult, ORDER_KEYS } from '@/lib/provider';
import { MangaCard } from '@/components/MangaCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Flame, Clock, Star, PlayCircle, History as HistoryIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { history } = useAppStore();
  const [featured, setFeatured] = useState<SearchResult[]>([]);
  const [trending, setTrending] = useState<SearchResult[]>([]);
  const [newest, setNewest] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featData, trendData, newData] = await Promise.all([
          MangaProvider.getFeatured(),
          MangaProvider.search({ limit: 6, orderBy: ORDER_KEYS.WEEKLY_VIEWS }),
          MangaProvider.search({ limit: 12, orderBy: ORDER_KEYS.NEWEST })
        ]);
        setFeatured(featData || []);
        setTrending(trendData?.results || []);
        setNewest(newData?.results || []);
      } catch (e) {
        console.error("Home Data Error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Get latest history items
  const recentHistory = history
    .sort((a, b) => b.readAt - a.readAt)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-background pb-20 space-y-12">

      {/* HERO SECTION */}
      {!loading && featured.length > 0 && (
        <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden group">
          <div className="absolute inset-0 z-0">
            <img
              src={featured[0].cover}
              alt={featured[0].title}
              className="w-full h-full object-cover blur-sm scale-105 opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto h-full px-4 flex flex-col md:flex-row items-center justify-center md:justify-start gap-8 mt-12 md:mt-0">
            {/* Cover Card */}
            <div className="shrink-0 w-48 md:w-64 aspect-[2/3] ink-border rounded-lg shadow-2xl overflow-hidden rotate-[-3deg] group-hover:rotate-0 transition-transform duration-500 hidden md:block">
              <img
                src={featured[0].cover}
                className="w-full h-full object-cover"
                alt="Featured Cover"
              />
            </div>

            {/* Info */}
            <div className="text-center md:text-left space-y-4 max-w-2xl">
              <span className="inline-block bg-crimson text-white px-3 py-1 font-bold text-sm uppercase tracking-wider rounded-md animate-pulse">
                Featured Pick
              </span>
              <h1 className="font-display text-5xl md:text-7xl text-foreground leading-[0.9] text-shadow-sm">
                {featured[0].title}
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl font-medium line-clamp-3 md:line-clamp-none max-w-lg mx-auto md:mx-0">
                {featured[0].description || "Experience the most popular manga of the season. Read it now on Inkbound."}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
                <Link href={`/manga/${encodeURIComponent(featured[0].id)}`}>
                  <Button size="lg" className="text-xl h-14 px-8 rounded-md bg-ink text-white hover:bg-ink/90 ink-shadow transition-all hover:-translate-y-1">
                    Read Now
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="text-xl h-14 px-8 rounded-md hover:bg-muted/20">
                  <Star className="mr-2" /> Add to Library
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SKELETON HERO */}
      {loading && (
        <div className="w-full h-[60vh] bg-muted/20 flex items-center justify-center">
          <Skeleton className="w-[80%] h-64 rounded-xl" />
        </div>
      )}


      <div className="max-w-7xl mx-auto px-4 space-y-16">

        {/* CONTINUE READING */}
        {recentHistory.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b-4 border-ink pb-2">
              <HistoryIcon size={32} className="text-crimson" />
              <h2 className="font-display text-4xl text-foreground mt-1">Continue Reading</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x">
              {recentHistory.map((item) => (
                <Link
                  key={`${item.mangaId}-${item.chapterId}`}
                  href={`/read/${encodeURIComponent(item.chapterId)}`}
                  className="snap-start shrink-0 w-64 md:w-80 group relative overflow-hidden rounded-xl border-2 border-border bg-card hover:-translate-y-1 transition-transform shadow-md"
                >
                  <div className="flex items-center gap-4 p-3">
                    <div className="w-16 h-24 shrink-0 rounded-md overflow-hidden bg-muted">
                      {item.mangaCover ? (
                        <img src={item.mangaCover} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-xs">N/A</div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 min-w-0">
                      <h3 className="font-display text-lg text-foreground truncate w-full">{item.mangaTitle || 'Untitled'}</h3>
                      <span className="text-sm font-bold text-crimson truncate">{item.chapterTitle}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.readAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="ml-auto pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <PlayCircle size={32} className="fill-crimson text-white" />
                    </div>
                  </div>
                  <div className="h-1 w-full bg-muted mt-0">
                    <div className="h-full bg-crimson w-1/2" /> {/* Mock progress */}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}


        {/* TRENDING */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-4 border-ink pb-2">
            <div className="flex items-center gap-3">
              <Flame size={32} className="text-orange-500 fill-orange-500" />
              <h2 className="font-display text-4xl text-foreground mt-1">Trending Now</h2>
            </div>
            <Link href="/browse?sort=views_7d">
              <Button variant="outline" className="font-bold">View All</Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {loading
              ? Array(6).fill(0).map((_, i) => <Skeleton key={i} className="aspect-[2/3] rounded-md" />)
              : trending.map(manga => (
                <MangaCard
                  key={manga.id}
                  id={manga.id}
                  title={manga.title}
                  cover={manga.cover}
                  year={manga.year}
                  rating={manga.rating}
                  status={manga.status}
                  type={manga.type}
                  compact
                />
              ))
            }
          </div>
        </section>


        {/* NEW RELEASES */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-4 border-ink pb-2">
            <div className="flex items-center gap-3">
              <Clock size={32} className="text-blue-500" />
              <h2 className="font-display text-4xl text-foreground mt-1">New Releases</h2>
            </div>
            <Link href="/browse?sort=created_at">
              <Button variant="outline" className="font-bold">View All</Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {loading
              ? Array(12).fill(0).map((_, i) => <Skeleton key={i} className="aspect-[2/3] rounded-md" />)
              : newest.map(manga => (
                <MangaCard
                  key={manga.id}
                  id={manga.id}
                  title={manga.title}
                  cover={manga.cover}
                  year={manga.year}
                  rating={manga.rating}
                  status={manga.status}
                  type={manga.type}
                />
              ))
            }
          </div>
        </section>

      </div>

    </div>
  );
}
