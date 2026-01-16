'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MangaProvider, Chapter, SearchResult, GENRE_LIST } from '@/lib/provider';
import { useAppStore } from '@/lib/store';
import { Loader2, BookOpen, Clock, Heart, ArrowLeft, Star, Calendar, Users, Eye, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function MangaDetailsPage() {
    const { id } = useParams() as { id: string }; // 'cx:...'
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [info, setInfo] = useState<SearchResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [showStatusMenu, setShowStatusMenu] = useState(false);

    const { addToLibrary, removeFromLibrary, updateStatus, library, settings } = useAppStore();
    const isInLib = library.some(m => m.id === decodeURIComponent(id));
    const currentStatus = library.find(m => m.id === decodeURIComponent(id))?.status || 'plan_to_read';
    const currentId = decodeURIComponent(id);

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, settings?.defaultLanguage]);

    const loadData = async () => {
        setLoading(true);
        try {
            const cleanId = decodeURIComponent(id);
            const [details, chaps] = await Promise.all([
                MangaProvider.getMangaDetails(cleanId),
                MangaProvider.getAllChapters(cleanId, settings?.defaultLanguage || 'en')
            ]);

            setInfo(details);
            setChapters(chaps);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const toggleLibrary = () => {
        if (!info) return;

        if (isInLib) {
            if (confirm(`Remove "${info.title}" from library?`)) {
                removeFromLibrary(info.id);
            }
        } else {
            addToLibrary({
                id: info.id,
                title: info.title,
                cover: info.cover,
                status: 'plan_to_read',
                apiStatus: info.status,
                rating: info.rating,
                year: info.year,
                type: info.type
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background pb-20">
                {/* Skeleton Hero */}
                <div className="relative h-[40vh] bg-muted animate-pulse overflow-hidden">
                    <div className="absolute inset-0 bg-black/20" />
                </div>
                <div className="max-w-5xl mx-auto px-4 -mt-32 relative z-10 space-y-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        <Skeleton className="w-64 h-96 shrink-0 rounded-lg shadow-xl" />
                        <div className="pt-32 md:pt-0 space-y-4 flex-1">
                            <Skeleton className="h-12 w-3/4" />
                            <Skeleton className="h-6 w-1/3" />
                            <div className="flex gap-2">
                                <Skeleton className="h-8 w-20" />
                                <Skeleton className="h-8 w-20" />
                            </div>
                            <Skeleton className="h-32 w-full" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!info) return <div className="p-20 text-center font-display text-2xl">Manga Not Found</div>;

    const formattedRating = info.rating ? info.rating.toFixed(2) : 'N/A';
    const cleanDescription = info.description?.replace(/<[^>]*>?/gm, '') || 'No description available.';

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* HEROBANNER BACKGROUND */}
            <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center blur-xl opacity-50 scale-110"
                    style={{ backgroundImage: `url(${info.cover})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background/90" />

                <div className="absolute top-4 left-4 z-20">
                    <Link href="/browse" className="items-center gap-2 px-4 py-2 bg-muted hover:bg-card text-foreground rounded-md ink-border transition-colors inline-flex font-bold">
                        <ArrowLeft size={18} /> Back
                    </Link>
                </div>
            </div>

            {/* CONTENT CONTAINER */}
            <div className="max-w-6xl mx-auto px-4 -mt-32 md:-mt-48 relative z-10 space-y-12">

                {/* HERO SECTION */}
                <div className="flex flex-col md:flex-row gap-8 items-start">

                    {/* Cover Image */}
                    <div className="w-full md:w-72 shrink-0 group perspective">
                        <div className="relative aspect-[2/3] rounded-lg ink-border shadow-2xl overflow-hidden bg-card hover:scale-[1.02] transition-transform duration-300">
                            <img
                                src={info.cover}
                                alt={info.title}
                                className="w-full h-full object-cover"
                            />
                            {info.status === 'completed' && (
                                <div className="absolute top-4 right-[-30px] rotate-45 bg-crimson text-white px-8 py-1 font-bold shadow-md">
                                    END
                                </div>
                            )}
                        </div>

                        {/* Library Button (Mobile/Desktop) */}
                        <div className="space-y-2 mt-4">
                            <Button
                                onClick={toggleLibrary}
                                size="lg"
                                className={cn(
                                    "w-full text-xl h-auto py-3 ink-border transition-all active:scale-95 shadow-md",
                                    isInLib
                                        ? "bg-green-100 text-green-800 border-green-800 hover:bg-green-200"
                                        : "bg-crimson text-white hover:bg-crimson/90"
                                )}
                            >
                                <Heart className={cn(isInLib && "fill-current")} />
                                {isInLib ? "IN LIBRARY" : "ADD TO LIBRARY"}
                            </Button>

                            {isInLib && (
                                <div className="relative">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-between"
                                        onClick={() => setShowStatusMenu(!showStatusMenu)}
                                    >
                                        <span className="opacity-70">Status:</span>
                                        <span className="font-bold uppercase">{currentStatus?.replace(/_/g, ' ')}</span>
                                        <ChevronDown size={16} className={cn("transition-transform", showStatusMenu && "rotate-180")} />
                                    </Button>

                                    {showStatusMenu && (
                                        <div className="absolute top-full left-0 right-0 mt-2 flex flex-col gap-1 z-50 animate-in fade-in slide-in-from-top-2">
                                            {[
                                                { id: 'reading', label: 'Reading' },
                                                { id: 'plan_to_read', label: 'Plan to Read' },
                                                { id: 'completed', label: 'Completed' },
                                                { id: 'dropped', label: 'Dropped' }
                                            ].map((status) => (
                                                <button
                                                    key={status.id}
                                                    className={cn(
                                                        "px-4 py-3 text-left font-bold transition-all flex items-center justify-between border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                                                        currentStatus === status.id
                                                            ? "bg-crimson text-white"
                                                            : "bg-muted text-foreground hover:bg-card"
                                                    )}
                                                    onClick={() => {
                                                        const validStatus = status.id as import('@/lib/store').Manga['status'];
                                                        if (validStatus) {
                                                            updateStatus(currentId, validStatus);
                                                            setShowStatusMenu(false);
                                                        }
                                                    }}
                                                >
                                                    {status.label}
                                                    {currentStatus === status.id && <Check size={16} strokeWidth={4} />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 space-y-6 pt-4 md:pt-12 text-foreground">
                        <div>
                            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground leading-none drop-shadow-sm mb-2">
                                {info.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-crimson font-display flex items-center gap-2">
                                <span>{info.author || 'Unknown Author'}</span>
                                {info.year && <span className="text-muted-foreground text-lg">• {info.year}</span>}
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-card/80 backdrop-blur-sm p-3 rounded-lg border border-ink/10 flex flex-col items-center justify-center text-center">
                                <span className="text-2xl font-bold flex items-center gap-1">
                                    {formattedRating} <Star size={20} className="fill-yellow-400 text-yellow-500" />
                                </span>
                                <span className="text-xs uppercase font-bold text-muted-foreground">Rating</span>
                            </div>
                            <div className="bg-card p-3 rounded-lg border border-border flex flex-col items-center justify-center text-center">
                                <span className="text-2xl font-bold flex items-center gap-1">
                                    {(info.follows || 0).toLocaleString()} <Users size={20} className="text-blue-500" />
                                </span>
                                <span className="text-xs uppercase font-bold text-muted-foreground">Follows</span>
                            </div>
                            <div className="bg-card p-3 rounded-lg border border-border flex flex-col items-center justify-center text-center">
                                <span className="text-xl font-bold uppercase truncate w-full">
                                    {info.status || 'Ongoing'}
                                </span>
                                <span className="text-xs uppercase font-bold text-muted-foreground">Status</span>
                            </div>
                            <div className="bg-card p-3 rounded-lg border border-border flex flex-col items-center justify-center text-center">
                                <span className="text-xl font-bold uppercase truncate w-full">
                                    {info.type || 'Manga'}
                                </span>
                                <span className="text-xs uppercase font-bold text-muted-foreground">Type</span>
                            </div>
                        </div>

                        {/* Genres */}
                        <div className="flex flex-wrap gap-2">
                            {info.tags?.map(tag => {
                                const genreId = GENRE_LIST.find(g => g.name.toLowerCase() === tag.toLowerCase())?.id;
                                return genreId ? (
                                    <Link key={tag} href={`/browse?genres=${genreId}`}>
                                        <Badge variant="secondary" className="px-3 py-1 text-sm bg-card border border-ink/20 shadow-sm hover:bg-ink hover:text-white transition-colors cursor-pointer">
                                            {tag}
                                        </Badge>
                                    </Link>
                                ) : (
                                    <Badge key={tag} variant="secondary" className="px-3 py-1 text-sm bg-card border border-ink/20 shadow-sm opacity-70">
                                        {tag}
                                    </Badge>
                                );
                            })}
                        </div>

                        {/* Description */}
                        <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
                            <h3 className="font-display text-xl mb-2 text-foreground/80">Synopsis</h3>
                            <p className="text-muted-foreground leading-relaxed text-lg line-clamp-[10]">
                                {cleanDescription}
                            </p>
                        </div>
                    </div>
                </div>

                {/* CHAPTERS SECTION */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b-4 border-crimson pb-2">
                        <div className="flex items-center gap-4">
                            <h2 className="font-display text-4xl text-foreground">Chapters</h2>
                            <Badge variant="crimson" className="text-lg px-3 py-1 bg-crimson text-white">
                                {chapters.length}
                            </Badge>
                        </div>
                        {/* Potential sorting controls here */}
                    </div>

                    <div className="grid gap-3">
                        {chapters.map((ch) => (
                            <Link
                                key={ch.id}
                                href={`/read/${ch.id}`}
                                className="group relative bg-card p-4 rounded-lg border-2 border-transparent hover:border-black hover:scale-[1.005] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center font-display text-xl group-hover:bg-crimson group-hover:text-white transition-colors shrink-0">
                                        {ch.number === 'null' || !ch.number ? '#' : ch.number}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg group-hover:text-crimson transition-colors">
                                            {ch.title && ch.title !== 'null' ? ch.title : `Chapter ${ch.number}`}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                                            {ch.scanGroup && (
                                                <span className="flex items-center gap-1">
                                                    <Users size={12} /> {ch.scanGroup}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} /> {ch.date}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mr-4 opacity-0 group-hover:opacity-100 transition-opacity text-crimson font-display font-bold text-lg">
                                    READ ➤
                                </div>
                            </Link>
                        ))}
                        {chapters.length === 0 && (
                            <div className="text-center py-20 text-muted-foreground font-display text-xl opacity-50">
                                No chapters found yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
