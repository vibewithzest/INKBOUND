export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background pb-20 px-4">
            <div className="max-w-3xl mx-auto py-8 space-y-8">
                <h1 className="font-display text-5xl text-foreground">Privacy Policy</h1>

                <div className="prose prose-lg text-muted-foreground space-y-6">
                    <p className="text-lg">
                        Last updated: January 2026
                    </p>

                    <section className="bg-card p-6 rounded-lg ink-border space-y-4">
                        <h2 className="font-display text-2xl text-foreground">Information We Collect</h2>
                        <p>Inkbound is designed with privacy in mind. We collect minimal data:</p>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>Local Storage:</strong> Your library, reading history, and preferences are stored locally on your device.</li>
                            <li><strong>No Account Required:</strong> We don't require registration or collect personal information.</li>
                            <li><strong>No Tracking:</strong> We don't use analytics or tracking cookies.</li>
                        </ul>
                    </section>

                    <section className="bg-card p-6 rounded-lg ink-border space-y-4">
                        <h2 className="font-display text-2xl text-foreground">Third-Party Content</h2>
                        <p>
                            Inkbound aggregates content from third-party sources. We do not host any manga content directly.
                            Images and data are fetched from external APIs and may be subject to their respective privacy policies.
                        </p>
                    </section>

                    <section className="bg-card p-6 rounded-lg ink-border space-y-4">
                        <h2 className="font-display text-2xl text-foreground">Your Data</h2>
                        <p>
                            All your data stays on your device. You can export your library and history from Settings,
                            and you can clear all data at any time.
                        </p>
                    </section>

                    <section className="bg-card p-6 rounded-lg ink-border space-y-4">
                        <h2 className="font-display text-2xl text-foreground">Contact</h2>
                        <p>
                            For privacy concerns, please contact us through our support channels.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
