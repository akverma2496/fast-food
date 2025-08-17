// src/store/categories/categoryActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";

const PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const BUCKET_NAME = `${PROJECT_ID}.firebasestorage.app`;

// 1. Fetch Categories
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (idToken, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/categories`,
        {
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch categories");

      const data = await res.json();
      return (data.documents || []).map((doc) => ({
        id: doc.name.split("/").pop(),
        fullPath: doc.name,
        name: doc.fields.name.stringValue,
        image: doc.fields.image.stringValue,
      }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 2. Add Category (Upload + Save)
export const addCategory = createAsyncThunk(
  "categories/addCategory",
  async ({ name, file, idToken }, { rejectWithValue }) => {
    try {
      // Step 1: Upload Image to Storage
      const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${BUCKET_NAME}/o?uploadType=media&name=categories/${encodeURIComponent(file.name)}`;

      const uploadRes = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) throw new Error("Image upload failed");

      // Step 2: Get Public Image URL
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${BUCKET_NAME}/o/${encodeURIComponent(
        "categories/" + file.name
      )}?alt=media`;

      // Step 3: Save category in Firestore
      const saveRes = await fetch(
        `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/categories`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fields: {
              name: { stringValue: name },
              image: { stringValue: imageUrl },
              createdAt: { timestampValue: new Date().toISOString() },
            },
          }),
        }
      );

      if (!saveRes.ok) throw new Error("Category save failed");

      const data = await saveRes.json();

      // 🔥 Return with id and fullPath from Firestore response
      return {
        id: data.name.split("/").pop(),
        fullPath: data.name,
        name,
        image: imageUrl,
      };

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 3. Delete Category
export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async ({ fullPath, idToken }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `https://firestore.googleapis.com/v1/${fullPath}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );

      if (!res.ok) throw new Error("Failed to delete category");

      // return short id so slice can filter it out
      return fullPath.split("/").pop();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// src/store/categories/categoriesActions.js
export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ fullPath, name, file, idToken }, { rejectWithValue }) => {
    try {
      let imageUrl = null;

      // Step 1: Upload new file if provided
      if (file) {
        const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${BUCKET_NAME}/o?uploadType=media&name=categories/${encodeURIComponent(file.name)}`;

        const uploadRes = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": file.type,
          },
          body: file,
        });

        if (!uploadRes.ok) throw new Error("Image upload failed");

        imageUrl = `https://firebasestorage.googleapis.com/v0/b/${BUCKET_NAME}/o/${encodeURIComponent(
          "categories/" + file.name
        )}?alt=media`;
      }

      // Step 2: Patch document in Firestore
      const patchRes = await fetch(`https://firestore.googleapis.com/v1/${fullPath}?updateMask.fieldPaths=name&updateMask.fieldPaths=image`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            name: { stringValue: name },
            ...(imageUrl && { image: { stringValue: imageUrl } }),
          },
        }),
      });

      if (!patchRes.ok) throw new Error("Failed to update category");

      return {
        id: fullPath.split("/").pop(),
        fullPath,
        name,
        ...(imageUrl && { image: imageUrl }),
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


