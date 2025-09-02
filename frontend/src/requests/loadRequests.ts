import { api } from 'src/requests/api';

import { StatsRecord } from 'src/types/alleyConfig';

interface LoadRequests {
    success: boolean;
    records: StatsRecord[];
}

export const getAllRecords = async (): Promise<LoadRequests | null> => {
    return api.get('/allRecords');
};

export interface SearchFilters {
    dateFrom?: string;
    dateTo?: string;
    location?: string;
    trainingMode?: 'any' | 'training' | 'wettkampf';
    startLane?: number | null;
    lanes?: number[];
    volleMin?: number | '';
    volleMax?: number | '';
    clearMin?: number | '';
    clearMax?: number | '';
    totalMin?: number | '';
    totalMax?: number | '';
}

export const searchRecords = async (filters: SearchFilters): Promise<LoadRequests | null> => {
    return api.post('/searchRecords', filters);
};
