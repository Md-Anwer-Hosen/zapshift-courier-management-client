// SendParcel.jsx
// Your imports (as you said):
import React, { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import hubs from "../../assets/json/warehouses.json";
import RegionServiceSelect from "../../shared/RegionServiceSelect"; // keep if you already have it (not required below)
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import axios from "axios";

// ---------- Cost calculation (simple demo) ----------
const BASE_PRICE = { document: 80, "non-document": 120 };
const REGION_MULTIPLIER = {
  Dhaka: 1.15,
  Chattogram: 1.1,
  Sylhet: 1.05,
  Rangpur: 1.05,
  Khulna: 1.05,
  Rajshahi: 1.05,
  Mymensingh: 1.05,
  Barishal: 1.05,
};

// service center (district) small fee example
function centerFee(district) {
  if (!district) return 0;
  // you can customize later
  return 15;
}

function calcDeliveryCost({
  type,
  senderRegion,
  receiverRegion,
  senderCenter,
  receiverCenter,
  weight,
}) {
  const base = BASE_PRICE[type] ?? 100;

  const sMul = REGION_MULTIPLIER[senderRegion] ?? 1;
  const rMul = REGION_MULTIPLIER[receiverRegion] ?? 1;

  const w = Number(weight || 0);
  const weightExtra = type === "non-document" ? w * 20 : 0; // optional

  const crossCenterFee = senderCenter !== receiverCenter ? 25 : 0;
  const districtFee = centerFee(senderCenter) + centerFee(receiverCenter);

  const cost = Math.round(
    base * (sMul + rMul) + weightExtra + crossCenterFee + districtFee,
  );
  return cost;
}

// ---------- Mini reusable selector: Region (search) + Service Center (district) ----------
function RHFRegionCenter({
  labelPrefix,
  control,
  setValue,
  hubsActive,
  regions,
  regionName,
  centerName,
  errors,
}) {
  const selectedRegion = control._formValues?.[regionName];

  const centers = useMemo(() => {
    if (!selectedRegion) return [];
    const set = new Set(
      hubsActive
        .filter((h) => h.region === selectedRegion)
        .map((h) => h.district)
        .filter(Boolean),
    );
    return Array.from(set).sort();
  }, [hubsActive, selectedRegion]);

  const isValidRegion = (val) => hubsActive.some((h) => h.region === val);
  const isValidCenter = (region, center) =>
    hubsActive.some((h) => h.region === region && h.district === center);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Region searchable */}
      <div>
        <label className="text-sm font-medium text-slate-700">
          {labelPrefix} Region <span className="text-red-500">*</span>
        </label>

        <Controller
          control={control}
          name={regionName}
          rules={{
            required: `${labelPrefix} region is required`,
            validate: (val) =>
              isValidRegion(val) || "Please select a valid region",
          }}
          render={({ field }) => (
            <>
              <input
                {...field}
                list="regionList"
                placeholder="Type to search region (e.g. Dhaka)"
                className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
                onChange={(e) => {
                  field.onChange(e.target.value);
                  setValue(centerName, ""); // reset center when region changes
                }}
              />
              <datalist id="regionList">
                {regions.map((r) => (
                  <option key={r} value={r} />
                ))}
              </datalist>
            </>
          )}
        />

        {errors?.[regionName] && (
          <p className="text-xs text-red-600 mt-1">
            {errors[regionName].message}
          </p>
        )}
      </div>

      {/* Service Center */}
      <div>
        <label className="text-sm font-medium text-slate-700">
          {labelPrefix} Service Center <span className="text-red-500">*</span>
        </label>

        <Controller
          control={control}
          name={centerName}
          rules={{
            required: `${labelPrefix} service center is required`,
            validate: (val) =>
              isValidCenter(selectedRegion, val) ||
              "Service center must match region",
          }}
          render={({ field }) => (
            <select
              {...field}
              disabled={!selectedRegion}
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:bg-slate-100"
            >
              <option value="">Select service center</option>
              {centers.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        />

        {errors?.[centerName] && (
          <p className="text-xs text-red-600 mt-1">
            {errors[centerName].message}
          </p>
        )}
      </div>
    </div>
  );
}

export default function SendParcel() {
  // active hubs only
  const hubsActive = useMemo(() => {
    return hubs.filter((h) => String(h.status).toLowerCase() === "active");
  }, []);

  // unique regions list
  const regions = useMemo(() => {
    const set = new Set(hubsActive.map((h) => h.region).filter(Boolean));
    return Array.from(set).sort();
  }, [hubsActive]);

  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    register,
    control,
    setValue,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      // Parcel
      parcelType: "document",
      parcelTitle: "",
      parcelWeight: "",

      // Sender
      senderName: user?.displayName || "",
      senderContact: "",
      senderRegion: "",
      senderCenter: "",
      senderAddress: "",
      senderPickupInstruction: "",

      // Receiver
      receiverName: "",
      receiverContact: "",
      receiverRegion: "",
      receiverCenter: "",
      receiverAddress: "",
      receiverDeliveryInstruction: "",
    },
  });

  const parcelType = watch("parcelType");

  const onSubmit = (data) => {
    const cost = calcDeliveryCost({
      type: data.parcelType,
      senderRegion: data.senderRegion,
      receiverRegion: data.receiverRegion,
      senderCenter: data.senderCenter,
      receiverCenter: data.receiverCenter,
      weight: data.parcelWeight,
    });

    function generateTrackingId() {
      const time = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000);
      return `TRK-${time}${random}`;
    }

    // prepare payload with creation_date

    const payload = {
      trackingId: generateTrackingId(),
      deliveryCost: cost,
      creation_date: new Date().toISOString(),
      status: "pending",

      parcel: {
        type: data.parcelType,
        title: data.parcelTitle,
        weight:
          data.parcelType === "non-document"
            ? Number(data.parcelWeight || 0)
            : null,
      },
      sender: {
        name: data.senderName,
        email: user.email,
        contact: data.senderContact,
        region: data.senderRegion,
        serviceCenter: data.senderCenter,
        address: data.senderAddress,
        pickupInstruction: data.senderPickupInstruction,
      },
      receiver: {
        name: data.receiverName,
        contact: data.receiverContact,
        region: data.receiverRegion,
        serviceCenter: data.receiverCenter,
        address: data.receiverAddress,
        deliveryInstruction: data.receiverDeliveryInstruction,
      },
    };

    // Toast with confirm button
    toast(
      (t) => (
        <div className="w-[320px] space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">
            Delivery Cost Estimate
          </h3>

          {/* Cost Breakdown */}
          <div className="text-sm space-y-1 text-gray-600">
            <div className="flex justify-between">
              <span>Base Price</span>
              <span>৳{BASE_PRICE[data.parcelType]}</span>
            </div>

            <div className="flex justify-between">
              <span>Sender Region Multiplier</span>
              <span>{REGION_MULTIPLIER[data.senderRegion] ?? 1}x</span>
            </div>

            <div className="flex justify-between">
              <span>Receiver Region Multiplier</span>
              <span>{REGION_MULTIPLIER[data.receiverRegion] ?? 1}x</span>
            </div>

            {data.parcelType === "non-document" && (
              <div className="flex justify-between">
                <span>Weight Cost</span>
                <span>৳{Number(data.parcelWeight || 0) * 20}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Service Center Fee</span>
              <span>৳30</span>
            </div>

            {data.senderCenter !== data.receiverCenter && (
              <div className="flex justify-between">
                <span>Cross Center Charge</span>
                <span>৳25</span>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="border-t pt-2 flex justify-between font-semibold text-gray-800">
            <span>Total Cost</span>
            <span className="text-green-600 text-lg">৳{cost}</span>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              className="flex-1 rounded-md bg-emerald-600 px-3 py-2 text-white text-sm hover:bg-emerald-700"
              onClick={() => {
                toast.dismiss(t.id);
                console.log("CONFIRMED payload:", payload);

                //sent data in server-->>

                axiosSecure.post("/parcels", payload).then((res) => {
                  console.log(res.data);
                  toast.success("Parcel Confirmed");
                });
              }}
            >
              Confirm
            </button>

            <button
              className="flex-1 rounded-md bg-gray-200 px-3 py-2 text-sm hover:bg-gray-300"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: 9000,
      },
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <Toaster position="top-right" />

      {/* Heading + subtitle */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Send Parcel
        </h1>
        <p className="text-slate-600 mt-1">
          Add parcel for door-to-door delivery (pickup + delivery required).
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Parcel Info */}
        <section className="rounded-xl border bg-white p-4 md:p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Parcel Info
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Type */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
                {...register("parcelType", { required: true })}
              >
                <option value="document">Document</option>
                <option value="non-document">Non-document</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
                placeholder="e.g. Important Papers / Gift Box"
                {...register("parcelTitle", {
                  required: "Parcel title is required",
                  minLength: { value: 2, message: "Title is too short" },
                })}
              />
              {errors.parcelTitle && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.parcelTitle.message}
                </p>
              )}
            </div>

            {/* Weight (optional, only for non-document) */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Weight (kg){" "}
                <span className="text-slate-400">
                  {parcelType === "non-document"
                    ? "(optional)"
                    : "(not needed)"}
                </span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                disabled={parcelType !== "non-document"}
                className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:bg-slate-100"
                placeholder="e.g. 1.5"
                {...register("parcelWeight", {
                  validate: (val) => {
                    if (parcelType !== "non-document") return true;
                    if (val === "" || val === null || val === undefined)
                      return true; // optional
                    return Number(val) >= 0 || "Weight must be 0 or more";
                  },
                })}
              />
              {errors.parcelWeight && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.parcelWeight.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Sender Info */}
        <section className="rounded-xl border bg-white p-4 md:p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Sender Info
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Name (prefilled) */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
                {...register("senderName", {
                  required: "Sender name is required",
                })}
              />
              {errors.senderName && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.senderName.message}
                </p>
              )}
            </div>

            {/* Contact */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Contact <span className="text-red-500">*</span>
              </label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
                placeholder="01XXXXXXXXX"
                {...register("senderContact", {
                  required: "Sender contact is required",
                  minLength: { value: 8, message: "Contact too short" },
                })}
              />
              {errors.senderContact && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.senderContact.message}
                </p>
              )}
            </div>
          </div>

          {/* Region + Service Center (search + filter from JSON) */}
          <RegionServiceSelect
            labelPrefix="Sender"
            hubs={hubs}
            control={control}
            setValue={setValue}
            regionName="senderRegion"
            centerName="senderCenter"
            errors={errors}
          />

          {/* Address */}
          <div className="mt-4">
            <label className="text-sm font-medium text-slate-700">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="Full pickup address"
              {...register("senderAddress", {
                required: "Sender address is required",
              })}
            />
            {errors.senderAddress && (
              <p className="text-xs text-red-600 mt-1">
                {errors.senderAddress.message}
              </p>
            )}
          </div>

          {/* Pickup instruction */}
          <div className="mt-4">
            <label className="text-sm font-medium text-slate-700">
              Pick up Instruction <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="e.g. Call before arriving, come after 6 PM"
              {...register("senderPickupInstruction", {
                required: "Pickup instruction is required",
              })}
            />
            {errors.senderPickupInstruction && (
              <p className="text-xs text-red-600 mt-1">
                {errors.senderPickupInstruction.message}
              </p>
            )}
          </div>
        </section>

        {/* Receiver Info */}
        <section className="rounded-xl border bg-white p-4 md:p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Receiver Info
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Name */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
                {...register("receiverName", {
                  required: "Receiver name is required",
                })}
              />
              {errors.receiverName && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.receiverName.message}
                </p>
              )}
            </div>

            {/* Contact */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Contact <span className="text-red-500">*</span>
              </label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
                placeholder="01XXXXXXXXX"
                {...register("receiverContact", {
                  required: "Receiver contact is required",
                  minLength: { value: 8, message: "Contact too short" },
                })}
              />
              {errors.receiverContact && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.receiverContact.message}
                </p>
              )}
            </div>
          </div>

          {/* Region + Service Center */}
          <RegionServiceSelect
            labelPrefix="Receiver"
            hubs={hubs}
            control={control}
            setValue={setValue}
            regionName="receiverRegion"
            centerName="receiverCenter"
            errors={errors}
          />

          {/* Address */}
          <div className="mt-4">
            <label className="text-sm font-medium text-slate-700">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="Full delivery address"
              {...register("receiverAddress", {
                required: "Receiver address is required",
              })}
            />
            {errors.receiverAddress && (
              <p className="text-xs text-red-600 mt-1">
                {errors.receiverAddress.message}
              </p>
            )}
          </div>

          {/* Delivery instruction */}
          <div className="mt-4">
            <label className="text-sm font-medium text-slate-700">
              Delivery Instruction <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="e.g. Leave at reception / call on arrival"
              {...register("receiverDeliveryInstruction", {
                required: "Delivery instruction is required",
              })}
            />
            {errors.receiverDeliveryInstruction && (
              <p className="text-xs text-red-600 mt-1">
                {errors.receiverDeliveryInstruction.message}
              </p>
            )}
          </div>
        </section>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            className="rounded-xl bg-slate-200 px-5 py-2.5 text-slate-900 font-medium hover:bg-slate-300"
            onClick={() => {
              reset();
              toast.success("Form reset");
            }}
          >
            Reset
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-white font-medium hover:bg-slate-800 disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Submit shows delivery cost. Confirm will save later (you will
          implement DB).
        </p>
      </form>
    </div>
  );
}
