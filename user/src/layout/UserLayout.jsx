// src/layout/UserLayout.jsx
import { Container, Navbar, Nav, Form, FormControl, NavDropdown } from "react-bootstrap";
import { Outlet, Link } from "react-router";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { Badge } from "react-bootstrap";
import UserDropdown from "../components/UserDropdown";

export default function UserLayout() {

    const { cartItems } = useCart();
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <>
            {/* Header */}
            <div className="d-flex flex-column min-vh-100">
            <Navbar bg="light" expand="lg" className="shadow-sm">
                <Container>
                    <Navbar.Brand as={Link} to="/" className="fw-bold">
                        FastFood 🍔
                    </Navbar.Brand>

                    <Form className="d-flex mx-auto" style={{ maxWidth: "400px", flex: 1 }}>
                        <FormControl type="search" placeholder="Search recipes..." className="me-2" />
                    </Form>

                    <Nav className="ms-auto d-flex align-items-center gap-3">

                        <Nav.Link as={Link} to="/cart" className="position-relative p-0">
                            <FaShoppingCart size={20} />
                            {cartCount > 0 && (
                                <Badge
                                    pill
                                    bg="danger"
                                    className="position-absolute top-0 start-100 translate-middle"
                                    style={{
                                        fontSize: "0.6rem",
                                        padding: "0.25em 0.4em",
                                        borderRadius: "50%",
                                    }}
                                >
                                    {cartCount}
                                </Badge>
                            )}
                        </Nav.Link>
                        <UserDropdown />    
                    </Nav>
                </Container>
                
            </Navbar>

            {/* Page Content */}
            <main className="py-4 flex-grow-1">
                <Container>
                    <Outlet />
                </Container>
            </main>

            {/* Footer */}
            <footer className="bg-light text-center py-3 border-top">
                <small className="text-muted">© {new Date().getFullYear()} FastFood. All rights reserved.</small>
            </footer>
        </div>
        </>
    );
}
