import React from "react";
import { Link } from "react-router-dom";
import { MdOutlineErrorOutline, MdHome, MdArrowBack } from "react-icons/md";

const Error404 = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-6 sm:p-10 text-center">
        <div className="flex justify-center mb-6">
          <div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full bg-red-500/10 border border-red-400/20">
            <MdOutlineErrorOutline className="text-6xl sm:text-7xl text-red-400" />
          </div>
        </div>

        <p className="text-red-400 font-semibold tracking-[0.3em] uppercase text-sm sm:text-base mb-3">
          Oops! Page Not Found
        </p>

        <h1 className="text-6xl sm:text-8xl font-extrabold leading-none bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          404
        </h1>

        <h2 className="mt-4 text-2xl sm:text-4xl font-bold text-white">
          The page you are looking for doesn&apos;t exist
        </h2>

        <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
          The page may have been moved, deleted, or the link might be broken.
          Please check the URL or return to a safe page.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm sm:text-base font-semibold text-black shadow-lg transition hover:scale-[1.02] hover:shadow-primary/30"
          >
            <MdHome size={20} />
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm sm:text-base font-semibold text-white transition hover:bg-white/10"
          >
            <MdArrowBack size={20} />
            Go Back
          </button>
        </div>

        <div className="mt-10 border-t border-white/10 pt-5 text-xs sm:text-sm text-slate-400">
          Need help? Please return to the homepage and continue browsing.
        </div>
      </div>
    </div>
  );
};

export default Error404;
