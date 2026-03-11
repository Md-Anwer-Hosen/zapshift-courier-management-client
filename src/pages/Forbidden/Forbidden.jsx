import React from "react";
import { Link } from "react-router-dom";
import { FaShieldAlt, FaArrowLeft, FaLock } from "react-icons/fa";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

const Forbidden = () => {
  return (
    <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-10">
      <div className="w-full max-w-3xl rounded-3xl border border-gray-200 bg-white p-6 shadow-xl md:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-50 text-red-500 shadow-sm md:h-28 md:w-28">
            <FaShieldAlt className="text-4xl md:text-5xl" />
          </div>

          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
            <FaLock />
            Access Denied
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
            403 Forbidden
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600 md:text-base">
            You do not have permission to access this page. This area is
            restricted to authorized admins only. Please go back to a safe page
            or return to your dashboard.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700">
              <MdOutlineAdminPanelSettings className="text-lg text-primary" />
              Admin permission required
            </div>
          </div>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:opacity-90"
            >
              <FaArrowLeft />
              Go Home
            </Link>

            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Forbidden;
