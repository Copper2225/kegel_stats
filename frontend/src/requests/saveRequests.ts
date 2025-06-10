import { api } from 'src/requests/api';
import { StatsRecordSave } from 'src/types/alleyConfig';

export const saveRecord = async (request: StatsRecordSave) => {
    return api.post('/saveRecord', request);
};
