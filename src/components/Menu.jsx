// src/components/Menu.js
import React from "react";
import { FaHome, FaInfoCircle, FaUsers, FaBars, FaTimes } from "react-icons/fa"; // Importar íconos de react-icons
import "../assets/styles/App.css";

const Menu = ({ isMenuVisible, toggleMenu }) => { // Recibir las props
  return (
    <div className="menu-container">
      <button
        className={`menu-toggle ${isMenuVisible ? 'active' : ''}`}
        onClick={toggleMenu} // Usar la función pasada como prop
        style={{
          transform: isMenuVisible ? 'translateX(220px)' : 'translateX(0)', // Mover el botón junto con el menú
          transition: 'transform 0.3s ease', // Asegurar que la transición sea suave
        }}
      >
        {isMenuVisible ? <FaTimes /> : <FaBars />} {/* Ícono para mostrar/ocultar el menú */}
      </button>
      <nav className={`menu ${isMenuVisible ? 'visible' : 'hidden'}`}>
        <ul>
          <li>
            <a href="/dashboard"><FaHome /> Pagina Principal</a>
          </li>
          <li>
            <a href="/about"><FaInfoCircle /> Registro Persona</a>
          </li>
          <li>
            <a href="/users"><FaUsers /> Crear Usuario</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Menu;
