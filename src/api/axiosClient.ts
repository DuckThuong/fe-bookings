import { ROUTER_PATH } from "@/routers/Route";
import { clearStoredAuth, getStoredToken } from "@/common/utils/authStorage";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL ?? "http://localhost:8000";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = getStoredToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      clearStoredAuth();

      const publicPaths = [
        ROUTER_PATH.WELCOME,
        ROUTER_PATH.LOGIN,
        ROUTER_PATH.SIGNIN,
        ROUTER_PATH.OTP_CONFIRM,
        ROUTER_PATH.FINISH,
      ];
      const isPublicPath = publicPaths.includes(window.location.pathname);

      if (!isPublicPath) {
        window.history.replaceState(null, "", ROUTER_PATH.LOGIN);
        window.dispatchEvent(new PopStateEvent("popstate"));
      }
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
