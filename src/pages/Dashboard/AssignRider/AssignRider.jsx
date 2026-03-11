import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();

  const [selectedParcel, setSelectedParcel] = useState(null);
  const [availableRiders, setAvailableRiders] = useState([]);
  const [loadingRiders, setLoadingRiders] = useState(false);

  const {
    data: parcels = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["assignable-parcels"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels-for-assignment");
      return res.data;
    },
  });

  const { mutateAsync: assignRiderMutation } = useMutation({
    mutationFn: async ({ parcelId, riderData }) => {
      const res = await axiosSecure.patch(
        `/parcels/assign/${parcelId}`,
        riderData,
      );
      return res.data;
    },
    onSuccess: () => {
      refetch();
    },
  });

  const closeModal = () => {
    setSelectedParcel(null);
    setAvailableRiders([]);
    setLoadingRiders(false);
  };

  const handleAssignClick = async (parcel) => {
    try {
      setSelectedParcel(parcel);
      setLoadingRiders(true);

      const region = parcel.sender?.region;
      const district = parcel.sender?.serviceCenter;

      const res = await axiosSecure.get(
        `/riders/available?region=${encodeURIComponent(region)}&district=${encodeURIComponent(district)}`,
      );

      setAvailableRiders(res.data);
    } catch (error) {
      console.error("Failed to load riders", error);
      Swal.fire("Error", "Failed to load riders", "error");
      closeModal();
    } finally {
      setLoadingRiders(false);
    }
  };

  const handleConfirmAssign = async (rider) => {
    if (!selectedParcel?._id) return;

    const result = await Swal.fire({
      title: "Assign this rider?",
      html: `
        <div style="text-align:left; font-size:14px;">
          <p><strong>Parcel:</strong> ${selectedParcel.trackingId || "N/A"}</p>
          <p><strong>Rider:</strong> ${rider.name || "N/A"}</p>
          <p><strong>Phone:</strong> ${rider.phone || "N/A"}</p>
          <p><strong>Area:</strong> ${rider.region || "N/A"} / ${rider.district || "N/A"}</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Assign",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const payload = {
        riderId: rider._id,
        riderName: rider.name,
        riderEmail: rider.email,
        riderPhone: rider.phone,
      };

      const res = await assignRiderMutation({
        parcelId: selectedParcel._id,
        riderData: payload,
      });

      if (res.modifiedCount > 0 || res.matchedCount > 0) {
        await Swal.fire("Success!", "Rider assigned successfully.", "success");
        closeModal();
      } else {
        Swal.fire("Oops!", "Assignment failed.", "error");
      }
    } catch (error) {
      console.error("Assign failed", error);
      Swal.fire("Error", "Failed to assign rider", "error");
    }
  };

  if (isLoading) {
    return <div className="text-center p-10 font-bold">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-center p-10 font-bold text-red-600">
        Something went wrong while fetching parcels.
      </div>
    );
  }

  return (
    <div className="p-2 md:p-6 lg:p-10">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Assign Rider
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Paid parcels waiting for rider assignment.
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
              <th className="hidden sm:table-cell">Cost</th>
              <th>Payment</th>
              <th>Delivery</th>
              <th className="hidden xl:table-cell">Created</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {parcels.map((parcel, index) => (
              <tr key={parcel._id} className="hover:bg-blue-50">
                <th className="text-center">{index + 1}</th>

                <td>
                  <div className="font-semibold capitalize text-blue-800">
                    {parcel.parcel?.type || "N/A"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {parcel.parcel?.title || "Untitled"}
                  </div>
                </td>

                <td className="hidden md:table-cell text-xs font-mono">
                  {parcel.trackingId || "—"}
                </td>

                <td>
                  <div className="font-semibold text-xs md:text-sm">
                    {parcel.sender?.name || "N/A"}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {parcel.sender?.region || "N/A"} /{" "}
                    {parcel.sender?.serviceCenter || "N/A"}
                  </div>

                  <div className="mt-1 space-y-0.5 text-[11px] text-gray-600 md:hidden">
                    <div className="font-mono">
                      <span className="font-semibold">ID:</span>{" "}
                      {parcel.trackingId || "—"}
                    </div>
                    <div>
                      <span className="font-semibold">Receiver:</span>{" "}
                      {parcel.receiver?.name || "N/A"}
                    </div>
                    <div>
                      <span className="font-semibold">Cost:</span> ৳{" "}
                      {parcel.deliveryCost ?? "—"}
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

                <td className="hidden lg:table-cell">
                  <div className="font-semibold text-xs md:text-sm">
                    {parcel.receiver?.name || "N/A"}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {parcel.receiver?.region || "N/A"} /{" "}
                    {parcel.receiver?.serviceCenter || "N/A"}
                  </div>
                </td>

                <td className="hidden sm:table-cell text-center font-bold text-green-600">
                  ৳ {parcel.deliveryCost ?? 0}
                </td>

                <td className="text-center">
                  <span
                    className={`badge badge-sm font-semibold ${
                      parcel.payment_status === "paid"
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                  >
                    {parcel.payment_status || "unpaid"}
                  </span>
                </td>

                <td className="text-center">
                  <span
                    className={`badge badge-sm font-semibold ${
                      parcel.delivery_status === "not_collected"
                        ? "badge-warning"
                        : parcel.delivery_status === "assigned"
                          ? "badge-info"
                          : parcel.delivery_status === "delivered"
                            ? "badge-success"
                            : "badge-neutral"
                    }`}
                  >
                    {parcel.delivery_status || "not_collected"}
                  </span>
                </td>

                <td className="hidden xl:table-cell text-center text-sm">
                  {parcel.creation_date
                    ? new Date(parcel.creation_date).toLocaleDateString("en-GB")
                    : "—"}
                </td>

                <td>
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleAssignClick(parcel)}
                      className="btn btn-xs md:btn-sm btn-primary text-black"
                    >
                      Assign
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {parcels.length === 0 && (
          <div className="p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-700">
              No parcels available
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              There are no paid parcels waiting for rider assignment right now.
            </p>
          </div>
        )}
      </div>

      {selectedParcel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 md:p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b p-4 md:p-5">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800">
                  Assign Rider
                </h3>
                <p className="text-sm text-gray-500">
                  Tracking ID: {selectedParcel.trackingId || "N/A"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Area: {selectedParcel.sender?.region || "N/A"} /{" "}
                  {selectedParcel.sender?.serviceCenter || "N/A"}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-4 md:p-5">
              {loadingRiders ? (
                <div className="py-10 text-center font-semibold text-gray-600">
                  Loading riders...
                </div>
              ) : availableRiders.length === 0 ? (
                <div className="rounded-xl border border-dashed p-8 text-center">
                  <h4 className="text-base font-semibold text-gray-700">
                    No active rider found
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    No rider is available in this area right now.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {availableRiders.map((rider) => (
                    <div
                      key={rider._id}
                      className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                    >
                      <div className="mb-3">
                        <h4 className="text-base font-bold text-gray-800">
                          {rider.name || "N/A"}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {rider.email || "N/A"}
                        </p>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          <span className="font-semibold">Phone:</span>{" "}
                          {rider.phone || "N/A"}
                        </p>
                        <p>
                          <span className="font-semibold">Region:</span>{" "}
                          {rider.region || "N/A"}
                        </p>
                        <p>
                          <span className="font-semibold">District:</span>{" "}
                          {rider.district || "N/A"}
                        </p>
                        <p>
                          <span className="font-semibold">Bike:</span>{" "}
                          {rider.bikeInfo || "N/A"}
                        </p>
                        <p>
                          <span className="font-semibold">Registration:</span>{" "}
                          {rider.bikeRegistration || "N/A"}
                        </p>
                        <p>
                          <span className="font-semibold">Status:</span>{" "}
                          {rider.status || "N/A"}
                        </p>
                      </div>

                      <div className="mt-4">
                        <button
                          onClick={() => handleConfirmAssign(rider)}
                          className="btn btn-primary  text-black btn-sm w-full"
                        >
                          Assign Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t bg-gray-50 p-3 md:p-4 flex justify-end">
              <button onClick={closeModal} className="btn btn-outline btn-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignRider;
