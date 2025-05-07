import React, { useState, useEffect } from "react"; // Importar useEffect
import { useNavigate, Link } from "react-router-dom";
import "../assets/styles/App.css";
import { FaUser, FaEnvelope, FaLock, FaIdCard } from "react-icons/fa";
import logo from "../assets/images/ifemi.jpg";
import Modal from "../components/Modal";

const Register = () => {
  const [cedula, setCedula] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccessModal, setIsSuccessModal] = useState(false);

  const navigate = useNavigate();

  // Efecto para manejar el cierre automático y la navegación del modal de éxito
  useEffect(() => {
    let timer;
    if (showModal && isSuccessModal) {
      timer = setTimeout(() => {
        handleCloseModal(); // Cierra el modal y navega
      }, 3000); // 3000 milisegundos = 3 segundos
    }

    // Limpieza del timer al desmontar el componente o si las condiciones cambian
    // La navegación ocurrirá dentro de handleCloseModal si isSuccessModal es true
    return () => clearTimeout(timer);
  }, [showModal, isSuccessModal, navigate]); // Dependencias del efecto

  const handleCloseModal = () => {
    setShowModal(false);
    setModalMessage("");
    // La navegación solo ocurre si era un modal de éxito (manejado por useEffect que llama a esta función)
    // No necesitamos el if(isSuccessModal) aquí porque useEffect ya lo verificó antes de llamar a esta función
    setIsSuccessModal(false); // Resetear el estado después de cerrar

    // Navegar a la página de inicio de sesión después de cerrar el modal de éxito
    if (isSuccessModal) { // Añadimos una verificación extra aquí para mayor claridad, aunque el useEffect ya lo garantiza
        navigate("/registro2"); // Redirige a la página de inicio de sesión
    }
  };

  const showModalWithMessage = (message, isSuccess = false) => {
    setModalMessage(message);
    setIsSuccessModal(isSuccess);
    setShowModal(true);
  };

  const handleCedulaChange = (e) => {
    const value = e.target.value;
    const regex = /^[0-9]*$/;
    if (regex.test(value)) {
      setCedula(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!cedula || !fullName || !username || !email || !password || !confirmPassword) {
        showModalWithMessage("Por favor, completa todos los campos.");
        return;
      }

    if (cedula.length < 5) {
      showModalWithMessage("La Cédula de Identidad debe tener al menos 5 dígitos.");
      return;
    }

    const cedulaRegex = /^[0-9]+$/;
    if (!cedulaRegex.test(cedula)) {
        showModalWithMessage("La Cédula de Identidad solo debe contener números.");
        return;
    }

    if (fullName.length < 5) {
      showModalWithMessage("El Nombre y Apellido debe tener al menos 5 caracteres.");
      return;
    }

    if (username.length < 3) {
      showModalWithMessage("El nombre de usuario debe tener al menos 3 caracteres.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showModalWithMessage("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    if (password.length < 5) {
      showModalWithMessage("La contraseña debe tener al menos 5 caracteres.");
      return;
      }

    if (password !== confirmPassword) {
      showModalWithMessage("Las contraseñas no coinciden.");
      return;
    }

    // Si todas las validaciones pasan
    console.log("Registro Data:", {
      cedula,
      fullName,
      username,
      email,
      password,
    });

    // Mostrar el modal de éxito
    showModalWithMessage("Usuario creado con exito. Ahora proceda completar los siguientes formularios.", true);

    // La navegación automática a "/" se maneja en el useEffect después de 3 segundos,
    // llamando a handleCloseModal, que a su vez llama a navigate.
  };

  return (
    <div className="login-page-container">
      <div className="logo-page-container">
        <img src={logo} alt="Institution Logo" className="institution-logo" />
      </div>
      <div className="auth-container-wrapper">
        <div className="registration-form-box">
          <form className="auth-form" onSubmit={handleSubmit}>
            <h2>Registrarse</h2>
            {/* Cédula */}
            <div className="input-group input-col-12">
              <label htmlFor="reg-cedula">Cédula de Identidad:</label>
              <div className="input-wrapper">
                <FaIdCard className="icon" />
                <input
                  type="text"
                  id="reg-cedula"
                  name="cedula"
                  value={cedula}
                  onChange={handleCedulaChange}
                  placeholder="Ingresa tu Cédula de Identidad"
                  autoComplete="off"
                  inputMode="numeric"
                  pattern="\d*"
                />
              </div>
            </div>
            {/* Nombre y Apellido */}
            <div className="input-group input-col-12">
              <label htmlFor="reg-fullName">Nombre y Apellido:</label>
              <div className="input-wrapper">
                <FaUser className="icon" />
                <input
                  type="text"
                  id="reg-fullName"
                  name="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ingresa tu Nombre y Apellido"
                  autoComplete="off"
                />
              </div>
            </div>
            {/* Usuario */}
            <div className="input-group input-col-12">
              <label htmlFor="reg-username">Usuario:</label>
              <div className="input-wrapper">
                <FaUser className="icon" />
                <input
                  type="text"
                  id="reg-username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Elige un nombre de usuario"
                  autoComplete="off"
                />
              </div>
            </div>
            {/* Email */}
            <div className="input-group input-col-12">
              <label htmlFor="reg-email">Correo Electrónico:</label>
              <div className="input-wrapper">
                <FaEnvelope className="icon" />
                <input
                  type="email"
                  id="reg-email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresa tu correo electrónico"
                  autoComplete="off"
                />
              </div>
            </div>
            {/* Contraseña */}
            <div className="input-group password-group">
              <div className="input-col-12">
                <label htmlFor="reg-password">Contraseña:</label>
                <div className="input-wrapper">
                  <FaLock className="icon" />
                  <input
                    type="password"
                    id="reg-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Crea una contraseña"
                  />
                </div>
              </div>
              {/* Confirmar Contraseña */}
              <div className="input-col-12">
                <label htmlFor="confirm-password">Confirmar Contraseña:</label>
                <div className="input-wrapper">
                  <FaLock className="icon" />
                  <input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirma tu contraseña"
                  />
                </div>
              </div>
            </div>
            <button type="submit" className="submit-button">
              Registrarse
            </button>
            <div className="register-link-container">
              <p>
                ¿Ya tienes una cuenta? <Link to="/">Inicia Sesión aquí</Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={handleCloseModal}>
        <p>{modalMessage}</p>
      </Modal>
    </div>
  );
};

export default Register;