export interface Alley {
    full: number | null;
    clear: number | null;
    total: number | null;
    number: number;
}

export interface StatsRecord {
    id: number;
    alleys: Alley[];
    total: number;
    start: number;
    location: string;
    date: string;
    training: boolean;
}
