// src/components/UserDropdown.jsx
import { NavDropdown } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { signOut } from "firebase/auth";
import { auth } from "../firebase.config";
import { toast } from "react-toastify";
import { useCallback } from "react";
import { FaUser } from "react-icons/fa";


export default function UserDropdown() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  }, [navigate]);

  const logo  = <FaUser size={20} />

  return (
    <NavDropdown title={logo} align="end">
      <NavDropdown.Item onClick={() => navigate("/profile")}>
        Profile
      </NavDropdown.Item>
      <NavDropdown.Item onClick={() => navigate("/orders")}>
        My Orders
      </NavDropdown.Item>
      { currentUser &&
      <>
      <NavDropdown.Divider />
      <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item></>}
    </NavDropdown>
  );
}
