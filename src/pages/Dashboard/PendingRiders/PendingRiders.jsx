import React from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PendingRiders = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: pendingRiders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["pending-riders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/pending");
      return res.data;
    },
  });

  const handleApprove = async (rider) => {
    const result = await Swal.fire({
      title: "Approve Rider?",
      text: `Do you want to approve ${rider.name}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#8DC63F",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Approve",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosSecure.patch(`/riders/approve/${rider._id}`);

      if (res.data.modifiedCount > 0) {
        await Swal.fire({
          title: "Approved!",
          text: `${rider.name} is now an active rider.`,
          icon: "success",
          confirmButtonColor: "#8DC63F",
        });

        refetch();
      }
    } catch (error) {
      console.log(error);

      Swal.fire({
        title: "Failed!",
        text: "Could not approve this rider.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleReject = async (rider) => {
    const result = await Swal.fire({
      title: "Reject Rider?",
      text: `Do you want to reject ${rider.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#8DC63F",
      confirmButtonText: "Yes, Reject",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosSecure.patch(`/riders/reject/${rider._id}`);

      if (res.data.modifiedCount > 0) {
        await Swal.fire({
          title: "Rejected!",
          text: `${rider.name} has been rejected.`,
          icon: "success",
          confirmButtonColor: "#8DC63F",
        });

        refetch();
      }
    } catch (error) {
      console.log(error);

      Swal.fire({
        title: "Failed!",
        text: "Could not reject this rider.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  if (isLoading) {
    return <div className="py-10 text-center font-semibold">Loading...</div>;
  }

  return (
    <section className="p-3 md:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold md:text-2xl">
          Pending Riders: {pendingRiders.length}
        </h2>

        <button
          onClick={() => refetch()}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
        >
          Refresh
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm lg:block">
        <table className="w-full text-left">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Region</th>
              <th className="px-4 py-3">District</th>
              <th className="px-4 py-3">License</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {pendingRiders.map((rider, index) => (
              <tr key={rider._id} className="border-t">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3 font-medium">{rider.name}</td>
                <td className="px-4 py-3">{rider.email}</td>
                <td className="px-4 py-3">{rider.phone}</td>
                <td className="px-4 py-3">{rider.region}</td>
                <td className="px-4 py-3">{rider.district}</td>
                <td className="px-4 py-3">{rider.license}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                    {rider.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleApprove(rider)}
                      className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleReject(rider)}
                      className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {pendingRiders.length === 0 && (
              <tr>
                <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                  No pending riders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile / Tablet Cards */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {pendingRiders.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-gray-500 shadow-sm">
            No pending riders found.
          </div>
        )}

        {pendingRiders.map((rider) => (
          <div
            key={rider._id}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  {rider.name}
                </h3>
                <p className="text-sm text-gray-500 break-all">{rider.email}</p>
              </div>

              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                {rider.status}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Phone:</span> {rider.phone}
              </p>
              <p>
                <span className="font-semibold">Region:</span> {rider.region}
              </p>
              <p>
                <span className="font-semibold">District:</span>{" "}
                {rider.district}
              </p>
              <p>
                <span className="font-semibold">License:</span> {rider.license}
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleApprove(rider)}
                className="w-full rounded-md bg-primary px-4 py-2 font-semibold text-white transition hover:opacity-90"
              >
                Approve
              </button>

              <button
                onClick={() => handleReject(rider)}
                className="w-full rounded-md bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PendingRiders;
