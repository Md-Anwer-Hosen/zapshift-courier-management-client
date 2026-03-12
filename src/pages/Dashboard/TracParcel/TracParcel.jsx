import React, { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const TrackParcel = () => {
  const axiosSecure = useAxiosSecure();

  const [trackingId, setTrackingId] = useState("");
  const [parcel, setParcel] = useState(null);
  const [loading, setLoading] = useState(false);

  const getDeliveryText = (status) => {
    if (status === "not_collected") return "Parcel Created";
    if (status === "assigned") return "Rider Assigned";
    if (status === "picked_up") return "Parcel Picked Up";
    if (status === "in_transit") return "On The Way";
    if (status === "delivered") return "Delivered";
    return status || "Unknown";
  };

  const getBadgeClass = (status) => {
    if (status === "not_collected") return "badge-warning";
    if (status === "assigned") return "badge-info";
    if (status === "picked_up") return "badge-secondary";
    if (status === "in_transit") return "badge-primary";
    if (status === "delivered") return "badge-success";
    return "badge-neutral";
  };

  const handleTrack = async (e) => {
    e.preventDefault();

    if (!trackingId.trim()) {
      return Swal.fire("Required", "Please enter a tracking ID", "warning");
    }

    try {
      setLoading(true);
      setParcel(null);

      const res = await axiosSecure.get(`/track-parcel/${trackingId.trim()}`);
      setParcel(res.data);
    } catch (error) {
      console.error(error);
      Swal.fire("Not Found", "No parcel found with this tracking ID", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Track Parcel
        </h1>
        <p className="mt-2 text-slate-600">
          Enter your tracking ID to see the current parcel status.
        </p>
      </div>

      {/* Search box */}
      <form
        onSubmit={handleTrack}
        className="mb-6 rounded-2xl border bg-white p-4 md:p-6 shadow-sm"
      >
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="Enter tracking ID (e.g. TRK-363952249)"
            className="input input-bordered w-full outline-none focus:border-primary focus:outline-none focus:ring-0 "
          />

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary md:w-40 text-black"
          >
            {loading ? "Tracking..." : "Track Now"}
          </button>
        </div>
      </form>

      {/* Result */}
      {parcel && (
        <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
          <div className="bg-blue-600 text-white p-4 md:p-5">
            <h2 className="text-lg md:text-xl font-bold">Tracking Details</h2>
            <p className="text-sm opacity-90 mt-1">
              Tracking ID: {parcel.trackingId}
            </p>
          </div>

          <div className="p-4 md:p-6 space-y-6">
            {/* Status section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border p-4">
                <p className="text-sm text-gray-500 mb-2">Payment Status</p>
                <span
                  className={`badge ${
                    parcel.payment_status === "paid"
                      ? "badge-success"
                      : "badge-warning"
                  }`}
                >
                  {parcel.payment_status || "unpaid"}
                </span>
              </div>

              <div className="rounded-xl border p-4">
                <p className="text-sm text-gray-500 mb-2">Delivery Status</p>
                <span
                  className={`badge ${getBadgeClass(parcel.delivery_status)}`}
                >
                  {getDeliveryText(parcel.delivery_status)}
                </span>
              </div>
            </div>

            {/* Parcel Info */}
            <div className="rounded-xl border p-4">
              <h3 className="text-lg font-semibold mb-3">Parcel Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="font-semibold">Type:</span>{" "}
                  {parcel.parcel?.type || "N/A"}
                </div>
                <div>
                  <span className="font-semibold">Title:</span>{" "}
                  {parcel.parcel?.title || "N/A"}
                </div>
                <div>
                  <span className="font-semibold">Cost:</span> ৳{" "}
                  {parcel.deliveryCost ?? 0}
                </div>
              </div>
            </div>

            {/* Sender + Receiver */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border p-4">
                <h3 className="text-lg font-semibold mb-3">Sender Info</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-semibold">Name:</span>{" "}
                    {parcel.sender?.name || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Contact:</span>{" "}
                    {parcel.sender?.contact || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Region:</span>{" "}
                    {parcel.sender?.region || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Service Center:</span>{" "}
                    {parcel.sender?.serviceCenter || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Address:</span>{" "}
                    {parcel.sender?.address || "N/A"}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border p-4">
                <h3 className="text-lg font-semibold mb-3">Receiver Info</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-semibold">Name:</span>{" "}
                    {parcel.receiver?.name || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Contact:</span>{" "}
                    {parcel.receiver?.contact || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Region:</span>{" "}
                    {parcel.receiver?.region || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Service Center:</span>{" "}
                    {parcel.receiver?.serviceCenter || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Address:</span>{" "}
                    {parcel.receiver?.address || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Rider info */}
            <div className="rounded-xl border p-4">
              <h3 className="text-lg font-semibold mb-3">Rider Info</h3>
              {parcel.assigned_rider_name ? (
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-semibold">Name:</span>{" "}
                    {parcel.assigned_rider_name}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    {parcel.assigned_rider_email || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    {parcel.assigned_rider_phone || "N/A"}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Rider has not been assigned yet.
                </p>
              )}
            </div>

            {/* Dates */}
            <div className="rounded-xl border p-4">
              <h3 className="text-lg font-semibold mb-3">Timeline Info</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-semibold">Created At:</span>{" "}
                  {parcel.creation_date
                    ? new Date(parcel.creation_date).toLocaleString("en-GB")
                    : "—"}
                </p>
                <p>
                  <span className="font-semibold">Updated At:</span>{" "}
                  {parcel.updated_at
                    ? new Date(parcel.updated_at).toLocaleString("en-GB")
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackParcel;
