import React, { useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import Header from "../components/Header";
import Menu from "../components/Menu";
import Footer from "../components/Footer";
import axios from "axios";
import "../assets/styles/App.css"; // Puedes mantenerlo si hay otros estilos en archivos separados.

const Usuario = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState("dollar");
  const [amount, setAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState(0);
  const [totalBs, setTotalBs] = useState(0);
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [errorMessage, setErrorMessage] = useState("");

  // Check online status
  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(window.navigator.onLine);
    };

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  // Fetch the exchange rate when the selected currency changes
  useEffect(() => {
    if (isOnline) {
      setErrorMessage(""); // Limpiar el mensaje de error
      fetchExchangeRate();
    } else {
      setErrorMessage(
        "No hay conexión a Internet. Por favor, verifica tu conexión."
      );
    }
  }, [selectedCurrency, isOnline]);

  const fetchExchangeRate = async () => {
    try {
      const baseCurrency = selectedCurrency === "dollar" ? "USD" : "EUR";
      const response = await axios.get(
        `https://open.er-api.com/v6/latest/${baseCurrency}`
      );
      const rate = response.data.rates["VES"];
      setExchangeRate(rate);
      calculateTotal(amount, rate);
    } catch (error) {
      console.error("Error al obtener la tasa de cambio:", error);
    }
  };

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setSelectedCurrency(newCurrency);
    setAmount("");
    setTotalBs(0);
  };

  const handleAmountChange = (e) => {
    const newAmount = e.target.value;
    setAmount(newAmount);
    calculateTotal(newAmount, exchangeRate);
  };

  const calculateTotal = (amountInString, rate) => {
    const amountInNumber = parseFloat(amountInString) || 0;
    const total = amountInNumber * rate;
    setTotalBs(total);
  };

  // Estilos en línea (como en el ejemplo anterior)
  const styles = {
    dashboardContainer: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
    },
    dashboardContent: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
    },
    formContainer: {
      width: "400px",
      margin: "0 auto",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "10px",
      backgroundColor: "#fff",
      boxShadow: "0 3px 10px rgba(0, 0, 0, 0.1)",
    },
    h2: {
      textAlign: "center",
      color: "#333",
    },
    formGroup: {
      marginBottom: "15px",
    },
    formLabel: {
      display: "block",
      marginBottom: "5px",
      fontWeight: "bold",
      color: "#555",
    },
    formControl: {
      width: "100%",
      padding: "10px",
      border: "1px solid #ddd",
      borderRadius: "5px",
      boxSizing: "border-box",
      fontSize: "16px",
      transition: "border-color 0.3s",
    },
    formControlFocus: {
      borderColor: "#007bff",
      outline: "none",
    },
    success: {
      borderColor: "#28a745",
    },
    successIcon: {
      marginLeft: "10px",
      color: "#28a745",
    },
    errorMessage: {
      color: "red",
      fontWeight: "bold",
      textAlign: "center",
      marginTop: "10px",
    },
  };

  return (
    <div style={styles.dashboardContainer}>
      <Header />
      <Menu
        isMenuVisible={isMenuVisible}
        toggleMenu={() => setIsMenuVisible(!isMenuVisible)}
      />

      <div style={styles.dashboardContent}>
        <div style={styles.formContainer}>
          <h2 style={styles.h2}>Calculadora de Monedas</h2>
          {errorMessage && (
            <div style={styles.errorMessage}>{errorMessage}</div>
          )}{" "}
          {/* Mensaje de error */}
          <form className="modal-form">
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Tipo de Moneda:</label>
              <select
                value={selectedCurrency}
                onChange={handleCurrencyChange}
                style={styles.formControl}
              >
                <option value="dollar">Dólar</option>
                <option value="euro">Euro</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Monto:</label>
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                style={styles.formControl}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Tipo de Cambio:</label>
              <input
                type="number"
                value={exchangeRate}
                readOnly
                style={styles.formControl}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Cambio Total:</label>
              <input
                type="text"
                value={totalBs > 0 ? totalBs.toFixed(2) : ""}
                readOnly
                style={{
                  ...styles.formControl,
                  ...(totalBs > 0 ? styles.success : {}),
                }}
              />
              {totalBs > 0 && <FaCheckCircle style={styles.successIcon} />}
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Usuario;
