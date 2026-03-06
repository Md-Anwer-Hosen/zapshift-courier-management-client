import React from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signInWithGoogle, signIn } = useAuth();

  const getFirebaseErrorMessage = (code) => {
    switch (code) {
      case "auth/user-not-found":
        return "No account found with this email.";
      case "auth/wrong-password":
        return "Incorrect password.";
      case "auth/invalid-email":
        return "Invalid email address.";
      case "auth/network-request-failed":
        return "Network error. Check your internet connection.";
      default:
        return "Login failed. Please try again.";
    }
  };

  const handlegoogleLogin = () => {
    signInWithGoogle()
      .then((result) => {
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Logged in with Google.",
        }).then(() => {
          navigate(from);
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Google Login Failed",
          text: getFirebaseErrorMessage(err.code),
        });
      });
  };

  const onsubmit = (data) => {
    const { email, password } = data;

    signIn(email, password)
      .then((result) => {
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Welcome back!",
        }).then(() => {
          navigate(from);
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: getFirebaseErrorMessage(err.code),
        });
      });
  };

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-3xl sm:text-4xl font-bold text-[#0b3b3f]">
        Welcome Back
      </h1>
      <p className="mt-2 text-sm sm:text-base text-slate-500">
        Login with ZapShift
      </p>

      <div className="mt-8 card bg-white w-full shadow-sm border border-slate-100">
        <div className="card-body p-6">
          <form className="space-y-4" onSubmit={handleSubmit(onsubmit)}>
            <div>
              <label className="label pb-1">
                <span className="label-text text-sm">Email</span>
              </label>
              <input
                type="email"
                {...register("email", { required: true })}
                className="input input-bordered w-full focus:outline-none 
             focus:ring-1 
             focus:ring-[#CAEB66] 
             focus:border-[#CAEB66]"
                placeholder="Email"
              />
              {errors.email?.type === "required" && (
                <p className=" text-red-700">Email is required!</p>
              )}
            </div>

            <div>
              <label className="label pb-1">
                <span className="label-text text-sm">Password</span>
              </label>
              <input
                type="password"
                {...register("password", { required: true, minLength: 6 })}
                className="input input-bordered w-full focus:outline-none 
             focus:ring-1 
             focus:ring-[#CAEB66] 
             focus:border-[#CAEB66]"
                placeholder="Password"
              />
              {errors.password?.type === "required" && (
                <p className=" text-red-700">Password is required!</p>
              )}
              {errors.password?.type === "minLength" && (
                <p className=" text-red-700">Password must be 6 cheracter!</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Link to="/auth/forgot" className="link link-hover text-sm">
                Forgot password?
              </Link>
            </div>

            <button className="btn w-full bg-primary text-black hover:bg-[#b8dc55] border-0">
              Login
            </button>

            <div className="text-center text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <Link to="/createAccount" className="link link-hover font-medium">
                Register
              </Link>
            </div>

            <div className="divider text-xs text-slate-400">OR</div>
            <div className="flex items-center justify-center">
              <button
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
                Login with Google
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
