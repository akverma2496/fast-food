import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase.config";
import { toast } from "react-toastify";
import { Link } from "react-router";
import { Form, Button, Card, Container } from "react-bootstrap";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Container className="d-flex justify-content-center pt-5">
      <Card className="p-4 shadow" style={{ width: "100%", maxWidth: "450px" }}>
        <h2 className="text-center mb-4">Reset Password</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit" className="w-100">Send Reset Link</Button>
        </Form>
        <div className="mt-3 text-center small">
          <span>
            Remembered your password? <Link to="/login">Login</Link>
          </span>
        </div>
      </Card>
    </Container>
  );
}
