import axios from "axios";
import Swal from "sweetalert2";
import router from "../routers/routers.js";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
  withCredentials: true,
});

// 請求攜帶 token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers["authorization"] = `Bearer ${token}`;
    }
    return config;
  }
);

// 統一處理 401
axiosInstance.interceptors.response.use(
  (response) => response,(error) => {
    if (error.response && error.response.status === 401) {
      Swal.fire("未授權", "未授權行為或您的登入已過期，請重新登入", "warning").then(() => {
        router.push("/"); 
      });
    }else{
      return Promise.reject(error);
    }
  }
);

export default axiosInstance;