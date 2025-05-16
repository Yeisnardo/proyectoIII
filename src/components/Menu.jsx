import React, { useState, useEffect, useContext } from "react";
import {
  FaHome,
  FaUser,
  FaExchangeAlt,
  FaMoneyBillWave,
  FaBars,
  FaTimes,
  FaClipboardList,
  FaStreetView,
  FaCheckCircle,
  FaMoneyCheckAlt,
  FaUniversity,
} from "react-icons/fa";
import { MenuContext } from '../contexts/MenuContext';
import { NavLink, useLocation } from "react-router-dom";
import "../assets/styles/App.css";

const NavigationMenu = ({ isMenuVisible, toggleMenu }) => {
  const { isMenuOpen, toggleMenu: toggleMenuContext } = useContext(MenuContext);
  const [isEmprendedorOpen, setEmprendedorOpen] = useState(false);
  const [isFormalizacionOpen, setFormalizacionOpen] = useState(false);

  const location = useLocation();

  const emprendedorPaths = ["/requerimientos", "/perfil-financiero"];
  const formalizacionPaths = [
    "/ubicacion-actividad-emprendedora",
    "/cadena-productiva",
    "/situacion-operativa",
  ];

  useEffect(() => {
    setEmprendedorOpen(emprendedorPaths.includes(location.pathname));
    setFormalizacionOpen(formalizacionPaths.includes(location.pathname));
  }, [location.pathname]);

  return (
    <div className="menu-container">
      <nav className={`menu ${isMenuOpen ? 'visible' : 'hidden'}`}>
        <ul>
          {/* Inicio */}
          <li>
            <NavLink to="/dashboard" end className={({ isActive }) => (isActive ? "active" : "")}>
              <span className="icon-text">
                <FaHome className="menu-icon" />
                <span className="link-text">Inicio</span>
              </span>
            </NavLink>
          </li>
          {/* Información Personal */}
          <li>
            <NavLink to="/Informacion_personal" className={({ isActive }) => (isActive ? "active" : "")}>
              <span className="icon-text">
                <FaUser className="menu-icon" />
                <span className="link-text">Información Personal</span>
              </span>
            </NavLink>
          </li>
          {/* Perfil Financiero */}
          <li>
            <NavLink to="/perfil-financiero" className={({ isActive }) => (isActive ? "active" : "")}>
              <span className="icon-text">
                <FaUser className="menu-icon" />
                <span className="link-text">Perfil Financiero</span>
              </span>
            </NavLink>
          </li>
          {/* Requerimientos */}
          <li>
            <NavLink to="/requerimientos" className={({ isActive }) => (isActive ? "active" : "")}>
              <span className="icon-text">
                <FaClipboardList className="menu-icon" />
                <span className="link-text">Requerimientos</span>
              </span>
            </NavLink>
          </li>
          {/* Banca */}
          <li>
            <NavLink to="/bancos" className={({ isActive }) => (isActive ? "active" : "")}>
              <span className="icon-text">
                <FaUniversity className="menu-icon" />
                <span className="link-text">Banca</span>
              </span>
            </NavLink>
          </li>
          {/* Ubicación de Actividad Emprendedora */}
          <li>
            <NavLink to="/ubicacion-actividad-emprendedora" className={({ isActive }) => (isActive ? "active" : "")}>
              <span className="icon-text">
                <FaUniversity className="menu-icon" />
                <span className="link-text">Ubicación de Actividad Emprendedora</span>
              </span>
            </NavLink>
          </li>
          {/* Cadena Productiva */}
          <li>
            <NavLink to="/cadena-productiva" className={({ isActive }) => (isActive ? "active" : "")}>
              <span className="icon-text">
                <FaUniversity className="menu-icon" />
                <span className="link-text">Cadena Productiva</span>
              </span>
            </NavLink>
          </li>
          {/* Situación Operativa */}
          <li>
            <NavLink to="/situacion-operativa" className={({ isActive }) => (isActive ? "active" : "")}>
              <span className="icon-text">
                <FaUniversity className="menu-icon" />
                <span className="link-text">Situación Operativa</span>
              </span>
            </NavLink>
          </li>
          {/* Solicitud de Crédito */}
          <li>
            <NavLink to="/amortizacion" className={({ isActive }) => (isActive ? "active" : "")}>
              <span className="icon-text">
                <FaMoneyBillWave className="menu-icon" />
                <span className="link-text">Solicitud de Crédito</span>
              </span>
            </NavLink>
          </li>
          {/* Amortización */}
          <li>
            <NavLink to="/amortizacion" className={({ isActive }) => (isActive ? "active" : "")}>
              <span className="icon-text">
                <FaMoneyBillWave className="menu-icon" />
                <span className="link-text">Amortización</span>
              </span>
            </NavLink>
          </li>
          {/* Administración de Persona */}
          <li>
            <NavLink to="/usuario" className={({ isActive }) => (isActive ? "active" : "")}>
              <span className="icon-text">
                <FaUser className="menu-icon" />
                <span className="link-text">Administración de Persona</span>
              </span>
            </NavLink>
          </li>
          {/* Administración de Usuario */}
          <li>
            <NavLink to="/usuario" className={({ isActive }) => (isActive ? "active" : "")}>
              <span className="icon-text">
                <FaUser className="menu-icon" />
                <span className="link-text">Administración de Usuario</span>
              </span>
            </NavLink>
          </li>
          {/* Buscar de Emprendedor */}
          <li>
            <NavLink to="/administracion-persona" className={({ isActive }) => (isActive ? "active" : "")}>
              <span className="icon-text">
                <FaUser className="menu-icon" />
                <span className="link-text">Buscar de Emprendedor</span>
              </span>
            </NavLink>
          </li>
          {/* Otros módulos */}
          <li>
            <NavLink to="/aprobacion-credito" className={({ isActive }) => (isActive ? "active" : "")}>
              <span className="icon-text">
                <FaCheckCircle className="menu-icon" />
                <span className="link-text">Aprobación de solicitud</span>
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/Credito" className={({ isActive }) => (isActive ? "active" : "")}>
              <span className="icon-text">
                <FaMoneyCheckAlt className="menu-icon" />
                <span className="link-text">Administración de Crédito</span>
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/ferias" className={({ isActive }) => (isActive ? "active" : "")}>
              <span className="icon-text">
                <FaStreetView className="menu-icon" />
                <span className="link-text">Ferias y Eventos</span>
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/AlCambio" className={({ isActive }) => (isActive ? "active" : "")}>
              <span className="icon-text">
                <FaExchangeAlt className="menu-icon" />
                <span className="link-text">Cotización Divisas</span>
              </span>
            </NavLink>
          </li>
        </ul>
      </nav>


    </div>
  );
};

export default NavigationMenu;