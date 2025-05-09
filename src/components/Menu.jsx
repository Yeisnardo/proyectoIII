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
  FaUniversity, // reemplazamos FaBank por FaUniversity
} from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import "../assets/styles/App.css";
import logo from "../assets/images/logo.jpg";

const NavigationMenu = ({ isMenuVisible, toggleMenu }) => {
  // Estados para manejar submenus
  const [isEmprendedorOpen, setEmprendedorOpen] = useState(false);
  const [isFormalizacionOpen, setFormalizacionOpen] = useState(false);
  
  // Estado para determinar la sección activa, si se requiere
  const [activeSection, setActiveSection] = useState(null);
  
  const location = useLocation();

  // Funciones para toggle de submenus
  const toggleEmprendedorMenu = () => {
    setEmprendedorOpen(!isEmprendedorOpen);
  };

  const toggleFormalizacionMenu = () => {
    setFormalizacionOpen(!isFormalizacionOpen);
  };

  // Effect para abrir automáticamente los submenus según la ruta
  useEffect(() => {
    const formalizacionPaths = [
      "/ubicacion-actividad-emprendedora",
      "/cadena-productiva",
      "/situacion-operativa",
    ];
    setFormalizacionOpen(formalizacionPaths.includes(location.pathname));

    const emprendedorPaths = [
      "/requerimientos",
      "/perfil-financiero",
    ];
    setEmprendedorOpen(emprendedorPaths.includes(location.pathname));
  }, [location.pathname]);

  return (
    <div className="menu-container">
      {/* Menú lateral */}
      <nav className={`menu ${isMenuVisible ? "visible" : "hidden"}`}>
        {/* Logo */}
        <div className="menu-header">
          <img src={logo} alt="Logo Institucional" className="menu-logo" />
        </div>
        <h2 className="menu-title">Menú Principal</h2>
        <ul>
          {/* Página de Inicio */}
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaHome className="menu-icon" /> Inicio
            </NavLink>
          </li>

          {/* Datos Personales y Perfil */}
          <li>
            <NavLink
              to="/Informacion_personal"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaUser className="menu-icon" /> Información Personal
            </NavLink>
          </li>
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

          <li>
            <NavLink
              to="/bancos"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaUniversity className="menu-icon" /> Banca
            </NavLink>
          </li>

          {/* Emprendimiento */}
          <li>
            <NavLink
              to="/ubicacion-actividad-emprendedora"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaUniversity className="menu-icon" /> Ubicación de Actividad Emprededora
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
              <FaUniversity className="menu-icon" /> Situacion Operativa
            </NavLink>
          </li>

          {/* Aciministrativo */}
          <li>
            <NavLink
              to="/administracion-persona"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaUser className="menu-icon" /> Administración de Usuarios
            </NavLink>
          </li>

          {/* Administración de Emprendedor (con submenu) */}
          <li>
            <button onClick={toggleEmprendedorMenu} className="dropdown-toggle">
              <FaUserTie className="menu-icon" /> Administración de Emprendedor
              {isEmprendedorOpen ? (
                <FaChevronUp className="arrow-icon" />
              ) : (
                <FaChevronDown className="arrow-icon" />
              )}
            </button>
            {isEmprendedorOpen && (
              <ul className="submenu">
                <li>
                  <NavLink
                    to="/requerimientos"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Registrar Requerimientos
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/perfil-financiero"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Perfil Financiero
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          {/* Gestión Emprendedora */}
          <li>
            <button onClick={toggleFormalizacionMenu} className="dropdown-toggle">
              <FaClipboardList className="menu-icon" /> Gestión Emprendedora
              {isFormalizacionOpen ? (
                <FaChevronUp className="arrow-icon" />
              ) : (
                <FaChevronDown className="arrow-icon" />
              )}
            </button>
            {isFormalizacionOpen && (
              <ul className="submenu">
                <li>
                  <NavLink
                    to="/ubicacion-actividad-emprendedora"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Ubicación de Actividad
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/cadena-productiva"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Cadena Productiva
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/situacion-operativa"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Situación Operativa
                  </NavLink>
                </li>
              </ul>
            )}
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
              to="/administracion-credito"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaMoneyCheckAlt className="menu-icon" /> Administración de Crédito
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/cambio-divisas"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaExchangeAlt className="menu-icon" /> Cotización Divisas
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/bancos"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaUniversity className="menu-icon" /> Banca y Cuentas
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

      {/* Botón para mostrar/ocultar menú */}
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