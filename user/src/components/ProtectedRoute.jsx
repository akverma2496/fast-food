import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation, useNavigate } from "react-router";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const hasRedirected = useRef(false); // ✅ prevents multiple redirects

  useEffect(() => {
    if (!currentUser && !hasRedirected.current) {
      toast.warning("Please login first");
      hasRedirected.current = true;
      navigate("/login", { replace: true, state: { from: location } });
    }
  }, [currentUser, location, navigate]);

  if (!currentUser) return null;

  return children;
}
