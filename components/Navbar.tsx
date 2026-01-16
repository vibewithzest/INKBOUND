'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Library, Settings, BookOpen, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export function Navbar() {
    const pathname = usePathname();
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstalled, setIsInstalled] = useState(false);

    const isActive = (path: string) => pathname === path;

    const navItems = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/browse', label: 'Browse', icon: Compass },
        { href: '/library', label: 'Library', icon: Library },
        { href: '/settings', label: 'Settings', icon: Settings },
    ];

    // PWA Install detection
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (window.matchMedia('(display-mode: standalone)').matches) {
                setIsInstalled(true);
            }
            const handlePrompt = (e: Event) => {
                e.preventDefault();
                setDeferredPrompt(e);
            };
            window.addEventListener('beforeinstallprompt', handlePrompt);
            return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
        }
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') setIsInstalled(true);
        setDeferredPrompt(null);
    };

    // Hide navbar on reader page (immersive mode)
    if (pathname.startsWith('/read/')) return null;

    return (
        <>
            {/* Desktop Navbar (Top) */}
            <nav className="fixed top-0 left-0 right-0 z-40 bg-card border-b-2 border-black hidden md:block">
                <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <BookOpen size={24} className="text-crimson group-hover:rotate-12 transition-transform" />
                        <span className="font-display text-xl text-foreground tracking-wide">INKBOUND</span>
                    </Link>

                    {/* Links */}
                    <div className="flex items-center gap-1">
                        {navItems.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-2 ink-border text-sm",
                                        active
                                            ? "bg-crimson text-white"
                                            : "bg-muted text-foreground hover:bg-card"
                                    )}
                                >
                                    <item.icon size={16} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* Mobile Top Header */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-card border-b-2 border-black md:hidden">
                <div className="px-4 h-12 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <BookOpen size={22} className="text-crimson" />
                        <span className="font-display text-lg text-foreground">INKBOUND</span>
                    </Link>

                    {/* Quick Install Button */}
                    {!isInstalled && deferredPrompt && (
                        <button
                            onClick={handleInstall}
                            className="flex items-center gap-1 px-3 py-1 bg-crimson text-white rounded-md ink-border text-sm font-bold"
                        >
                            <Download size={16} /> Install
                        </button>
                    )}
                    {!isInstalled && !deferredPrompt && (
                        <Link href="/help" className="flex items-center gap-1 px-2 py-1 bg-muted text-foreground rounded-md text-sm font-bold">
                            <Download size={16} />
                        </Link>
                    )}
                </div>
            </header>

            {/* Mobile Navbar (Bottom) */}
            <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t-2 border-border md:hidden pb-safe">
                <div className="flex justify-around items-center h-14">
                    {navItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center w-full h-full p-1 transition-colors",
                                    active ? "text-crimson" : "text-muted-foreground"
                                )}
                            >
                                <item.icon size={active ? 24 : 22} strokeWidth={active ? 2.5 : 2} />
                                <span className="text-[10px] font-bold uppercase mt-0.5">
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Spacer for Desktop */}
            <div className="hidden md:block h-14" />

            {/* Spacer for Mobile (top + bottom) */}
            <div className="md:hidden h-12" />
        </>
    );
}

