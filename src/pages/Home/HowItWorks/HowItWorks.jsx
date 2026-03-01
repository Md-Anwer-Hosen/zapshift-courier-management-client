import React from "react";
import icon from "../../../assets/bookingIcon.png";

const steps = [
  {
    title: "Booking Pick & Drop",
    desc: "From personal packages to business shipments — we deliver on time, every time.",
  },
  {
    title: "Cash On Delivery",
    desc: "From personal packages to business shipments — we deliver on time, every time.",
  },
  {
    title: "Delivery Hub",
    desc: "From personal packages to business shipments — we deliver on time, every time.",
  },
  {
    title: "Booking SME & Corporate",
    desc: "From personal packages to business shipments — we deliver on time, every time.",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-transparent py-12 px-4">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-xl sm:text-2xl font-semibold text-[#0b3b3f]">
          How it Works
        </h2>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 
           transition-all duration-400 ease-in-out 
           hover:shadow-lg hover:-translate-y-1 hover:bg-primary"
              data-aos="fade-up"
            >
              <img src={icon} alt="" className="h-10 w-10" />

              <h3 className="mt-4 text-xl font-semibold text-[#0b3b3f]">
                {item.title}
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
