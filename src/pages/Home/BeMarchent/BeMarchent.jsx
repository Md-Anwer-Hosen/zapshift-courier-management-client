import React from "react";
import image1 from "../../../assets/location-merchant.png";
import image2 from "../../../assets/be-a-merchant-bg.png";

const BeMarchent = () => {
  return (
    <section className="py-6 sm:py-10 px-4">
      <div className="mx-auto max-w-6xl">
        <div
          className="
            relative overflow-hidden rounded-2xl
            bg-[#03373D]/95 text-white
            bg-no-repeat bg-top
            px-5 py-8
            sm:px-8 sm:py-10
            md:px-12 md:py-12
          "
          style={{ backgroundImage: `url(${image2})` }}
        >
          <div
            className="
              flex flex-col
              md:flex-row md:items-center md:justify-between
              gap-8 md:gap-10
            "
          >
            {/* Left content */}
            <div className="max-w-xl">
              <h1 className="text-xl sm:text-2xl md:text-4xl font-semibold leading-snug md:leading-tight">
                Merchant and Customer Satisfaction is Our First Priority
              </h1>

              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-white/80 leading-relaxed">
                We offer the lowest delivery charge with the highest value along
                with 100% safety of your product. Pathao courier delivers your
                parcels in every corner of Bangladesh right on time.
              </p>

              <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3">
                <button className="w-full sm:w-auto bg-[#CAEB66] text-black font-medium rounded-full px-5 py-2.5 border border-primary">
                  Become a Merchant
                </button>

                <button className="w-full sm:w-auto bg-transparent text-white font-medium rounded-full px-5 py-2.5 border border-primary">
                  Earn with ZapShift Courier
                </button>
              </div>
            </div>

            {/* Right image */}
            <div className="w-full md:w-auto flex justify-center md:justify-end">
              <img
                src={image1}
                alt="Merchant location illustration"
                className="
                  w-[220px]
                  sm:w-[280px]
                  md:w-[340px]
                  lg:w-[420px]
                  h-auto object-contain
                "
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeMarchent;
