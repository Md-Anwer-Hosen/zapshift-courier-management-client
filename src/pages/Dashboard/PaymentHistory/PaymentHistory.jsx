import React from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/paymentshistory/${user.email}`);
      return res.data;
    },
  });

  if (isLoading) {
    return <div className="text-center p-10 font-bold">Loading...</div>;
  }

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <div className="mb-4">
        <h2 className="text-xl md:text-2xl font-bold">Payment History</h2>
        <p className="text-sm text-gray-500 mt-1">
          Total Payments: {payments.length}
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="table w-full min-w-[700px]">
          <thead className="bg-base-200">
            <tr>
              <th className="whitespace-nowrap">#</th>
              <th className="whitespace-nowrap">Transaction ID</th>
              <th className="whitespace-nowrap">Amount</th>
              <th className="whitespace-nowrap">Method</th>
              <th className="whitespace-nowrap">Date</th>
            </tr>
          </thead>

          <tbody>
            {payments.length > 0 ? (
              payments.map((pay, index) => (
                <tr
                  key={pay._id}
                  className="hover:bg-base-100 transition-colors duration-200"
                >
                  <td className="whitespace-nowrap font-medium">{index + 1}</td>

                  <td>
                    <div
                      className="max-w-[110px] sm:max-w-[150px] md:max-w-[220px] lg:max-w-[280px] truncate cursor-pointer"
                      title={pay.transactionId}
                    >
                      {pay.transactionId}
                    </div>
                  </td>

                  <td className="whitespace-nowrap font-semibold text-emerald-600">
                    ৳ {pay.amount}
                  </td>

                  <td>
                    <div
                      className="max-w-[70px] sm:max-w-[90px] md:max-w-[120px] truncate capitalize cursor-pointer"
                      title={pay.paymentMethod}
                    >
                      {pay.paymentMethod}
                    </div>
                  </td>

                  <td className="whitespace-nowrap text-sm">
                    {new Date(pay.paid_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">
                  No payment history found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
