import { ReactElement, useCallback, useEffect } from 'react';
import InputTile from 'src/View/InputPage/InputTile';
import { Button, FormControl } from 'react-bootstrap';
import { useAlleyStore } from 'src/stores/alleyStore';
import { Form as FormikForm, Formik, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator } from '@fortawesome/free-solid-svg-icons';
import { Alley, AlleyConfig } from 'src/types/alleyConfig';

const validationSchema = Yup.object().shape({
    alley1: Yup.object().shape({
        full: Yup.number().nullable(),
        clear: Yup.number().nullable(),
        total: Yup.number().nullable(),
    }),
    alley2: Yup.object().shape({
        full: Yup.number().nullable(),
        clear: Yup.number().nullable(),
        total: Yup.number().nullable(),
    }),
    alley3: Yup.object().shape({
        full: Yup.number().nullable(),
        clear: Yup.number().nullable(),
        total: Yup.number().nullable(),
    }),
    alley4: Yup.object().shape({
        full: Yup.number().nullable(),
        clear: Yup.number().nullable(),
        total: Yup.number().nullable(),
    }),
});

interface AlleyFormData {
    full: number | string;
    clear: number | string;
    total: number | string;
}

export interface AlleysFormData {
    alley1: AlleyFormData;
    alley2: AlleyFormData;
    alley3: AlleyFormData;
    alley4: AlleyFormData;
    total: number | '';
}

const initialValues: AlleysFormData = {
    alley1: { full: '', clear: '', total: '' },
    alley2: { full: '', clear: '', total: '' },
    alley3: { full: '', clear: '', total: '' },
    alley4: { full: '', clear: '', total: '' },
    total: '',
};

const InputPage = (): ReactElement => {
    const { setAlleys, setTotal, clearAlleys } = useAlleyStore();
    const navigate = useNavigate();
    const formik = useFormikContext<typeof initialValues>();

    const calculateTotal = useCallback(() => {
        let total = 0;

        ['1', '2', '3', '4'].forEach((alley) => {
            const alleyData = formik.values[`alley${alley}` as keyof typeof formik.values] as AlleyFormData;
            if (alleyData.total === '') {
                return;
            }

            total = total + (alleyData.total === '' ? 0 : Number(alleyData.total));
        });

        return total;
    }, [formik]);

    useEffect(() => {
        clearAlleys();
    }, [clearAlleys]);

    const getAlleyFromFormData = useCallback((value: AlleyFormData): Alley => {
        return {
            total: String(value.total).trim() !== '' ? (value.total as number) : null,
            full: String(value.full).trim() !== '' ? (value.full as number) : null,
            clearing: String(value.clear).trim() !== '' ? (value.clear as number) : null,
        };
    }, []);

    const handleSubmit = useCallback(
        (values: typeof initialValues) => {
            const data: AlleyConfig = {
                start: 1,
                alley1: getAlleyFromFormData(values.alley1),
                alley2: getAlleyFromFormData(values.alley2),
                alley3: getAlleyFromFormData(values.alley3),
                alley4: getAlleyFromFormData(values.alley4),
            };

            setTotal(values.total !== '' ? (values.total as number) : calculateTotal());

            setAlleys(data);
            navigate('/advancedInput');
        },
        [calculateTotal, getAlleyFromFormData, navigate, setAlleys, setTotal],
    );

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            <FormContent />
        </Formik>
    );
};

const FormContent = () => {
    const formik = useFormikContext<typeof initialValues>();

    const handleCalculateTotal = useCallback(() => {
        let total = 0;

        ['1', '2', '3', '4'].forEach((alley) => {
            const alleyData = formik.values[`alley${alley}` as keyof typeof formik.values] as AlleyFormData;
            if (alleyData.total === '') {
                return;
            }

            total = total + (alleyData.total === '' ? 0 : Number(alleyData.total));
        });

        formik.setFieldValue('total', total).then();
    }, [formik]);

    return (
        <FormikForm className={'h-100 justify-content-between d-flex flex-column pb-2'}>
            <div className={'d-flex w-100 justify-content-center align-items-center gap-2'}>
                <FormControl
                    name={`total`}
                    value={formik.values.total}
                    onChange={(e) => formik.setFieldValue(`total`, e.target.value ? Number(e.target.value) : '')}
                    type="number"
                    className={`w-50 text-center fs-2`}
                    placeholder="Gesamt"
                />
                <Button onClick={handleCalculateTotal} size={'lg'}>
                    <FontAwesomeIcon icon={faCalculator} size="sm" />
                </Button>
            </div>
            <InputTile title={'Bahn 1'} namePrefix="alley1" values={formik.values.alley1} setFieldValue={formik.setFieldValue} />
            <InputTile title={'Bahn 2'} namePrefix="alley2" values={formik.values.alley2} setFieldValue={formik.setFieldValue} />
            <InputTile title={'Bahn 3'} namePrefix="alley3" values={formik.values.alley3} setFieldValue={formik.setFieldValue} />
            <InputTile title={'Bahn 4'} namePrefix="alley4" values={formik.values.alley4} setFieldValue={formik.setFieldValue} />
            <Button type="submit" className={'mb-2'} size={'lg'}>
                Save
            </Button>
        </FormikForm>
    );
};

export default InputPage;
