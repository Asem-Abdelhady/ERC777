import React from "react";
import {Button, Modal} from "react-bootstrap";

function NotEnoughEthersModal(props) {
    return (
        <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Not enough ether!
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Your account balance cannot support the purchase transaction!
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}
export default NotEnoughEthersModal;