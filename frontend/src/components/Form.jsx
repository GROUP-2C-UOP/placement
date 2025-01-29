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
        payload.remember_me = rememberMe
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
    <>
      <h1 className="form-title">Career Compass</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <h2 className="type">{typename}</h2>
        {method === "register" && (
          <input
            className="form-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            required
          />
        )}
        <input
          className="form-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          className="form-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button className="form-button" type="submit">
          {typename}
        </button>
        {method === "login" && (
          <>
          <div id="remember-checkbox">
            <label id="remember-label" htmlFor="rememberMe">Remember Me?</label>
          <input
            className="form-input"
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          </div>
          <div id="register-container">
          <p>Don't have an account?</p>
          <p className="clickable" onClick={() => navigate("/register")}><u>Register</u></p>
          </div>
          <div id="forgot-password">
          <p className="clickable" onClick={() => alert("TO BE DONE")} ><u>Forgot Password?</u></p>
          </div>
          </>
        )}
        <div className="edge"></div>
        <div className="shaper1"></div>
        <div className="shaper2"></div>
      </form>
    </>
  );
}

export default Form;
