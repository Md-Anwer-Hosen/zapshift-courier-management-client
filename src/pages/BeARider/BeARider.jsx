import React from "react";
import { useForm } from "react-hook-form";
import riderImage from "../../assets/agent-pending.png"; // path change kore niba
import useAuth from "../../hooks/useAuth";
import districtsByRegion from "../../assets/json/distic.json";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const inputStyle =
  "w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-primary focus:outline-none focus:ring-0";

const BeARider = () => {
  const { user } = useAuth();
  const regions = Object.keys(districtsByRegion);
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.displayName || "",
      email: user?.email || "",
    },
  });

  const selectedRegion = watch("region");

  const districts = districtsByRegion[selectedRegion] || [];

  const onSubmit = async (data) => {
    const riderData = {
      ...data,
      name: user?.displayName || data.name,
      email: user?.email || data.email,
    };

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to submit your rider application?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#8DC63F",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, submit it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const result = await axiosSecure.post("/rider", riderData);

      if (result.data.insertedId) {
        await Swal.fire({
          title: "Submitted!",
          text: "Your rider application has been submitted successfully.",
          icon: "success",
          confirmButtonColor: "#8DC63F",
        });

        reset({
          name: user?.displayName || "",
          email: user?.email || "",
          license: "",
          region: "",
          district: "",
          nid: "",
          phone: "",
          bikeInfo: "",
          bikeRegistration: "",
          about: "",
        });
      }

      console.log("Rider data:", riderData);
    } catch (error) {
      console.error(error);

      Swal.fire({
        title: "Failed!",
        text: "Something went wrong while submitting your application.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <section className="px-4 py-8 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl rounded-[28px] bg-white p-5 shadow-sm md:p-8 lg:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left */}
          <div>
            <h1 className="text-3xl font-extrabold text-primary md:text-4xl">
              Be a Rider
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
              Enjoy fast, reliable parcel delivery with real-time tracking and
              zero hassle. From personal packages to business shipments — we
              deliver on time, every time.
            </p>

            <div className="my-6 border-t border-gray-200" />

            <h2 className="mb-5 text-xl font-bold text-gray-800">
              Tell us about yourself
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  {...register("name", { required: "Name is required" })}
                  className={inputStyle}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Driving License Number
                </label>
                <input
                  type="text"
                  placeholder="Driving License Number"
                  {...register("license", {
                    required: "Driving license number is required",
                  })}
                  className={inputStyle}
                />
                {errors.license && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.license.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Your Email
                </label>
                <input
                  type="email"
                  placeholder="Your Email"
                  {...register("email", { required: "Email is required" })}
                  className={inputStyle}
                  readOnly
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Your Region
                  </label>
                  <select
                    {...register("region", {
                      required: "Region is required",
                    })}
                    className={inputStyle}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select your Region
                    </option>
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                  {errors.region && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.region.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Your District
                  </label>
                  <select
                    {...register("district", {
                      required: "District is required",
                    })}
                    className={inputStyle}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select your District
                    </option>
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  {errors.district && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.district.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  NID No
                </label>
                <input
                  type="text"
                  placeholder="NID"
                  {...register("nid", { required: "NID is required" })}
                  className={inputStyle}
                />
                {errors.nid && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.nid.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="Phone Number"
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                  className={inputStyle}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Bike Brand Model and Year
                </label>
                <input
                  type="text"
                  placeholder="Bike Brand Model and Year"
                  {...register("bikeInfo", {
                    required: "Bike brand, model and year is required",
                  })}
                  className={inputStyle}
                />
                {errors.bikeInfo && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.bikeInfo.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Bike Registration Number
                </label>
                <input
                  type="text"
                  placeholder="Bike Registration Number"
                  {...register("bikeRegistration", {
                    required: "Bike registration number is required",
                  })}
                  className={inputStyle}
                />
                {errors.bikeRegistration && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.bikeRegistration.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Tell Us About Yourself
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell Us About Yourself"
                  {...register("about", {
                    required: "This field is required",
                  })}
                  className={inputStyle}
                />
                {errors.about && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.about.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-primary px-4 py-2 font-semibold text-white transition hover:opacity-90"
              >
                Submit
              </button>
            </form>
          </div>

          {/* Right */}
          <div className="flex items-center justify-center self-center">
            <img
              src={riderImage}
              alt="Rider"
              className="w-full max-w-[420px] object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeARider;
