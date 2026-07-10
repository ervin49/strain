import { useState } from "react";
import {Button, Modal} from "react-bootstrap";

export default function ModalWindow(){
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    return (
        <>
            <Modal show={show}>
                <Modal.Header closeButton>
                    <Modal.Title>Registration error</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}></Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}