import { api } from 'src/requests/api';

import { StatsRecord } from 'src/types/alleyConfig';

interface LoadRequests {
    success: string;
    records: StatsRecord[];
}

export const getAllRecords = async (): Promise<LoadRequests | null> => {
    return api.get('/allRecords');
};
