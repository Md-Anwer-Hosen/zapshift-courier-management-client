import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const AdminDashboardHome = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-dashboard-summary", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard-summary/admin");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="text-center p-10 font-bold">Loading dashboard...</div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-10 font-bold text-red-600">
        Failed to load admin dashboard data.
      </div>
    );
  }

  const summary = data?.summary || {};

  const chartData = [
    { name: "Users", value: summary.totalUsers || 0 },

    { name: "Parcels", value: summary.totalParcels || 0 },
    { name: "Payments", value: summary.totalPayments || 0 },
    { name: "Pending", value: summary.pendingAssignment || 0 },
    { name: "Delivered", value: summary.deliveredParcels || 0 },
  ];

  return (
    <div className="p-2 md:p-6 lg:p-10 space-y-6">
      {/* Top */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Welcome back as Admin, {user?.displayName || "Admin"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here is your system overview and recent parcel activity.
          </p>
        </div>

        <button onClick={() => refetch()} className="btn btn-sm md:btn-md">
          Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Users</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-800">
            {summary.totalUsers || 0}
          </h2>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Parcels</p>
          <h2 className="mt-2 text-3xl font-bold text-indigo-600">
            {summary.totalParcels || 0}
          </h2>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Payments</p>
          <h2 className="mt-2 text-3xl font-bold text-cyan-600">
            {summary.totalPayments || 0}
          </h2>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <h2 className="mt-2 text-3xl font-bold text-green-600">
            ৳ {summary.totalRevenue || 0}
          </h2>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Pending Assignment</p>
          <h2 className="mt-2 text-3xl font-bold text-orange-500">
            {summary.pendingAssignment || 0}
          </h2>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Delivered Parcels</p>
          <h2 className="mt-2 text-3xl font-bold text-emerald-600">
            {summary.deliveredParcels || 0}
          </h2>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link
          to="/dashboard/asignRider"
          className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold text-gray-800">Assign Rider</h3>
          <p className="mt-1 text-sm text-gray-500">
            Assign riders to paid parcels waiting for delivery.
          </p>
        </Link>

        <Link
          to="/dashboard/activeRiders"
          className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold text-gray-800">Manage Riders</h3>
          <p className="mt-1 text-sm text-gray-500">
            Review, approve, and manage rider accounts.
          </p>
        </Link>

        <Link
          to="/dashboard/pendingRiders"
          className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold text-gray-800">
            Pending Riders
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Check riders waiting for approval.
          </p>
        </Link>
      </div>

      {/* Bottom progress chart */}
      <div className="rounded-2xl border bg-white p-4 md:p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg md:text-xl font-bold text-gray-800">
            System Progress Overview
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Quick visual summary of users, riders, parcels, payments, pending
            assignments, and deliveries.
          </p>
        </div>

        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;
