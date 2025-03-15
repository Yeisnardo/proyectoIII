// src/pages/Cambio.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Menu from "../components/Menu"; 
import Footer from "../components/Footer";
import logo from "../assets/images/ifemi.jpg"; 
import "../assets/styles/App.css";

const Cambio = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [exchangeRates, setExchangeRates] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        // Obtener tasas de cambio de la API
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        const data = await response.json();
        console.log("Tasas de cambio:", data); // Verifica la respuesta de la API

        // Obtener el dólar paralelo
        const paraleloResponse = await fetch("https://ve.dolarapi.com/v1/dolares/paralelo");
        const paraleloData = await paraleloResponse.json();
        console.log("Dólar paralelo:", paraleloData); // Verifica la respuesta de la API

        // Obtener el euro
        const euroResponse = await fetch("https://api.exchangerate-api.com/v4/latest/EUR");
        const euroData = await euroResponse.json();
        console.log("Tasa de Euro:", euroData); // Verifica la respuesta de la API

        setExchangeRates({
          VES: data.rates.VES, // Bolívar Soberano
          EUR: euroData.rates.VES, // Euro en VES
          BTC: data.rates.BTC, // Bitcoin
          DOLAR_PARALLELO: paraleloData.dolar_paralelo || "No disponible", // Dólar Paralelo
        });
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRates();
  }, []);

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
        <div className="exchange-rates">
          {loading ? (
            <p>Cargando tasas de cambio...</p>
          ) : (
            <div>
              <h3>Tasas de Cambio</h3>
              <ul>
                <li>1 USD = {exchangeRates?.VES} VES (Bolívar Soberano)</li>
                <li>1 USD = {exchangeRates?.DOLAR_PARALLELO} VES (Dólar Paralelo)</li>
                <li>1 EUR = {exchangeRates?.EUR} VES (Euro)</li>
                <li>1 USD = {exchangeRates?.BTC} BTC (Bitcoin)</li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cambio;