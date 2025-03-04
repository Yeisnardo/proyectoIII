// src/components/Header.js
import React, { useState } from "react";
import { FaBell, FaUser } from "react-icons/fa"; // Importa los íconos necesarios
import "../assets/styles/App.css";

const Header = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="header">
      <h1></h1>
      <div className="header-icons">
        <div className="notification-icon">
          <FaBell aria-hidden="true" />
        </div>
        <div className="profile" onClick={toggleDropdown}>
          <div className="profile-icon">
            <FaUser aria-hidden="true" />
          </div>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <ul>
                <li>
                  <a href="/change-password">Cambiar Contraseña</a>
                </li>
                <li>
                  <a href="/">Cerrar Sesión</a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
