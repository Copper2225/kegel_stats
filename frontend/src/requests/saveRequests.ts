import { api } from 'src/requests/api';
import { StatsRecord } from 'src/types/alleyConfig';

export const saveRecord = async (request: StatsRecord) => {
    return api.post('/saveRecord', request);
};
