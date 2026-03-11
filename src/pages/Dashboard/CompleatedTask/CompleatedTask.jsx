import React from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";

const CompletedTask = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: tasks = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["completed-tasks", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/rider/completed-tasks");
      return res.data;
    },
  });

  const getRiderEarning = (task) => {
    return Math.round((task.deliveryCost || 0) * 0.2);
  };

  const totalEarning = tasks.reduce((sum, task) => {
    return sum + getRiderEarning(task);
  }, 0);

  if (isLoading) {
    return <div className="text-center p-10 font-bold">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-center p-10 font-bold text-red-600">
        Failed to load completed tasks.
      </div>
    );
  }

  return (
    <div className="p-2 md:p-6 lg:p-10">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Completed Tasks
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Your delivered parcel history.
          </p>
          <p className="mt-2 text-sm md:text-base font-semibold text-green-600">
            Total Earnings: ৳ {totalEarning}
          </p>
        </div>

        <button onClick={() => refetch()} className="btn btn-sm md:btn-md">
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="table table-xs md:table-md w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th>#</th>
              <th>Tracking ID</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th className="hidden sm:table-cell">Delivery Cost</th>
              <th>Earning</th>
              <th className="hidden md:table-cell">Payment</th>
              <th className="hidden lg:table-cell">Delivered Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task, index) => (
              <tr key={task._id} className="hover:bg-blue-50">
                <td>{index + 1}</td>

                <td>
                  <div className="font-mono text-xs md:text-sm">
                    {task.trackingId || "—"}
                  </div>

                  <div className="mt-1 space-y-0.5 text-[11px] text-gray-600 sm:hidden">
                    <div>
                      <span className="font-semibold">Cost:</span> ৳{" "}
                      {task.deliveryCost ?? 0}
                    </div>
                    <div>
                      <span className="font-semibold">Earning:</span> ৳{" "}
                      {getRiderEarning(task)}
                    </div>
                    <div>
                      <span className="font-semibold">Payment:</span>{" "}
                      {task.payment_status || "paid"}
                    </div>
                    <div>
                      <span className="font-semibold">Date:</span>{" "}
                      {task.updated_at
                        ? new Date(task.updated_at).toLocaleDateString("en-GB")
                        : "—"}
                    </div>
                  </div>
                </td>

                <td>
                  <div className="font-semibold text-xs md:text-sm">
                    {task.sender?.name || "N/A"}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {task.sender?.contact || "N/A"}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {task.sender?.region || "N/A"} /{" "}
                    {task.sender?.serviceCenter || "N/A"}
                  </div>
                </td>

                <td>
                  <div className="font-semibold text-xs md:text-sm">
                    {task.receiver?.name || "N/A"}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {task.receiver?.contact || "N/A"}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {task.receiver?.region || "N/A"} /{" "}
                    {task.receiver?.serviceCenter || "N/A"}
                  </div>
                </td>

                <td className="hidden sm:table-cell font-semibold text-center">
                  ৳ {task.deliveryCost ?? 0}
                </td>

                <td className="font-semibold text-green-600 text-center">
                  ৳ {getRiderEarning(task)}
                </td>

                <td className="hidden md:table-cell text-center">
                  <span className="badge badge-success">
                    {task.payment_status || "paid"}
                  </span>
                </td>

                <td className="hidden lg:table-cell text-center text-sm">
                  {task.updated_at
                    ? new Date(task.updated_at).toLocaleDateString("en-GB")
                    : "—"}
                </td>

                <td className="text-center">
                  <span className="badge badge-success">Delivered</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {tasks.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No completed tasks found.
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedTask;
