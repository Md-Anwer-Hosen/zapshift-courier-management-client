import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import topImg from "../../../assets/customer-top.png";
import quoteImg from "../../../assets/reviewQuote.png";

const reviews = [
  {
    id: 1,
    text: "A posture corrector works by providing support and gentle alignment to your shoulders, back and spine, encouraging you to maintain proper posture throughout the day.",
    name: "Rasel Ahamed",
    role: "CTO",
  },
  {
    id: 2,
    text: "A posture corrector works by providing support and gentle alignment to your shoulders, back and spine, encouraging you to maintain proper posture throughout the day.",
    name: "Awlad Hossin",
    role: "Senior Product Designer",
  },
  {
    id: 3,
    text: "A posture corrector works by providing support and gentle alignment to your shoulders, back and spine, encouraging you to maintain proper posture throughout the day.",
    name: "Nasir Uddin",
    role: "CEO",
  },
  {
    id: 4,
    text: "A posture corrector works by providing support and gentle alignment to your shoulders, back and spine, encouraging you to maintain proper posture throughout the day.",
    name: "Awla Khatun",
    role: "Senior Designer",
  },
];

export default function CustomerSayings() {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="w-full bg-tra py-16 overflow-hidden">
      {/* Top Illustration */}
      <div className="flex justify-center mb-6">
        <img
          src={topImg}
          alt="delivery illustration"
          className="h-24 md:h-28 object-contain"
        />
      </div>

      {/* Heading */}
      <div className="text-center px-4 mb-2">
        <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900">
          What our customers are sayings
        </h2>
      </div>
      <p className="text-center text-sm md:text-base text-gray-500 max-w-lg mx-auto mb-12 px-4 leading-relaxed">
        Enhance posture, mobility, and well-being effortlessly with Posture Pro.
        Achieve proper alignment, reduce pain, and strengthen your body with
        ease!
      </p>

      {/* Swiper container — overflow visible for peek effect */}
      <div className="px-4">
        <Swiper
          modules={[Navigation]}
          centeredSlides={true}
          slidesPerView={"auto"}
          spaceBetween={24}
          loop={true}
          loopedSlides={reviews.length}
          initialSlide={0}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            // Force loop init so clones exist from the start
            swiper.loopCreate?.();
            swiper.update?.();
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          style={{ overflow: "visible" }}
        >
          {reviews.map((review) => (
            <SwiperSlide
              key={review.id}
              style={{ width: "clamp(260px, 48vw, 420px)", flexShrink: 0 }}
            >
              {({ isActive }) => (
                <div
                  className={`rounded-2xl p-4 transition-all duration-300 ${
                    isActive
                      ? "bg-white shadow-lg opacity-100"
                      : "bg-[#e2e1db] shadow-none opacity-60"
                  }`}
                  style={{ minHeight: 230 }}
                >
                  {/* Quote Icon */}
                  <div className="mb-4">
                    <img
                      src={quoteImg}
                      alt="quote"
                      className="h-7 w-7 object-contain opacity-60"
                    />
                  </div>

                  {/* Review Text */}
                  <p className="text-sm text-gray-600 leading-relaxed mb-5">
                    {review.text}
                  </p>

                  {/* Divider */}
                  <div className="border-t border-dashed border-gray-300 mb-4" />

                  {/* Reviewer */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {review.name}
                      </p>
                      <p className="text-xs text-gray-400">{review.role}</p>
                    </div>
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-10">
        {/* Prev */}
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="w-10 h-10 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-100 transition shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => swiperRef.current?.slideToLoop(idx)}
              className={`rounded-full transition-all duration-300 ${
                idx === activeIndex
                  ? "w-6 h-2.5 bg-gray-700"
                  : "w-2.5 h-2.5 bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Next */}
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="w-10 h-10 rounded-full bg-[#b5d433] flex items-center justify-center hover:brightness-95 transition shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-gray-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
