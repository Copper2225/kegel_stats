import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { Alley } from 'src/types/alleyConfig';

interface TrackingData {
    alleys: Alley[];
    total: number;
}

interface Actions {
    setAlleys(alleys: Alley[]): void;
    setTotal(total: number): void;
    clearAlleys(): void;
}

export const useAlleyStore = create<TrackingData & Actions>()(
    persist(
        immer((set) => ({
            alleys: [],
            total: 0,
            setAlleys: (alleys: Alley[]) =>
                set((state) => {
                    state.alleys = alleys;
                }),
            setTotal: (total: number) =>
                set((state) => {
                    state.total = total;
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
