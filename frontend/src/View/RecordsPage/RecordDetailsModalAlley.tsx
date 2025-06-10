import styled from 'styled-components';
import { Alley } from 'src/types/alleyConfig';

const Grid = styled.div`
    display: grid;
    grid-template-areas: 'a c' 'b c';
`;

const GridItem = styled.div`
    outline: 2px solid #008e4f;
    background: #454545;

    padding: 4px 12px;

    font-size: 1.5em;
`;

interface Props {
    alley: Alley;
    title: string;
}

const RecordDetailsModalAlley = ({ alley, title }: Props) => {
    return (
        <div className={'mb-3'}>
            <h4>{title}</h4>
            <Grid>
                <GridItem style={{ gridArea: 'a' }}>{alley.full ?? '-'}</GridItem>
                <GridItem style={{ gridArea: 'b' }}>{alley.clear ?? '-'}</GridItem>
                <GridItem className={'text-end align-content-center'} style={{ gridArea: 'c', fontSize: '2.5em' }}>
                    {alley.total ?? '-'}
                </GridItem>
            </Grid>
        </div>
    );
};

export default RecordDetailsModalAlley;
