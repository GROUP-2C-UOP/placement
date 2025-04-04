import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import ErrorMessage from "./Error";
import "../styles/Form.css";

function Form({ route, method }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showError, setShowError] = useState( {hasError: false, detail: ""} );
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const navigate = useNavigate();

  const typename = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = { email, password };
      if (method === "register") {
        if (!verificationSent) {
          // if verification code hasnt been sent then trigger the send code view via the url
          setLoading(true);
          await api.post("/api/user/register/verification/", { email });
          setVerificationSent(true);
          setLoading(false);
          return;
        }

        payload.verification_code = verificationCode;
      }

      if (method === "register") {
        const nameParts = name.split(" ");
        payload.first_name = nameParts[0];
        payload.last_name = nameParts.slice(1).join(" ");
      }

      if (method === "login") {
        payload.remember_me = rememberMe;
      }

      const res = await api.post(route, payload);
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      if (error.response.data.detail === "incorrect") {
        setShowError( {hasError: true, detail: "The verification code is incorrect."})
      }
      else if (error.response.data.detail === "expired") {
        setShowError( {hasError: true, detail: "The verification code has expired."})
      }
      else if (error.response.data.detail === "exists") {
        setShowError( {hasError: true, detail: "This email already has an account."})
      }
      else if (error.response.data.detail === "No active account found with the given credentials") {
        setShowError( {hasError: true, detail: "Incorrect Credentials."})
      }
      setLoading(false);
    }
  };

  return (
    <div id="cont">
      <div id="login-container">
        <div id="title">
          <h2 id="welcomer">Welcome To</h2>
          <h1 id="namer">
            <img src="../src/assets/react.svg" alt="Career Compass" />
            Career Compass
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="form-container">
          <div id="credentials-container">
            {method === "register" && !verificationSent && (
              <>
                <label htmlFor="name">Full Name</label>
                <input
                  className="form-input"
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </>
            )}
  
            {!verificationSent && (
              <>
                <label htmlFor="email">Email</label>
                <input
                  className="form-input"
                  id="email-input"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="password">Password</label>
                <input
                  className="form-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </>
            )}
  
            {method === "register" && verificationSent && (
              <div id="verification-input">
                <label htmlFor="verificationCode">Verification Code</label>
                <input
                  className="form-input"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
                <div id="reg-container-input">
              <p className="clickable" onClick={() => setVerificationSent(false)}>
                <u>Go Back?</u>
              </p>
            </div>
              </div>
            )}
          </div>
  
          {method === "login" && (
            <div id="remember-me-button">
              <input
                id="chkbx"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label id="remember-label" htmlFor="chkbx">
                Remember Me
              </label>
            </div>
          )}
  
          <div id="but-cont">
            <button
              id={typename === "Login" ? "log-but" : "reg-but"}
              className="form-button"
              type="submit"
            >
              {loading ? (
                <div className="spinner"></div> 
              ) : typename === "Login" ? (
                "SIGN IN"
              ) : (
                "REGISTER"
              )}
            </button>
          </div>
  
          {method === "login" && (
            <div id="reg-container">
              <p>Don't have an account?</p>
              <p className="clickable" onClick={() => navigate("/register")}>
                <u>Register</u>
              </p>
            </div>
          )}
          {method === "register" && !verificationSent && (
            <div id="reg-container">
              <p>Have an account?</p>
              <p className="clickable" onClick={() => navigate("/login")}>
                <u>Login</u>
              </p>
            </div>
          )}
        </form>
      </div>
      <div id="slash"></div>
      {showError.hasError && (
        <ErrorMessage
          message={showError.detail}
          setShowError={setShowError}
        />
      )}
    </div>
  );
  
}

export default Form;
