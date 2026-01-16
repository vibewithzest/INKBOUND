'use client';

import { Plus, Check, Star, Calendar } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface MangaCardProps {
    id: string;
    title: string;
    cover: string;
    status?: string;
    rating?: number;
    year?: number;
    follows?: number;
    type?: string;  // NEW: manga, manhwa, manhua
    compact?: boolean;
    loading?: boolean;
}

export function MangaCard({
    id,
    title,
    cover,
    status,
    rating,
    year,
    follows,
    type,
    compact,
    loading
}: MangaCardProps) {
    const { library, addToLibrary, removeFromLibrary } = useAppStore();
    const isInLib = library.some(m => m.id === id);

    const toggleLibrary = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isInLib) {
            if (confirm(`Remove "${title}" from library?`)) {
                removeFromLibrary(id);
            }
        } else {
            addToLibrary({
                id,
                title,
                cover,
                status: 'plan_to_read',
                apiStatus: status, // Save original API status
                rating,
                year,
                type
            });
        }
    };

    if (loading) {
        return (
            <div className="space-y-3">
                <Skeleton className={cn("w-full rounded-md", compact ? "aspect-[3/4]" : "aspect-[2/3]")} />
                <div className="space-y-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
        );
    }

    // Determine badge
    const showHotBadge = (follows && follows > 50000) || (rating && rating > 8.5);
    const showNewBadge = year === new Date().getFullYear();

    return (
        <div className="group relative flex flex-col gap-2">
            {/* Cover Container */}
            <Link
                href={`/manga/${encodeURIComponent(id)}`}
                className={cn(
                    "relative block overflow-hidden rounded-md ink-border bg-muted transition-all group-hover:-translate-y-1 group-hover:shadow-[4px_4px_0px_0px_var(--border)]",
                    compact ? "aspect-[3/4]" : "aspect-[2/3]"
                )}
            >
                {cover ? (
                    <img
                        src={cover}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground font-display text-xl p-4 text-center">
                        NO COVER
                    </div>
                )}

                {/* Overlay & Badges */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                    {showHotBadge && <Badge variant="crimson" className="font-bold">HOT</Badge>}
                    {showNewBadge && <Badge className="bg-blue-600 text-white font-bold">NEW</Badge>}
                    {status === 'completed' && <Badge variant="secondary" className="font-bold">END</Badge>}
                </div>

                {/* Stats Overlay on Hover */}
                {rating && (
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity delay-75">
                        <Star className="fill-yellow-400 text-yellow-400" size={12} />
                        <span>{rating.toFixed(1)}</span>
                    </div>
                )}

                {year && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity delay-75">
                        <Calendar size={12} />
                        <span>{year}</span>
                    </div>
                )}

                {/* Library Button */}
                <button
                    onClick={toggleLibrary}
                    className={cn(
                        "absolute top-2 right-2 p-1.5 rounded-full ink-border transition-all z-20 hover:scale-110 active:scale-95",
                        isInLib
                            ? "bg-green-500 text-white"
                            : "bg-muted text-foreground hover:bg-crimson hover:text-white"
                    )}
                    title={isInLib ? "Remove from Library" : "Add to Library"}
                >
                    {isInLib ? <Check size={14} strokeWidth={4} /> : <Plus size={14} strokeWidth={4} />}
                </button>
            </Link>

            {/* Title Info */}
            <div>
                <Link href={`/manga/${encodeURIComponent(id)}`} className="block">
                    <h3
                        className="font-display text-sm md:text-base leading-tight line-clamp-2 text-ink group-hover:text-crimson transition-colors"
                        title={title}
                    >
                        {title}
                    </h3>
                </Link>
                {/* Optional extra info line */}
                <div className="flex items-center gap-2 mt-1">
                    <span className={cn(
                        "text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded",
                        type === 'manhwa' && "bg-blue-100 text-blue-700",
                        type === 'manhua' && "bg-green-100 text-green-700",
                        type === 'manga' && "bg-purple-100 text-purple-700",
                        !type && "text-muted-foreground"
                    )}>
                        {type || (status === 'completed' ? 'Completed' : 'Manga')}
                    </span>
                    {status === 'completed' && type && (
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">• END</span>
                    )}
                </div>
            </div>
        </div>
    );
}
