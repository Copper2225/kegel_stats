import { useEffect, useState } from 'react';
import { StatsRecord } from 'src/types/alleyConfig';
import { getAllRecords } from 'src/requests/loadRequests';
import RecordTile from 'src/View/RecordsPage/RecordTile';

const RecordsPage = () => {
    const [records, setRecords] = useState<StatsRecord[]>([]);

    useEffect(() => {
        getAllRecords().then((res) => {
            setRecords(res?.records ?? []);
        });
    }, []);

    return (
        <div>
            {records.length > 0 && (
                <ul className={'list-unstyled'}>
                    {records.map((record) => (
                        <RecordTile key={record.id} record={record} />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RecordsPage;
