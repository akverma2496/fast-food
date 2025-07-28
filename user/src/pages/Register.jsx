import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.config";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router";
import { Form, Button, Card, Container } from "react-bootstrap";

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, form.email, form.password);
      toast.success("Account created");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Container className="d-flex justify-content-center pt-5">
      <Card className="p-4 shadow" style={{ width: "100%", maxWidth: "450px" }}>
        <h2 className="text-center mb-4">Register</h2>
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
          <Form.Group className="mb-3">
            <Form.Control
              name="confirm"
              type="password"
              value={form.confirm}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
            />
          </Form.Group>
          <Button type="submit" className="w-100">Register</Button>
        </Form>
        <div className="mt-3 text-center small">
          <span>
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </div>
      </Card>
    </Container>
  );
}
