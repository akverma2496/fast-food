import React from "react";
import CategoryForm from "../components/category/CategoryForm";
import CategoryList from "../components/category/CategoryList";

export default function Categories() {
  return (
    <div style={{ padding: "2rem" }}>
      <CategoryForm />
      <CategoryList />
    </div>
  );
}

