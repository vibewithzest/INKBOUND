'use client';

import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Trash2, AlertTriangle, Settings, BookOpen, Globe, EyeOff, Download, HelpCircle, CheckCircle, Zap, WifiOff, Cpu, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { clearAllCache } from '@/lib/cache';

// ...

export default function SettingsPage() {
    const { settings: rawSettings, updateSettings, library, history } = useAppStore();
    const settings = rawSettings || { includeNSFW: false, defaultLanguage: 'en', readerMode: 'webtoon', dataSaver: false, gpuAcceleration: true };

    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstalled, setIsInstalled] = useState(false);

    // Prevent hydration mismatch + PWA detection
    useEffect(() => {
        setMounted(true);

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
        }

        // Listen for install prompt
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setIsInstalled(true);
        }
        setDeferredPrompt(null);
    };

    const LANGUAGES = [
        { id: 'en', label: 'English' },
        { id: 'ko', label: 'Korean (Raw)' },
        { id: 'ja', label: 'Japanese (Raw)' },
        { id: 'zh', label: 'Chinese (Raw)' },
        { id: 'all', label: 'All Languages' },
    ];

    const READING_MODES = [
        { id: 'webtoon', label: 'Webtoon (Continuous)' },
        { id: 'single', label: 'Single Page' },
        { id: 'double', label: 'Double Page' },
    ];

    return (
        <div className="min-h-screen bg-background pb-20 px-4">
            <div className="max-w-2xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center space-y-2 mb-12">
                    <h1 className="font-display text-5xl text-foreground drop-shadow-sm">SETTINGS</h1>
                    <p className="text-muted-foreground text-xl">Customize your reading experience</p>
                </div>

                {/* Appearance */}
                <section className="space-y-4">
                    <h2 className="font-display text-2xl text-foreground border-b-2 border-border pb-2 flex items-center gap-2">
                        <Settings size={24} /> Appearance
                    </h2>
                    <div className="bg-card p-6 rounded-lg ink-border space-y-6">
                        <div className="space-y-3">
                            <h3 className="font-bold text-lg">Theme</h3>
                            <div className="flex gap-2">
                                {['light', 'dark', 'system'].map((t) => (
                                    <Button
                                        key={t}
                                        onClick={() => setTheme(t)}
                                        variant={mounted && theme === t ? "default" : "outline"}
                                        className="capitalize min-w-[33%]"
                                        disabled={!mounted}
                                    >
                                        {t}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Install App */}
                <section className="space-y-4">
                    <h2 className="font-display text-2xl text-foreground border-b-2 border-border pb-2 flex items-center gap-2">
                        <Download size={24} /> Install App
                    </h2>
                    <div className="bg-card p-6 rounded-lg ink-border space-y-4">
                        {isInstalled ? (
                            <div className="flex items-center gap-3 text-green-600">
                                <CheckCircle size={24} />
                                <div>
                                    <h3 className="font-bold text-lg">App Installed!</h3>
                                    <p className="text-sm text-muted-foreground">You're using the PWA version of Inkbound.</p>
                                </div>
                            </div>
                        ) : deferredPrompt ? (
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-lg">Install Inkbound</h3>
                                    <p className="text-sm text-muted-foreground">Get the full app experience on your device.</p>
                                </div>
                                <Button onClick={handleInstall} className="ink-border bg-crimson text-white hover:bg-crimson/90">
                                    <Download size={18} className="mr-2" /> Install
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-lg">Install Inkbound</h3>
                                    <p className="text-sm text-muted-foreground">Learn how to add Inkbound to your home screen.</p>
                                </div>
                                <Link href="/help">
                                    <Button variant="outline">
                                        <HelpCircle size={18} className="mr-2" /> How to Install
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </section>

                {/* Performance */}
                <section className="space-y-4">
                    <h2 className="font-display text-2xl text-foreground border-b-2 border-border pb-2 flex items-center gap-2">
                        <Zap size={24} /> Performance
                    </h2>
                    <div className="bg-card p-6 rounded-lg ink-border space-y-6">
                        {/* Data Saver */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <WifiOff size={20} className={settings.dataSaver ? "text-green-600" : "text-muted-foreground"} />
                                    Data Saver
                                </h3>
                                <p className="text-sm text-muted-foreground">Load lower quality images to save bandwidth.</p>
                            </div>
                            <Button
                                onClick={() => updateSettings({ dataSaver: !settings.dataSaver })}
                                variant={settings.dataSaver ? "default" : "outline"}
                                className="min-w-[80px]"
                            >
                                {settings.dataSaver ? "ON" : "OFF"}
                            </Button>
                        </div>

                        {/* GPU Acceleration */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <Cpu size={20} className={settings.gpuAcceleration ? "text-green-600" : "text-muted-foreground"} />
                                    GPU Acceleration
                                </h3>
                                <p className="text-sm text-muted-foreground">Use hardware rendering for smoother scrolling.</p>
                            </div>
                            <Button
                                onClick={() => updateSettings({ gpuAcceleration: !settings.gpuAcceleration })}
                                variant={settings.gpuAcceleration ? "default" : "outline"}
                                className="min-w-[80px]"
                            >
                                {settings.gpuAcceleration ? "ON" : "OFF"}
                            </Button>
                        </div>

                        {/* Clear Cache */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <RefreshCw size={20} className="text-muted-foreground" />
                                    Clear Cache
                                </h3>
                                <p className="text-sm text-muted-foreground">Force reload all data from servers.</p>
                            </div>
                            <Button
                                onClick={() => {
                                    clearAllCache();
                                    alert('Cache cleared! Pages will reload fresh data.');
                                }}
                                variant="outline"
                            >
                                Clear
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Content Preferences */}
                <section className="space-y-4">
                    <h2 className="font-display text-2xl text-foreground border-b-2 border-border pb-2 flex items-center gap-2">
                        <Globe size={24} /> Content Preferences
                    </h2>

                    <div className="bg-card p-6 rounded-lg ink-border space-y-6">
                        {/* NSFW Toggle */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <EyeOff size={20} className={settings.includeNSFW ? "text-crimson" : "text-muted-foreground"} />
                                    Adult Content (18+)
                                </h3>
                                <p className="text-sm text-muted-foreground">Show explicit/NSFW content in search results.</p>
                            </div>
                            <Button
                                onClick={() => updateSettings({ includeNSFW: !settings.includeNSFW })}
                                variant={settings.includeNSFW ? "crimson" : "outline"}
                                className={cn("min-w-[100px]", settings.includeNSFW && "animate-pulse")}
                            >
                                {settings.includeNSFW ? "VISIBLE" : "HIDDEN"}
                            </Button>
                        </div>

                        {/* Language Selector */}
                        <div className="space-y-3">
                            <h3 className="font-bold text-lg">Default Chapter Language</h3>
                            <div className="flex flex-wrap gap-2">
                                {LANGUAGES.map(lang => (
                                    <Button
                                        key={lang.id}
                                        onClick={() => updateSettings({ defaultLanguage: lang.id })}
                                        variant={settings.defaultLanguage === lang.id ? "default" : "outline"}
                                        size="sm"
                                    >
                                        {lang.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Reader Preferences */}
                <section className="space-y-4">
                    <h2 className="font-display text-2xl text-foreground border-b-2 border-border pb-2 flex items-center gap-2">
                        <BookOpen size={24} /> Reader Preferences
                    </h2>

                    <div className="bg-card p-6 rounded-lg ink-border space-y-6">
                        <div className="space-y-3">
                            <h3 className="font-bold text-lg">Default Reading Mode</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                {READING_MODES.map(mode => (
                                    <Button
                                        key={mode.id}
                                        onClick={() => updateSettings({ readerMode: mode.id as any })}
                                        variant={settings.readerMode === mode.id ? "default" : "outline"}
                                        className="w-full"
                                    >
                                        {mode.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Data Management */}
                <section className="space-y-4">
                    <h2 className="font-display text-2xl text-foreground border-b-2 border-border pb-2 flex items-center gap-2">
                        <Settings size={24} /> Data Management
                    </h2>

                    <div className="bg-card p-6 rounded-lg ink-border space-y-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-lg">Backup Library</h3>
                                    <p className="text-sm text-muted-foreground">Save your library and history to a file.</p>
                                </div>
                                <Button
                                    onClick={() => {
                                        const data = JSON.stringify({ library, history, settings }, null, 2);
                                        const blob = new Blob([data], { type: 'application/json' });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `inkbound-backup-${new Date().toISOString().split('T')[0]}.json`;
                                        document.body.appendChild(a);
                                        a.click();
                                        document.body.removeChild(a);
                                        URL.revokeObjectURL(url);
                                    }}
                                    variant="outline"
                                >
                                    Export JSON
                                </Button>
                            </div>

                            <div className="h-px bg-border/10" />

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-lg">Restore Backup</h3>
                                    <p className="text-sm text-muted-foreground">Restore from a previous backup file.</p>
                                </div>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".json"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                                try {
                                                    const json = JSON.parse(event.target?.result as string);
                                                    if (json.library && json.history) {
                                                        if (confirm('This will overwrite your current library and history. Are you sure?')) {
                                                            useAppStore.setState({
                                                                library: json.library,
                                                                history: json.history,
                                                                settings: { ...settings, ...json.settings }
                                                            });
                                                            alert('Backup restored successfully!');
                                                            window.location.reload();
                                                        }
                                                    } else {
                                                        alert('Invalid backup file.');
                                                    }
                                                } catch (err) {
                                                    alert('Failed to parse backup file.');
                                                    console.error(err);
                                                }
                                            };
                                            reader.readAsText(file);
                                        }}
                                    />
                                    <Button variant="outline">Import JSON</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="space-y-4 opacity-80 hover:opacity-100 transition-opacity">
                    <h2 className="font-display text-2xl text-red-600 border-b-2 border-red-100 pb-2 flex items-center gap-2">
                        <AlertTriangle size={24} /> Danger Zone
                    </h2>

                    <div className="bg-red-50 p-6 rounded-lg border-2 border-red-200 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-lg text-red-900">Clear Local Data</h3>
                                <p className="text-sm text-red-700">
                                    Library: {library.length} items • History: {history.length} entries
                                </p>
                            </div>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    if (confirm('Are you sure you want to wipe all data? This cannot be undone.')) {
                                        localStorage.clear();
                                        window.location.reload();
                                    }
                                }}
                            >
                                <Trash2 size={16} className="mr-2" /> WIPE DATA
                            </Button>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
