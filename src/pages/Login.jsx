import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/App.css";
import { FaUser, FaLock } from "react-icons/fa";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "password") {
      alert("Inicio de sesión exitoso");
      navigate("/dashboard");
    } else {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        <div className="input-group">
          <label htmlFor="username">Usuario:</label>
          <div className="input-container">
            <FaUser className="icon" />
            <input
              type="text"
              id="username"
              name="username" // Atributo name agregado
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Ingresa tu usuario"
            />
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="password">Contraseña:</label>
          <div className="input-container">
            <FaLock className="icon" />
            <input
              type="password"
              id="password"
              name="password" // Atributo name agregado
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Ingresa tu contraseña"
            />
          </div>
        </div>
        <button type="submit">Iniciar Sesión</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default Login;
