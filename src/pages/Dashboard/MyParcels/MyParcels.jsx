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
      // Method change kora holo: axiosSecure.delete
      const res = await axiosSecure.delete(`/parcels/${id}`);
      return res.data;
    },
    onSuccess: () => {
      refetch(); // Table-er data refresh hobe
      Swal.fire("Deleted!", "Parcel has been removed.", "success");
    },
  });

  // 3. Handle Delete Button Click
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
          await deleteParcel(id); // Upore banano mutation function-ta call hobe
        } catch {
          Swal.fire("Error!", "Failed to delete.", "error");
        }
      }
    });
  };
  if (isLoading)
    return <div className="text-center p-10 font-bold">Loading...</div>;

  if (isError)
    return (
      <div className="text-center p-10 font-bold text-red-600">
        Something went wrong.
      </div>
    );

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

      {/* Responsive Wrapper */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="table table-xs md:table-md w-full">
          {/* Head */}
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="whitespace-nowrap">#</th>
              <th className="whitespace-nowrap">Type</th>
              <th className="hidden md:table-cell whitespace-nowrap">
                Tracking ID
              </th>
              <th className="whitespace-nowrap">Receiver</th>
              <th className="hidden sm:table-cell whitespace-nowrap">Cost</th>
              <th className="whitespace-nowrap">Status</th>
              <th className="hidden lg:table-cell whitespace-nowrap">Date</th>
              <th className="whitespace-nowrap">Actions</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {parcels.map((p, index) => (
              <tr key={p._id} className="hover:bg-blue-50">
                <th className="text-center">{index + 1}</th>

                <td className="capitalize font-semibold text-blue-800">
                  {p.parcel?.type || "N/A"}
                </td>

                <td className="hidden md:table-cell text-xs font-mono">
                  {p.trackingId}
                </td>

                <td>
                  <div className="font-bold text-xs md:text-sm">
                    {p.receiver?.name || "N/A"}
                  </div>

                  {/* Mobile only: tracking + cost + date (so info missing na hoy) */}
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
                      <span className="font-semibold">Date:</span>{" "}
                      {p.creation_date
                        ? new Date(p.creation_date).toLocaleDateString("en-GB")
                        : "—"}
                    </div>
                  </div>
                </td>

                <td className="hidden sm:table-cell font-bold text-green-600 text-center">
                  ৳ {p.deliveryCost}
                </td>

                <td className="text-center">
                  <span
                    className={`badge badge-sm font-semibold ${
                      p.status === "pending"
                        ? "badge-warning"
                        : p.status === "delivered"
                          ? "badge-success"
                          : "badge-error"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>

                <td className="hidden lg:table-cell text-sm text-center">
                  {p.creation_date
                    ? new Date(p.creation_date).toLocaleDateString("en-GB")
                    : "—"}
                </td>

                {/* Actions Column */}
                <td>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-1">
                    <Link
                      to={`/dashboard/parcel-details/${p._id}`}
                      className="btn btn-xs md:btn-sm btn-ghost bg-gray-200"
                    >
                      View
                    </Link>

                    {p.status === "pending" && (
                      <>
                        <Link
                          className="btn btn-xs md:btn-sm btn-info btn-outline"
                          to={`/dashboard/payment/${p._id}`}
                        >
                          pay
                        </Link>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="btn btn-xs md:btn-sm btn-error btn-outline"
                        >
                          Cancel
                        </button>
                      </>
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
