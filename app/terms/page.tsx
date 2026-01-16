export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background pb-20 px-4">
            <div className="max-w-3xl mx-auto py-8 space-y-8">
                <h1 className="font-display text-5xl text-foreground">Terms of Service</h1>

                <div className="prose prose-lg text-muted-foreground space-y-6">
                    <p className="text-lg">
                        Last updated: January 2026
                    </p>

                    <section className="bg-card p-6 rounded-lg ink-border space-y-4">
                        <h2 className="font-display text-2xl text-foreground">Acceptance of Terms</h2>
                        <p>
                            By accessing and using Inkbound, you accept and agree to be bound by these Terms of Service.
                            If you do not agree, please do not use the service.
                        </p>
                    </section>

                    <section className="bg-card p-6 rounded-lg ink-border space-y-4">
                        <h2 className="font-display text-2xl text-foreground">Use of Service</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li>Inkbound is provided as-is for personal, non-commercial use.</li>
                            <li>You may not use the service for any illegal purposes.</li>
                            <li>We reserve the right to modify or discontinue the service at any time.</li>
                        </ul>
                    </section>

                    <section className="bg-card p-6 rounded-lg ink-border space-y-4">
                        <h2 className="font-display text-2xl text-foreground">Content Disclaimer</h2>
                        <p>
                            Inkbound does not host any content. All manga, manhwa, and manhua are provided by third-party sources.
                            We are not responsible for the accuracy, legality, or content of external sources.
                        </p>
                    </section>

                    <section className="bg-card p-6 rounded-lg ink-border space-y-4">
                        <h2 className="font-display text-2xl text-foreground">Limitation of Liability</h2>
                        <p>
                            Inkbound and its creators are not liable for any damages arising from the use of this service.
                            Use at your own risk.
                        </p>
                    </section>

                    <section className="bg-card p-6 rounded-lg ink-border space-y-4">
                        <h2 className="font-display text-2xl text-foreground">Changes to Terms</h2>
                        <p>
                            We may update these terms at any time. Continued use of the service constitutes acceptance of the updated terms.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
