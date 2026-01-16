'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MangaProvider, ReaderPage } from '@/lib/provider';
import { useAppStore } from '@/lib/store';
import { Loader2, ArrowLeft, Settings, AlertCircle, Home, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function ReadPage() {
    const { chapterId } = useParams() as { chapterId: string };
    const router = useRouter();
    const { settings, addToHistory } = useAppStore();

    const [pages, setPages] = useState<ReaderPage[]>([]);
    const [loading, setLoading] = useState(true);
    const [showControls, setShowControls] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [title, setTitle] = useState("Chapter Viewer"); // Store title
    const [prevChapterId, setPrevChapterId] = useState<string | undefined>();
    const [nextChapterId, setNextChapterId] = useState<string | undefined>();
    const [mangaId, setMangaId] = useState<string | undefined>();

    // Reading Mode State
    const [mode, setMode] = useState(settings.readerMode || 'webtoon');
    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    // Tap Handling
    const lastTap = useRef(0);
    const DOUBLE_TAP_DELAY = 300;

    const toggleControls = () => setShowControls(prev => !prev);

    const handleTap = (e: React.MouseEvent) => {
        // Ignore if clicking on buttons/inputs
        if ((e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).closest('button')) {
            return;
        }

        const now = Date.now();
        if (now - lastTap.current < DOUBLE_TAP_DELAY) {
            router.push('/settings');
        } else {
            toggleControls();
        }
        lastTap.current = now;
    };

    // Toggle controls auto-hide
    useEffect(() => {
        if (showControls) {
            const timer = setTimeout(() => setShowControls(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showControls]);

    // Handle scroll for progress (Webtoon Mode)
    useEffect(() => {
        if (mode !== 'webtoon') return;
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollValues = window.scrollY;
            if (totalHeight > 0) {
                const percent = Math.min(100, Math.max(0, (scrollValues / totalHeight) * 100));
                setProgress(percent);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [mode]);

    const loadPages = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { pages: data, meta } = await MangaProvider.getPages(chapterId);
            if (data.length === 0) {
                setError("No pages found for this chapter. It might be locked or processing.");
            }
            setPages(data);

            if (meta) {
                setTitle(meta.mangaTitle || meta.title || "Chapter Viewer");
                // Save History
                addToHistory({
                    mangaId: meta.mangaId,
                    mangaTitle: meta.mangaTitle || "Unknown Title",
                    // FALLBACK: If no cover, use the first page of the chapter
                    mangaCover: meta.mangaCover || (data[0] ? data[0].url : ""),
                    chapterId: meta.chapterId,
                    chapterTitle: meta.title || `Chapter ${meta.number}`,
                    page: 0,
                    readAt: Date.now()
                });
                setPrevChapterId(meta.prevChapterId);
                setNextChapterId(meta.nextChapterId);
                setMangaId(meta.mangaId);
            }
        } catch (e) {
            console.error(e);
            setError("Failed to load chapter. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [chapterId, addToHistory]);

    useEffect(() => {
        loadPages();
    }, [loadPages]);

    // Navigation for Single/Double modes
    const goToPage = (index: number) => {
        if (index >= 0 && index < pages.length) {
            setCurrentPageIndex(index);
            setProgress(((index + 1) / pages.length) * 100);
            window.scrollTo(0, 0);
        }
    };

    const nextPage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        const increment = mode === 'double' ? 2 : 1;
        if (currentPageIndex + increment < pages.length) {
            goToPage(currentPageIndex + increment);
        } else {
            // End of chapter
            alert("End of chapter reached!");
        }
    };

    const prevPage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        const increment = mode === 'double' ? 2 : 1;
        if (currentPageIndex - increment >= 0) {
            goToPage(currentPageIndex - increment);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-background text-foreground z-50">
                <Loader2 className="animate-spin text-primary mb-4" size={50} />
                <p className="font-display text-2xl animate-pulse text-primary">Summoning Pages...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center text-white p-4 text-center space-y-6">
                <AlertCircle size={64} className="text-crimson" />
                <h2 className="font-display text-3xl">Page Load Error</h2>
                <p className="text-gray-400 max-w-md">{error}</p>
                <div className="flex gap-4">
                    <Button onClick={loadPages} variant="crimson" className="rounded-full px-8">
                        Retry
                    </Button>
                    <Link href="/browse">
                        <Button variant="outline" className="rounded-full px-8">
                            Return to Browse
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    // --- RENDER CONTENT BASED ON MODE ---
    const renderContent = () => {
        if (mode === 'webtoon') {
            return (
                <div
                    className="max-w-4xl mx-auto flex flex-col items-center min-h-screen bg-black relative z-10 py-20 md:py-0 cursor-pointer"
                    onClick={handleTap}
                >
                    {pages.map((page) => (
                        <div key={page.index} className="w-full relative shadow-2xl">
                            <img
                                src={page.url}
                                loading="lazy"
                                alt={`Page ${page.index + 1}`}
                                className="w-full h-auto block"
                            />
                        </div>
                    ))}
                    {/* Chapter Navigation */}
                    <div className="py-12 text-center w-full bg-card mt-4 z-50 relative border-t-2 border-border">
                        <div className="max-w-md mx-auto space-y-4 px-4">
                            <div className="flex gap-3 justify-center">
                                {prevChapterId && (
                                    <Button
                                        onClick={() => router.push(`/read/${encodeURIComponent(prevChapterId)}`)}
                                        variant="outline"
                                        size="lg"
                                        className="flex-1 text-lg"
                                    >
                                        <ChevronLeft /> Previous
                                    </Button>
                                )}
                                {nextChapterId && (
                                    <Button
                                        onClick={() => router.push(`/read/${encodeURIComponent(nextChapterId)}`)}
                                        variant="crimson"
                                        size="lg"
                                        className="flex-1 text-lg"
                                    >
                                        Next <ChevronRight />
                                    </Button>
                                )}
                            </div>
                            {mangaId && (
                                <Link href={`/manga/${encodeURIComponent(mangaId)}`}>
                                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                                        ← Back to Manga Details
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        // Single & Double Page Logic
        const currentImages = [];
        if (mode === 'single') {
            currentImages.push(pages[currentPageIndex]);
        } else if (mode === 'double') {
            currentImages.push(pages[currentPageIndex]);
            if (currentPageIndex + 1 < pages.length) {
                currentImages.push(pages[currentPageIndex + 1]);
            }
        }

        return (
            <div className="flex-1 flex items-center justify-center min-h-screen h-full pb-20 pt-20" onClick={handleTap}>
                <div className={cn("flex gap-2 max-w-full max-h-screen p-2", mode === 'double' ? "flex-row" : "flex-col")}>
                    {currentImages.map((page, idx) => page ? (
                        <img
                            key={idx}
                            src={page.url}
                            className="max-h-[85vh] max-w-full object-contain mx-auto shadow-2xl border-4 border-black"
                            alt={`Page ${page.index + 1}`}
                        />
                    ) : null)}
                </div>

                {/* Navigation Areas (Invisible) */}
                <div className="fixed inset-y-0 left-0 w-1/4 z-20 cursor-w-resize" onClick={prevPage} title="Previous Page" />
                <div className="fixed inset-y-0 right-0 w-1/4 z-20 cursor-e-resize" onClick={nextPage} title="Next Page" />
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-background text-foreground relative">
            {/* Top Bar */}
            <div className={cn(
                "fixed top-0 left-0 right-0 bg-card border-b-2 border-black p-4 flex items-center justify-between z-50 transition-transform duration-300",
                showControls ? "translate-y-0" : "-translate-y-full"
            )}>
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="text-foreground hover:text-primary transition-colors relative z-50">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex flex-col">
                        <span className="font-display text-foreground text-lg leading-none truncate w-32 md:w-auto">{title}</span>
                        <span className="text-xs text-muted-foreground">
                            {mode === 'webtoon' ? `${pages.length} Pages` : `Page ${currentPageIndex + 1} / ${pages.length}`}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 relative z-50">
                    <div className="hidden md:flex bg-muted rounded-full p-1 gap-1 ink-border">
                        {(['webtoon', 'single', 'double'] as const).map((m) => (
                            <button
                                key={m}
                                onClick={() => setMode(m)}
                                className={cn(
                                    "px-3 py-1 rounded-full text-xs font-bold uppercase transition-all",
                                    mode === m ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-card"
                                )}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                    <Link href="/settings">
                        <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
                            <Settings size={24} />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            {renderContent()}

            {/* Hover Zone for Top Bar (Desktop) */}
            <div
                className="fixed top-0 left-0 right-0 h-16 z-40 transition-opacity opacity-0 hover:opacity-100"
                onMouseEnter={() => setShowControls(true)}
            />

            {/* Bottom Bar (Progress) */}
            <div className={cn(
                "fixed bottom-0 left-0 right-0 bg-card border-t-2 border-black p-4 flex items-center justify-between z-40 transition-transform duration-300",
                showControls ? "translate-y-0" : "translate-y-full"
            )}>
                {mode !== 'webtoon' ? (
                    <div className="w-full flex justify-between items-center px-4">
                        <Button onClick={prevPage} disabled={currentPageIndex === 0} variant="outline">
                            <ChevronLeft /> Prev
                        </Button>
                        <span className="font-display text-foreground">
                            {currentPageIndex + 1} / {pages.length}
                        </span>
                        <Button onClick={nextPage} disabled={currentPageIndex >= pages.length - 1} variant="outline">
                            Next <ChevronRight />
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 mr-4">
                            <div className="h-1 bg-gray-700 rounded-full w-full overflow-hidden">
                                <div
                                    className="h-full bg-crimson transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                        <div className="font-display text-white text-sm whitespace-nowrap">
                            {Math.round(progress)}% Read
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
