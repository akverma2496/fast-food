import { Container, Row, Col, Nav, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Outlet, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase.config";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <Container fluid className="vh-100 p-0">
      <Row className="h-100 m-0">
        {/* Sidebar */}
        <Col
          xs={2}
          className="bg-light d-flex flex-column justify-content-between align-items-center p-3 position-fixed h-100"
          style={{ top: 0, left: 0, bottom: 0 }}
        >
          {/* Top: Heading and Navigation */}
          <div className="w-100 d-flex flex-column align-items-center">
            <h4 className="fw-bold mb-4">Admin</h4>

            <Nav className="flex-column w-100 align-items-center gap-2">
              <LinkContainer to="dashboard">
                <Nav.Link>Dashboard</Nav.Link>
              </LinkContainer>
              <LinkContainer to="categories">
                <Nav.Link>Categories</Nav.Link>
              </LinkContainer>
              <LinkContainer to="recipes">
                <Nav.Link>Recipes</Nav.Link>
              </LinkContainer>
              <LinkContainer to="orders">
                <Nav.Link>Orders</Nav.Link>
              </LinkContainer>
            </Nav>
          </div>

          {/* Bottom: Logout Button */}
          <div className="w-100 text-center mt-auto">
            <Button variant="outline-danger" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Col>

        {/* Main Content */}
        <Col
          xs={10}
          className="p-4"
          style={{
            marginLeft: '16.666667%' /* Sidebar width (2/12) */
          }}
        >
          <div className="h-100 overflow-auto">
            <Outlet />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
