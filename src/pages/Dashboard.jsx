// src/pages/Dashboard.js
import React, { useState } from "react";
import Header from "../components/Header";
import Menu from "../components/Menu"; // Asegúrate de que este componente esté definido
import Footer from "../components/Footer";
import logo from "../assets/images/ifemi.jpg"; // Importa el logo
import "../assets/styles/App.css";

const Dashboard = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(true); // Estado para controlar la visibilidad del menú

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible); // Alternar la visibilidad del menú
  };

  return (
    <div className={`dashboard-container ${isMenuVisible ? "" : "menu-hidden"}`}>
      <Header />
      <Menu isMenuVisible={isMenuVisible} toggleMenu={toggleMenu} />
      <div className="dashboard-content">
        <br />
        <br />
        <br />
        <div className="logo-container">
          <img src={logo} alt="Logo de la Institución" className="institution-logo" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
