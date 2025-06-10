import { ReactElement, useCallback } from 'react';
import { Button, FormCheck, FormControl, FormGroup, FormLabel, FormSelect } from 'react-bootstrap';
import { Form, Formik } from 'formik';
import { useAlleyStore } from 'src/stores/alleyStore';
import { saveRecord } from 'src/requests/saveRequests';
import { useNavigate } from 'react-router';

interface AdvancedInputFormData {
    start: number;
    location: string;
    training: boolean;
    date: string;
}

const initialValues: AdvancedInputFormData = {
    start: 1,
    location: 'Ostbevern',
    training: true,
    date: new Date().toISOString().split('T')[0],
};

const AdvancedInputPage = (): ReactElement => {
    const { alleys, total } = useAlleyStore();
    const navigate = useNavigate();

    const handleSubmit = useCallback(
        async (values: AdvancedInputFormData) => {
            const response = await saveRecord({
                id: 0,
                alleys: alleys,
                start: values.start,
                total: total,
                location: values.location,
                date: values.date,
                training: values.training,
            });

            if (response.success === true) {
                navigate('/records');
            }
        },
        [alleys, navigate, total],
    );

    return (
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({ handleChange, values }) => (
                <Form className={'d-flex gap-3 flex-column'}>
                    <FormGroup>
                        <FormLabel>Startbahn</FormLabel>
                        <FormSelect name={'start'} onChange={handleChange} value={values.start}>
                            <option value={1}>Bahn 1</option>
                            <option value={2}>Bahn 2</option>
                            <option value={3}>Bahn 3</option>
                            <option value={4}>Bahn 4</option>
                        </FormSelect>
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>Ort</FormLabel>
                        <FormControl name={'location'} onChange={handleChange} value={values.location} />
                    </FormGroup>

                    <FormGroup>
                        <FormCheck name={'training'} onChange={handleChange} checked={values.training} label={<label>Training</label>} />
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>Datum</FormLabel>
                        <FormControl name={'date'} onChange={handleChange} value={values.date} type={'date'} />
                    </FormGroup>

                    <Button type={'submit'} className={'mt-4'} size={'lg'}>
                        Save
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default AdvancedInputPage;
