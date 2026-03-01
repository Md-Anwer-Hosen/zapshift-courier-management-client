import React from "react";
import Marquee from "react-fast-marquee";

import logo2 from "../../../assets/brands/amazon_vector.png";
import logo3 from "../../../assets/brands/casio.png";
import logo4 from "../../../assets/brands/moonstar.png";
import logo5 from "../../../assets/brands/randstad.png";
import logo6 from "../../../assets/brands/star.png";
import logo7 from "../../../assets/brands/start_people.png";

const logos = [logo2, logo3, logo4, logo5, logo6, logo7];

const Brands = () => {
  return (
    <section className="py-14 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-black">
          We've helped thousands of sales teams
        </h2>

        <Marquee
          speed={40}
          gradient={true}
          gradientColor={[255, 255, 255]}
          pauseOnHover={true}
          className="h-10"
        >
          {logos.map((logo, index) => (
            <div key={index} className="mx-5 md:mx-10">
              <img
                src={logo}
                alt="brand logo"
                className=" object-contain  transition"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default Brands;
