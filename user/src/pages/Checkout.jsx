import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { db } from "../firebase.config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { toast } from "react-toastify";

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    street: "",
    city: "",
    zipCode: "",
    phone: "",
    instructions: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleOrder = async (e) => {
    e.preventDefault();
    const { street, city, zipCode, phone } = address;

    if (!street || !city || !zipCode || !phone) {
      toast.error("Please fill in all required address fields.");
      return;
    }

    try {
      await addDoc(collection(db, "orders"), {
        userId: currentUser.uid,
        items: cartItems,
        totalAmount,
        address,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      clearCart();
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Something went wrong while placing the order.");
    }
  };

  return (
    <Row className="my-4">
      <Col md={6}>
        <h4>Delivery Address</h4>
        <Form onSubmit={handleOrder}>
          <Form.Group className="mb-3">
            <Form.Label>Street Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="123 Main Street"
              name="street"
              value={address.street}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              placeholder="City"
              name="city"
              value={address.city}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>ZIP Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="123456"
              name="zipCode"
              value={address.zipCode}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Enter phone number"
              name="phone"
              value={address.phone}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Delivery Instructions (optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="e.g. Leave at the door"
              name="instructions"
              value={address.instructions}
              onChange={handleChange}
            />
          </Form.Group>

          <Button type="submit" variant="success">
            Place Order (COD)
          </Button>
        </Form>
      </Col>

      <Col md={6}>
        <h4>Order Summary</h4>
        {cartItems.map((item) => (
          <Card key={item.id} className="mb-2">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{item.name}</strong> x {item.quantity}
              </div>
              <div>₹{item.price * item.quantity}</div>
            </Card.Body>
          </Card>
        ))}
        <h5 className="mt-3">Total: ₹{totalAmount}</h5>
      </Col>
    </Row>
  );
}
