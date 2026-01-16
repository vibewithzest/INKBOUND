export default function DMCAPage() {
    return (
        <div className="min-h-screen bg-background pb-20 px-4">
            <div className="max-w-3xl mx-auto py-8 space-y-8">
                <h1 className="font-display text-5xl text-foreground">DMCA Notice</h1>

                <div className="prose prose-lg text-muted-foreground space-y-6">
                    <section className="bg-card p-6 rounded-lg ink-border space-y-4">
                        <h2 className="font-display text-2xl text-foreground">Copyright Notice</h2>
                        <p>
                            Inkbound respects the intellectual property rights of others.
                            We do not host any copyrighted content on our servers.
                            All content is provided by third-party sources and APIs.
                        </p>
                    </section>

                    <section className="bg-card p-6 rounded-lg ink-border space-y-4">
                        <h2 className="font-display text-2xl text-foreground">Filing a DMCA Complaint</h2>
                        <p>
                            If you believe your copyrighted work has been used inappropriately through our service,
                            please contact the original content hosting platforms directly.
                        </p>
                        <p>
                            As Inkbound is an aggregator that does not host content, DMCA requests should be directed to
                            the actual hosting services from which the content originates.
                        </p>
                    </section>

                    <section className="bg-card p-6 rounded-lg ink-border space-y-4">
                        <h2 className="font-display text-2xl text-foreground">Content Removal</h2>
                        <p>
                            While we cannot remove content we don't host, we can block specific titles from appearing
                            in our interface upon valid request. Please contact us with:
                        </p>
                        <ul className="list-disc list-inside space-y-2">
                            <li>Proof of copyright ownership</li>
                            <li>Specific title(s) to be blocked</li>
                            <li>Your contact information</li>
                        </ul>
                    </section>

                    <section className="bg-card p-6 rounded-lg ink-border space-y-4">
                        <h2 className="font-display text-2xl text-foreground">Good Faith Statement</h2>
                        <p>
                            We operate in good faith to provide a legal service. We encourage users to support
                            official releases and manga creators whenever possible.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
