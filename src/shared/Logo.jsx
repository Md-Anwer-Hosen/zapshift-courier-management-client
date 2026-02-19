import React from "react";
import logo from "../assets/logo.png";

const Logo = () => {
  return (
    <div className="flex relative ">
      <img src={logo} alt="logo" />
      <div className="absolute bottom-0 left-4">
        <p className="text-2xl font-semibold">ZapShift</p>
      </div>
    </div>
  );
};

export default Logo;
