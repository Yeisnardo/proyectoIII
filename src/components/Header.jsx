import React, { useState, useEffect, useRef } from "react";
import { FaBell, FaUser, FaLock, FaSignOutAlt } from "react-icons/fa"; // Importa los íconos necesarios
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import "../assets/styles/App.css"; // Asegúrate de que los estilos estén importados

const Header = ({ userName, userType }) => {
  const navigate = useNavigate();

  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);

  const profileDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  const [notifications, setNotifications] = useState([
    { id: 1, message: "Nueva notificación 1" },
    { id: 2, message: "Nueva notificación 2" },
  ]);

  // Funciones para cerrar todos los dropdowns
  const closeAllDropdowns = () => {
    setProfileDropdownOpen(false);
    setNotificationDropdownOpen(false);
  };

  const toggleProfileDropdown = () => {
    if (isNotificationDropdownOpen) {
      setNotificationDropdownOpen(false);
    }
    setProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleNotificationDropdown = () => {
    if (isProfileDropdownOpen) {
      setProfileDropdownOpen(false);
    }
    setNotificationDropdownOpen(!isNotificationDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (
      profileDropdownRef.current &&
      !profileDropdownRef.current.contains(event.target) &&
      notificationDropdownRef.current &&
      !notificationDropdownRef.current.contains(event.target)
    ) {
      closeAllDropdowns();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileDropdownOpen, isNotificationDropdownOpen]);

  const handleLogout = () => {
    closeAllDropdowns();
    setLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    console.log("Cerrando sesión...");
    setLogoutModalOpen(false);
    navigate("/");
  };

  return (
    <header className="header">
      {/* Aquí agregamos un menú adicional fuera del perfil */}
      <div className="extra-menu">
        {/* Puedes cambiar la ubicación y estilo según tu diseño */}
        <a href="/caracterización" className="extra-menu-item">
          Caracterización
        </a>
        <a href="/emprendimiento" className="extra-menu-item">
          Emprendimiento
        </a>
        <a href="/reportar-pagos" className="extra-menu-item">
          Reportar pagos
        </a>
      </div>

      <div className="header-icons">
        {/* Icono y Dropdown de Notificaciones */}
        <div className="dropdown notification-icon" ref={notificationDropdownRef}>
          <FaBell
            aria-label="Notificaciones"
            onClick={toggleNotificationDropdown}
            aria-expanded={isNotificationDropdownOpen}
            style={{ cursor: "pointer" }}
          />
          {notifications.length > 0 && (
            <span className="notification-badge" aria-live="polite">
              {notifications.length}
            </span>
          )}
          <div
            className={`dropdown-menu notification-menu ${
              isNotificationDropdownOpen ? "visible" : ""
            }`}
            aria-hidden={!isNotificationDropdownOpen}
          >
            <div className="notification-arrow" />
            <ul>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <li key={notification.id}>{notification.message}</li>
                ))
              ) : (
                <li>No hay notificaciones nuevas.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Icono y Dropdown de Perfil */}
        <div className="dropdown profile" ref={profileDropdownRef}>
          <div
            className="profile-icon"
            onClick={toggleProfileDropdown}
            aria-label="Menú de perfil de usuario"
            aria-expanded={isProfileDropdownOpen}
            style={{ cursor: "pointer" }}
          >
            <FaUser aria-hidden="true" />
          </div>
          <div
            className={`dropdown-menu ${isProfileDropdownOpen ? "visible" : ""}`}
            aria-hidden={!isProfileDropdownOpen}
          >
            {/* Información del Perfil */}
            <ul className="menu-list">
              <li className="menu-list-item profile-info">
                <div>
                  <span className="user-name">{userName || "Usuario Desconocido"}</span>
                  <span className="user-type">{userType || "Tipo Desconocido"}</span>
                </div>
              </li>
              {/* Opciones del perfil */}
              <li className="menu-list-item">
                <a href="/change-password" onClick={closeAllDropdowns}>
                  <FaLock className="menu-icon" aria-hidden="true" />
                  Configuración
                </a>
              </li>
              {/* Cerrar sesión */}
              <li
                className="menu-list-item"
                onClick={handleLogout}
                role="button"
                tabIndex="0"
              >
                <FaSignOutAlt className="menu-icon" aria-hidden="true" />
                <span>Cerrar sesión</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal de confirmación de cierre de sesión */}
      {isLogoutModalOpen && (
        <div
          className="logout-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-modal-title"
        >
          <div className="modal-content">
            <h2 id="logout-modal-title">Confirmar Cierre de Sesión</h2>
            <p>¿Estás seguro de que deseas cerrar sesión?</p>
            <div className="modal-actions">
              <button onClick={confirmLogout}>Sí, cerrar sesión</button>
              <button onClick={() => setLogoutModalOpen(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;