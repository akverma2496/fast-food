// src/components/category/CategoryList.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  deleteCategory,
} from "../../store/categories/categoriesActions";
import { Row, Col, Card, Button, Spinner } from "react-bootstrap";
import ConfirmModal from "../ConfirmModal";
import CategoryFormModal from "./CategoryFormModal";
import { updateCategory } from "../../store/categories/categoriesActions";
import { toast } from "react-toastify";

export default function CategoryList() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.categories);
  const { idToken } = useSelector((state) => state.auth);

  const [showModal, setShowModal] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);

  const [editModal, setEditModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);

  useEffect(() => {
    if (idToken) {
      dispatch(fetchCategories(idToken));
    }
  }, [dispatch, idToken]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleDeleteClick = (cat) => {
    setSelectedCat(cat);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (selectedCat) {
      dispatch(deleteCategory({ fullPath: selectedCat.fullPath, idToken }))
        .unwrap()
        .then(() => toast.success("Category deleted successfully"))
        .catch((err) => toast.error(err));
    }
    setShowModal(false);
    setSelectedCat(null);
  };

  const handleSaveEdit = ({ name, file }) => {
    dispatch(updateCategory({
      fullPath: editingCat.fullPath,
      name,
      file,
      idToken
    }))
      .unwrap()
      .then(() => toast.success("Category updated successfully"))
      .catch((err) => toast.error(err));
    setEditModal(false);
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-4" />;
  if (error) return null;

  if (list.length === 0) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: "#555",
        }}
      >
        No categories found
      </div>
    );
  }

  return (
    <>
      <Row>
        {list.map((cat) => (
          <Col md={4} lg={3} key={cat.id} className="mb-4">
            <Card className="shadow-sm h-100">
              <Card.Img
                variant="top"
                src={cat.image}
                alt={cat.name}
                style={{ height: "180px", objectFit: "cover" }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{cat.name}</Card.Title>
                <div className="mt-auto d-flex justify-content-between">
                  <Button variant="primary" size="sm"
                    onClick={() => {
                      setEditingCat(cat);
                      setEditModal(true);
                    }}>
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(cat)}
                  >
                    Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Confirm Modal */}
      <ConfirmModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={confirmDelete}
        title="Delete Category"
        body={`Are you sure you want to delete "${selectedCat?.name}"?`}
      />

      <CategoryFormModal
        show={editModal}
        onHide={() => setEditModal(false)}
        category={editingCat}
        onSave={handleSaveEdit}
      />
    </>
  );
}
