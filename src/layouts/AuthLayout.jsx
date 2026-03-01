import React from "react";
import { Outlet } from "react-router-dom";
import image from "../assets/authImage.png";
import Logo from "../shared/Logo";

const AuthLayout = () => {
  return (
    <>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <img src={image} className="rounded-lg " />
          <div>
            <div>{<Logo />}</div>
            {<Outlet />}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
