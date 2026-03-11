import React from "react";
import useUserRole from "../hooks/useUserRole";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const AdminRoutes = ({ children }) => {
  const { role, isLoading } = useUserRole();
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  if (!user || role !== "admin") {
    return <Navigate to="/forbidden" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminRoutes;
