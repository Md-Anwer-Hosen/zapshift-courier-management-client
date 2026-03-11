import axios from "axios";
import React from "react";

const axiosNormal = axios.create({ baseURL: "http://localhost:5000" });

const useAxiosNormal = () => {
  return axiosNormal;
};

export default useAxiosNormal;
