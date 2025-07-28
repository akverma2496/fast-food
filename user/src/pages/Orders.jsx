import React, { useEffect, useState } from "react";
import { db } from "../firebase.config";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import {
  Card,
  Spinner,
  Row,
  Col,
  Badge,
  Modal,
  Button,
  ListGroup,
} from "react-bootstrap";
import { format } from "date-fns";

export default function Orders() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "orders"),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const statusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "warning";
      case "preparing":
        return "info";
      case "delivered":
        return "success";
      case "cancelled":
        return "danger";
      case "out for delivery":
        return "secondary";
      default:
        return "light";
    }
  };

  const handleCardClick = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" />
      </div>
    );

  return (
    <div className="my-4">
      <h3>Your Orders</h3>

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <h2 className="text-muted">No Orders Yet 📭</h2>
          <p className="text-muted">
            Looks like you haven’t ordered anything yet.
          </p>
        </div>
      ) : (
        orders.map((order) => (
          <Card
            key={order.id}
            className="mb-3"
            style={{ cursor: "pointer" }}
            onClick={() => handleCardClick(order)}
          >
            <Card.Body>
              <Row>
                <Col md={6}>
                  <strong>Order Date:</strong>{" "}
                  {order.createdAt?.toDate
                    ? format(order.createdAt.toDate(), "dd MMM yyyy hh:mm a")
                    : "N/A"}
                  <br />
                  <strong>Items:</strong> {order.items.length} item(s)
                  <br />
                  <strong>Total:</strong> ₹{order.totalAmount}
                </Col>
                <Col md={6} className="text-md-end">
                  <Badge bg={statusColor(order.status)} className="fs-6">
                    {order.status?.toUpperCase()}
                  </Badge>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))
      )}

      {/* Modal for order details */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <p>
                <strong>Date:</strong>{" "}
                {selectedOrder.createdAt?.toDate
                  ? format(selectedOrder.createdAt.toDate(), "dd MMM yyyy hh:mm a")
                  : "N/A"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <Badge bg={statusColor(selectedOrder.status)}>
                  {selectedOrder.status?.toUpperCase()}
                </Badge>
              </p>
              <p>
                <strong>Total Amount:</strong> ₹{selectedOrder.totalAmount}
              </p>
              <h5 className="mt-3">Items:</h5>
              <ListGroup variant="flush">
                {selectedOrder.items.map((item, index) => (
                  <ListGroup.Item key={index}>
                    {item.name} × {item.quantity} = ₹{item.price * item.quantity}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
