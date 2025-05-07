import React, { useState, useEffect, useRef } from "react";
import { FaBell, FaUser, FaLock, FaSignOutAlt } from "react-icons/fa"; // Importa los íconos necesarios
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import "../assets/styles/App.css"; // Asegúrate de que los estilos estén importados

const Header = ({ userName, userType }) => {
  const navigate = useNavigate(); // Inicializa useNavigate

  // Estados para controlar la visibilidad de los dropdowns y el modal
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);

  // Referencias para los elementos DOM de los dropdowns
  const profileDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  // Estado de ejemplo para notificaciones (puedes reemplazarlo con datos reales)
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Nueva notificación 1" },
    { id: 2, message: "Nueva notificación 2" },
  ]);

  // Función para cerrar todos los dropdowns
  const closeAllDropdowns = () => {
    setProfileDropdownOpen(false);
    setNotificationDropdownOpen(false);
  };

  // Alternar la visibilidad del dropdown de perfil
  const toggleProfileDropdown = () => {
    // Cierra el otro dropdown si está abierto
    if (isNotificationDropdownOpen) {
      setNotificationDropdownOpen(false);
    }
    setProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Alternar la visibilidad del dropdown de notificaciones
  const toggleNotificationDropdown = () => {
    // Cierra el otro dropdown si está abierto
    if (isProfileDropdownOpen) {
      setProfileDropdownOpen(false);
    }
    setNotificationDropdownOpen(!isNotificationDropdownOpen);
  };

  // Manejar clic fuera de los dropdowns para cerrarlos
  const handleClickOutside = (event) => {
    if (
      profileDropdownRef.current &&
      !profileDropdownRef.current.contains(event.target) &&
      notificationDropdownRef.current &&
      !notificationDropdownRef.current.contains(event.target)
    ) {
      closeAllDropdowns();
    }
  };

  // Efecto para añadir y remover el event listener de clic
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileDropdownOpen, isNotificationDropdownOpen]); // Dependencias: solo re-ejecutar si cambian los estados de los dropdowns

  // Abrir el modal de confirmación de cierre de sesión
  const handleLogout = () => {
    closeAllDropdowns(); // Cierra los dropdowns antes de abrir el modal
    setLogoutModalOpen(true);
  };

  // Confirmar el cierre de sesión y redirigir
  const confirmLogout = () => {
    console.log("Cerrando sesión...");
    // Aquí puedes agregar la lógica de limpieza de sesión (localStorage, cookies, etc.)

    setLogoutModalOpen(false); // Cierra el modal
    navigate("/"); // Redirige a la página de inicio de sesión
  };

  // Renderizar el componente
  return (
    <header className="header">
      <div className="header-icons">
        {/* Icono y Dropdown de Notificaciones */}
        <div className="dropdown notification-icon" ref={notificationDropdownRef}>
          <FaBell
            aria-label="Notificaciones"
            onClick={toggleNotificationDropdown}
            aria-expanded={isNotificationDropdownOpen}
            cursor="pointer" // Añadir cursor pointer visualmente
          />
          {notifications.length > 0 && (
            <span className="notification-badge" aria-live="polite"> {/* aria-live para accesibilidad */}
              {notifications.length}
            </span>
          )}
          <div
            className={`dropdown-menu notification-menu ${
              isNotificationDropdownOpen ? "visible" : ""
            }`}
            aria-hidden={!isNotificationDropdownOpen} // Ocultar para lectores de pantalla si no es visible
          >
            <div className="notification-arrow" /> {/* Flecha */}
            <ul>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <li key={notification.id}>{notification.message}</li>
                ))
              ) : (
                <li>No hay notificaciones nuevas.</li> // Mensaje si no hay notificaciones
              )}
            </ul>
          </div>
        </div>

        {/* Icono y Dropdown de Perfil */}
        <div className="dropdown profile" ref={profileDropdownRef}>
          <div
            className="profile-icon"
            onClick={toggleProfileDropdown}
            aria-label="Menú de perfil de usuario"
            aria-expanded={isProfileDropdownOpen}
            cursor="pointer" // Añadir cursor pointer visualmente
          >
            <FaUser aria-hidden="true" />
          </div>
          <div
            className={`dropdown-menu ${isProfileDropdownOpen ? "visible" : ""}`}
            aria-hidden={!isProfileDropdownOpen} // Ocultar para lectores de pantalla si no es visible
          >
            {/* Información del Perfil */}
            <ul className="menu-list">
              <li className="menu-list-item profile-info">
                <div>
                  {/* Usar props para el nombre y tipo de usuario */}
                  <span className="user-name">{userName || "Usuario Desconocido"}</span>
                  <span className="user-type">{userType || "Tipo Desconocido"}</span>
                </div>
              </li>
              {/* Enlace a Configuración (Cambio de Contraseña) */}
              <li className="menu-list-item">
                 {/* Considerar usar Link de react-router-dom si es una navegación interna */}
                <a href="/change-password" onClick={closeAllDropdowns}> {/* Cierra dropdown al hacer clic */}
                  <FaLock className="menu-icon" aria-hidden="true" />
                  Configuración
                </a>
              </li>
              {/* Enlace para Cerrar Sesión */}
              <li className="menu-list-item" onClick={handleLogout} role="button" tabIndex="0"> {/* Hacer clickeable con teclado */}
                <FaSignOutAlt className="menu-icon" aria-hidden="true" />
                <span>Cerrar sesión</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal de confirmación de cierre de sesión */}
      {isLogoutModalOpen && (
        <div className="logout-modal" role="dialog" aria-modal="true" aria-labelledby="logout-modal-title">
          <div className="modal-content">
            <h2 id="logout-modal-title">Confirmar Cierre de Sesión</h2>
            <p>¿Estás seguro de que deseas cerrar sesión?</p>
            <div className="modal-actions">
              <button onClick={confirmLogout}>Sí, cerrar sesión</button>
              <button onClick={() => setLogoutModalOpen(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;