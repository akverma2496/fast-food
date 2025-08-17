// src/components/category/CategoryForm.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCategory } from "../../store/categories/categoriesActions";

export default function CategoryForm() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.categories);
  const { idToken } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !file) {
      alert("Please provide both name and image");
      return;
    }
    dispatch(addCategory({ name, file, idToken }));
    setName("");
    setFile(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5rem 1rem",
        border: "1px solid #ddd",
        borderRadius: "6px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        backgroundColor: "#fff",
        width: "100%",
        maxWidth: "100%",
        marginBottom: "1rem",
      }}
    >
      <input
        type="text"
        placeholder="Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        style={{
          flex: "1",
          padding: "0.5rem",
          border: "1px solid #ccc",
          borderRadius: "4px",
          fontSize: "0.95rem",
        }}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        required
        style={{
          flex: "1",
          padding: "0.4rem",
          border: "1px solid #ccc",
          borderRadius: "4px",
          fontSize: "0.85rem",
        }}
      />

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "4px",
          border: "none",
          backgroundColor: "#007bff",
          color: "#fff",
          fontSize: "0.9rem",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {loading ? "Saving..." : "Add"}
      </button>
    </form>
  );
}
