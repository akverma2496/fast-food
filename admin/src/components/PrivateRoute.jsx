import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PrivateRoute({ children }) {
  const { idToken } = useSelector((state) => state.auth);

  if (!idToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
