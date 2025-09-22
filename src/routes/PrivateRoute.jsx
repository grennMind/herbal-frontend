// File: src/routes/PrivateRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../services/userService";

/**
 * Props:
 * - children: the component to render
 * - roles: array of allowed roles, e.g., ['admin', 'herbalist']
 */
const PrivateRoute = ({ children, roles = [] }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  // If not logged in
  if (!user) return <Navigate to="/login" replace />;

  // If roles are specified, check if user has permission
  const effectiveRole = user.user_type || user.profile?.user_type;
  if (roles.length && !roles.includes(effectiveRole)) {
    return <Navigate to="/" replace />; // Redirect unauthorized users
  }

  return children;
};

export default PrivateRoute;
