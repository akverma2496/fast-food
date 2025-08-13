import React from "react";
import { Container, Navbar, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { logout } from "../store/auth/authSlice";
import { useNavigate, Outlet } from "react-router-dom";

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" className="px-3">
        <Navbar.Brand>Fast-Food Admin</Navbar.Brand>
        <Button variant="outline-light" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </Navbar>
      <Container className="mt-4">
        <Outlet />
      </Container>
    </>
  );
}
