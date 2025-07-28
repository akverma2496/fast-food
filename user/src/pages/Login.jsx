// src/pages/Login.jsx
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.config";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router";
import { Form, Button, Card, Container } from "react-bootstrap";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      toast.success("Logged in successfully");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Container className="d-flex justify-content-center pt-5">
      <Card className="p-4 shadow" style={{ width: "100%", maxWidth: "450px" }}>
        <h2 className="text-center mb-4">Login</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </Form.Group>
          <Button type="submit" className="w-100">Login</Button>
        </Form>
        <div className="mt-3 text-center small">
          <Link to="/forgot-password">Forgot Password?</Link>
          <br />
          <span>
            Don't have an account? <Link to="/register">Register</Link>
          </span>
        </div>
      </Card>
    </Container>
  );
}
