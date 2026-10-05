import { create } from 'zustand';

interface UIState {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
    sidebarOpen: true,
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));

interface AppState {
    researchFilter: string;
    setResearchFilter: (filter: string) => void;
    literatureFilter: string;
    setLiteratureFilter: (filter: string) => void;
    experimentFilter: string;
    setExperimentFilter: (filter: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
    researchFilter: 'all',
    setResearchFilter: (filter) => set({ researchFilter: filter }),
    literatureFilter: 'all',
    setLiteratureFilter: (filter) => set({ literatureFilter: filter }),
    experimentFilter: 'all',
    setExperimentFilter: (filter) => set({ experimentFilter: filter }),
}));
