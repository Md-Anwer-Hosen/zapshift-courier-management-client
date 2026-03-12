import React from "react";
import useUserRole from "../../../hooks/useUserRole";
import UserDashboardHome from "./UserDashboardHome";

import RiderDashboardHome from "./RiderDashboardHome";
import AdminDashboardHome from "./AdminDashboardHome";

const DashboardHome = () => {
  const { role, roleLoading } = useUserRole();

  if (roleLoading) {
    return (
      <div className="text-center p-10 font-bold">Loading dashboard...</div>
    );
  }

  if (role === "admin") {
    return <AdminDashboardHome />;
  }

  if (role === "rider") {
    return <RiderDashboardHome />;
  }

  return <UserDashboardHome />;
};

export default DashboardHome;
