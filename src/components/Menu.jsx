import React from "react";
import { IoPerson } from "react-icons/io5";
import { FaRegCircleUser  } from "react-icons/fa6";
import { FaHome, FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom"; // Importar NavLink
import "../assets/styles/App.css";
import logo from "../assets/images/logo.jpg";

const Menu = ({ isMenuVisible, toggleMenu }) => {
  return (
    <div className="menu-container">
      <nav className={`menu ${isMenuVisible ? "visible" : "hidden"}`}>
        <div className="menu-header">
          <img src={logo} alt="Logo IFEMI" className="menu-logo" />
        </div>
        <ul>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive ? "active" : "")} // Aplicar clase activa
            >
              <FaHome className="menu-icon" /> Pagina Principal
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/persona"
              className={({ isActive }) => (isActive ? "active" : "")} // Aplicar clase activa
            >
              <IoPerson className="menu-icon" /> Registro Persona
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/users"
              className={({ isActive }) => (isActive ? "active" : "")} // Aplicar clase activa
            >
              <FaRegCircleUser  className="menu-icon" /> Crear Usuario
            </NavLink>
          </li>
        </ul>
      </nav>
      <button
        className={`menu-toggle ${isMenuVisible ? "active" : ""}`}
        onClick={toggleMenu}
        style={{
          transform: isMenuVisible ? "translateX(220px)" : "translateX(0)",
          transition: "transform 0.3s ease",
        }}
      >
        {isMenuVisible ? (
          <FaTimes className="menu-icon" />
        ) : (
          <FaBars className="menu-icon" />
        )}
      </button>
    </div>
  );
};

export default Menu;