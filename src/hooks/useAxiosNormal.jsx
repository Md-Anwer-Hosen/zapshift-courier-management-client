import axios from "axios";
import React from "react";

const axiosNormal = axios.create({
  baseURL: "https://zapshift-courier-management-server.vercel.app",
});

const useAxiosNormal = () => {
  return axiosNormal;
};

export default useAxiosNormal;
