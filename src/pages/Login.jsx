import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../assets/styles/App.css"; // Estilos principales de login
// import "../assets/styles/Modal.css"; // Importa Modal.css si lo creaste separado
import { FaUser, FaLock } from "react-icons/fa";
import logo from "../assets/images/ifemi.jpg";
import Modal from "../components/Modal"; // Importa el componente Modal

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Eliminamos el estado 'error' que renderizaba en línea
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
  const [modalMessage, setModalMessage] = useState(""); // Estado para el mensaje del modal

  const navigate = useNavigate();

  const handleCloseModal = () => {
    setShowModal(false);
    setModalMessage("");
  };

  const showModalWithMessage = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // No necesitamos resetear el error aquí si usamos modal

    // Validaciones - Usar showModalWithMessage en lugar de setError o alert
    if (!username) {
      showModalWithMessage("Por favor, ingresa tu usuario.");
      return;
    }

    if (!password) {
      showModalWithMessage("Por favor, ingresa tu contraseña.");
      return;
    }

    if (username.length < 3) {
      showModalWithMessage("El nombre de usuario debe tener al menos 3 caracteres.");
      return;
    }

    if (password.length < 5) {
      showModalWithMessage("La contraseña debe tener al menos 5 caracteres.");
      return;
    }

    // Simulación de inicio de sesión exitoso
    if (username === "admin" && password === "12345") {
      // Para el éxito, puedes mantener un alert simple o usar otro tipo de notificación
      alert("Inicio de sesión exitoso");
      navigate("/dashboard"); // Redirige al dashboard
    } else {
      showModalWithMessage("Credenciales incorrectas."); // Mostrar error en el modal
    }
  };

  return (
    <div className="login-layout-container">
      <div className="logo-container">
        <img src={logo} alt="Institution Logo" className="institution-logo" />
      </div>
      <div className="auth-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Iniciar Sesión</h2>
          <div className="input-group">
            <label htmlFor="username">Usuario:</label>
            <div className="input-wrapper">
              <FaUser className="icon" />
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                autoComplete="off"
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
                autoComplete="off"
              />
            </div>
          </div>
          <button type="submit" className="submit-button">Iniciar Sesión</button>
          {/* Eliminamos la renderización del mensaje de error en línea */}
          {/* {error && <div className="error-message">{error}</div>} */}

          <div className="register-link-container">
            <p>¿No tienes una cuenta? <Link to="/registro2">Regístrate aquí</Link></p>
          </div>

        </form>
      </div>

      {/* Renderiza el componente Modal */}
      <Modal
        isOpen={showModal} // Usamos isOpen en lugar de show
        onClose={handleCloseModal}
      >
        {/* El mensaje de error va como children */}
        <p>{modalMessage}</p>
      </Modal>

    </div>
  );
};

export default Login;