import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";

function Form({ route, method }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const typename = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const payload = { email, password };
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
      console.error(error.response);
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="cont">
      <div id="login-container">
        <div id="title">
          <h2 id="welcomer">Welcome To</h2>
          <h1 id="namer"><img src="../src/assets/react.svg"></img>Career Compass</h1>
        </div>
        <form onSubmit={handleSubmit} className="form-container">
          <div id="credentials-container">
            {method === "register" && (
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
          </div>
          {method === "login" && (
            <div id="remember-me-button">
              <input
                id="chkbx"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />{" "}
              <label id="remember-label" htmlFor="chkbx">Remember Me</label>
            </div>
          )}
          <div id="but-cont">
            <button id={typename === "Login" ? "log-but" : "reg-but"} className="form-button" type="submit">
              {typename === "Login" ? "SIGN IN" : "REGISTER"}
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
        </form>
      </div>
      <div id="slash">
          <p>d</p>
        </div>
    </div>
  );
}

export default Form;
