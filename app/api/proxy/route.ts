import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const url = request.nextUrl.searchParams.get('url');
    if (!url) {
        return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    try {
        const response = await fetch(url, {
            headers: {
                // Mimic a real browser better
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://comick.io/',
            }
        });

        if (!response.ok) {
            throw new Error(`Upstream Error: ${response.status} ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        const buffer = await response.arrayBuffer();

        return new NextResponse(buffer, {
            status: response.status,
            headers: {
                'Content-Type': contentType || 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=3600'
            },
        });
    } catch (error) {
        console.error("Proxy Error for:", url, error);
        return NextResponse.json({ error: 'Proxy failed', details: String(error) }, { status: 500 });
    }
}
