import * as React from 'react';
import styled from 'styled-components';
import { StatsRecord } from 'src/types/alleyConfig';

const ParentWrapper = styled.li`
    display: grid;
    column-gap: 4px;
    row-gap: 4px;
    grid-template-areas: 'a c' 'b c';
`;

interface Props {
    key: number;
    record: StatsRecord;
}

const RecordTile = ({ record, key }: Props): React.ReactElement => {
    return (
        <ParentWrapper key={key}>
            <div style={{ gridArea: 'a' }}>{record.date}</div>
            <div style={{ gridArea: 'c' }}>{record.location}</div>
            <div style={{ gridArea: 'b' }}>{record.total}</div>
        </ParentWrapper>
    );
};

export default RecordTile;
