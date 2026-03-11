import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaUserShield, FaSearch, FaUser } from "react-icons/fa";
import { MdAdminPanelSettings, MdRefresh } from "react-icons/md";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MakeAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const [searchInput, setSearchInput] = useState("");
  const [searchText, setSearchText] = useState("");

  const {
    data: users = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["search-users-admin", searchText],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/users/search?search=${encodeURIComponent(searchText)}`,
      );
      return res.data;
    },
  });

  const handleMakeAdmin = async (user) => {
    const result = await Swal.fire({
      title: "Make Admin?",
      text: `Do you want to make ${user.name || user.email} an admin?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Make Admin",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosSecure.patch(`/users/make-admin/${user._id}`);

      if (res.data?.success) {
        await Swal.fire({
          title: "Success!",
          text: `${user.name || user.email} is now an admin.`,
          icon: "success",
          confirmButtonColor: "#16a34a",
        });

        refetch();
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed!",
        text: "Could not make admin.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleRemoveAdmin = async (user) => {
    const result = await Swal.fire({
      title: "Remove Admin?",
      text: `Do you want to change ${user.name || user.email} back to user?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#16a34a",
      confirmButtonText: "Yes, Remove Admin",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosSecure.patch(`/users/remove-admin/${user._id}`);

      if (res.data?.success) {
        await Swal.fire({
          title: "Updated!",
          text: `${user.name || user.email} is now a user.`,
          icon: "success",
          confirmButtonColor: "#16a34a",
        });

        refetch();
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed!",
        text: "Could not remove admin.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  if (isLoading) {
    return <div className="py-10 text-center font-semibold">Loading...</div>;
  }

  return (
    <section className="p-3 md:p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold md:text-2xl">
          <MdAdminPanelSettings className="text-primary" size={28} />
          Manage Admins
        </h2>

        <button
          onClick={() => refetch()}
          className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-black"
        >
          <MdRefresh size={18} />
          Refresh
        </button>
      </div>

      {/* Search box */}
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative w-full">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 outline-none focus:border-primary focus:ring-0"
            />
          </div>

          <button
            onClick={() => setSearchText(searchInput)}
            className="rounded-md bg-primary px-5 py-2 font-medium text-black"
          >
            Search
          </button>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm lg:block">
        <table className="w-full text-left">
          <thead className="bg-primary text-black">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="text-black">
            {users.map((user, index) => (
              <tr key={user._id} className="border-t">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FaUser className="text-gray-500" />
                    <span className="font-medium">
                      {user.name || "No Name"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      user.role === "admin"
                        ? "bg-green-100 text-green-700"
                        : user.role === "rider"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {user.role || "user"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    {user.role !== "admin" ? (
                      <button
                        onClick={() => handleMakeAdmin(user)}
                        className="flex  items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-black transition hover:opacity-90"
                      >
                        <FaUserShield />
                        Make Admin
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRemoveAdmin(user)}
                        className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                      >
                        Remove Admin
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {users.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-gray-500 shadow-sm">
            No users found.
          </div>
        )}

        {users.map((user) => (
          <div
            key={user._id}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  {user.name || "No Name"}
                </h3>
                <p className="break-all text-sm text-gray-500">{user.email}</p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  user.role === "admin"
                    ? "bg-green-100 text-green-700"
                    : user.role === "rider"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                }`}
              >
                {user.role || "user"}
              </span>
            </div>

            <div className="mt-4">
              {user.role !== "admin" ? (
                <button
                  onClick={() => handleMakeAdmin(user)}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 font-semibold text-white transition hover:opacity-90"
                >
                  <FaUserShield />
                  Make Admin
                </button>
              ) : (
                <button
                  onClick={() => handleRemoveAdmin(user)}
                  className="w-full rounded-md bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-600"
                >
                  Remove Admin
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MakeAdmin;
