export interface Alley {
    full: number | null;
    clearing: number | null;
    total: number | null;
}
export interface AlleyConfig {
    start: number;
    alley1: Alley;
    alley2: Alley;
    alley3: Alley;
    alley4: Alley;
}

export interface StatsRecord {
    id: number;
    alleys: AlleyConfig;
    total: number;
    location: string;
    date: string;
    training: boolean;
}
