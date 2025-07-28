// src/components/categories/CategoryList.jsx
import React, { useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import CategoryItem from "./CategoryItem";
import CategoryForm from "./CategoryForm";

const CategoryList = ({ categories, onReload }) => {
  const [editingCategory, setEditingCategory] = useState(null);

  const handleEdit = (category) => {
    setEditingCategory(category);
  };

  const cancelEdit = () => {
    setEditingCategory(null);
  };

  return (
    <Card className="p-3 shadow-sm">
      <CategoryForm
        editingCategory={editingCategory}
        cancelEdit={cancelEdit}
        onSuccess={onReload}
      />

      <h5>Existing Categories</h5>
      <ListGroup variant="flush">
        {categories.length === 0 ? (
          <div className="text-muted p-2">No categories found.</div>
        ) : (
          categories.map((cat) => (
            <CategoryItem
              key={cat.id}
              category={cat}
              onDelete={onReload}
              onEdit={handleEdit}
            />
          ))
        )}
      </ListGroup>
    </Card>
  );
};

export default CategoryList;
