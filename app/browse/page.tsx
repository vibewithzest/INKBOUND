'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Loader2, ArrowUpRight, Settings, Filter } from 'lucide-react';
import { MangaProvider, SearchFilters, SearchResult, GENRE_LIST, LANGUAGES, SORT_OPTIONS, STATUSES } from '@/lib/provider';
import { useAppStore } from '@/lib/store';
import { MangaCard } from '@/components/MangaCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function BrowsePage() {
    // Search State
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    // Filter State
    const [showFilters, setShowFilters] = useState(false);
    const { library, settings, updateSettings } = useAppStore();
    const [filters, setFilters] = useState<SearchFilters>({
        sort: 'views_30d',
        status: undefined,
        genres: [],
        type: undefined,
        includeNSFW: settings.includeNSFW,
        limit: 24
    });

    // Data State
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isInitial, setIsInitial] = useState(true);

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);
        return () => clearTimeout(timer);
    }, [query]);

    // Fetch Data
    const fetchData = useCallback(async (reset = false) => {
        setLoading(true);
        const currentPage = reset ? 1 : page;

        // If sorting by relevance (default) but no query, force trending view sort
        const effectiveSort = (filters.sort === 'relevance' && !debouncedQuery) ? 'views_30d' : filters.sort;

        try {
            const { results } = await MangaProvider.search(debouncedQuery, {
                page: currentPage,
                limit: 24,
                genres: filters.genres,
                status: filters.status,
                sort: effectiveSort,
                type: filters.type,
                includeNSFW: filters.includeNSFW
            });

            if (reset) {
                setResults(results);
                setPage(2);
            } else {
                setResults(prev => [...prev, ...results]);
                setPage(prev => prev + 1);
            }
            setHasMore(results.length === 24);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            if (reset) setIsInitial(false);
        }
    }, [debouncedQuery, filters, page]);

    // Initial Load & Filter Changes
    useEffect(() => {
        fetchData(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedQuery, filters.sort, filters.status, filters.genres, filters.type, filters.includeNSFW]);

    // Toggle Genre Helper
    const toggleGenre = (id: number) => {
        setFilters(prev => {
            const current = prev.genres || [];
            if (current.includes(id)) {
                return { ...prev, genres: current.filter(g => g !== id) };
            } else {
                return { ...prev, genres: [...current, id] };
            }
        });
    };

    return (
        <div className="min-h-screen pb-20">
            {/* Header / Search Bar */}
            <div className="z-30 bg-card border-b-2 border-black shadow-sm transition-colors">
                {/* Title & Search */}
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex gap-2 w-full max-w-2xl">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search titles..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-l-md bg-muted text-foreground ink-border border-r-0 font-body text-lg focus:outline-none focus:bg-card transition-colors shadow-none"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={cn(
                                "px-4 rounded-r-md ink-border border-l-0 transition-colors flex items-center gap-2 font-display text-lg",
                                showFilters ? "bg-card" : "bg-muted hover:bg-card"
                            )}
                        >
                            <Filter size={20} />
                            <span className="hidden sm:inline">Filters</span>
                        </button>
                    </div>
                </div>

                {/* Filter Panel (Collapsible) */}
                {showFilters && (
                    <div className="border-b border-border bg-muted">
                        <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-4 gap-6 animate-in slide-in-from-top-2">

                            {/* Sort */}
                            <div className="space-y-2">
                                <h3 className="font-display text-lg text-foreground">Sort By</h3>
                                <div className="flex flex-wrap gap-2">
                                    {SORT_OPTIONS.map(opt => (
                                        <Button
                                            key={opt.value}
                                            onClick={() => setFilters({ ...filters, sort: opt.value })}
                                            variant={filters.sort === opt.value ? "crimson" : "outline"}
                                            size="sm"
                                            className="rounded-md h-9 min-w-[5rem] font-bold"
                                        >
                                            {opt.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <h3 className="font-display text-lg text-foreground">Status</h3>
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        onClick={() => setFilters({ ...filters, status: undefined })}
                                        variant={!filters.status ? "default" : "outline"}
                                        size="sm"
                                        className={cn("rounded-md h-9 min-w-[5rem] font-bold", !filters.status ? "bg-primary text-primary-foreground hover:bg-primary/90" : "")}
                                    >
                                        All
                                    </Button>
                                    {STATUSES.map(opt => (
                                        <Button
                                            key={opt.value}
                                            onClick={() => setFilters({ ...filters, status: opt.value })}
                                            variant={filters.status === opt.value ? "default" : "outline"}
                                            size="sm"
                                            className={cn("rounded-md h-9 min-w-[5rem] font-bold", filters.status === opt.value ? "bg-primary text-primary-foreground hover:bg-primary/90" : "")}
                                        >
                                            {opt.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* NSFW Toggle */}
                            <div className="space-y-2">
                                <h3 className="font-display text-lg text-foreground">Content</h3>
                                <Button
                                    onClick={() => {
                                        const newValue = !filters.includeNSFW;
                                        setFilters({ ...filters, includeNSFW: newValue });
                                        updateSettings({ includeNSFW: newValue });
                                    }}
                                    variant="outline"
                                    className={cn(
                                        "rounded-md border-2 gap-2 h-10 font-bold",
                                        filters.includeNSFW
                                            ? "bg-pink-600 text-white border-pink-600 hover:bg-pink-700"
                                            : "text-gray-500 border-gray-300 hover:border-pink-400"
                                    )}
                                >
                                    <span className="text-lg">🔞</span>
                                    {filters.includeNSFW ? "18+ Enabled" : "SFW Only"}
                                </Button>
                                {filters.includeNSFW && (
                                    <p className="text-xs text-pink-600 font-medium">Adult content visible</p>
                                )}
                            </div>

                            {/* Type */}
                            <div className="space-y-2">
                                <h3 className="font-display text-lg text-foreground">Type</h3>
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        onClick={() => setFilters({ ...filters, type: undefined })}
                                        variant="outline"
                                        size="sm"
                                        className={cn(
                                            "rounded-md h-9 min-w-[5rem] font-bold",
                                            !filters.type ? "bg-purple-600 text-white border-purple-600 hover:bg-purple-700" : "hover:border-purple-400"
                                        )}
                                    >
                                        All
                                    </Button>
                                    {['manga', 'manhwa', 'manhua'].map(t => (
                                        <Button
                                            key={t}
                                            onClick={() => setFilters({ ...filters, type: t })}
                                            variant="outline"
                                            size="sm"
                                            className={cn(
                                                "rounded-md h-9 min-w-[5rem] capitalize font-bold",
                                                filters.type === t
                                                    ? t === 'manhwa' ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                                                        : t === 'manhua' ? "bg-green-600 text-white border-green-600 hover:bg-green-700"
                                                            : "bg-purple-600 text-white border-purple-600 hover:bg-purple-700"
                                                    : "hover:border-purple-400"
                                            )}
                                        >
                                            {t}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Genres */}
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <h3 className="font-display text-lg text-foreground">Genres</h3>
                                <div className="flex flex-wrap gap-1.5 h-32 overflow-y-auto pr-2 custom-scrollbar">
                                    {GENRE_LIST.map(genre => {
                                        const isSelected = filters.genres?.includes(genre.id);
                                        return (
                                            <Button
                                                key={genre.id}
                                                onClick={() => toggleGenre(genre.id)}
                                                variant={isSelected ? "crimson" : "outline"}
                                                size="sm"
                                                className="text-xs h-7 px-2 uppercase tracking-slate-200"
                                            >
                                                {genre.name}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>



            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 mt-8 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="font-display text-3xl text-foreground border-l-8 border-crimson pl-4">
                        {debouncedQuery ? `Results for "${debouncedQuery}"` : 'Discover Manga'}
                    </h2>
                    <span className="text-muted-foreground font-bold">
                        {results.length} Titles
                    </span>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
                    {/* Render Results */}
                    {results.map((manga) => (
                        <MangaCard
                            key={manga.id}
                            id={manga.id}
                            title={manga.title}
                            cover={manga.cover}
                            status={manga.status}
                            rating={manga.rating}
                            year={manga.year}
                            follows={manga.follows}
                            type={manga.type}
                        />
                    ))}

                    {/* Loading Skeletons */}
                    {loading && Array.from({ length: results.length > 0 ? 6 : 12 }).map((_, i) => (
                        <MangaCard
                            key={`skeleton-${i}`}
                            id="skeleton"
                            title=""
                            cover=""
                            loading={true}
                        />
                    ))}
                </div>

                {/* Pagination / Empty State */}
                {!loading && results.length === 0 && (
                    <div className="text-center py-20 opacity-50 space-y-4">
                        <div className="text-6xl">🕸️</div>
                        <div className="font-display text-2xl">No manga found in the ink.</div>
                        <button
                            onClick={() => {
                                setQuery('');
                                setFilters({ genres: [], status: undefined, sort: 'views_30d', type: undefined });
                            }}
                            className="text-crimson hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                )}

                {hasMore && !loading && results.length > 0 && (
                    <div className="flex justify-center pt-8">
                        <button
                            onClick={() => fetchData()}
                            className="px-8 py-3 bg-card border-2 border-border hover:bg-primary hover:text-white transition-colors font-display text-xl rounded-full"
                        >
                            Load More Ink
                        </button>
                    </div>
                )}
            </div>
        </div >
    );
}
