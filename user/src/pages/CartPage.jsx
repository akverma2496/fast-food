import { useCart } from "../context/CartContext";
import { Container, Row, Col, Card, Button, Image } from "react-bootstrap";
import { Link } from "react-router";

export default function CartPage() {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity} = useCart();


  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Container className="py-4">
      <h2 className="text-center">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center">Your cart is empty. <Link to="/">Browse recipes</Link></p>
      ) : (
        <>
          {cartItems.map((item) => (
            <Card key={item.id} className="mb-3">
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={2}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fluid
                      rounded
                      style={{ height: "80px", objectFit: "cover" }}
                    />
                  </Col>
                  <Col md={4}>
                    <h5>{item.name}</h5>
                  </Col>
                  <Col md={2}>
                    ₹ {item.price} x {item.quantity}
                  </Col>
                  <Col md={2}>
                    <strong>₹ {item.price * item.quantity}</strong>
                  </Col>
                  <Col md={2} className="text-end">
                    <div className="d-flex align-items-center justify-content-end">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => decreaseQuantity(item.id)}
                      >
                        −
                      </Button>
                      <span className="px-2">{item.quantity}</span>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => increaseQuantity(item.id)}
                      >
                        +
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="ms-2"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </Col>


                </Row>
              </Card.Body>
            </Card>
          ))}

          <h4 className="text-end">Total: ₹ {total}</h4>

          <div className="text-end">
            <Link to="/checkout">
              <Button variant="success">Proceed to Checkout</Button>
            </Link>
          </div>
        </>
      )}
    </Container>
  );
}
