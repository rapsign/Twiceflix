// src/components/Auth/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged, auth } from "../../firebase/firebase";

const ProtectedRoute = ({ children }) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setAuthChecked(true);
    });
    return unsubscribe;
  }, []);

  if (!authChecked) return null;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
