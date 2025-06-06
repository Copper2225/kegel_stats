import * as React from 'react';
import { useCallback } from 'react';
import styled from 'styled-components';
import { StatsRecord } from 'src/types/alleyConfig';
import { Button } from 'react-bootstrap';
import RecordDetailsModal from 'src/View/RecordsPage/RecordDetailsModal';

const ParentWrapper = styled.li`
    border-bottom: #959595 2px solid;
    padding-block: 12px;

    &:last-child {
        border-bottom: none;
    }

    &:first-child {
        padding-top: 0;
    }
`;

const GridButton = styled(Button)`
    display: grid;
    column-gap: 4px;
    row-gap: 4px;
    grid-template-areas: 'a c' 'b c';

    div {
        text-align: left;
    }
`;

interface Props {
    key: number;
    record: StatsRecord;
    loadRecords: () => void;
}

const RecordTile = ({ record, key, loadRecords }: Props): React.ReactElement => {
    const [showModal, setShowModal] = React.useState<boolean>(false);

    const openModal = useCallback(() => {
        setShowModal(true);
    }, []);

    const hideModal = useCallback(() => {
        setShowModal(false);
    }, []);

    return (
        <ParentWrapper key={key}>
            <GridButton
                onClick={openModal}
                variant={`${record.training ? 'outline-primary' : 'outline-info'}`}
                className={'w-100 d-grid text-white'}
            >
                <div style={{ gridArea: 'a' }}>{new Date(record.date).toLocaleDateString()}</div>
                <div style={{ gridArea: 'b' }}>{record.location}</div>
                <div className={'align-content-center text-end'} style={{ gridArea: 'c', fontSize: '1.6rem' }}>
                    {record.total}
                </div>
            </GridButton>
            <RecordDetailsModal showModal={showModal} hideModal={hideModal} record={record} loadRecords={loadRecords} />
        </ParentWrapper>
    );
};

export default RecordTile;
