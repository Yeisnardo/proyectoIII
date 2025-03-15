import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/App.css";
import { FaUser , FaLock } from "react-icons/fa";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "12345") {
      alert("Inicio de sesión exitoso");
      navigate("/dashboard");
    } else {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        <div className="input-group">
          <label htmlFor="username">Usuario:</label>
          <div className="input-wrapper">
            <FaUser  className="icon" />
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Ingresa tu usuario"
            />
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="password">Contraseña:</label>
          <div className="input-wrapper">
            <FaLock className="icon" />
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Ingresa tu contraseña"
            />
          </div>
        </div>
        <button type="submit" className="submit-button">Iniciar Sesión</button>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default Login;