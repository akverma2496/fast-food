// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";

export default function Profile() {
  const { currentUser, userData } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "" });

  useEffect(() => {
    if (userData) {
      setForm({
        name: userData.name || "",
        phone: userData.phone || "",
      });
    }
  }, [userData]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        name: form.name,
        phone: form.phone,
      });
      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <Card className="p-4 mx-auto mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="text-center mb-4">My Profile</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Control
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            type="email"
            value={currentUser?.email}
            disabled
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button type="submit" className="w-100">
          Update Profile
        </Button>
      </Form>
    </Card>
  );
}
