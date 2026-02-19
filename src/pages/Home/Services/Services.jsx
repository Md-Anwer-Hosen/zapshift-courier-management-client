import React from "react";
import services from "../../../assets/Services.json";
import {
  FiTruck,
  FiMapPin,
  FiBox,
  FiDollarSign,
  FiBriefcase,
  FiRefreshCw,
} from "react-icons/fi";

const iconMap = {
  truck: FiTruck,
  map: FiMapPin,
  box: FiBox,
  dollar: FiDollarSign,
  briefcase: FiBriefcase,
  refresh: FiRefreshCw,
};

const Services = () => {
  return (
    <section className="w-full px-2 sm:px-0 py-14">
      <div className=" rounded-2xl bg-[#0b3a3f] p-6 sm:p-8 lg:p-12 shadow-xl">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Our Services
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-white/70 text-sm sm:text-base">
            Enjoy fast, reliable parcel delivery with real-time tracking and
            care. From personal packages to business shipments — we deliver on
            time, every time.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((item) => {
            const Icon = iconMap[item.icon];

            return (
              <div
                key={item.id}
                className="
                  group rounded-2xl border border-white/10
                  bg-white p-6 shadow-sm
                  transition-all duration-300
                  hover:-translate-y-2 hover:shadow-2xl
                  hover:bg-lime-300/90
                "
              >
                {/* Icon */}
                <div
                  className="
                  flex h-12 w-12 items-center justify-center
                  rounded-full bg-slate-100
                  transition group-hover:bg-white/70
                "
                >
                  <Icon
                    className="
                    text-xl text-slate-700
                    transition group-hover:text-[#0b3a3f]
                  "
                  />
                </div>

                {/* Title */}
                <h3
                  className="
                  mt-4 text-lg font-semibold text-slate-900
                  group-hover:text-[#0b3a3f] transition
                "
                >
                  {item.title}
                </h3>

                {/* Description */}
                <p
                  className="
                  mt-3 text-sm text-slate-600
                  group-hover:text-[#0b3a3f]/80 transition
                "
                >
                  {item.desc}
                </p>

                {/* Bottom Accent */}
                <div
                  className="
                  mt-5 h-1 w-12 rounded-full bg-slate-200
                  transition-all duration-300
                  group-hover:w-20 group-hover:bg-[#0b3a3f]/40
                "
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
