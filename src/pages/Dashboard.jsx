// src/pages/Dashboard.js
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Menu from "../components/Menu"; // Asegúrate de que este componente esté definido
import Footer from "../components/Footer";
import logo from "../assets/images/ifemi.jpg"; // Importa el logo
import "../assets/styles/App.css";

// Define el mismo breakpoint que usaste en NavigationMenu y tu CSS
const SMALL_SCREEN_BREAKPOINT = 600;

const Dashboard = () => {
  // Inicializa isMenuVisible basado en el tamaño de la pantalla al cargar
  const [isMenuVisible, setIsMenuVisible] = useState(
    window.innerWidth > SMALL_SCREEN_BREAKPOINT
  );

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible); // Alternar la visibilidad del menú
  };

  // Efecto para manejar el tamaño de la pantalla y la visibilidad del menú
  useEffect(() => {
    const handleResize = () => {
      const isCurrentlySmall = window.innerWidth <= SMALL_SCREEN_BREAKPOINT;

      // Si la pantalla se vuelve pequeña Y el menú está visible, ocúltalo
      if (isCurrentlySmall && isMenuVisible) {
        setIsMenuVisible(false);
      }
       // Si la pantalla se vuelve grande y el menú está oculto, muéstralo
      else if (!isCurrentlySmall && !isMenuVisible) {
         setIsMenuVisible(true);
      }
    };

    window.addEventListener("resize", handleResize);

    // Limpieza
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMenuVisible]); // Agregamos isMenuVisible como dependencia

  // --- Aquí podrías añadir lógica para cargar datos reales ---
  // Por ahora, usaremos datos de ejemplo
  const dashboardStats = {
    totalUsuarios: 7,
    totalEmprendedores: 100,
    creditosAprobados: "100",
  };


  // --- Fin de la lógica de datos ---


  return (
    <div
      className={`dashboard-container ${isMenuVisible ? "" : "menu-hidden"}`}
    >
      <Header />
      {/* Pasamos isMenuVisible y toggleMenu al componente de menú */}
      <Menu isMenuVisible={isMenuVisible} toggleMenu={toggleMenu} />

      <div className="dashboard-content">
        {/* Mantenemos el logo y los br's */}
        <br />
        <div className="app-header-logo-container">
          <img
            src={logo}
            alt="Logo de la Institución"
            className="app-header-institution-logo"
          />
        </div>


        <h2>Resumen General</h2>
        <div className="kpi-cards-container">
          <div className="kpi-card">
            <h3>Usuarios Totales</h3>
            <p className="kpi-value">{dashboardStats.totalUsuarios}</p>
          </div>
          <div className="kpi-card">
            <h3>Emprendedores</h3>
            <p className="kpi-value">{dashboardStats.totalEmprendedores}</p>
          </div>
          <div className="kpi-card">
            <h3>Créditos Aprobados</h3>
            <p className="kpi-value">{dashboardStats.creditosAprobados}</p>
          </div>
          {/* Puedes añadir más tarjetas aquí */}
        </div>

        {/* --- Aquí puedes añadir más secciones de contenido --- */}
        {/* Por ejemplo, Próximas Ferias, Accesos Rápidos, etc. */}

        {/* <div className="upcoming-fairs">
          <h3>Próximas Ferias</h3>
          <p>Feria de Verano - 15/07/2024</p>
          <p>Mercado Navideño - 01/12/2024</p>
        </div> */}

        {/* <div className="quick-actions">
          <h3>Acciones Rápidas</h3>
          <button>Registrar Persona</button>
          <button>Aprobar Créditos</button>
        </div> */}

      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;