import React from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogOut = () => {
    logout()
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  };

  const links = (
    <>
      <li>
        <NavLink>Home</NavLink>
      </li>
      <li>
        <NavLink>Covarage</NavLink>
      </li>

      <li>
        <NavLink to={"/sendParcel"}>Send a Parcel</NavLink>
      </li>
      {user && (
        <>
          <li>
            <NavLink to={"/dashboard"}>Dashboard</NavLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <div className="navbar bg-white shadow-sm text-black h-16 rounded-lg">
      <div className="navbar-start">
        <div className="dropdown bg-white">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost lg:hidden bg-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-white rounded-box z-1 mt-3 w-52 p-2 shadow "
          >
            {links}
          </ul>
        </div>
        <div className=" text-xl hidden lg:flex px-2 -py-1">
          <Logo />
        </div>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{links}</ul>
      </div>
      <div className="navbar-end">
        {user ? (
          <button className="btn bg-primary text-black" onClick={handleLogOut}>
            Log out
          </button>
        ) : (
          <Link to={"/login"} className="btn bg-primary">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
