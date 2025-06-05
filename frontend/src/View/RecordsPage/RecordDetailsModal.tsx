import { Modal, ModalBody, ModalHeader } from 'react-bootstrap';
import { StatsRecord } from 'src/types/alleyConfig';
import RecordDetailsModalAlley from 'src/View/RecordsPage/RecordDetailsModalAlley';

interface Props {
    showModal: boolean;
    hideModal: () => void;
    record: StatsRecord;
}

const RecordDetailsModal = ({ showModal, hideModal, record }: Props) => {
    console.log(record);

    return (
        <Modal show={showModal} onHide={hideModal} fullscreen>
            <ModalHeader closeButton>Details</ModalHeader>
            <ModalBody>
                <h1 className={'w-100 text-center text-decoration-underline mb-4'}>Gesamt: {record.total}</h1>
                <div className={'d-flex flex-column'}>
                    <h2>Datum: {new Date(record.date).toLocaleDateString()}</h2>
                    <h2>Ort: {record.location}</h2>
                    <h2 className={'mb-5'}>{record.training ? 'Training' : 'Wettkampf'}</h2>
                    <RecordDetailsModalAlley title={'Bahn 1'} alley={record.alleys.alley1} />
                    <RecordDetailsModalAlley title={'Bahn 2'} alley={record.alleys.alley2} />
                    <RecordDetailsModalAlley title={'Bahn 3'} alley={record.alleys.alley3} />
                    <RecordDetailsModalAlley title={'Bahn 4'} alley={record.alleys.alley4} />
                </div>
            </ModalBody>
        </Modal>
    );
};

export default RecordDetailsModal;
