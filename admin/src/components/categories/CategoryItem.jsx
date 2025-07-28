// src/components/categories/CategoryItem.jsx
import React from "react";
import { ListGroup, Image, Button } from "react-bootstrap";
import { db, storage } from "../../firebase.config";
import { doc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { toast } from "react-toastify";

const CategoryItem = ({ category, onDelete, onEdit }) => {
  
  const handleDelete = async () => {
    const confirm = window.confirm(`Delete category "${category.name}"?`);
    if (!confirm) return;

    try {
      const imageRef = ref(storage, category.imageURL);
      await deleteObject(imageRef);
      await deleteDoc(doc(db, "categories", category.id));
      toast.success("Category deleted");
      onDelete();
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  return (
    <ListGroup.Item className="d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center gap-3">
        <Image
          src={category.imageURL}
          alt={category.name}
          rounded
          width={50}
          height={50}
          style={{ objectFit: "cover" }}
        />
        <span>{category.name}</span>
      </div>
      <div className="d-flex gap-2">
        <Button variant="warning" size="sm" onClick={() => onEdit(category)}>
          Edit
        </Button>
        <Button variant="outline-danger" size="sm" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </ListGroup.Item>
  );
};

export default CategoryItem;
