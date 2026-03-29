import axios from "axios";
import React from "react";

const axiosNormal = axios.create({
  baseURL: "https://product-recomendations-servermanage.vercel.app",
});

const useAxiosNormal = () => {
  return axiosNormal;
};

export default useAxiosNormal;
