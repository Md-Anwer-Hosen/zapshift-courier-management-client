import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import axios from "axios";
import useAxiosNormal from "../../../hooks/useAxiosNormal";

const CreateAccount = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { createUser, signInWithGoogle, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const axiosNormal = useAxiosNormal();
  const [image, setImage] = useState("");

  const getFirebaseErrorMessage = (code) => {
    switch (code) {
      case "auth/email-already-in-use":
        return "This email is already registered.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      case "auth/missing-password":
        return "Password is required.";
      case "auth/network-request-failed":
        return "Network error. Please check your internet connection.";
      default:
        return "Something went wrong. Please try again.";
    }
  };

  const onSubmit = async (data) => {
    const { email, password, name } = data;

    try {
      const result = await createUser(email, password);
      console.log(result.user);

      const userInfo = {
        name: name,
        email: email,
        photoURL: image || "",
        role: "user",
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
      };

      const res = await axiosNormal.post("/users", userInfo);
      console.log(res.data);

      const userProfile = {
        displayName: name,
        photoURL: image || "",
      };

      await updateUserProfile(userProfile);
      console.log("profile updated");

      Swal.fire({
        icon: "success",
        title: "Account Created",
        text: "Your account has been created successfully.",
      }).then(() => {
        navigate("/");
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: getFirebaseErrorMessage(err.code),
      });
      console.log(err);
    }
  };

  //google login-->>

  const handlegoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      console.log(result.user);

      const userInfo = {
        name: result.user.displayName || "No Name",
        email: result.user.email,
        photoURL: result.user.photoURL || "",
        role: "user",
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
      };

      const res = await axiosNormal.post("/users", userInfo);
      console.log(res.data);

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "You have logged in with Google.",
      }).then(() => {
        navigate("/");
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Google Login Failed",
        text: getFirebaseErrorMessage(err.code),
      });
    }
  };
  //image upload-->>

  const handleImageUpload = async (e) => {
    try {
      const imageFile = e.target.files[0];
      if (!imageFile) return;

      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGEBB_API_KEY}`,
        formData,
      );

      setImage(res.data.data.url);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Image Upload Failed",
        text: "Could not upload image. Try again.",
      });
    }
  };

  const inputClass =
    "input input-bordered w-full focus:outline-none focus:ring-1 focus:ring-[#CAEB66] focus:border-[#CAEB66]";

  return (
    <div className="w-full px-4 sm:px-6">
      <div className="w-full max-w-sm mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0b3b3f]">
          Create an Account
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-500">
          Register with ZapShift
        </p>

        <div className="mt-6 sm:mt-8 card bg-white w-full shadow-sm border border-slate-100">
          <div className="card-body p-5 sm:p-6">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* image */}
              <div>
                <label className="label pb-1">
                  <span className="label-text text-sm">Upload image</span>
                </label>
                <input
                  type="file"
                  className={inputClass}
                  placeholder=""
                  onChange={handleImageUpload}
                />
              </div>

              {/* Name */}
              <div>
                <label className="label pb-1">
                  <span className="label-text text-sm">Name</span>
                </label>
                <input
                  type="text"
                  {...register("name", { required: true })}
                  className={inputClass}
                  placeholder="Enter your name"
                />
                {errors.name?.type === "required" && (
                  <p className="mt-1 text-xs sm:text-sm text-red-700">
                    Name is required!
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="label pb-1">
                  <span className="label-text text-sm">Email</span>
                </label>
                <input
                  type="email"
                  {...register("email", { required: true })}
                  className={inputClass}
                  placeholder="Email"
                />
                {errors.email?.type === "required" && (
                  <p className="mt-1 text-xs sm:text-sm text-red-700">
                    Email is required!
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="label pb-1">
                  <span className="label-text text-sm">Password</span>
                </label>
                <input
                  type="password"
                  {...register("password", { required: true, minLength: 6 })}
                  className={inputClass}
                  placeholder="Password"
                />
                {errors.password?.type === "required" && (
                  <p className="mt-1 text-xs sm:text-sm text-red-700">
                    Password is required!
                  </p>
                )}
                {errors.password?.type === "minLength" && (
                  <p className="mt-1 text-xs sm:text-sm text-red-700">
                    Password must be at least 6 characters!
                  </p>
                )}
              </div>

              <button className="btn w-full bg-primary text-black hover:bg-[#b8dc55] border-0">
                Create Account
              </button>

              <div className="text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link to="/login" className="link link-hover font-medium">
                  Login
                </Link>
              </div>

              <div className="divider text-xs text-slate-400">OR</div>

              <button
                type="button"
                className="btn bg-white text-black border-[#e5e5e5] w-full"
                onClick={handlegoogleLogin}
              >
                <svg
                  aria-label="Google logo"
                  width="16"
                  height="16"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <g>
                    <path d="m0 0H512V512H0" fill="#fff"></path>
                    <path
                      fill="#34a853"
                      d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                    ></path>
                    <path
                      fill="#4285f4"
                      d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                    ></path>
                    <path
                      fill="#fbbc02"
                      d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                    ></path>
                    <path
                      fill="#ea4335"
                      d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                    ></path>
                  </g>
                </svg>
                <span className="ml-2">Login with Google</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
