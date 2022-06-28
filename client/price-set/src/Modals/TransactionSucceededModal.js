import React from "react";
import {Button, Modal} from "react-bootstrap";


function TransactionSucceededModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Transaction succeeded!
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    You made a successful transaction, the price for your AT is now {props.newPrice}.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default TransactionSucceededModal;