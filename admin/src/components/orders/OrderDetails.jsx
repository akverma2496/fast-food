import React from "react";
import { Modal, Button, ListGroup, Badge } from "react-bootstrap";

const OrderDetails = ({ show, handleClose, order }) => {
  if (!order) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Order Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>User ID: <Badge bg="secondary">{order.userId}</Badge></h5>
        <h6>Status: <Badge bg="info">{order.status}</Badge></h6>
        <p>Placed At: {order.createdAt?.toDate?.().toLocaleString() || "N/A"}</p>

        <h6 className="mt-3">Items:</h6>
        <ListGroup>
          {order.items.map((item, idx) => (
            <ListGroup.Item key={idx}>
              <div className="d-flex justify-content-between">
                <span>{item.name} × {item.quantity}</span>
                <strong>₹{item.price * item.quantity}</strong>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>

        <div className="text-end mt-3">
          <h5>Total: ₹{order.totalAmount}</h5>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderDetails;
