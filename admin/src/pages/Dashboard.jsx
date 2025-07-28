import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { db } from "../firebase.config";
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";

const Dashboard = () => {
  const [counts, setCounts] = useState({
    categories: 0,
    recipes: 0,
    orders: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const [catSnap, recSnap, orderSnap] = await Promise.all([
        getDocs(collection(db, "categories")),
        getDocs(collection(db, "recipes")),
        getDocs(collection(db, "orders")),
      ]);

      setCounts({
        categories: catSnap.size,
        recipes: recSnap.size,
        orders: orderSnap.size,
      });
    } catch (error) {
      console.error("Error fetching dashboard counts:", error);
    } finally {
      setLoading(false);
    }
  };

  const cardData = [
    {
      title: "Categories",
      count: counts.categories,
      link: "/admin/categories",
      bg: "primary",
    },
    {
      title: "Recipes",
      count: counts.recipes,
      link: "/admin/recipes",
      bg: "success",
    },
    {
      title: "All Orders",
      count: counts.orders,
      link: "/admin/orders",
      bg: "warning",
    },
  ];

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Dashboard</h3>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row xs={1} md={2} className="g-4">
          {cardData.map((card, idx) => (
            <Col key={idx}>
              <Card
                bg={card.bg.toLowerCase()}
                text="white"
                className="h-100 shadow-sm"
              >
                <Card.Body>
                  <Card.Title>{card.title}</Card.Title>
                  <Card.Text style={{ fontSize: "2rem" }}>
                    {card.count}
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <Link
                    to={card.link}
                    className="text-white text-decoration-underline"
                  >
                    View {card.title}
                  </Link>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Dashboard;
