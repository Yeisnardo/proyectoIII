import React, { useState, useEffect, useRef, useContext } from "react";
import { FaBell, FaUser, FaLock, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa"; 
import { useNavigate, NavLink } from "react-router-dom"; 
import logo from "../assets/images/logo.jpg";
import { MenuContext } from '../contexts/MenuContext';
import "../assets/styles/App.css"; 

const Header = ({ userName, userType }) => {
  const navigate = useNavigate();
  const { isMenuOpen, toggleMenu } = useContext(MenuContext);

  // Estados para dropdowns y modales
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isCharacterizationOpen, setCharacterizationOpen] = useState(false);

  // Referencias para detectar clics fuera
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  // Estado de notificaciones
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Nueva notificación 1" },
    { id: 2, message: "Nueva notificación 2" },
  ]);

  // Funciones para manejar dropdowns
  const toggleProfileDropdown = () => {
    if (isNotificationDropdownOpen) setNotificationDropdownOpen(false);
    setProfileDropdownOpen(prev => !prev);
  };

  const toggleNotificationDropdown = () => {
    if (isProfileDropdownOpen) setProfileDropdownOpen(false);
    setNotificationDropdownOpen(prev => !prev);
  };

  // Cerrar todos los dropdowns
  const closeAllDropdowns = () => {
    setProfileDropdownOpen(false);
    setNotificationDropdownOpen(false);
  };

  // Detectar clics fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current && !profileRef.current.contains(event.target) &&
        notificationRef.current && !notificationRef.current.contains(event.target)
      ) {
        closeAllDropdowns();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Logout
  const handleLogout = () => {
    closeAllDropdowns();
    setLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    console.log("Cerrando sesión...");
    setLogoutModalOpen(false);
    navigate("/");
  };

  // Caracterización
  const handleCharacterizationClick = () => {
    setCharacterizationOpen(prev => !prev);
  };

  return (
    <header className="header">
      {/* Logo y título */}
      <div className="menu-header">
        <img src={logo} alt="Logo Institucional" className="menu-logo" />
        <span className="logo-text">IFEMI</span>
      </div>

{/* Div contenedor para mover el botón */}
<div className="menu-toggle-container">
  {/* Botón para toggle de menú */}
<div
  onClick={toggleMenu}
  role="button"
  tabIndex={0}
  aria-label="Toggle menu"
  style={{ display: 'inline-block', cursor: 'pointer' }}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
  }}
>
  {isMenuOpen ? <FaTimes /> : <FaBars />}
</div>
</div>

      {/* Enlaces adicionales */}
      <div className="extra-menu">

        <a
          href="#"
          className="extra-menu-item"
          onClick={(e) => {
            e.preventDefault();
            handleCharacterizationClick();
          }}
        >
          Caracterización
        </a>
        <a href="/emprendimiento" className="extra-menu-item">
          Emprendimiento
        </a>
        <a href="/reportar-pagos" className="extra-menu-item">
          Creditos
        </a>
      </div>

      {/* Iconos de notificaciones y perfil */}
      <div className="header-icons">
        {/* Notificaciones */}
        <div className="dropdown notification-icon" ref={notificationRef}>
          <FaBell
            aria-label="Notificaciones"
            onClick={toggleNotificationDropdown}
            aria-expanded={isNotificationDropdownOpen}
            tabIndex={0}
            role="button"
          />
          {notifications.length > 0 && (
            <span className="notification-badge" aria-live="polite">
              {notifications.length}
            </span>
          )}
          {/* Lista de notificaciones */}
          <div
            className={`dropdown-menu notification-menu ${isNotificationDropdownOpen ? "visible" : ""}`}
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

        {/* Perfil */}
        <div className="dropdown profile" ref={profileRef}>
          <div
            className="profile-icon"
            onClick={toggleProfileDropdown}
            aria-label="Menú de perfil de usuario"
            aria-expanded={isProfileDropdownOpen}
            tabIndex={0}
            role="button"
          >
            <FaUser />
          </div>
          {/* Menú desplegable de perfil */}
          <div
            className={`dropdown-menu ${isProfileDropdownOpen ? "visible" : ""}`}
            aria-hidden={!isProfileDropdownOpen}
          >
            <ul className="menu-list">
              <li className="profile-info">
                <div>
                  <span className="user-name">{userName || "Usuario Desconocido"}</span>
                  <br />
                  <span className="user-type">{userType || "Tipo Desconocido"}</span>
                </div>
              </li>
              <li>
                <a href="/change-password" onClick={closeAllDropdowns}>
                  <FaLock /> Configuración
                </a>
              </li>
              <li role="button" tabIndex={0} onClick={handleLogout}>
                <FaSignOutAlt /> Cerrar sesión
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal de confirmación para logout */}
      {isLogoutModalOpen && (
        <div className="logout-modal" role="dialog" aria-modal="true" aria-labelledby="logout-modal-title">
          <div className="modal-content">
            <h2 id="logout-modal-title">Confirmar Cierre de Sesión</h2>
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