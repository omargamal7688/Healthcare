import React from "react";
import { useRole } from "../App";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { setRole } = useRole();
  const navigate = useNavigate();

  const handleLogin = (selectedRole) => {
    setRole(selectedRole);
    navigate(selectedRole === "admin" ? "/" : "/patients");
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <button onClick={() => handleLogin("admin")}>Login as Admin</button>
      <button onClick={() => handleLogin("receptionist")}>Login as Receptionist</button>
    </div>
  );
};

export default Login;
