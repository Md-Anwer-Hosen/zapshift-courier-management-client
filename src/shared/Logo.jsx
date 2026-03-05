import React from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <div className="flex relative ">
      <Link to={"/"}>
        <img src={logo} alt="logo" />
        <div className="absolute bottom-0 left-4">
          <p className="text-2xl font-semibold">ZapShift</p>
        </div>
      </Link>
    </div>
  );
};

export default Logo;
