import { api } from 'src/requests/api';

export const deleteRecord = async (id: number) => {
    return api.post('/deleteRecord', { id: id });
};
