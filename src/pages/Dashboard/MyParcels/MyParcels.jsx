import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: parcels = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["my-parcels", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${user.email}`);
      return res.data;
    },
  });

  const { mutateAsync: deleteParcel } = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/parcels/${id}`);
      return res.data;
    },
    onSuccess: () => {
      refetch();
      Swal.fire("Deleted!", "Parcel has been removed.", "success");
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this parcel?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteParcel(id);
        } catch {
          Swal.fire("Error!", "Failed to delete.", "error");
        }
      }
    });
  };

  if (isLoading) {
    return <div className="text-center p-10 font-bold">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-center p-10 font-bold text-red-600">
        Something went wrong.
      </div>
    );
  }

  return (
    <div className="p-2 md:p-10">
      <div className="flex items-center justify-between gap-3 mb-5">
        <h2 className="text-lg md:text-2xl font-bold">
          My Parcels: {parcels.length}
        </h2>

        <button onClick={() => refetch()} className="btn btn-sm md:btn-md">
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="table table-xs md:table-md w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="whitespace-nowrap">#</th>
              <th className="whitespace-nowrap">Type</th>
              <th className="hidden md:table-cell whitespace-nowrap">
                Tracking ID
              </th>
              <th className="whitespace-nowrap">Receiver</th>
              <th className="hidden sm:table-cell whitespace-nowrap">Cost</th>
              <th className="whitespace-nowrap">Payment</th>
              <th className="whitespace-nowrap">Delivery</th>
              <th className="hidden lg:table-cell whitespace-nowrap">Date</th>
              <th className="whitespace-nowrap">Actions</th>
            </tr>
          </thead>

          <tbody>
            {parcels.map((p, index) => (
              <tr key={p._id} className="hover:bg-blue-50">
                <th className="text-center">{index + 1}</th>

                <td className="capitalize font-semibold text-blue-800">
                  {p.parcel?.type || "N/A"}
                </td>

                <td className="hidden md:table-cell text-xs font-mono">
                  {p.trackingId || "—"}
                </td>

                <td>
                  <div className="font-bold text-xs md:text-sm">
                    {p.receiver?.name || "N/A"}
                  </div>

                  <div className="mt-1 space-y-0.5 text-[11px] text-gray-600 md:hidden">
                    <div className="font-mono">
                      <span className="font-semibold">ID:</span>{" "}
                      {p.trackingId || "—"}
                    </div>

                    <div>
                      <span className="font-semibold">Cost:</span> ৳{" "}
                      {p.deliveryCost ?? "—"}
                    </div>

                    <div>
                      <span className="font-semibold">Payment:</span>{" "}
                      {p.payment_status || "unpaid"}
                    </div>

                    <div>
                      <span className="font-semibold">Delivery:</span>{" "}
                      {p.delivery_status || "not_collected"}
                    </div>

                    <div>
                      <span className="font-semibold">Date:</span>{" "}
                      {p.creation_date
                        ? new Date(p.creation_date).toLocaleDateString("en-GB")
                        : "—"}
                    </div>
                  </div>
                </td>

                <td className="hidden sm:table-cell font-bold text-green-600 text-center">
                  ৳ {p.deliveryCost ?? 0}
                </td>

                <td className="text-center">
                  <span
                    className={`badge badge-sm font-semibold ${
                      p.payment_status === "paid"
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                  >
                    {p.payment_status || "unpaid"}
                  </span>
                </td>

                <td className="text-center">
                  <span
                    className={`badge badge-sm font-semibold ${
                      p.delivery_status === "delivered"
                        ? "badge-success"
                        : p.delivery_status === "assigned"
                          ? "badge-info"
                          : p.delivery_status === "picked_up"
                            ? "badge-secondary"
                            : "badge-warning"
                    }`}
                  >
                    {p.delivery_status || "not_collected"}
                  </span>
                </td>

                <td className="hidden lg:table-cell text-sm text-center">
                  {p.creation_date
                    ? new Date(p.creation_date).toLocaleDateString("en-GB")
                    : "—"}
                </td>

                <td>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-1">
                    {p.payment_status === "unpaid" && (
                      <>
                        <Link
                          className="btn btn-xs md:btn-sm btn-info btn-outline"
                          to={`/dashboard/payment/${p._id}`}
                        >
                          Pay
                        </Link>

                        <button
                          onClick={() => handleDelete(p._id)}
                          className="btn btn-xs md:btn-sm btn-error btn-outline"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {p.payment_status === "paid" && (
                      <span className="text-xs font-semibold text-green-600 px-2 py-1">
                        Paid
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {parcels.length === 0 && (
          <div className="p-6 text-center text-gray-500">No parcels found.</div>
        )}
      </div>
    </div>
  );
};

export default MyParcels;
