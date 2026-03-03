import React from "react";
import { Outlet } from "react-router-dom";
import image from "../assets/authImage.png";
import Logo from "../shared/Logo";

const AuthLayout = () => {
  return (
    <section className="min-h-screen bg-white ">
      <div className="mx-auto max-w-7xl min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT: Dynamic route area */}
        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-16 relative">
          <div className="mb-8 absolute top-6 left-3">
            <Logo />
          </div>

          {/* Outlet renders Login/Register/Forgot etc */}
          <Outlet />
        </div>

        {/* RIGHT: Fixed image area */}
        <div className="hidden lg:flex items-center justify-center bg-[#f4f9e9] px-10">
          <img
            src={image}
            alt="Auth illustration"
            className="max-w-[520px] w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default AuthLayout;
