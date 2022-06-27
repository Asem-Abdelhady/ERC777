import {Button, Modal} from "react-bootstrap";

function TransactionFailedModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Transaction failed!
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    The transaction is {props.transactionFailedStatus}.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default TransactionFailedModal;