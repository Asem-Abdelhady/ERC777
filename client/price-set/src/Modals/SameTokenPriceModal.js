import {Button, Modal} from "react-bootstrap";

function SameTokenPriceModal(props){
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Same price!
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    This is the same price you already set for your AT.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );

}

export default SameTokenPriceModal;