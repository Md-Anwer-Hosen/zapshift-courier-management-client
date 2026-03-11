import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const { parcelId } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const {
    data: parcel = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-parcel", parcelId],
    enabled: !!parcelId,
    queryFn: async () => {
      const res = await axiosSecure.get(`/paymentParcel/${parcelId}`);
      return res.data;
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const card = elements.getElement(CardElement);

    if (!card) {
      setLoading(false);
      return;
    }

    try {
      // 1) create payment intent from server
      const { data } = await axiosSecure.post("/create-payment-intent", {
        cost: parcel.deliveryCost,
        parcelId,
      });

      const clientSecret = data.clientSecret;

      // 2) confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: parcel?.sender?.name || "Anonymous",
            email: parcel?.sender?.email || "unknown@example.com",
          },
        },
      });

      if (result.error) {
        setErr(result.error.message);
        setLoading(false);
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
        const paymentInfo = {
          parcelId: parcel._id,
          email: parcel?.sender?.email,
          amount: parcel?.deliveryCost,
          transactionId: result.paymentIntent.id,
          paymentMethod: "card",
          paid_at: new Date().toISOString(),
        };

        const paymentRes = await axiosSecure.post("/payments", paymentInfo);

        if (paymentRes.data?.success) {
          Swal.fire({
            icon: "success",
            title: "Payment Successful",
            text: "Your payment has been completed successfully.",
            confirmButtonText: "Go to My Parcels",
          }).then(() => {
            navigate("/dashboard/myParcels");
          });
        }
      }
    } catch (error) {
      console.log(error);
      setErr("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  //create payment intent-->>

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
