export default function DisclaimerPage() {
    return (
        <div className="min-h-screen bg-background pb-20 px-4">
            <div className="max-w-3xl mx-auto py-8 space-y-8">
                <h1 className="font-display text-5xl text-foreground">Disclaimer</h1>

                <div className="prose prose-lg text-muted-foreground space-y-6">
                    <section className="bg-card p-6 rounded-lg ink-border space-y-4">
                        <h2 className="font-display text-2xl text-foreground">General Disclaimer</h2>
                        <p>
                            Inkbound is a manga reader interface that aggregates content from various third-party sources.
                            We do not store, host, or upload any manga, manhwa, or manhua content on our servers.
                        </p>
                    </section>

                    <section className="bg-card p-6 rounded-lg ink-border space-y-4">
                        <h2 className="font-display text-2xl text-foreground">No Affiliation</h2>
                        <p>
                            Inkbound is not affiliated with any manga publishers, authors, or distributors.
                            All trademarks, service marks, and logos are the property of their respective owners.
                        </p>
                    </section>

                    <section className="bg-card p-6 rounded-lg ink-border space-y-4">
                        <h2 className="font-display text-2xl text-foreground">Content Accuracy</h2>
                        <p>
                            We make no guarantees about the accuracy, completeness, or availability of any content.
                            Content availability depends on third-party sources and may change without notice.
                        </p>
                    </section>

                    <section className="bg-card p-6 rounded-lg ink-border space-y-4">
                        <h2 className="font-display text-2xl text-foreground">Support Official Releases</h2>
                        <p>
                            We encourage all users to support official manga releases and the creators behind them.
                            If you enjoy a series, please consider purchasing official volumes or subscribing to
                            official platforms.
                        </p>
                    </section>

                    <section className="bg-card p-6 rounded-lg ink-border space-y-4">
                        <h2 className="font-display text-2xl text-foreground">Age Restriction</h2>
                        <p>
                            Some content accessible through Inkbound may not be suitable for all ages.
                            Users are responsible for ensuring appropriate content filters are enabled in Settings.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
