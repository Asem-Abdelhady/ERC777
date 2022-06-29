import {Button, Modal} from "react-bootstrap";

function PriceSetConfirmationModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Price confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>Your current price for AT is {props.currentPrice} ether are you sure you want to change it
                to {props.newPrice} ether?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>
                    Close
                </Button>
                <Button variant="primary" onClick={props.setPrice}>
                    Set price
                </Button>
            </Modal.Footer>
        </Modal>
    )

}

export default PriceSetConfirmationModal;