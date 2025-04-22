import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../App";
import "../styles/Login.css";
const Login = () => {
  const { setRole } = useRole();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError(""); // Clear any previous errors

    // **Replace with your actual authentication logic**
    if (username === "admin" && password === "admin") {
      setRole("admin");
      navigate("/");
    } else if (username === "receptionist" && password === "receptionist") {
      setRole("receptionist");
      navigate("/patients");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;