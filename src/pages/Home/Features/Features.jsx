import React from "react";

import tracking from "../../../assets/features/Group 4.png";
import safe from "../../../assets/features/Group 5.png";
import support from "../../../assets/features/Group 6.png";

const features = [
  {
    id: 1,
    title: "Live Parcel Tracking",
    desc: "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment’s journey and get instant status updates for complete peace of mind.",
    image: tracking,
  },
  {
    id: 2,
    title: "100% Safe Delivery",
    desc: "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
    image: safe,
  },
  {
    id: 3,
    title: "24/7 Call Center Support",
    desc: "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns — anytime you need us.",
    image: support,
  },
];

const Features = () => {
  return (
    <section className="py-14 bg-transparent">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="flex flex-col md:flex-row items-center gap-6 bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-lg transition"
            data-aos="fade-up"
          >
            {/* Image */}
            <div className="flex-shrink-0">
              <img
                src={feature.image}
                alt={feature.title}
                className="h-28 md:h-32 object-contain"
              />
            </div>

            {/* Vertical Line */}
            <div className="hidden md:block h-24 border-l-2 border-dashed border-gray-300"></div>

            {/* Text */}
            <div>
              <h3 className="text-md md:text-2xl font-semibold text-secondary">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
