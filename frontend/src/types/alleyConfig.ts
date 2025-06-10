export interface Alley {
    full: number | null;
    clear: number | null;
    total: number | null;
    number: number;
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

export interface StatsRecordSave {
    id: number;
    alleys: Alley[];
    total: number;
    start: number;
    location: string;
    date: string;
    training: boolean;
}
