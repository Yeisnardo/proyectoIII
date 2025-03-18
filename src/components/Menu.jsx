import React from "react";
import { FaHome, FaUser , FaUsers, FaExchangeAlt, FaClipboardCheck, FaPlusCircle, FaFileContract, FaMoneyBillWave, FaBars, FaTimes, FaBuilding } from "react-icons/fa"; // Cambia FaBank por FaBuilding
import { NavLink } from "react-router-dom";
import "../assets/styles/App.css";
import logo from "../assets/images/logo.jpg";

const NavigationMenu = ({ isMenuVisible, toggleMenu }) => {
  return (
    <div className="menu-container">
      <nav className={`menu ${isMenuVisible ? "visible" : "hidden"}`}>
        <div className="menu-header">
          <img src={logo} alt="Logo IFEMI" className="menu-logo" />
        </div>
        <h2 className="menu-menu">Menu</h2>

        <ul>
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaHome className="menu-icon" /> Inicio
            </NavLink>
          </li>
          <li>
            <NavLink to="/persona" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaUser  className="menu-icon" /> Gestión de Persona
            </NavLink>
          </li>
          <li>
            <NavLink to="/usuario" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaUsers className="menu-icon" /> Gestión de Usuario
            </NavLink>
          </li>
          <li>
            <NavLink to="/al-cambio" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaExchangeAlt className="menu-icon" /> Precio de Divisa
            </NavLink>
          </li>
          <li>
            <NavLink to="/cuentas" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaBuilding className="menu-icon" /> Cuentas Bancarias {/* Cambia el ícono aquí */}
            </NavLink>
          </li>
          <li>
            <NavLink to="/formalizacion-emprendimiento" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaClipboardCheck className="menu-icon" /> Formalización de Emprendimiento
            </NavLink>
          </li>
          <li>
            <NavLink to="/nuevo-emprendimiento" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaPlusCircle className="menu-icon" /> Nuevo Emprendimiento
            </NavLink>
          </li>
          <li>
            <NavLink to="/contrato" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaFileContract className="menu-icon" /> Gestión de Contrato
            </NavLink>
          </li>
          <li>
            <NavLink to="/amortizacion" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaMoneyBillWave className="menu-icon" /> Gestion de Amortización
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
        {isMenuVisible ? <FaTimes className="menu-icon" /> : <FaBars className="menu-icon" />}
      </button>
    </div>
  );
};

export default NavigationMenu;