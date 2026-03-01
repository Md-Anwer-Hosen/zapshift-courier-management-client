import React from "react";
import Banner from "../Banner/Banner";
import Services from "../Services/Services";
import Brands from "../Brands/Brands";
import Features from "../Features/Features";
import BeMarchent from "../BeMarchent/BeMarchent";
import CoustomerSayings from "../CoustomerSayings/CoustomerSayings";
import Faq from "../FAQ/Faq";
import HowItWorks from "../HowItWorks/HowItWorks";

const Home = () => {
  return (
    <div>
      <Banner />
      <HowItWorks />
      <Services />
      <Brands />
      <Features />
      <BeMarchent />
      <CoustomerSayings />
      <Faq />
    </div>
  );
};

export default Home;
