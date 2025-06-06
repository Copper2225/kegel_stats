import { useCallback, useEffect, useState } from 'react';
import { StatsRecord } from 'src/types/alleyConfig';
import { getAllRecords } from 'src/requests/loadRequests';
import RecordTile from 'src/View/RecordsPage/RecordTile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

const Header = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    width: min-content;
    font-size: 1.8em;
`;

const RecordsPage = () => {
    const [records, setRecords] = useState<StatsRecord[]>([]);

    const loadRecords = useCallback(() => {
        getAllRecords().then((res) => {
            setRecords(res?.records ?? []);
        });
    }, []);

    useEffect(() => {
        loadRecords();
    }, [loadRecords]);

    return (
        <div className={'h-100'}>
            <div className={'d-flex align-items-center mb-2'}>
                <a href={'/'} className={'btn btn-primary'}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                </a>
                <Header>Einträge</Header>
            </div>
            {records.length > 0 ? (
                <ul className={'list-unstyled'}>
                    {records.map((record) => (
                        <RecordTile key={record.id} record={record} loadRecords={loadRecords} />
                    ))}
                </ul>
            ) : (
                <div className={'text-center align-content-center h-100 fs-1'}>no records</div>
            )}
        </div>
    );
};

export default RecordsPage;
