// src/pages/Menu.jsx
import { useEffect, useState } from "react";
import { db } from "../firebase.config";
import { collection, getDocs } from "firebase/firestore";
import { Row, Col, Card, Spinner } from "react-bootstrap";
import { Link } from "react-router";

export default function Menu() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const list = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(list);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-center mb-4">Browse Categories</h2>
      <Row>
        {categories.map(category => (
          <Col key={category.id} xs={12} md={6} lg={4} className="mb-4">
            <Card
              as={Link}
              to={`/category/${category.id}`}
              className="text-decoration-none text-dark"
            >
              <Card.Img
                variant="top"
                src={category.imageURL}
                alt={category.name}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <Card.Body className="text-center">
                <Card.Title>{category.name}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
