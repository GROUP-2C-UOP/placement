import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const isTokenExpired = (token) => {
  const expiry = JSON.parse(atob(token.split('.')[1])).exp;
  return Date.now() >= expiry * 1000;
};

const handleRefreshTokenExpired = () => {
  localStorage.clear()
  window.location.href = "/logout"; 
};

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN);

  if (!refreshToken) return null;

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/token/refresh/`, { refresh: refreshToken });
    const { access } = response.data;

    localStorage.setItem(ACCESS_TOKEN, access);
    return access;
  } catch (error) {
    console.error("Token refresh failed:", error);
    localStorage.clear()
    return null;
  }
};

api.interceptors.request.use(
  async (config) => {
    let accessToken = localStorage.getItem(ACCESS_TOKEN);
    let refreshToken = localStorage.getItem(REFRESH_TOKEN);
    console.log(accessToken)
    if (refreshToken && isTokenExpired(refreshToken)) {
      handleRefreshTokenExpired();
      return Promise.reject("Refresh token expired, user logged out.");
    }

    if (accessToken && isTokenExpired(accessToken)) {
      accessToken = await refreshAccessToken(); 
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log("Authorization header:", config.headers.Authorization);

    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
