/**
 * Inkbound Manga Provider - Complete Comix.to API Implementation
 * Fixed version based on the original paper-manga ComixProvider
 */

const PROXY_URL = '/api/proxy?url=';
const COMIX_BASE = 'https://comix.to';

// ==================== CONSTANTS ====================

export const ORDER_KEYS = {
    RELEVANCE: 'relevance',
    DAILY_VIEWS: 'views_1d',
    WEEKLY_VIEWS: 'views_7d',      // Trending
    MONTHLY_VIEWS: 'views_30d',    // Popular
    QUARTERLY_VIEWS: 'views_90d',
    ALL_TIME_VIEWS: 'views_total',
    FOLLOWS: 'follows_total',       // Most Followed
    RATING: 'rated_avg',            // Top Rated
    LATEST_UPDATED: 'chapter_updated_at',
    NEWEST: 'created_at',
    TITLE: 'title',
    YEAR: 'year'
} as const;

export const GENRES = {
    ACTION: 6,
    ADVENTURE: 7,
    COMEDY: 9,
    DRAMA: 11,
    FANTASY: 12,
    HORROR: 15,
    ISEKAI: 16,
    ROMANCE: 54,
    SCHOOL_LIFE: 57,
    SUPERNATURAL: 59,
    MARTIAL_ARTS: 45,
    MAGIC: 44,
    SCI_FI: 56,
    SLICE_OF_LIFE: 58,
    SPORTS: 60,
    MYSTERY: 48,
    PSYCHOLOGICAL: 51,
    TRAGEDY: 63,
    HISTORICAL: 14,
    MECHA: 46
} as const;

// Array version for UI iteration
export const GENRE_LIST = [
    { id: 6, name: 'Action' },
    { id: 7, name: 'Adventure' },
    { id: 9, name: 'Comedy' },
    { id: 11, name: 'Drama' },
    { id: 12, name: 'Fantasy' },
    { id: 15, name: 'Horror' },
    { id: 16, name: 'Isekai' },
    { id: 54, name: 'Romance' },
    { id: 57, name: 'School Life' },
    { id: 59, name: 'Supernatural' },
    { id: 45, name: 'Martial Arts' },
    { id: 44, name: 'Magic' },
    { id: 56, name: 'Sci-Fi' },
    { id: 58, name: 'Slice of Life' },
    { id: 60, name: 'Sports' },
    { id: 48, name: 'Mystery' },
    { id: 51, name: 'Psychological' },
    { id: 63, name: 'Tragedy' },
    { id: 14, name: 'Historical' },
    { id: 46, name: 'Mecha' }
];

export const DEMOGRAPHICS = {
    SHOUJO: 1,
    SHOUNEN: 2,
    JOSEI: 3,
    SEINEN: 4
} as const;

export const STATUSES = [
    { value: 'releasing', label: 'Ongoing' },
    { value: 'finished', label: 'Completed' },
    { value: 'on_hiatus', label: 'Hiatus' },
    { value: 'discontinued', label: 'Dropped' }
] as const;

export const TYPES = ['manga', 'manhwa', 'manhua', 'other'] as const;

export const SORT_OPTIONS = [
    { value: ORDER_KEYS.WEEKLY_VIEWS, label: 'Trending' },
    { value: ORDER_KEYS.MONTHLY_VIEWS, label: 'Popular' },
    { value: ORDER_KEYS.NEWEST, label: 'Newest' },
    { value: ORDER_KEYS.LATEST_UPDATED, label: 'Latest Updates' },
    { value: ORDER_KEYS.RATING, label: 'Top Rated' },
    { value: ORDER_KEYS.FOLLOWS, label: 'Most Followed' },
    { value: ORDER_KEYS.TITLE, label: 'A-Z' },
    { value: ORDER_KEYS.ALL_TIME_VIEWS, label: 'Most Viewed' }
] as const;

export const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'ko', name: 'Korean (Raw)' },
    { code: 'ja', name: 'Japanese (Raw)' },
    { code: 'zh', name: 'Chinese (Raw)' },
    { code: 'all', name: 'All Languages' }
] as const;

// NSFW genre IDs - exported for UI toggle
export const NSFW_GENRE_IDS = [87264, 87266, 87265, 87268, 87267];

// ==================== TYPES ====================

export interface SearchFilters {
    limit?: number;
    page?: number;
    offset?: number;
    genres?: number[];
    excludeGenres?: number[];
    statuses?: string[];
    types?: string[];
    demographics?: number[];
    orderBy?: string;
    orderDir?: 'asc' | 'desc';
    includeNSFW?: boolean;
    language?: string;  // NEW: Language filter for chapters
    yearFrom?: number;
    yearTo?: number;
    // Single-value variants for UI convenience
    type?: string;
    status?: string;
    sort?: string;
}

export interface SearchResult {
    id: string;
    title: string;
    cover: string;
    slug: string;
    description?: string;
    author?: string;
    status?: string;
    type?: string;
    year?: number;
    rating?: number;
    follows?: number;
    tags?: string[];
}

export interface SearchResponse {
    results: SearchResult[];
    total: number;
}

export interface Chapter {
    id: string;
    title: string;
    number: string;
    scanGroup?: string;
    date: string;
    pages?: number;
}

export interface ReaderPage {
    url: string;
    index: number;
}

export interface ChapterMeta {
    mangaId: string;
    chapterId: string;
    title: string;
    number: string;
    mangaTitle: string;
    mangaCover: string;
    prevChapterId?: string;
    nextChapterId?: string;
}

// ==================== CACHE ====================
import { getCache, setCache, CACHE_DURATIONS } from './cache';

// ==================== FETCH HELPER ====================

async function fetchAPI(path: string, cacheDuration?: number): Promise<any> {
    // Check cache first (client-side only)
    if (typeof window !== 'undefined' && cacheDuration) {
        const cached = getCache<any>(`api:${path}`);
        if (cached) {
            console.log(`[Cache HIT] ${path}`);
            return cached;
        }
    }

    const url = `${COMIX_BASE}${path}`;
    const isServer = typeof window === 'undefined';

    let data: any;

    if (isServer) {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            next: { revalidate: 300 }
        });
        if (!res.ok) throw new Error(`Comix API Error: ${res.status}`);
        data = await res.json();
    } else {
        const proxyUrl = `${PROXY_URL}${encodeURIComponent(url)}`;
        const res = await fetch(proxyUrl);
        if (!res.ok) throw new Error(`Comix API Error: ${res.status}`);
        data = await res.json();

        // Store in cache
        if (cacheDuration) {
            setCache(`api:${path}`, data, cacheDuration);
        }
    }

    return data;
}

function extractHashId(id: string): string {
    return id.replace(/^cx:/, '').split('-')[0];
}

// ==================== QUERY BUILDER ====================

function buildQuery(filters?: SearchFilters): string {
    const params: string[] = [];

    params.push(`limit=${filters?.limit || 28}`);
    if (filters?.offset) params.push(`offset=${filters.offset}`);
    if (filters?.page) params.push(`page=${filters.page}`);

    // Types - handle both array and single value
    if (filters?.types?.length) {
        filters.types.forEach(t => params.push(`types[]=${t}`));
    } else if ((filters as any)?.type) {
        params.push(`types[]=${(filters as any).type}`);
    }

    // Order by - handle both orderBy and sort
    const sortKey = filters?.orderBy || (filters as any)?.sort;
    if (sortKey) {
        params.push(`order[${sortKey}]=${filters?.orderDir || 'desc'}`);
    } else {
        params.push(`order[${ORDER_KEYS.MONTHLY_VIEWS}]=desc`);
    }

    // Genres
    if (filters?.genres?.length) {
        filters.genres.forEach(g => params.push(`genres[]=${g}`));
    }
    if (filters?.excludeGenres?.length) {
        filters.excludeGenres.forEach(g => params.push(`genres[]=-${g}`));
    }

    // NSFW handling - exclude by default
    if (!filters?.includeNSFW) {
        NSFW_GENRE_IDS.forEach(id => params.push(`genres[]=-${id}`));
    }

    // Statuses - handle both array and single value
    if (filters?.statuses?.length) {
        filters.statuses.forEach(s => params.push(`statuses[]=${s}`));
    } else if ((filters as any)?.status) {
        // Map simple status strings to API values
        const statusVal = (filters as any).status;
        if (statusVal === 'completed') params.push(`statuses[]=finished`);
        else if (statusVal === 'ongoing') params.push(`statuses[]=releasing`);
        else if (statusVal === 'hiatus') params.push(`statuses[]=on_hiatus`);
        else params.push(`statuses[]=${statusVal}`);
    }

    // Demographics
    if (filters?.demographics?.length) {
        filters.demographics.forEach(d => params.push(`demographics[]=${d}`));
    }

    // Year range
    if (filters?.yearFrom) params.push(`year_from=${filters.yearFrom}`);
    if (filters?.yearTo) params.push(`year_to=${filters.yearTo}`);

    return params.join('&');
}

// ==================== MAPPERS ====================

function mapMangaList(data: any): SearchResult[] {
    // Handle different response structures
    const items = data.result?.items || data.result || data.data || [];
    if (!Array.isArray(items)) return [];
    return items.map((item: any) => mapManga(item));
}

function mapManga(item: any): SearchResult {
    const hashId = item.hash_id || item.hid || String(item.id || item.manga_id);
    const slug = item.slug || '';

    // Cover URL - handle multiple formats
    let coverUrl = '';
    if (item.poster) {
        coverUrl = item.poster.large || item.poster.medium || item.poster.small || '';
    }
    if (!coverUrl && item.md_covers?.length) {
        const cover = item.md_covers[0];
        if (cover.b2key) coverUrl = `https://meo.comick.pictures/${cover.b2key}`;
    }
    if (!coverUrl) coverUrl = item.thumb_url || item.cover_url || '';

    // Extract authors - handle both array and object formats
    const authorData = item.md_authors || item.authors || item.author;
    let authors: string[] = [];
    if (Array.isArray(authorData)) {
        authors = authorData.map((a: any) => {
            if (typeof a === 'string') return a;
            if (a.md_author) return a.md_author.name;
            return a.name || '';
        }).filter(Boolean);
    } else if (typeof authorData === 'string') {
        authors = [authorData];
    }

    // Extract artists
    const artistData = item.md_artists || item.artists || item.artist;
    let artists: string[] = [];
    if (Array.isArray(artistData)) {
        artists = artistData.map((a: any) => {
            if (typeof a === 'string') return a;
            if (a.md_artist) return a.md_artist.name;
            return a.name || '';
        }).filter(Boolean);
    }

    const finalAuthor = authors.length > 0 ? authors.join(', ') : (artists.length > 0 ? artists.join(', ') : 'Unknown');

    // Extract tags/genres
    const tags: string[] = [];
    const tagSource = item.md_genres || item.genres || item.terms || item.tags || [];
    if (Array.isArray(tagSource)) {
        tagSource.forEach((g: any) => {
            if (typeof g === 'string') {
                tags.push(g);
            } else if (g.md_genres) {
                tags.push(g.md_genres.name);
            } else if (g.name) {
                tags.push(g.name);
            }
        });
    }

    // Get status
    let status = 'ongoing';
    if (item.status) {
        const s = String(item.status).toLowerCase();
        if (s === 'finished' || s.includes('complete') || s === '2') status = 'completed';
        else if (s === 'on_hiatus' || s.includes('hiatus')) status = 'hiatus';
    }

    // Get type from country code
    let type = item.type || 'manga';
    if (item.country) {
        const c = item.country.toLowerCase();
        if (c === 'kr') type = 'manhwa';
        else if (c === 'cn') type = 'manhua';
        else if (c === 'jp') type = 'manga';
    }

    return {
        id: `cx:${hashId}${slug ? '-' + slug : ''}`,
        title: item.title || item.name || "Unknown",
        cover: coverUrl,
        slug: slug,
        description: item.desc || item.description || item.synopsis || '',
        author: finalAuthor,
        status: status,
        type: type,
        year: item.year || (item.created_at ? new Date(item.created_at).getFullYear() : undefined),
        rating: item.rating ? Number(item.rating) : (item.bayesian_rating || item.rated_avg || 0),
        follows: item.user_follow_count || item.follows_total || 0,
        tags: tags
    };
}

function mapChapter(item: any): Chapter {
    const chapterId = item.id || item.chapter_id || item.hid;
    const chapterNum = item.chap ?? item.number ?? "0";
    const chapterName = item.title || item.name || '';

    // FIXED: Handle Unix timestamps (multiply by 1000 if needed)
    let publishDate = 'Unknown';
    if (item.updated_at) {
        const ts = typeof item.updated_at === 'string'
            ? new Date(item.updated_at).getTime()
            : (item.updated_at > 9999999999 ? item.updated_at : item.updated_at * 1000);
        publishDate = new Date(ts).toLocaleDateString();
    } else if (item.created_at) {
        const ts = typeof item.created_at === 'string'
            ? new Date(item.created_at).getTime()
            : (item.created_at > 9999999999 ? item.created_at : item.created_at * 1000);
        publishDate = new Date(ts).toLocaleDateString();
    }

    return {
        id: `cx:${chapterId}`,
        title: chapterName || `Chapter ${chapterNum}`,
        number: String(chapterNum),
        scanGroup: item.md_scanlation_groups?.[0]?.name || item.group_name?.[0] || undefined,
        date: publishDate,
        pages: item.count || item.pages || 0
    };
}

// ==================== MANGA PROVIDER ====================

export const MangaProvider = {
    /**
     * Search for manga with keyword and filters
     * FIXED: Uses 'keyword=' parameter instead of 'q='
     */
    async search(queryOrFilters: string | SearchFilters, filters?: SearchFilters): Promise<SearchResponse> {
        let query = '';
        let finalFilters: SearchFilters = {};

        if (typeof queryOrFilters === 'string') {
            query = queryOrFilters;
            finalFilters = filters || {};
        } else {
            finalFilters = queryOrFilters || {};
        }

        try {
            const queryString = buildQuery(finalFilters);
            // CRITICAL FIX: Comix API uses 'keyword' not 'q'
            let url = `/api/v2/manga?${queryString}`;
            if (query) {
                url += `&keyword=${encodeURIComponent(query)}`;
            }

            const data = await fetchAPI(url, CACHE_DURATIONS.BROWSE);
            let results = mapMangaList(data);

            // Manual Client-Side Filter for extra safety
            if (!finalFilters.includeNSFW) {
                const NSFW_KEYWORDS = ['adult', 'hentai', 'mature', 'erotica', 'smut', 'ecchi', '18+', 'gore', 'pornographic'];
                results = results.filter(manga => {
                    // Check tags
                    const hasNSFWTag = manga.tags?.some(tag =>
                        NSFW_KEYWORDS.some(k => tag.toLowerCase().includes(k))
                    );
                    // Check Title
                    const isPorbablyNSFW = NSFW_KEYWORDS.some(k => manga.title.toLowerCase().includes(k));

                    // Specific check for "Secret Class" and similar leaks
                    if (manga.title.toLowerCase().includes("secret class")) return false;

                    return !hasNSFWTag && !isPorbablyNSFW;
                });
            }

            return {
                results,
                total: results.length
            };
        } catch (e) {
            console.error("Search Error:", e);
            return { results: [], total: 0 };
        }
    },

    /**
     * Get trending manga (Weekly Views)
     */
    async getTrending(limit = 20): Promise<SearchResult[]> {
        try {
            const query = buildQuery({
                limit,
                orderBy: ORDER_KEYS.WEEKLY_VIEWS,
                orderDir: 'desc'
            });
            const data = await fetchAPI(`/api/v2/manga?${query}`);
            return mapMangaList(data);
        } catch (e) {
            console.error("Trending Error:", e);
            return [];
        }
    },

    /**
     * Get popular manga (Monthly Views)
     */
    async getPopular(limit = 20): Promise<SearchResult[]> {
        try {
            const query = buildQuery({
                limit,
                orderBy: ORDER_KEYS.MONTHLY_VIEWS,
                orderDir: 'desc'
            });
            const data = await fetchAPI(`/api/v2/manga?${query}`, CACHE_DURATIONS.BROWSE);
            return mapMangaList(data);
        } catch (e) {
            console.error("Popular Error:", e);
            return [];
        }
    },

    /**
     * Get latest updates
     */
    async getLatestUpdates(limit = 20): Promise<SearchResult[]> {
        try {
            const query = buildQuery({
                limit,
                orderBy: ORDER_KEYS.LATEST_UPDATED,
                orderDir: 'desc'
            });
            const data = await fetchAPI(`/api/v2/manga?${query}`);
            return mapMangaList(data);
        } catch (e) {
            console.error("Latest Updates Error:", e);
            return [];
        }
    },

    /**
     * Get new releases
     */
    async getNewReleases(limit = 20): Promise<SearchResult[]> {
        try {
            const query = buildQuery({
                limit,
                orderBy: ORDER_KEYS.NEWEST,
                orderDir: 'desc'
            });
            const data = await fetchAPI(`/api/v2/manga?${query}`);
            return mapMangaList(data);
        } catch (e) {
            console.error("New Releases Error:", e);
            return [];
        }
    },

    /**
     * Get top rated manga
     */
    async getTopRated(limit = 20): Promise<SearchResult[]> {
        try {
            const query = buildQuery({
                limit,
                orderBy: ORDER_KEYS.RATING,
                orderDir: 'desc'
            });
            const data = await fetchAPI(`/api/v2/manga?${query}`);
            return mapMangaList(data);
        } catch (e) {
            console.error("Top Rated Error:", e);
            return [];
        }
    },

    /**
     * Get most followed manga
     */
    async getMostFollowed(limit = 20): Promise<SearchResult[]> {
        try {
            const query = buildQuery({
                limit,
                orderBy: ORDER_KEYS.FOLLOWS,
                orderDir: 'desc'
            });
            const data = await fetchAPI(`/api/v2/manga?${query}`);
            return mapMangaList(data);
        } catch (e) {
            console.error("Most Followed Error:", e);
            return [];
        }
    },

    /**
     * Get manga by type (manga, manhwa, manhua)
     */
    async getByType(type: 'manga' | 'manhwa' | 'manhua' | 'other', limit = 20): Promise<SearchResult[]> {
        try {
            const query = buildQuery({
                limit,
                types: [type],
                orderBy: ORDER_KEYS.MONTHLY_VIEWS,
                orderDir: 'desc'
            });
            const data = await fetchAPI(`/api/v2/manga?${query}`);
            return mapMangaList(data);
        } catch (e) {
            console.error(`${type} Error:`, e);
            return [];
        }
    },

    /**
     * Get manga by genre
     */
    async getByGenre(genreId: number, limit = 20): Promise<SearchResult[]> {
        try {
            const query = buildQuery({
                limit,
                genres: [genreId],
                orderBy: ORDER_KEYS.MONTHLY_VIEWS,
                orderDir: 'desc'
            });
            const data = await fetchAPI(`/api/v2/manga?${query}`);
            return mapMangaList(data);
        } catch (e) {
            console.error(`Genre ${genreId} Error:`, e);
            return [];
        }
    },

    /**
     * Get completed manga
     */
    async getCompleted(limit = 20): Promise<SearchResult[]> {
        try {
            const query = buildQuery({
                limit,
                statuses: ['finished'],
                orderBy: ORDER_KEYS.MONTHLY_VIEWS,
                orderDir: 'desc'
            });
            const data = await fetchAPI(`/api/v2/manga?${query}`);
            return mapMangaList(data);
        } catch (e) {
            console.error("Completed Error:", e);
            return [];
        }
    },

    /**
     * Get ongoing/releasing manga
     */
    async getOngoing(limit = 20): Promise<SearchResult[]> {
        try {
            const query = buildQuery({
                limit,
                statuses: ['releasing'],
                orderBy: ORDER_KEYS.MONTHLY_VIEWS,
                orderDir: 'desc'
            });
            const data = await fetchAPI(`/api/v2/manga?${query}`);
            return mapMangaList(data);
        } catch (e) {
            console.error("Ongoing Error:", e);
            return [];
        }
    },

    /**
     * Get featured/spotlight manga
     */
    async getFeatured(): Promise<SearchResult[]> {
        try {
            const data = await fetchAPI(`/api/v2/featured`);
            return mapMangaList(data);
        } catch (e) {
            console.error("Featured Error:", e);
            return this.getTrending(10);
        }
    },

    /**
     * Get manga by demographic (1=Shoujo, 2=Shounen, 3=Josei, 4=Seinen)
     */
    async getByDemographic(demographicId: number, limit = 20): Promise<SearchResult[]> {
        try {
            const query = buildQuery({
                limit,
                demographics: [demographicId],
                orderBy: ORDER_KEYS.MONTHLY_VIEWS,
                orderDir: 'desc'
            });
            const data = await fetchAPI(`/api/v2/manga?${query}`);
            return mapMangaList(data);
        } catch (e) {
            console.error(`Demographic ${demographicId} Error:`, e);
            return [];
        }
    },

    /**
     * Get adult/NSFW manga (18+ content)
     */
    async getAdultManga(limit = 20): Promise<SearchResult[]> {
        try {
            const query = buildQuery({
                limit,
                genres: [NSFW_GENRE_IDS[0]],
                includeNSFW: true,
                orderBy: ORDER_KEYS.MONTHLY_VIEWS,
                orderDir: 'desc'
            });
            const data = await fetchAPI(`/api/v2/manga?${query}`);
            return mapMangaList(data);
        } catch (e) {
            console.error("Adult Manga Error:", e);
            return [];
        }
    },

    /**
     * Get manga details by ID
     */
    async getMangaDetails(mangaId: string): Promise<SearchResult | null> {
        const hashId = extractHashId(mangaId);
        try {
            const data = await fetchAPI(`/api/v2/manga/${hashId}`);
            if (!data.result) return null;
            return mapManga(data.result);
        } catch (e) {
            console.error("Details Error:", e);
            return null;
        }
    },

    /**
     * Get related manga
     */
    async getRelated(mangaId: string): Promise<SearchResult[]> {
        const hashId = extractHashId(mangaId);
        try {
            const data = await fetchAPI(`/api/v2/manga/${hashId}/related`);
            return mapMangaList(data);
        } catch (e) {
            console.error("Related Error:", e);
            // Fallback to popular
            return this.getPopular(10);
        }
    },

    /**
     * Get chapters for a manga (single page)
     * Supports language filter: 'en' (default), 'ko', 'ja', 'zh', or 'all'
     */
    async getChapters(mangaId: string, page = 1, limit = 100, language = 'en'): Promise<Chapter[]> {
        const hashId = extractHashId(mangaId);
        const safeLimit = Math.min(limit, 100);
        try {
            // Build URL with optional language filter
            let url = `/api/v2/manga/${hashId}/chapters?limit=${safeLimit}&page=${page}`;
            if (language && language !== 'all') {
                url += `&lang=${language}`;
            }
            const data = await fetchAPI(url);

            // Response structure is direct 'chapters' array
            const items = data.chapters || data.result?.items || [];
            if (!Array.isArray(items)) return [];
            return items.map((item: any) => mapChapter(item));
        } catch (e) {
            console.error("Chapters Error:", e);
            return [];
        }
    },

    /**
     * Get ALL chapters with pagination
     * FIXED: Deduplicates by chapter NUMBER, not ID, to eliminate duplicates from different groups
     */
    async getAllChapters(mangaId: string, language = 'en'): Promise<Chapter[]> {
        const allChapters: Chapter[] = [];
        const seenNumbers = new Set<string>();  // CHANGED: Track by number, not ID
        let page = 1;
        const limit = 100;

        while (true) {
            const batch = await this.getChapters(mangaId, page, limit, language);

            let newCount = 0;
            for (const chapter of batch) {
                // CHANGED: Deduplicate by chapter number to eliminate group duplicates
                if (!seenNumbers.has(chapter.number)) {
                    seenNumbers.add(chapter.number);
                    allChapters.push(chapter);
                    newCount++;
                }
            }

            if (newCount === 0 || batch.length === 0) break;
            if (batch.length < limit) break;

            page++;
            if (page > 50) break; // Safety limit
        }

        // Sort by chapter number descending (newest first)
        return allChapters.sort((a, b) => parseFloat(b.number) - parseFloat(a.number));
    },

    /**
     * Get pages for a chapter
     */
    async getPages(chapterId: string): Promise<{ pages: ReaderPage[], meta?: ChapterMeta }> {
        // Remove cx: prefix and decode
        const cleanId = decodeURIComponent(chapterId).replace(/^cx:/, '');

        try {
            // Try the chapter endpoint with the full ID (could be numeric or HID)
            const data = await fetchAPI(`/api/v2/chapters/${cleanId}`, CACHE_DURATIONS.PAGES);

            // ComicK/Comix API structure
            const chapter = data.chapter || data.result || data;

            // Try multiple image sources
            let pages: ReaderPage[] = [];

            // Primary: md_images with b2key (ComicK format)
            if (chapter.md_images && Array.isArray(chapter.md_images) && chapter.md_images.length > 0) {
                pages = chapter.md_images.map((img: any, index: number) => ({
                    url: img.b2key ? `https://meo.comick.pictures/${img.b2key}` : (img.url || ''),
                    index
                })).filter((p: ReaderPage) => p.url);
                console.log(`[getPages] Found ${pages.length} images from md_images`);
            }
            // Fallback: direct images array (string URLs)
            else if (chapter.images && Array.isArray(chapter.images) && chapter.images.length > 0) {
                pages = chapter.images.map((img: any, index: number) => ({
                    url: typeof img === 'string' ? img : (img.url || img.src || ''),
                    index
                })).filter((p: ReaderPage) => p.url);
                console.log(`[getPages] Found ${pages.length} images from images array`);
            }
            // Fallback: data.images directly
            else if (data.images && Array.isArray(data.images)) {
                pages = data.images.map((img: any, index: number) => ({
                    url: typeof img === 'string' ? img : (img.url || img.src || ''),
                    index
                })).filter((p: ReaderPage) => p.url);
                console.log(`[getPages] Found ${pages.length} images from data.images`);
            }

            if (pages.length === 0) {
                console.warn(`[getPages] No images found for ${cleanId}`);
                console.warn('[getPages] Full response:', JSON.stringify(data).slice(0, 1000));
                return { pages: [] };
            }

            // Extract Metadata
            const ch = chapter;
            let meta: ChapterMeta | undefined;
            if (ch) {
                // Try to find manga info in various common locations
                const manga = ch.manga || ch.md_comics || ch.comic;

                // Construct ID to match mapManga format: cx:HID-SLUG
                const hid = manga?.hid || ch.comic_hid || manga?.id; // HID is the Comix ID
                const slug = manga?.slug || '';

                let mangaId = '';
                if (hid) {
                    mangaId = `cx:${hid}${slug ? '-' + slug : ''}`;
                } else if (slug) {
                    mangaId = `cx:${slug}`; // Fallback if no HID
                }

                let mangaTitle = manga?.title || manga?.name || '';
                let mangaCover = manga?.cover_url || manga?.cover || (manga?.md_covers ? `https://meo.comick.pictures/${manga.md_covers[0].b2key}` : '') || '';

                // FALLBACK: If we have an ID but no title/cover, fetch details
                if (mangaId && (!mangaTitle || !mangaCover)) {
                    try {
                        // Extract just the HID for the API call if possible, or use the full ID
                        const lookupId = hid || slug || mangaId;
                        const details = await this.getMangaDetails(lookupId);
                        if (details) {
                            if (!mangaTitle) mangaTitle = details.title;
                            if (!mangaCover) mangaCover = details.cover;
                            // Ensure we have the most accurate ID
                            if (!mangaId) mangaId = details.id;
                        }
                    } catch (err) {
                        console.warn('Failed to fetch fallback metadata', err);
                    }
                }

                // Extract prev/next chapter IDs - these can be objects or primitives
                console.log('[getPages] ch.prev:', JSON.stringify(ch.prev));
                console.log('[getPages] ch.next:', JSON.stringify(ch.next));

                let prevId: string | number | null = null;
                let nextId: string | number | null = null;

                if (ch.prev) {
                    if (typeof ch.prev === 'object') {
                        prevId = ch.prev.id || ch.prev.hid || ch.prev.chapter_id || null;
                    } else {
                        prevId = ch.prev;
                    }
                }

                if (ch.next) {
                    if (typeof ch.next === 'object') {
                        nextId = ch.next.id || ch.next.hid || ch.next.chapter_id || null;
                    } else {
                        nextId = ch.next;
                    }
                }

                console.log('[getPages] Extracted prevId:', prevId, 'nextId:', nextId);

                meta = {
                    mangaId: mangaId || `cx:unknown-${cleanId}`, // Absolute fallback
                    chapterId: cleanId,
                    title: ch.title || '',
                    number: ch.number || '',
                    mangaTitle,
                    mangaCover,
                    prevChapterId: prevId ? `cx:${prevId}` : undefined,
                    nextChapterId: nextId ? `cx:${nextId}` : undefined,
                };
            }

            return { pages, meta };

        } catch (e) {
            console.error("Pages Error:", e);
            return { pages: [] };
        }
    }
};



