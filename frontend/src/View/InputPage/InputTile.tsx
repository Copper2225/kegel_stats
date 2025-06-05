import { ReactElement, useCallback } from 'react';
import styled from 'styled-components';
import { Button, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator } from '@fortawesome/free-solid-svg-icons';
import { FormikHelpers } from 'formik';
import { AlleysFormData } from 'src/View/InputPage/InputPage';

const ParentWrapper = styled.div`
    display: grid;
    column-gap: 4px;
    row-gap: 4px;
    grid-template-areas: 'a c' 'b c';
`;

interface Props {
    title: string;
    namePrefix: string;
    values: {
        full: string | number;
        clear: string | number;
        total: string | number;
    };
    setFieldValue: FormikHelpers<AlleysFormData>['setFieldValue'];
}

const InputTile = ({ title, namePrefix, values, setFieldValue }: Props): ReactElement => {
    const handleCalculation = useCallback(() => {
        const calculateMissingValue = (fullValue: number, clearValue: number, totalValue: number) => {
            if (fullValue === 0) {
                return totalValue - clearValue;
            }
            if (clearValue === 0) {
                return totalValue - fullValue;
            }
            return fullValue + clearValue;
        };

        const full = Number(values.full) || 0;
        const clear = Number(values.clear) || 0;
        const total = Number(values.total) || 0;

        if (full && total && clear) {
            return;
        } else if (full && total) {
            setFieldValue(`${namePrefix}.clear`, calculateMissingValue(full, 0, total)).then();
        } else if (full && clear) {
            setFieldValue(`${namePrefix}.total`, calculateMissingValue(full, clear, 0)).then();
        } else if (total && clear) {
            setFieldValue(`${namePrefix}.full`, calculateMissingValue(0, clear, total)).then();
        }
    }, [values, namePrefix, setFieldValue]);

    const isTotalMismatch =
        values.full && values.clear && values.total && Number(values.full) + Number(values.clear) !== Number(values.total);

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
                    <FormControl
                        name={`${namePrefix}.full`}
                        value={values.full}
                        onChange={(e) => setFieldValue(`${namePrefix}.full`, e.target.value ? Number(e.target.value) : '')}
                        type="number"
                        placeholder="Volle"
                    />
                </div>
                <div style={{ gridArea: 'c' }}>
                    <FormControl
                        name={`${namePrefix}.total`}
                        value={values.total}
                        onChange={(e) => setFieldValue(`${namePrefix}.total`, e.target.value ? Number(e.target.value) : '')}
                        type="number"
                        className={`h-100 ${isTotalMismatch ? 'border-danger text-danger' : ''} text-center fs-2`}
                        placeholder="Gesamt"
                    />
                </div>
                <div style={{ gridArea: 'b' }}>
                    <FormControl
                        name={`${namePrefix}.clear`}
                        value={values.clear}
                        onChange={(e) => setFieldValue(`${namePrefix}.clear`, e.target.value ? Number(e.target.value) : '')}
                        type="number"
                        placeholder="Räumen"
                    />
                </div>
            </ParentWrapper>
        </div>
    );
};

export default InputTile;
