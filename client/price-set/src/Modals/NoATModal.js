import {Button, Modal} from "react-bootstrap";

function NoATModal(props){
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    No AT!
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    You have 0 AT balance in your account
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default NoATModal;