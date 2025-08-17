// src/components/common/ConfirmModal.jsx
import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function ConfirmModal({ show, onHide, title, message, onConfirm }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      {title && (
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
