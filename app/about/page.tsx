'use client';

import { BookOpen, Sparkles, MessageCircle, Github, Mail, Heart, Rocket, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
    const changelog = [
        {
            version: "1.0.0",
            date: "January 2026",
            title: "Initial Release",
            changes: [
                "📖 Read manga in Webtoon, Single Page, or Double Page mode",
                "📚 Save your favorite manga to your personal Library",
                "📊 Track what you're Reading, Plan to Read, Completed, or Dropped",
                "🔍 Search and filter thousands of titles",
                "⏱️ Continue reading where you left off",
                "📱 Install as an app on your phone or computer",
                "🌙 Switch between Dark and Light themes",
                "💾 Backup and restore your library",
            ]
        }
    ];

    const roadmap = [
        { status: 'planned', title: 'Offline Reading', desc: 'Download chapters for offline viewing' },
        { status: 'planned', title: 'Push Notifications', desc: 'Get notified when new chapters release' },
        { status: 'planned', title: 'Sync Across Devices', desc: 'Cloud sync for library and progress' },
        { status: 'planned', title: 'Multiple Sources', desc: 'Add more manga providers as fallback' },
        { status: 'planned', title: 'Reading Stats', desc: 'Track reading time and stats' },
        { status: 'planned', title: 'Custom Lists', desc: 'Create custom collection lists' },
    ];

    return (
        <div className="min-h-screen bg-background pb-20 px-4">
            <div className="max-w-3xl mx-auto py-8 space-y-12">

                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="bg-crimson p-4 rounded-lg ink-border">
                            <BookOpen size={48} className="text-white" />
                        </div>
                    </div>
                    <h1 className="font-display text-5xl text-foreground">ABOUT INKBOUND</h1>
                    <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                        Your premium manga reader. Built with love for the manga community.
                    </p>
                </div>

                {/* Changelog */}
                <section className="space-y-6">
                    <h2 className="font-display text-3xl text-foreground border-b-2 border-border pb-2 flex items-center gap-2">
                        <Sparkles size={28} /> Changelog
                    </h2>

                    {changelog.map((release) => (
                        <div key={release.version} className="bg-card p-6 rounded-lg ink-border space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-display text-2xl text-foreground">
                                    v{release.version} - {release.title}
                                </h3>
                                <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                                    {release.date}
                                </span>
                            </div>
                            <ul className="space-y-2">
                                {release.changes.map((change, idx) => (
                                    <li key={idx} className="text-muted-foreground text-sm flex items-start gap-2">
                                        <CheckCircle2 size={16} className="text-green-600 mt-0.5 shrink-0" />
                                        {change}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </section>

                {/* Roadmap */}
                <section className="space-y-6">
                    <h2 className="font-display text-3xl text-foreground border-b-2 border-border pb-2 flex items-center gap-2">
                        <Clock size={28} /> Upcoming Features
                    </h2>

                    <div className="grid gap-4 md:grid-cols-2">
                        {roadmap.map((item, idx) => (
                            <div key={idx} className="bg-muted p-4 rounded-lg border-2 border-border space-y-2">
                                <h3 className="font-bold text-foreground">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                                <span className="inline-block text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-bold uppercase">
                                    Planned
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact / Suggestions */}
                <section className="space-y-6">
                    <h2 className="font-display text-3xl text-foreground border-b-2 border-border pb-2 flex items-center gap-2">
                        <MessageCircle size={28} /> Suggestions & Support
                    </h2>

                    <div className="bg-card p-6 rounded-lg ink-border space-y-4">
                        <p className="text-muted-foreground">
                            Have a feature request, found a bug, or just want to say hi?
                            We'd love to hear from you!
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="gap-2">
                                    <Github size={18} /> GitHub Issues
                                </Button>
                            </a>
                            <a href="mailto:support@inkbound.app">
                                <Button variant="outline" className="gap-2">
                                    <Mail size={18} /> Email Support
                                </Button>
                            </a>
                            <a href="https://discord.gg/inkbound" target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="gap-2">
                                    <MessageCircle size={18} /> Discord
                                </Button>
                            </a>
                        </div>
                    </div>
                </section>

                {/* Credits */}
                <section className="text-center space-y-4 pt-8 border-t border-border">
                    <p className="text-muted-foreground flex items-center justify-center gap-2">
                        Made with <Heart size={16} className="text-crimson fill-crimson" /> for manga lovers
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Not affiliated with any manga publishers
                    </p>
                    <Link href="/">
                        <Button variant="ghost" size="sm">← Back to Home</Button>
                    </Link>
                </section>

            </div>
        </div>
    );
}
