import React, { useEffect, useRef, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { db, storage } from "../../firebase.config";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

const CategoryForm = ({ onSuccess, editingCategory, cancelEdit }) => {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const fileInputRef = useRef(null); // Ref for file input

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name || "");
      setPreviewImage(editingCategory.imageURL || "");
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = null; // Reset file input
      }
    }
  }, [editingCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.warn("Please provide a category name");
      return;
    }

    try {
      let imageURL = previewImage;

      if (imageFile) {
        const imageRef = ref(storage, `categories/${uuidv4()}`);
        await uploadBytes(imageRef, imageFile);
        imageURL = await getDownloadURL(imageRef);
      }

      if (editingCategory) {
        const docRef = doc(db, "categories", editingCategory.id);
        await updateDoc(docRef, {
          name: name.trim(),
          imageURL,
          updatedAt: serverTimestamp(),
        });
        toast.success("Category updated");
      } else {
        await addDoc(collection(db, "categories"), {
          name: name.trim(),
          imageURL,
          createdAt: serverTimestamp(),
        });
        toast.success("Category added");
      }

      resetForm();
      onSuccess();
    } catch (err) {
      toast.error("Failed to save category");
    }
  };

  const resetForm = () => {
    setName("");
    setImageFile(null);
    setPreviewImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    cancelEdit(); // Exit editing mode
  };

  return (
    <div className="mb-4">
      <h5>{editingCategory ? "Edit Category" : "Add Category"}</h5>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2">
          <Form.Label>Category Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Appetizers"
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            ref={fileInputRef} // ✅ Attach ref to file input
          />
        </Form.Group>

        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            width="80"
            height="80"
            className="mb-2"
            style={{ objectFit: "cover" }}
          />
        )}

        <div className="d-flex gap-2">
          <Button type="submit" variant="primary">
            {editingCategory ? "Update" : "Add"}
          </Button>
          {editingCategory && (
            <Button type="button" variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default CategoryForm;
