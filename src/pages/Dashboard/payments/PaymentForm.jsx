import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const { parcelId } = useParams();
  const axiosSecure = useAxiosSecure();

  const {
    data: parcel = {},
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["my-parcel", parcelId],
    enabled: !!parcelId,
    queryFn: async () => {
      const res = await axiosSecure.get(`/payment/${parcelId}`);
      return res.data;
    },
  });
  console.log(parcelId);
  console.log(parcel);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (!card) {
      return;
    }

    setLoading(true);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("Error:", error);
      setErr(error.message);
      setLoading(false);
      return;
    }

    console.log("Payment Method:", paymentMethod);
    setLoading(false);
  };

  if (isLoading)
    return <div className="text-center p-10 font-bold">Loading...</div>;

  if (isError)
    return (
      <div className="text-center p-10 font-bold text-red-600">
        Something went wrong.
      </div>
    );

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-center mb-2">Complete Payment</h2>
      <p className="text-sm text-gray-500 text-center mb-6">
        Enter your card details to pay for your parcel
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="border rounded-xl p-4 shadow-sm">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#1f2937",
                  "::placeholder": {
                    color: "#9ca3af",
                  },
                },
                invalid: {
                  color: "#ef4444",
                },
              },
            }}
          />
        </div>

        {err && (
          <p className="text-red-500 text-sm font-medium bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {err}
          </p>
        )}

        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl transition duration-200"
        >
          {loading
            ? "Processing..."
            : `Pay for Parcel :  ${parcel.deliveryCost} $`}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
