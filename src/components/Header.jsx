import React, { useState, useEffect, useRef } from "react";
import { FaBell, FaUser , FaLock, FaSignOutAlt } from "react-icons/fa"; // Importa los íconos necesarios
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import "../assets/styles/App.css";

const Header = () => {
  const navigate = useNavigate(); // Inicializa useNavigate
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false); // Nuevo estado para el modal de cierre de sesión
  const dropdownRef = useRef(null); // Referencia para el menú desplegable

  // Ejemplo de notificaciones
  const notifications = [
    { id: 1, message: "Tienes un nuevo mensaje." },
    { id: 2, message: "Tu perfil ha sido actualizado." },
    { id: 3, message: "Se ha programado una reunión para mañana." },
  ];

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleNotification = () => {
    setNotificationOpen(!isNotificationOpen);
  };

  // Cierra el menú desplegable si se hace clic fuera de él
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
      setNotificationOpen(false);
    }
  };

  useEffect(() => {
    // Agrega el evento de clic al documento
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Limpia el evento al desmontar el componente
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setLogoutModalOpen(true); // Abre el modal de confirmación de cierre de sesión
  };

  const confirmLogout = () => {
    // Aquí puedes agregar la lógica para cerrar sesión
    console.log("Cerrando sesión...");
    setLogoutModalOpen(false);
    // Redirigir al usuario a la página de inicio de sesión
    navigate("/"); // Cambia "/login" a la ruta que desees
  };

  return (
    <header className="header">
      <div className="header-icons">
        <div className="notification-icon" onClick={toggleNotification} aria-expanded={isNotificationOpen}>
          <FaBell aria-hidden="true" />
          {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
          <div className={`notification-menu ${isNotificationOpen ? "visible" : ""}`}>
            <div className="notification-arrow" />
            <ul>
              {notifications.map((notification) => (
                <li key={notification.id}>{notification.message}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="profile" onClick={toggleDropdown} ref={dropdownRef} aria-expanded={isDropdownOpen}>
          <div className="profile-icon">
            <FaUser  aria-hidden="true" />
          </div>
          <div className={`dropdown-menu ${isDropdownOpen ? "visible" : ""}`}>
            <div className="arrow" />
            <ul className="menu-list">
              <li className="menu-list-item">
                <FaLock className="menu-icon" />
                <a href="/change-password">Cambiar Contraseña</a>
              </li>
              <li className="menu-list-item" onClick={handleLogout}>
                <FaSignOutAlt className="menu-icon" />
                <span>Cerrar Sesión</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal de confirmación de cierre de sesión */}
      {isLogoutModalOpen && (
        <div className="logout-modal">
          <div className="modal-content">
            <h2>Confirmar Cierre de Sesión</h2>
            <p>¿Estás seguro de que deseas cerrar sesión?</p>
            <div className="modal-actions">
              <button onClick={confirmLogout}>Sí, cerrar sesión</button>
              <button onClick={() => setLogoutModalOpen(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;