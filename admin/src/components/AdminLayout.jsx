import { Container, Navbar, Button, Nav } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { logout } from "../store/auth/authSlice";
import { useNavigate, Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" className="px-5">
        <Navbar.Brand>Fast-Food Admin</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/admin/categories">
            Categories
          </Nav.Link>
        </Nav>
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
