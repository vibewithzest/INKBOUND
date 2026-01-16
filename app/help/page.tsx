'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, Monitor, Apple, CheckCircle, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function HelpPage() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
        }

        // Check if iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        setIsIOS(/iphone|ipad|ipod/.test(userAgent));

        // Listen for install prompt
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
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

    return (
        <div className="min-h-screen bg-background pb-20 px-4">
            <div className="max-w-3xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center space-y-4 pt-8">
                    <div className="flex justify-center">
                        <div className="bg-crimson p-4 rounded-lg ink-border">
                            <BookOpen size={48} className="text-white" />
                        </div>
                    </div>
                    <h1 className="font-display text-5xl text-foreground">INSTALL INKBOUND</h1>
                    <p className="text-muted-foreground text-xl max-w-lg mx-auto">
                        Get the full app experience - faster loading, offline reading, and home screen access!
                    </p>
                </div>

                {/* Quick Install Button */}
                {!isInstalled && deferredPrompt && (
                    <div className="bg-card p-8 rounded-lg ink-border text-center space-y-4">
                        <h2 className="font-display text-3xl text-foreground">Ready to Install!</h2>
                        <p className="text-muted-foreground">Your browser supports direct installation.</p>
                        <Button
                            onClick={handleInstall}
                            size="lg"
                            className="text-xl h-14 px-8 ink-border bg-crimson text-white hover:bg-crimson/90"
                        >
                            <Download className="mr-2" /> Install Inkbound
                        </Button>
                    </div>
                )}

                {/* Already Installed */}
                {isInstalled && (
                    <div className="bg-green-100 p-8 rounded-lg border-2 border-green-600 text-center space-y-4">
                        <CheckCircle size={48} className="mx-auto text-green-600" />
                        <h2 className="font-display text-3xl text-green-800">Already Installed!</h2>
                        <p className="text-green-700">You're using the PWA version of Inkbound.</p>
                    </div>
                )}

                {/* Platform Instructions */}
                <div className="space-y-8">
                    <h2 className="font-display text-3xl text-foreground border-b-2 border-border pb-2">
                        Installation Guide
                    </h2>

                    {/* Android */}
                    <div className="bg-card p-6 rounded-lg ink-border space-y-4">
                        <div className="flex items-center gap-3">
                            <Smartphone size={32} className="text-green-600" />
                            <h3 className="font-display text-2xl text-foreground">Android</h3>
                        </div>
                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                            <li>Open <strong>Chrome</strong> browser</li>
                            <li>Tap the <strong>three dots menu</strong> (⋮) in the top right</li>
                            <li>Select <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong></li>
                            <li>Tap <strong>"Install"</strong> to confirm</li>
                        </ol>
                    </div>

                    {/* iOS */}
                    <div className="bg-card p-6 rounded-lg ink-border space-y-4">
                        <div className="flex items-center gap-3">
                            <Apple size={32} className="text-gray-800" />
                            <h3 className="font-display text-2xl text-foreground">iPhone / iPad</h3>
                        </div>
                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                            <li>Open <strong>Safari</strong> browser (required for iOS)</li>
                            <li>Tap the <strong>Share button</strong> (□↑) at the bottom</li>
                            <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                            <li>Tap <strong>"Add"</strong> in the top right</li>
                        </ol>
                        {isIOS && (
                            <div className="bg-yellow-100 p-3 rounded border border-yellow-400 text-yellow-800 text-sm">
                                <strong>Note:</strong> You must use Safari on iOS. Other browsers won't show the install option.
                            </div>
                        )}
                    </div>

                    {/* Desktop */}
                    <div className="bg-card p-6 rounded-lg ink-border space-y-4">
                        <div className="flex items-center gap-3">
                            <Monitor size={32} className="text-blue-600" />
                            <h3 className="font-display text-2xl text-foreground">Desktop (Chrome/Edge)</h3>
                        </div>
                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                            <li>Look for the <strong>install icon</strong> (⊕) in the address bar</li>
                            <li>Or click the <strong>three dots menu</strong> → <strong>"Install Inkbound"</strong></li>
                            <li>Click <strong>"Install"</strong> to add to your desktop</li>
                        </ol>
                    </div>
                </div>

                {/* Benefits */}
                <div className="space-y-4">
                    <h2 className="font-display text-3xl text-foreground border-b-2 border-border pb-2">
                        Why Install?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            { title: 'Faster', desc: 'Loads instantly from your home screen' },
                            { title: 'Offline', desc: 'Read cached chapters without internet' },
                            { title: 'Full Screen', desc: 'No browser UI - immersive reading' },
                        ].map((item) => (
                            <div key={item.title} className="bg-muted p-4 rounded-lg ink-border text-center">
                                <h4 className="font-display text-xl text-foreground">{item.title}</h4>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Back Link */}
                <div className="text-center pt-8">
                    <Link href="/">
                        <Button variant="outline" size="lg">
                            ← Back to Reading
                        </Button>
                    </Link>
                </div>

            </div>
        </div>
    );
}
