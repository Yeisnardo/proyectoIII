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
    setError(""); // Reset error message

    // Validaciones
    if (!username) {
      setError("Por favor, ingresa tu usuario.");
      return;
    }

    if (!password) {
      setError("Por favor, ingresa tu contraseña.");
      return;
    }

    if (username.length < 3) {
      setError("El nombre de usuario debe tener al menos 3 caracteres.");
      return;
    }

    if (password.length < 5) {
      setError("La contraseña debe tener al menos 5 caracteres.");
      return;
    }

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