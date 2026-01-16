'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { MangaCard } from '@/components/MangaCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { BookOpen, Compass, Heart } from 'lucide-react';

const LIBRARY_FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'reading', label: 'Reading' },
    { id: 'plan_to_read', label: 'Plan to Read' },
    { id: 'completed', label: 'Completed' },
    { id: 'dropped', label: 'Dropped' }
] as const;

export default function LibraryPage() {
    const { library } = useAppStore();
    const [activeFilter, setActiveFilter] = useState<string>('all');

    const filteredLibrary = library.filter(manga => {
        if (activeFilter === 'all') return true;
        return manga.status === activeFilter;
    });

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-card border-b-2 border-black">
                <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="font-display text-4xl text-foreground">MY LIBRARY</h1>
                        <span className="bg-crimson text-white px-2 py-1 text-sm font-bold rounded-md transform -rotate-2">
                            {library.length}
                        </span>
                    </div>
                    <Link href="/browse">
                        <Button variant="outline" className="gap-2 hidden sm:flex">
                            <Compass size={20} />
                            Browse More
                        </Button>
                        <Button variant="outline" size="icon" className="sm:hidden">
                            <Compass size={20} />
                        </Button>
                    </Link>
                </div>
            </header>

            <div className="max-w-7xl mx-auto p-4 space-y-8">
                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                    {LIBRARY_FILTERS.map(filter => (
                        <Button
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                            variant={activeFilter === filter.id ? "crimson" : "outline"}
                            className="font-bold min-w-[5rem]"
                        >
                            {filter.label}
                        </Button>
                    ))}
                </div>

                {/* Empty State */}
                {library.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                            <BookOpen size={48} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="font-display text-3xl">Your Library is Empty</h2>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                Looks like you haven't saved any manga yet. Explore the catalog and find something epic to read!
                            </p>
                        </div>
                        <Link href="/browse">
                            <Button size="lg" className="text-xl px-8">
                                Go to Browse
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Grid */}
                {filteredLibrary.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {filteredLibrary.map((manga) => (
                            <MangaCard
                                key={manga.id}
                                id={manga.id}
                                title={manga.title}
                                cover={manga.cover}
                                status={manga.apiStatus}
                                rating={manga.rating}
                                year={manga.year}
                                type={manga.type}
                                follows={0} // Not stored currently, optional
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
