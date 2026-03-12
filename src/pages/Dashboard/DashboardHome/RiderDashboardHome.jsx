import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router-dom";

const RiderDashboardHome = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["rider-dashboard-summary", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard-summary/rider");
      return res.data;
    },
  });

  const getStatusBadge = (status) => {
    if (status === "assigned") return "badge-warning";
    if (status === "picked_up") return "badge-secondary";
    if (status === "in_transit") return "badge-info";
    if (status === "delivered") return "badge-success";
    return "badge-neutral";
  };

  const getRiderEarning = (task) => {
    return Math.round((task.deliveryCost || 0) * 0.3);
  };

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
  const recentTasks = data?.recentTasks || [];

  return (
    <div className="p-2 md:p-6 lg:p-10 space-y-6">
      {/* Top */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Welcome back Rider, {user?.displayName || "Rider"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here is your delivery overview and earnings summary.
          </p>
        </div>

        <button onClick={() => refetch()} className="btn btn-sm md:btn-md">
          Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Assigned</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-800">
            {summary.totalAssigned || 0}
          </h2>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Active Tasks</p>
          <h2 className="mt-2 text-3xl font-bold text-orange-500">
            {summary.activeTasks || 0}
          </h2>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Completed Tasks</p>
          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {summary.completedTasks || 0}
          </h2>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Earnings</p>
          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            ৳ {summary.totalEarnings || 0}
          </h2>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Available Balance</p>
          <h2 className="mt-2 text-3xl font-bold text-emerald-600">
            ৳ {summary.availableBalance || 0}
          </h2>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link
          to="/dashboard/mytask"
          className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold text-gray-800">My Tasks</h3>
          <p className="mt-1 text-sm text-gray-500">
            View and update your active delivery tasks.
          </p>
        </Link>

        <Link
          to="/dashboard/compleatedTask"
          className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold text-gray-800">
            Completed Tasks
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            See your delivered parcels and earnings.
          </p>
        </Link>

        <Link
          to="/dashboard"
          className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold text-gray-800">Earnings</h3>
          <p className="mt-1 text-sm text-gray-500">
            Track your balance and future cashout progress.
          </p>
        </Link>
      </div>

      {/* Recent tasks */}
      <div className="rounded-2xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b p-4 md:p-5">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-800">
              Recent Tasks
            </h2>
            <p className="text-sm text-gray-500">
              Your latest assigned delivery tasks.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-xs md:table-md w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th>#</th>
                <th>Tracking ID</th>
                <th>Sender</th>
                <th className="hidden md:table-cell">Receiver</th>
                <th>Status</th>
                <th className="hidden lg:table-cell">Earning</th>
                <th className="hidden xl:table-cell">Assigned Date</th>
              </tr>
            </thead>

            <tbody>
              {recentTasks.map((task, index) => (
                <tr key={task._id} className="hover:bg-blue-50">
                  <td>{index + 1}</td>

                  <td>
                    <div className="font-mono text-xs md:text-sm">
                      {task.trackingId || "—"}
                    </div>

                    <div className="mt-1 space-y-0.5 text-[11px] text-gray-600 md:hidden">
                      <div>
                        <span className="font-semibold">Receiver:</span>{" "}
                        {task.receiver?.name || "N/A"}
                      </div>
                      <div>
                        <span className="font-semibold">Earning:</span> ৳{" "}
                        {task.delivery_status === "delivered"
                          ? getRiderEarning(task)
                          : 0}
                      </div>
                      <div>
                        <span className="font-semibold">Assigned:</span>{" "}
                        {task.assigned_at
                          ? new Date(task.assigned_at).toLocaleDateString(
                              "en-GB",
                            )
                          : "—"}
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="font-semibold text-xs md:text-sm">
                      {task.sender?.name || "N/A"}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      {task.sender?.region || "N/A"} /{" "}
                      {task.sender?.serviceCenter || "N/A"}
                    </div>
                  </td>

                  <td className="hidden md:table-cell">
                    <div className="font-semibold text-xs md:text-sm">
                      {task.receiver?.name || "N/A"}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      {task.receiver?.region || "N/A"} /{" "}
                      {task.receiver?.serviceCenter || "N/A"}
                    </div>
                  </td>

                  <td>
                    <span
                      className={`badge badge-sm font-semibold ${getStatusBadge(
                        task.delivery_status,
                      )}`}
                    >
                      {task.delivery_status || "N/A"}
                    </span>
                  </td>

                  <td className="hidden lg:table-cell font-semibold text-green-600">
                    ৳{" "}
                    {task.delivery_status === "delivered"
                      ? getRiderEarning(task)
                      : 0}
                  </td>

                  <td className="hidden xl:table-cell text-sm">
                    {task.assigned_at
                      ? new Date(task.assigned_at).toLocaleDateString("en-GB")
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {recentTasks.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No task data found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiderDashboardHome;
