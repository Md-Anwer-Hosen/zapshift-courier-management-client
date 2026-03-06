import React from "react";
import { Outlet } from "react-router-dom";
import image from "../assets/authImage.png";
import Logo from "../shared/Logo";

const AuthLayout = () => {
  return (
    <section className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT: Dynamic route area */}
        <div className="flex flex-col justify-center px-4 py-8 sm:px-6 sm:py-10 md:px-10 lg:px-12 xl:px-16 relative">
          {/* Logo - Responsive positioning */}
          <div className="mb-6 sm:mb-8 absolute top-4 left-4 sm:top-6 sm:left-6 md:left-10 lg:left-12 xl:left-16 z-10">
            <Logo />
          </div>

          {/* Outlet renders Login/Register/Forgot etc */}
          <div className="w-full max-w-md mx-auto pt-16 sm:pt-20 lg:pt-0">
            <Outlet />
          </div>
        </div>

        {/* RIGHT: Fixed image area - Hidden on mobile, visible on large screens */}
        <div className="hidden lg:flex items-center justify-center bg-[#f4f9e9] px-6 xl:px-10">
          <img
            src={image}
            alt="Auth illustration"
            className="max-w-full lg:max-w-[420px] xl:max-w-[520px] w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default AuthLayout;
