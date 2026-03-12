import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import Logo from "../shared/Logo";

import { MdHome, MdLocalShipping } from "react-icons/md";
import {
  FaHistory,
  FaUserClock,
  FaTasks,
  FaCheckCircle,
  FaUserShield,
  FaTruckMoving,
} from "react-icons/fa";
import { RiMotorbikeFill } from "react-icons/ri";
import { GiPathDistance } from "react-icons/gi";
import useUserRole from "../hooks/useUserRole";

const DashboardLayout = () => {
  const { role, roleLoading } = useUserRole();

  if (roleLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  const navStyle =
    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200";

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      {/* CONTENT */}
      <div className="drawer-content flex flex-col">
        {/* Mobile Navbar */}
        <div className="navbar bg-base-300 w-full lg:hidden">
          <div className="flex-none">
            <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
          </div>

          <div className="mx-2 flex-1 font-semibold">Dashboard</div>
        </div>

        <Outlet />
      </div>

      {/* SIDEBAR */}
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>

        <ul className="menu bg-base-200 min-h-full w-80 p-4 space-y-1">
          <li className="mb-4">
            <Logo />
          </li>

          {/* Home */}
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${navStyle} ${isActive ? "bg-primary text-black" : ""}`
              }
            >
              <MdHome size={20} />
              Home
            </NavLink>
          </li>

          {/* USER MENU */}
          <li>
            <NavLink
              to="/dashboard/myParcels"
              className={({ isActive }) =>
                `${navStyle} ${isActive ? "bg-primary text-black" : ""}`
              }
            >
              <MdLocalShipping size={20} />
              My Parcels
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/tracParcel"
              className={({ isActive }) =>
                `${navStyle} ${isActive ? "bg-primary text-black" : ""}`
              }
            >
              <GiPathDistance size={20} />
              Track a Parcel
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/paymentHistory"
              className={({ isActive }) =>
                `${navStyle} ${isActive ? "bg-primary text-black" : ""}`
              }
            >
              <FaHistory size={20} />
              Payment History
            </NavLink>
          </li>

          {/* RIDER MENU */}
          {role === "rider" && (
            <>
              <li>
                <NavLink
                  to="/dashboard/mytask"
                  className={({ isActive }) =>
                    `${navStyle} ${isActive ? "bg-primary text-black" : ""}`
                  }
                >
                  <FaTasks size={20} />
                  My Task
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/compleatedTask"
                  className={({ isActive }) =>
                    `${navStyle} ${isActive ? "bg-primary text-black" : ""}`
                  }
                >
                  <FaCheckCircle size={20} />
                  Compleated task
                </NavLink>
              </li>
            </>
          )}

          {/* ADMIN MENU */}
          {role === "admin" && (
            <>
              <div className="divider text-xs font-semibold text-gray-500">
                Management
              </div>

              <li>
                <NavLink
                  to="/dashboard/pendingRiders"
                  className={({ isActive }) =>
                    `${navStyle} ${isActive ? "bg-primary text-black" : ""}`
                  }
                >
                  <FaUserClock size={20} />
                  Pending Riders
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/dashboard/activeRiders"
                  className={({ isActive }) =>
                    `${navStyle} ${isActive ? "bg-primary text-black" : ""}`
                  }
                >
                  <RiMotorbikeFill size={20} />
                  Active Riders
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/dashboard/makeAdmin"
                  className={({ isActive }) =>
                    `${navStyle} ${isActive ? "bg-primary text-black" : ""}`
                  }
                >
                  <FaUserShield size={20} />
                  Make Admin
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/dashboard/asignRider"
                  className={({ isActive }) =>
                    `${navStyle} ${isActive ? "bg-primary text-black" : ""}`
                  }
                >
                  <FaTruckMoving size={20} />
                  Asign Rider
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
