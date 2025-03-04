// src/pages/Dashboard.js
import React, { useState } from 'react';
import Header from '../components/Header';
import Menu from '../components/Menu';
import Footer from '../components/Footer';
import '../assets/styles/App.css';

const Dashboard = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(true); // Estado para controlar la visibilidad del menú

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible); // Alternar la visibilidad del menú
  };

  return (
    <div className={`dashboard-container ${isMenuVisible ? '' : 'menu-hidden'}`}>
      <Header />
      <Menu isMenuVisible={isMenuVisible} toggleMenu={toggleMenu} />
      <div className="dashboard-content">
        <h1 className="dashboard-title">Instituto Fortalecimiento Emprendedor del Municipio Independencia</h1>
        {/* Aquí puedes agregar más contenido del dashboard */}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;