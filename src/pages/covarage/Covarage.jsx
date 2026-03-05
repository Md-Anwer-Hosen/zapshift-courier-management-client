import React, { useState } from "react";
import BangladeshMap from "./BangladeshMap";

const Covarage = () => {
  const [searchText, setSearchText] = useState("");

  return (
    <section className="px-4 py-10">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
        <h1 className="text-3xl font-extrabold">
          We are available in 64 districts
        </h1>

        <div className="mt-5 flex gap-3 max-w-xl">
          <input
            type="text"
            placeholder="Search district or city"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full h-11 rounded-full border px-4 outline-none focus:ring-2 focus:ring-lime-300"
          />
        </div>

        <hr className="my-6" />

        <h2 className="font-bold">We deliver almost all over Bangladesh</h2>

        <div className="mt-4">
          <BangladeshMap searchText={searchText} />
        </div>
      </div>
    </section>
  );
};

export default Covarage;
