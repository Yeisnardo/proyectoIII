import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaUser,
  FaExchangeAlt,
  FaFileContract,
  FaMoneyBillWave,
  FaBars,
  FaTimes,
  FaChevronUp,
  FaChevronDown,
  FaUserTie,
  FaClipboardList,
  FaStreetView,
  FaCheckCircle,
  FaMoneyCheckAlt,
  FaUniversity,
} from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import "../assets/styles/App.css";
import logo from "../assets/images/logo.jpg";

const NavigationMenu = ({ isMenuVisible, toggleMenu }) => {
  // State to control submenu open/close
  const [isEmprendedorOpen, setEmprendedorOpen] = useState(false);
  const [isFormalizacionOpen, setFormalizacionOpen] = useState(false);

  const location = useLocation();

  // Determine if current path belongs to Emprendedor submenu items
  const emprendedorPaths = ["/requerimientos", "/perfil-financiero"];
  // Determine if current path belongs to Formalizacion submenu items
  const formalizacionPaths = [
    "/ubicacion-actividad-emprendedora",
    "/cadena-productiva",
    "/situacion-operativa",
  ];

  // Update submenu open states according to current route so menu stays open on active section
  useEffect(() => {
    if (emprendedorPaths.includes(location.pathname)) {
      setEmprendedorOpen(true);
    } else {
      setEmprendedorOpen(false);
    }
    if (formalizacionPaths.includes(location.pathname)) {
      setFormalizacionOpen(true);
    } else {
      setFormalizacionOpen(false);
    }
  }, [location.pathname]);

  // Toggle handlers to manually open/close submenu on click
  const toggleEmprendedorMenu = () => {
    setEmprendedorOpen((prev) => !prev);
  };

  const toggleFormalizacionMenu = () => {
    setFormalizacionOpen((prev) => !prev);
  };

  return (
    <div className="menu-container">
      <nav className={`menu ${isMenuVisible ? "visible" : "hidden"}`}>
        {/* Logo */}
        <div className="menu-header">
          <img src={logo} alt="Logo Institucional" className="menu-logo" />
        </div>
        <ul>
          {/* Main Items */}
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive ? "active" : "")}
              end
            >
              <FaHome className="menu-icon" /> Inicio
            </NavLink>
          </li>

          {/* Personal Info */}
          <li>
            <NavLink
              to="/Informacion_personal"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaUser className="menu-icon" /> Información Personal
            </NavLink>
          </li>

          {/* Emprendedor submenu items standalone visible in main list */}
          <li>
            <NavLink
              to="/perfil-financiero"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaUser className="menu-icon" /> Perfil Financiero
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/requerimientos"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaClipboardList className="menu-icon" /> Requerimientos
            </NavLink>
          </li>

          {/* Banks */}
          <li>
            <NavLink
              to="/bancos"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaUniversity className="menu-icon" /> Banca
            </NavLink>
          </li>

          {/* Emprendimiento / Formalizacion submenu items shown standalone */}
          <li>
            <NavLink
              to="/ubicacion-actividad-emprendedora"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaUniversity className="menu-icon" /> Ubicación de Actividad Emprendedora
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/cadena-productiva"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaUniversity className="menu-icon" /> Cadena Productiva
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/situacion-operativa"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaUniversity className="menu-icon" /> Situación Operativa
            </NavLink>
          </li>

          {/* Administración de Usuarios */}
          <li>
            <NavLink
              to="/administracion-persona"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaUser className="menu-icon" /> Administración de Usuarios
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/administracion-persona"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaUser className="menu-icon" /> Administración de Emprededor
            </NavLink>
          </li>


          {/* Otros módulos */}
          <li>
            <NavLink
              to="/ferias"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaStreetView className="menu-icon" /> Ferias y Eventos
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/aprobacion-credito"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaCheckCircle className="menu-icon" /> Aprobación de Crédito
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contrato"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaFileContract className="menu-icon" /> Contratos
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/Credito"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaMoneyCheckAlt className="menu-icon" /> Administración de Crédito
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/AlCambio"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaExchangeAlt className="menu-icon" /> Cotización Divisas
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/amortizacion"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaMoneyBillWave className="menu-icon" /> Amortizaciones
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Toggle button for mobile and small screens */}
      <button
        className={`menu-toggle ${isMenuVisible ? "active" : ""}`}
        onClick={toggleMenu}
        style={{
          transform: isMenuVisible ? "translateX(220px)" : "translateX(0)",
          transition: "transform 0.3s ease",
        }}
        aria-label="Toggle menu"
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

export default NavigationMenu;

