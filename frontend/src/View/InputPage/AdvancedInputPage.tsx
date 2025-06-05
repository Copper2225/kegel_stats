import { ReactElement } from 'react';
import { Button, FormCheck, FormControl, FormGroup, FormLabel, FormSelect } from 'react-bootstrap';

const AdvancedInputPage = (): ReactElement => {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    return (
        <div className={'d-flex gap-3 flex-column'}>
            <FormGroup>
                <FormLabel>Startbahn</FormLabel>
                <FormSelect>
                    <option>Bahn 1</option>
                    <option>Bahn 2</option>
                    <option>Bahn 3</option>
                    <option>Bahn 4</option>
                </FormSelect>
            </FormGroup>

            <FormGroup>
                <FormLabel>Ort</FormLabel>
                <FormControl />
            </FormGroup>

            <FormGroup>
                <FormCheck label={<label>Training</label>} />
            </FormGroup>

            <FormGroup>
                <FormLabel>Datum</FormLabel>
                <FormControl value={today} type={'date'} />
            </FormGroup>

            <Button className={'mt-4'} size={'lg'}>
                Save
            </Button>
        </div>
    );
};

export default AdvancedInputPage;
