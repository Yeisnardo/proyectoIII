import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaUser ,
  FaUsers,
  FaExchangeAlt,
  FaClipboardCheck,
  FaPlusCircle,
  FaFileContract,
  FaMoneyBillWave,
  FaBars,
  FaTimes,
  FaBuilding,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import "../assets/styles/App.css";
import logo from "../assets/images/logo.jpg";

const NavigationMenu = ({ isMenuVisible, toggleMenu }) => {
  const [isEmprendedorOpen, setEmprendedorOpen] = useState(false);
  const [isFormalizacionOpen, setFormalizacionOpen] = useState(false);
  const location = useLocation();

  const toggleEmprendedorMenu = () => {
    setEmprendedorOpen(!isEmprendedorOpen);
  };

  const toggleFormalizacionMenu = () => {
    setFormalizacionOpen(!isFormalizacionOpen);
  };

  useEffect(() => {
    // Verifica si la ruta actual corresponde a uno de los submenús de formalización
    const formalizacionPaths = [
      "/UbicacionActivEmprende",
      "/cadena-productiva",
      "/situacion-operativa",
    ];
    setFormalizacionOpen(formalizacionPaths.includes(location.pathname));

    // Verifica si la ruta actual corresponde a uno de los submenús de emprendedor
    const emprendedorPaths = [
      "/requerimientos",
      "/perfil-financiero",
    ];
    setEmprendedorOpen(emprendedorPaths.includes(location.pathname));
  }, [location.pathname]);

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
            <button onClick={toggleEmprendedorMenu} className="dropdown-toggle">
              <FaPlusCircle className="menu-icon" /> G. de Emprendedor
              {isEmprendedorOpen ? <FaChevronUp className="arrow-icon" /> : <FaChevronDown className="arrow-icon" />}
            </button>
            {isEmprendedorOpen && (
              <ul className="submenu">
                <li>
                  <NavLink to="/requerimientos" className={({ isActive }) => (isActive ? "active" : "")}>
                    Registro de Requerimientos
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/perfil-financiero" className={({ isActive }) => (isActive ? "active" : "")}>
                    Perfil Financiero
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
          <li>
            <button onClick={toggleFormalizacionMenu} className="dropdown-toggle">
              <FaClipboardCheck className="menu-icon" /> G. de Emprendimiento
              {isFormalizacionOpen ? <FaChevronUp className="arrow-icon" /> : <FaChevronDown className="arrow-icon" />}
            </button>
            {isFormalizacionOpen && (
              <ul className="submenu">
                <li>
                  <NavLink to="/UbicacionActivEmprende" className={({ isActive }) => (isActive ? "active" : "")}>
                    Ubicación de Actividad Emprendedora
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/cadena-productiva" className={({ isActive }) => (isActive ? "active" : "")}>
                    Cadena Productiva
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/situacion-operativa" className={({ isActive }) => (isActive ? "active" : "")}>
                    Situación Operativa
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
          <li>
            <NavLink to="/ferias" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaUsers className="menu-icon" /> Gestión de Ferias
            </NavLink>
          </li>
          <li>
            <NavLink to="/aprobacion" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaFileContract className="menu-icon" /> Aprobar de Credito
            </NavLink>
          </li>
          <li>
            <NavLink to="/contrato" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaFileContract className="menu-icon" /> Gestión de Contrato
            </NavLink>
          </li>
          <li>
            <NavLink to="/credito" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaBuilding className="menu-icon" /> Gestión de Crédito
            </NavLink>
          </li>
          <li>
            <NavLink to="/al-cambio" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaExchangeAlt className="menu-icon" /> Precio de Divisa
            </NavLink>
          </li>
          <li>
            <NavLink to="/amortizacion" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaMoneyBillWave className="menu-icon" /> Gestión de Pago o Amortización
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