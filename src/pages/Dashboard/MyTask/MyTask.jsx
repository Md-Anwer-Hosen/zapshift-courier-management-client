import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyTask = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: tasks = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["rider-tasks", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/rider/tasks");
      return res.data;
    },
  });

  const { mutateAsync: updateTaskStatus } = useMutation({
    mutationFn: async ({ id, delivery_status }) => {
      const res = await axiosSecure.patch(`/rider/tasks/${id}`, {
        delivery_status,
      });
      return res.data;
    },
    onSuccess: () => {
      refetch();
    },
  });

  const getNextAction = (status) => {
    if (status === "assigned") {
      return { label: "Picked Up", value: "picked_up" };
    }
    if (status === "picked_up") {
      return { label: "In Transit", value: "in_transit" };
    }
    if (status === "in_transit") {
      return { label: "Delivered", value: "delivered" };
    }
    return null;
  };

  const getStatusBadgeClass = (status) => {
    if (status === "assigned") return "badge-warning ";
    if (status === "picked_up") return "badge-secondary";
    if (status === "in_transit") return "badge-info ";
    if (status === "delivered") return "badge-success ";
    return "badge-neutral";
  };

  const handleUpdateStatus = async (task) => {
    const action = getNextAction(task.delivery_status);
    if (!action) return;

    const result = await Swal.fire({
      title: `Mark as ${action.label}?`,
      html: `
        <div style="text-align:left; font-size:14px;">
          <p><strong>Tracking ID:</strong> ${task.trackingId || "N/A"}</p>
          <p><strong>Sender:</strong> ${task.sender?.name || "N/A"}</p>
          <p><strong>Receiver:</strong> ${task.receiver?.name || "N/A"}</p>
          <p><strong>Next Status:</strong> ${action.value}</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Update",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await updateTaskStatus({
        id: task._id,
        delivery_status: action.value,
      });

      if (res.modifiedCount > 0) {
        Swal.fire("Updated!", `Parcel marked as ${action.label}.`, "success");
      } else {
        Swal.fire("Oops!", "No changes were made.", "warning");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", "Failed to update parcel status.", "error");
    }
  };

  if (isLoading) {
    return <div className="text-center p-10 font-bold">Loading tasks...</div>;
  }

  if (isError) {
    return (
      <div className="text-center p-10 font-bold text-red-600">
        Something went wrong while loading tasks.
      </div>
    );
  }

  return (
    <div className="p-2 md:p-6 lg:p-10">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            My Tasks
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Your assigned delivery tasks.
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
              <th>Parcel</th>
              <th className="hidden md:table-cell">Tracking ID</th>
              <th>Sender</th>
              <th className="hidden lg:table-cell">Receiver</th>
              <th className="hidden sm:table-cell">Payment</th>
              <th>Delivery</th>
              <th className="hidden xl:table-cell">Assigned At</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task, index) => {
              const action = getNextAction(task.delivery_status);

              return (
                <tr key={task._id} className="hover:bg-blue-50">
                  <th className="text-center">{index + 1}</th>

                  <td>
                    <div className="font-semibold capitalize text-blue-800">
                      {task.parcel?.type || "N/A"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {task.parcel?.title || "Untitled"}
                    </div>
                  </td>

                  <td className="hidden md:table-cell text-xs font-mono">
                    {task.trackingId || "—"}
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

                    <div className="mt-1 space-y-0.5 text-[11px] text-gray-600 md:hidden">
                      <div className="font-mono">
                        <span className="font-semibold">ID:</span>{" "}
                        {task.trackingId || "—"}
                      </div>
                      <div>
                        <span className="font-semibold">Receiver:</span>{" "}
                        {task.receiver?.name || "N/A"}
                      </div>
                      <div>
                        <span className="font-semibold">Receiver Contact:</span>{" "}
                        {task.receiver?.contact || "N/A"}
                      </div>
                      <div>
                        <span className="font-semibold">Payment:</span>{" "}
                        {task.payment_status || "unpaid"}
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

                  <td className="hidden lg:table-cell">
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

                  <td className="hidden sm:table-cell text-center">
                    <span
                      className={`badge badge-sm font-semibold ${
                        task.payment_status === "paid"
                          ? "badge-success"
                          : "badge-warning"
                      }`}
                    >
                      {task.payment_status || "unpaid"}
                    </span>
                  </td>

                  <td className="text-center">
                    <span
                      className={`badge badge-sm font-semibold ${getStatusBadgeClass(
                        task.delivery_status,
                      )}`}
                    >
                      {task.delivery_status || "N/A"}
                    </span>
                  </td>

                  <td className="hidden xl:table-cell text-center text-sm">
                    {task.assigned_at
                      ? new Date(task.assigned_at).toLocaleDateString("en-GB")
                      : "—"}
                  </td>

                  <td>
                    <div className="flex justify-center">
                      {action ? (
                        <button
                          onClick={() => handleUpdateStatus(task)}
                          className="btn btn-xs md:btn-sm btn-primary text-black"
                        >
                          {action.label}
                        </button>
                      ) : (
                        <span className="badge badge-success">Completed</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {tasks.length === 0 && (
          <div className="p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-700">
              No tasks found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              You do not have any active delivery tasks right now.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTask;
