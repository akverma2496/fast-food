// src/pages/Categories.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.config";
import CategoryList from "../components/categories/CategoryList";
import { Spinner } from "react-bootstrap";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "categories"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) return <Spinner animation="border" />;

  return (
    <div>
      <h3 className="mb-4">Manage Categories</h3>
      <CategoryList categories={categories} onReload={fetchCategories} />
    </div>
  );
};

export default Categories;
