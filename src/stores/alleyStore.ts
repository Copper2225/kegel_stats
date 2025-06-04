import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

export interface AlleyData {
    full: number | null;
    clearing: number | null;
    total: number | null;
}

interface TrackingData {
    alleys: AlleyData[];
}

interface Actions {
    setAlleys(alleys: AlleyData[]): void;
    clearAlleys(): void;
}

export const useAlleyStore = create<TrackingData & Actions>()(
    persist(
        immer((set) => ({
            alleys: [],
            setAlleys: (alleys: AlleyData[]) =>
                set((state) => {
                    state.alleys = alleys;
                }),
            clearAlleys: () =>
                set((state) => {
                    state.alleys = [];
                }),
        })),
        {
            name: 'alleyStore',
        },
    ),
);
