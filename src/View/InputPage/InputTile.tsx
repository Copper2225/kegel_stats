import { ReactElement, useCallback, useState } from 'react';
import styled from 'styled-components';
import { Button, FormControl } from 'react-bootstrap';
import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator } from '@fortawesome/free-solid-svg-icons';

const ParentWrapper = styled.div`
    display: grid;
    column-gap: 4px;
    row-gap: 4px;
    grid-template-areas: 'a c' 'b c';
`;

interface Props {
    title: string;
}

const InputTile = ({ title }: Props): ReactElement => {
    const [volle, setVolle] = useState<number | ''>('');
    const [raeumen, setRaeumen] = useState<number | ''>('');
    const [gesamt, setGesamt] = useState<number | ''>('');
    const [isTotalMismatch, setIsTotalMismatch] = useState(false);

    const handleCalculation = useCallback(() => {
        const calculateMissingValue = (volleValue: number, raeumenValue: number, gesamtValue: number) => {
            if (volleValue === 0) {
                return gesamtValue - raeumenValue;
            }
            if (raeumenValue === 0) {
                return gesamtValue - volleValue;
            }
            return volleValue + raeumenValue;
        };
        if (volle !== '' && gesamt !== '' && raeumen !== '') {
            setIsTotalMismatch(volle + raeumen !== gesamt);
            return;
        } else if (volle !== '' && gesamt !== '') {
            setRaeumen(calculateMissingValue(volle, 0, gesamt));
        } else if (volle !== '' && raeumen !== '') {
            setGesamt(calculateMissingValue(volle, raeumen, 0));
        } else if (gesamt !== '' && raeumen !== '') {
            setVolle(calculateMissingValue(0, raeumen, gesamt));
        }
        setIsTotalMismatch(false);
    }, [gesamt, raeumen, volle, setIsTotalMismatch]);

    const handleVolleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setVolle(parseInt(e.target.value) || '');
    }, []);

    const handleRaeumenChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setRaeumen(parseInt(e.target.value) || '');
    }, []);

    const handleGesamtChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setGesamt(parseInt(e.target.value) || '');
    }, []);

    return (
        <div className={'mx-2'}>
            <h1>
                <div className={'d-flex align-items-center gap-2'}>
                    {title}
                    <Button onClick={handleCalculation} size={'sm'} style={{ lineHeight: '1em' }}>
                        <FontAwesomeIcon icon={faCalculator} size="sm" />
                    </Button>
                </div>
            </h1>
            <ParentWrapper>
                <div style={{ gridArea: 'a' }}>
                    <FormControl value={volle} onChange={handleVolleChange} type="number" placeholder="Volle" />
                </div>
                <div style={{ gridArea: 'c' }}>
                    <FormControl
                        value={gesamt}
                        onChange={handleGesamtChange}
                        type="number"
                        className={`h-100 ${isTotalMismatch ? 'border-danger text-danger' : ''}`}
                        placeholder="Gesamt"
                    />
                </div>
                <div style={{ gridArea: 'b' }}>
                    <FormControl value={raeumen} onChange={handleRaeumenChange} type="number" placeholder="Räumen" />
                </div>
            </ParentWrapper>
        </div>
    );
};

export default InputTile;
