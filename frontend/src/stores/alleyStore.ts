import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { AlleyConfig } from 'src/types/alleyConfig';

interface TrackingData {
    alleys: AlleyConfig;
    total: number;
}

interface Actions {
    setAlleys(alleys: AlleyConfig): void;
    setTotal(total: number): void;
    clearAlleys(): void;
}

export const useAlleyStore = create<TrackingData & Actions>()(
    persist(
        immer((set) => ({
            alleys: {
                start: 1,
                alley1: { total: null, full: null, clearing: null },
                alley2: { total: null, full: null, clearing: null },
                alley3: { total: null, full: null, clearing: null },
                alley4: { total: null, full: null, clearing: null },
            },
            total: 0,
            setAlleys: (alleys: AlleyConfig) =>
                set((state) => {
                    state.alleys = alleys;
                }),
            setTotal: (total: number) =>
                set((state) => {
                    state.total = total;
                }),
            clearAlleys: () =>
                set((state) => {
                    state.alleys = {
                        start: 1,
                        alley1: { total: null, full: null, clearing: null },
                        alley2: { total: null, full: null, clearing: null },
                        alley3: { total: null, full: null, clearing: null },
                        alley4: { total: null, full: null, clearing: null },
                    };
                }),
        })),
        {
            name: 'alleyStore',
        },
    ),
);
