import {Button, Modal} from "react-bootstrap";

function TokensPurchaseConfirmationModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Purchase confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to buy {props.tokensNumber} tokens for {props.tokensPrice} ether?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>
                    Close
                </Button>
                <Button variant="primary" onClick={props.buyTokens}>
                    Purchase
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
export default TokensPurchaseConfirmationModal;