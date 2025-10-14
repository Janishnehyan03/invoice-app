// src/lib/axios.js
import axios from "axios";

const Axios = axios.create({
  // baseURL: process.env.REACT_APP_API_URL || "http://localhost:5100/api",
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  },
});

export default Axios;
