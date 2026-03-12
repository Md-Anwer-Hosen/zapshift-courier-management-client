import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router-dom";

const UserDashboardHome = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["user-dashboard-summary", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard-summary/user");
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
        Failed to load dashboard data.
      </div>
    );
  }

  const summary = data?.summary || {};
  const recentParcels = data?.recentParcels || [];

  const getDeliveryBadge = (status) => {
    if (status === "delivered") return "badge-success";
    if (status === "assigned") return "badge-info";
    if (status === "picked_up") return "badge-secondary";
    if (status === "in_transit") return "badge-primary";
    return "badge-warning";
  };

  const getPaymentBadge = (status) => {
    return status === "paid" ? "badge-success" : "badge-warning";
  };

  return (
    <div className="p-2 md:p-6 lg:p-10 space-y-6">
      {/* Top section */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Welcome back User, {user?.displayName || "User"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here is your parcel overview and recent activity.
          </p>
        </div>

        <button onClick={() => refetch()} className="btn btn-sm md:btn-md">
          Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Parcels</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-800">
            {summary.totalParcels || 0}
          </h2>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Unpaid Parcels</p>
          <h2 className="mt-2 text-3xl font-bold text-orange-500">
            {summary.unpaidParcels || 0}
          </h2>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Paid Parcels</p>
          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            {summary.paidParcels || 0}
          </h2>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Delivered Parcels</p>
          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {summary.deliveredParcels || 0}
          </h2>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link
          to="/sendParcel"
          className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold text-gray-800">Send Parcel</h3>
          <p className="mt-1 text-sm text-gray-500">
            Create a new parcel delivery request.
          </p>
        </Link>

        <Link
          to="/dashboard/myParcels"
          className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold text-gray-800">My Parcels</h3>
          <p className="mt-1 text-sm text-gray-500">
            View, manage, and pay for your parcels.
          </p>
        </Link>

        <Link
          to="/dashboard/tracParcel"
          className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold text-gray-800">Track Parcel</h3>
          <p className="mt-1 text-sm text-gray-500">
            Track your parcel by tracking ID.
          </p>
        </Link>
      </div>

      {/* Recent parcels */}
      <div className="rounded-2xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b p-4 md:p-5">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-800">
              Recent Parcels
            </h2>
            <p className="text-sm text-gray-500">
              Your latest 5 parcel requests.
            </p>
          </div>

          <Link to="/dashboard/myParcels" className="btn btn-sm btn-outline">
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-xs md:table-md w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th>#</th>
                <th>Tracking ID</th>
                <th>Parcel</th>
                <th className="hidden md:table-cell">Receiver</th>
                <th>Payment</th>
                <th>Delivery</th>
                <th className="hidden lg:table-cell">Date</th>
              </tr>
            </thead>

            <tbody>
              {recentParcels.map((parcel, index) => (
                <tr key={parcel._id} className="hover:bg-blue-50">
                  <td>{index + 1}</td>

                  <td>
                    <div className="font-mono text-xs md:text-sm">
                      {parcel.trackingId || "—"}
                    </div>

                    <div className="mt-1 space-y-0.5 text-[11px] text-gray-600 md:hidden">
                      <div>
                        <span className="font-semibold">Receiver:</span>{" "}
                        {parcel.receiver?.name || "N/A"}
                      </div>
                      <div>
                        <span className="font-semibold">Date:</span>{" "}
                        {parcel.creation_date
                          ? new Date(parcel.creation_date).toLocaleDateString(
                              "en-GB",
                            )
                          : "—"}
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="font-semibold capitalize text-blue-800">
                      {parcel.parcel?.type || "N/A"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {parcel.parcel?.title || "Untitled"}
                    </div>
                  </td>

                  <td className="hidden md:table-cell">
                    <div className="font-semibold text-xs md:text-sm">
                      {parcel.receiver?.name || "N/A"}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      {parcel.receiver?.region || "N/A"} /{" "}
                      {parcel.receiver?.serviceCenter || "N/A"}
                    </div>
                  </td>

                  <td>
                    <span
                      className={`badge badge-sm font-semibold ${getPaymentBadge(
                        parcel.payment_status,
                      )}`}
                    >
                      {parcel.payment_status || "unpaid"}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`badge badge-sm font-semibold ${getDeliveryBadge(
                        parcel.delivery_status,
                      )}`}
                    >
                      {parcel.delivery_status || "not_collected"}
                    </span>
                  </td>

                  <td className="hidden lg:table-cell text-sm">
                    {parcel.creation_date
                      ? new Date(parcel.creation_date).toLocaleDateString(
                          "en-GB",
                        )
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {recentParcels.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No parcel data found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboardHome;
