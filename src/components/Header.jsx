// src/components/Header.js
import React, { useState, useEffect, useRef } from "react";
import { FaBell, FaUser  } from "react-icons/fa"; // Importa los íconos necesarios
import "../assets/styles/App.css";

const Header = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
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
            <ul>
              <li>
                <a href="/change-password">Cambiar Contraseña</a>
              </li>
              <li>
                <a href="/">Cerrar Sesión</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;