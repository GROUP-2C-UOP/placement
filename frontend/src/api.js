import axios from "axios"; //for constructing the actual api
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const api = axios.create({ //creater axios instance with the base api url from the .env file
  baseURL: import.meta.env.VITE_API_URL,
});

const isTokenExpired = (token) => { //function to check if a jwt has been expired
  const expiry = JSON.parse(atob(token.split('.')[1])).exp; // decode the tokens payload and extract the expiration time 
  return Date.now() >= expiry * 1000; //convert the expiry time from seconds to milliseconds and compare with the current time, returns true or false based on the comparison
};

const handleRefreshTokenExpired = () => { //function to handle if a refresh token has expired
  localStorage.clear() //clears users local storage to remove stored tokens
  window.location.href = "/logout"; //redirect the user to the logout page
};

const refreshAccessToken = async () => { //function to refresh the users access token
  const refreshToken = localStorage.getItem(REFRESH_TOKEN); //get the users refresh token from their local storage

  if (!refreshToken) return null; //if there is no refresh token, return null

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/token/refresh/`, { refresh: refreshToken }); //send a request to refresh the access token where the payload includes the refresh token
    const { access } = response.data; // extract the new access token from the response and set it to the access varaible

    localStorage.setItem(ACCESS_TOKEN, access); //store the new access token into the local storage
    return access; //return the new access token
  } catch (error) { //if fails catch the error and
    console.error("Token refresh failed:", error); //log that it failed with the actual error
    localStorage.clear() //clear the local storage
    return null; //return null
  }
};

api.interceptors.request.use( //attach authorisation tokens to each api requestr
  async (config) => { //the configuration for the HTTP request
    let accessToken = localStorage.getItem(ACCESS_TOKEN); //retrieve the access token from local storage
    let refreshToken = localStorage.getItem(REFRESH_TOKEN); //retreive the refresh token from local storage
    if (refreshToken && isTokenExpired(refreshToken)) { //if there is a refresh token and the refresh token is expired
      handleRefreshTokenExpired(); //handle this case
      return Promise.reject("Refresh token expired, user logged out."); //reject the request and add the message
    }

    if (accessToken && isTokenExpired(accessToken)) { //if access token exists but is expired
      accessToken = await refreshAccessToken();  //request a new access token
    }

    if (accessToken) { //if the access token exists
      config.headers.Authorization = `Bearer ${accessToken}`; //set the authorisation header to include the access token -- as a way to stamp that the request is valid and can go through

    }
    return config; //return the modified configuration
  },
  (error) => { //on error
    return Promise.reject(error); //reject the promise
  }
);

export default api;
