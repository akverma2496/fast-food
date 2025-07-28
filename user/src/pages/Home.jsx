// src/pages/Home.jsx
import { Container, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router";

export default function Home() {
  return (
    <Container className="text-center py-5">
      <Row className="align-items-center">
        <Col md={6} className="mb-4 mb-md-0">
          <img
            src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80
" // Replace with your own banner or food image
            alt="Delicious Food"
            className="img-fluid rounded"
          />
        </Col>
        <Col md={6}>
          <h1 className="display-4 fw-bold">Welcome to FastFood 🚀</h1>
          <p className="lead">
            Craving something fast and tasty? Browse our menu and get your favorite meals delivered quickly!
          </p>
          <Button as={Link} to="/menu" variant="primary" size="lg">
            Explore Menu
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
