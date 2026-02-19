import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Banner1 from "../../../assets/banner/banner1.png";
import Banner2 from "../../../assets/banner/banner2.png";
import Banner3 from "../../../assets/banner/banner3.png";

const Banner = () => {
  return (
    <Carousel
      autoPlay={true}
      infiniteLoop={true}
      showThumbs={false}
      className="mt-5"
    >
      <div>
        <img src={Banner1} alt="" />
        <p className="legend">{/* <p className="legend">Legend 1</p> */}</p>
      </div>
      <div>
        <img src={Banner2} alt="" />
        {/* <p className="legend">Legend 2</p> */}
      </div>
      <div>
        <img src={Banner3} alt="" />

        {/* <p className="legend">Legend 3</p> */}
      </div>
    </Carousel>
  );
};

export default Banner;
