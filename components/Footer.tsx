'use client';

import Link from 'next/link';
import { BookOpen, Github, Twitter, Heart } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Footer() {
    const pathname = usePathname();

    // Hide footer on reader page
    if (pathname.startsWith('/read/')) return null;

    const currentYear = new Date().getFullYear();

    const legalLinks = [
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/terms', label: 'Terms of Service' },
        { href: '/dmca', label: 'DMCA' },
        { href: '/disclaimer', label: 'Disclaimer' },
    ];

    const siteLinks = [
        { href: '/help', label: 'Install App' },
        { href: '/browse', label: 'Browse Manga' },
        { href: '/library', label: 'My Library' },
        { href: '/about', label: 'About / Changelog' },
        { href: '/settings', label: 'Settings' },
    ];

    return (
        <footer className="bg-card border-t-2 border-border mt-auto pb-20 md:pb-0">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

                    {/* Brand */}
                    <div className="md:col-span-2 space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <BookOpen size={28} className="text-crimson" />
                            <span className="font-display text-2xl text-foreground">INKBOUND</span>
                        </Link>
                        <p className="text-muted-foreground text-sm max-w-md">
                            Your ultimate destination for manga, manhwa, and manhua.
                            Read your favorite comics with style, anywhere, anytime.
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Made with <Heart size={12} className="inline text-crimson fill-crimson" /> for manga lovers
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-3">
                        <h3 className="font-display text-lg text-foreground">Quick Links</h3>
                        <ul className="space-y-2">
                            {siteLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-crimson transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="space-y-3">
                        <h3 className="font-display text-lg text-foreground">Legal</h3>
                        <ul className="space-y-2">
                            {legalLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-crimson transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-border pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        {/* Copyright */}
                        <p className="text-xs text-muted-foreground text-center md:text-left">
                            © {currentYear} Inkbound. All rights reserved.
                            <br className="md:hidden" />
                            <span className="md:ml-2">Not affiliated with any manga publishers.</span>
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Github size={20} />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <p className="text-[10px] text-muted-foreground/60 text-center mt-4 max-w-2xl mx-auto">
                        Inkbound does not store any files on its servers. All content is provided by third-party sources.
                        We respect intellectual property rights. If you believe your content has been used inappropriately, please contact us.
                    </p>
                </div>
            </div>
        </footer>
    );
}
