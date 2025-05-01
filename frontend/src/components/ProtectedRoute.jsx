import { Navigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN } from "../constants";
import { ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";

/**
 * Wrapper to wrap all pages that need to be accessed through log in
 * checks for valid access token on load and automatically refreshes expired tokens
 * if unauthorised, taken to login page
 * 
 *  
 */
function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  }, []);

  /**
   * Accesses local storage to get the refresh token and attempts to refresh the access token using the refresh token.
   * Updaytes the access token within local storage on success
   * Sets authorisation state based on result
   */
  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorized(false);
    }
  };

  /**
   * Checks for access token 
   * Validates token expiration
   * Refreshes if expired
   * Sets authorization state
   */
  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  };

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  //if authorised, show the page otherwise redirect to the login page
  return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
