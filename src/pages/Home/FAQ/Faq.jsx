import React from "react";

const Faq = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto text-[#03373D]">
        {/* Header */}
        <div>
          <h1 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold">
            Frequently Asked Question (FAQ)
          </h1>

          <p className="text-center mt-4 sm:mt-6 text-sm sm:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Enhance posture, mobility, and well-being effortlessly with Posture
            Pro. Achieve proper alignment, reduce pain, and strengthen your body
            with ease!
          </p>
        </div>

        {/* Accordion */}
        <div className="mt-8 sm:mt-10 space-y-4">
          <div className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-xl">
            <input type="radio" name="faq-accordion" defaultChecked />
            <div className="collapse-title font-semibold text-sm sm:text-base">
              How does this posture corrector work?
            </div>
            <div className="collapse-content text-xs sm:text-sm text-slate-600">
              A posture corrector works by providing support and gentle
              alignment to your shoulders, back, and spine, encouraging you to
              maintain proper posture throughout the day.
            </div>
          </div>

          <div className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-xl">
            <input type="radio" name="faq-accordion" />
            <div className="collapse-title font-semibold text-sm sm:text-base">
              Is it suitable for all ages and body types?
            </div>
            <div className="collapse-content text-xs sm:text-sm text-slate-600">
              Yes, it is designed to be adjustable and comfortable for different
              body types and age groups.
            </div>
          </div>

          <div className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-xl">
            <input type="radio" name="faq-accordion" />
            <div className="collapse-title font-semibold text-sm sm:text-base">
              Does it really help with back pain and posture improvement?
            </div>
            <div className="collapse-content text-xs sm:text-sm text-slate-600">
              Regular use helps improve posture awareness and reduces strain on
              your back and shoulders.
            </div>
          </div>

          <div className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-xl">
            <input type="radio" name="faq-accordion" />
            <div className="collapse-title font-semibold text-sm sm:text-base">
              How will I be notified when the product is back in stock?
            </div>
            <div className="collapse-content text-xs sm:text-sm text-slate-600">
              You will receive an email notification once the product becomes
              available again.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
