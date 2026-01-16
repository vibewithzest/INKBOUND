import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// --- TYPES ---
export interface Manga {
    id: string; // "provider:slug"
    title: string;
    cover: string;
    status: 'reading' | 'completed' | 'plan_to_read' | 'dropped';
    apiStatus?: string; // 'releasing' | 'finished' etc.
    rating?: number;
    year?: number;
    type?: string;
    totalChapters?: number;
    updatedAt: number; // For sorting
}

export interface ReadingHistory {
    mangaId: string;
    mangaTitle: string;
    mangaCover: string;
    chapterId: string;
    chapterTitle: string;
    page: number;
    readAt: number;
}

interface AppState {
    library: Manga[];
    history: ReadingHistory[];

    // Actions
    addToLibrary: (manga: Omit<Manga, 'updatedAt'>) => void;
    removeFromLibrary: (id: string) => void;
    updateStatus: (id: string, status: Manga['status']) => void;

    addToHistory: (entry: ReadingHistory) => void;
    getHistory: (mangaId: string) => ReadingHistory | undefined;

    // Settings
    settings: {
        includeNSFW: boolean;
        readerMode: 'webtoon' | 'single' | 'double';
        defaultLanguage: string;
        dataSaver: boolean;
        gpuAcceleration: boolean;
    };
    updateSettings: (settings: Partial<AppState['settings']>) => void;
}

// --- STORE ---
export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            library: [],
            history: [],

            addToLibrary: (manga) => set((state) => {
                if (!manga.id) return state; // Prevent empty IDs
                const exists = state.library.some(m => m.id === manga.id);
                if (exists) return state;
                return {
                    library: [...state.library, { ...manga, updatedAt: Date.now() }]
                };
            }),

            removeFromLibrary: (id) => set((state) => ({
                library: state.library.filter(m => m.id !== id)
            })),

            updateStatus: (id, status) => set((state) => ({
                library: state.library.map(m => m.id === id ? { ...m, status, updatedAt: Date.now() } : m)
            })),

            addToHistory: (entry) => set((state) => {
                if (!entry.mangaId) return state; // Prevent empty IDs from breaking history
                // Remove old entry for this manga if exists
                const filtered = state.history.filter(h => h.mangaId !== entry.mangaId);
                return {
                    history: [entry, ...filtered]
                };
            }),

            getHistory: (mangaId) => get().history.find(h => h.mangaId === mangaId),

            // Settings
            settings: {
                includeNSFW: false,
                readerMode: 'webtoon',
                defaultLanguage: 'en',
                dataSaver: false,
                gpuAcceleration: true,
            },
            updateSettings: (newSettings) => set((state) => {
                const currentSettings = state.settings || {
                    includeNSFW: false,
                    readerMode: 'webtoon',
                    defaultLanguage: 'en',
                    dataSaver: false,
                    gpuAcceleration: true,
                };
                return {
                    settings: { ...currentSettings, ...newSettings }
                };
            }),
        }),
        {
            name: 'inkbound-storage', // Key in localStorage
            storage: createJSONStorage(() => localStorage),
        }
    )
);
