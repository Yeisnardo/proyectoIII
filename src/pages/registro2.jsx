import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../assets/styles/App.css";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaIdCard,
  FaCheckCircle,
  FaPhone,
  FaCalendarAlt,
  FaVenusMars,
  FaCreditCard,
  FaMoneyBillWave,
  FaCashRegister,
  FaBuilding,
  FaCamera,
} from "react-icons/fa";
import logo from "../assets/images/ifemi.jpg";
import Modal from "../components/Modal";

const Register = () => {
  const [formData, setFormData] = useState({
    cedula: "",
    fullName: "",
    edad: "",
    sexo: "",
    fecha_nacimiento: "",
    email: "",
    telefono1: "",
    telefono2: "",

    // Documentation step (now Step 2)
    cedula_documentacion: "",
    foto_cedula: null,
    foto_rostro: null,

    // Operational Data step (now Step 3)
    cedula_datos_situacion_operativa: "",
    operativo_e: "",
    n_trabajadores: "",
    tiempo_opercional_e: "",
    muestra_producto_f: "",

    // Financial Data step (now Step 4)
    cedula_datos_financieros: "",
    cuenta_bancaria: "",
    banco_seleccionado: [],
    metodo_pago: [],
    emprendimiento_credito: "",
    numero_clientes_semanal: "",
    vendes_credito: "",
    declara_iva: "",
    declara_islr: "",
    compra_contrato_o_credito: "",
    mes_ventas: "",
    exiges_ventas: "",

    // Additional Data step (now Step 5)
    cedula_datos_adicionales: "",
    campo_adicional_a: "",
    campo_adicional_b: "",
  });

  // Total number of steps remains 5
  const totalSteps = 5;
  const [currentStep, setCurrentStep] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccessModal, setIsSuccessModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (showModal && isSuccessModal) {
      timer = setTimeout(() => {
        handleCloseModal();
        navigate("/");
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [showModal, isSuccessModal, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (event) => {
    const { name, value, checked } = event.target;

    setFormData((prevFormData) => {
      const currentArray = Array.isArray(prevFormData[name])
        ? prevFormData[name]
        : [];

      if (checked) {
        if (!currentArray.includes(value)) {
          return {
            ...prevFormData,
            [name]: [...currentArray, value],
          };
        }
      } else {
        return {
          ...prevFormData,
          [name]: currentArray.filter((item) => item !== value),
        };
      }
      return prevFormData;
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: null,
      }));
    }
  };

  const handleCedulaChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]+$/.test(value)) {
      setFormData((prevData) => ({
        ...prevData,
        cedula: value,
      }));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalMessage("");
    setIsSuccessModal(false);
  };

  const showModalWithMessage = (message, isSuccess = false) => {
    setModalMessage(message);
    setIsSuccessModal(isSuccess);
    setShowModal(true);
  };

  const handleNextStep = () => {
    let isValid = true;
    let errorMessage = "";

    if (currentStep === 1) {
      if (
        !formData.cedula ||
        !formData.fullName ||
        !formData.edad ||
        !formData.sexo ||
        !formData.fecha_nacimiento ||
        !formData.email ||
        !formData.telefono1
      ) {
        isValid = false;
        errorMessage =
          "Por favor, completa todos los campos obligatorios de Datos Personales.";
      } else if (
        formData.cedula.length < 5 ||
        !/^[0-9]+$/.test(formData.cedula)
      ) {
        isValid = false;
        errorMessage =
          "La Cédula de Identidad debe tener al menos 5 dígitos y contener solo números.";
      } else if (formData.fullName.trim().length < 5) {
        isValid = false;
        errorMessage = "El Nombre y Apellido debe tener al menos 5 caracteres.";
      } else if (
        isNaN(formData.edad) ||
        parseInt(formData.edad) <= 0 ||
        parseInt(formData.edad) > 120
      ) {
        isValid = false;
        errorMessage = "Por favor, ingresa una edad válida.";
      } else if (formData.sexo === "") {
        isValid = false;
        errorMessage = "Por favor, selecciona tu sexo.";
      } else if (!formData.fecha_nacimiento) {
        isValid = false;
        errorMessage = "Por favor, ingresa tu fecha de nacimiento.";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        isValid = false;
        errorMessage = "Por favor, ingresa un correo electrónico válido.";
      } else if (formData.telefono1.trim().length < 7) {
        isValid = false;
        errorMessage =
          "Por favor, ingresa un número de teléfono válido (Teléfono 1).";
      }

      if (isValid) {
        // Populate cedula for subsequent steps
        setFormData((prevData) => ({
          ...prevData,
          cedula_documentacion: prevData.cedula,
          cedula_datos_situacion_operativa: prevData.cedula,
          cedula_datos_financieros: prevData.cedula,
          cedula_datos_adicionales: prevData.cedula,
        }));
      }
    } else if (currentStep === 2) {
      // Validation for Documentation Step (now Step 2)
      if (
        !formData.cedula_documentacion ||
        !formData.foto_cedula ||
        !formData.foto_rostro
      ) {
        isValid = false;
        errorMessage = "Por favor, adjunta las fotos de la cédula y el rostro.";
      }
      // Add file type/size validation here if needed
    } else if (currentStep === 3) {
      // Validation for Operational Data Step (now Step 3)
      if (
        !formData.cedula_datos_situacion_operativa ||
        formData.operativo_e === "" ||
        !formData.n_trabajadores ||
        formData.tiempo_opercional_e === "" ||
        formData.muestra_producto_f === ""
      ) {
        isValid = false;
        errorMessage =
          "Por favor, completa todos los campos de Situación Operativa.";
      } else if (
        isNaN(formData.n_trabajadores) ||
        parseInt(formData.n_trabajadores) < 0
      ) {
        isValid = false;
        errorMessage =
          "El número de trabajadores debe ser un número válido (mayor o igual a 0).";
      }
    } else if (currentStep === 4) {
      // Validation for Financial Data Step (now Step 4)
      if (
        !formData.cedula_datos_financieros ||
        formData.cuenta_bancaria === "" ||
        formData.banco_seleccionado.length === 0 ||
        formData.metodo_pago.length === 0 ||
        formData.emprendimiento_credito === "" ||
        !formData.numero_clientes_semanal ||
        formData.vendes_credito === "" ||
        formData.declara_iva === "" ||
        formData.declara_islr === "" ||
        formData.compra_contrato_o_credito === "" ||
        formData.mes_ventas === "" ||
        formData.exiges_ventas === ""
      ) {
        isValid = false;
        errorMessage = "Por favor, completa todos los campos del Perfil Financiero.";
      } else if (
        isNaN(formData.numero_clientes_semanal) ||
        parseInt(formData.numero_clientes_semanal) < 0
      ) {
        isValid = false;
        errorMessage =
          "El número de clientes atendidos semanalmente debe ser un número válido (mayor o igual a 0).";
      }
    } else if (currentStep === 5) {
      // Validation for Additional Data Step (now Step 5)
      if (
        !formData.cedula_datos_adicionales ||
        !formData.campo_adicional_a ||
        !formData.campo_adicional_b
      ) {
        isValid = false;
        errorMessage = "Por favor, completa todos los campos adicionales.";
      } else if (formData.campo_adicional_a.trim().length < 3) {
        isValid = false;
        errorMessage = "El nombre de usuario debe tener al menos 3 caracteres.";
      } else if (formData.campo_adicional_b.length < 6) {
        isValid = false;
        errorMessage = "La contraseña debe tener al menos 6 caracteres.";
      }
      // Add password confirmation validation here if implemented
    }

    if (isValid) {
      setCurrentStep(currentStep + 1);
    } else {
      showModalWithMessage(errorMessage);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();

    // Final validation for the last step (Step 5 in this case)
    let isValid = true;
    let errorMessage = "";

    if (
      !formData.cedula_datos_adicionales ||
      !formData.campo_adicional_a ||
      !formData.campo_adicional_b
    ) {
      isValid = false;
      errorMessage = "Por favor, completa todos los campos adicionales.";
    } else if (formData.campo_adicional_a.trim().length < 3) {
      isValid = false;
      errorMessage = "El nombre de usuario debe tener al menos 3 caracteres.";
    } else if (formData.campo_adicional_b.length < 6) {
      isValid = false;
      errorMessage = "La contraseña debe tener al menos 6 caracteres.";
    }

    if (!isValid) {
      showModalWithMessage(errorMessage);
      return;
    }

    console.log("Final Registration Data:", formData);

    // Here you would typically send `formData` to your backend API.
    // Note: When sending files, you'll likely need to use `FormData` object.
    /*
    const apiFormData = new FormData();
    for (const key in formData) {
        if (formData[key] !== null && formData[key] !== undefined) {
             // Append files and other data
             apiFormData.append(key, formData[key]);
        }
    }

    fetch('/api/register', {
      method: 'POST',
      // Don't set Content-Type header for FormData, fetch sets it automatically
      body: apiFormData,
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => { throw new Error(err.message || 'Error en el registro') });
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      showModalWithMessage("Registro completo exitoso!", true);
    })
    .catch((error) => {
      console.error('Error:', error);
      showModalWithMessage(`Error en el registro: ${error.message}`);
    });
    */

    // Simulate successful final submission (remove this when using fetch)
    showModalWithMessage("Registro completo exitoso!", true);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h2>Datos Personales</h2>
            <div className="input-group input-col-12">
              <label htmlFor="reg-cedula" className="form-label">
                Cédula de Identidad:
              </label>
              <div className="input-wrapper">
                <FaIdCard className="icon" />
                <input
                  type="text"
                  id="reg-cedula"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleCedulaChange}
                  placeholder="Ingresa tu Cédula de Identidad (solo números)"
                  autoComplete="off"
                  inputMode="numeric"
                  pattern="\d*"
                  required
                />
              </div>
            </div>
            <div className="input-group input-col-12">
              <label htmlFor="reg-fullName" className="form-label">
                Nombre y Apellido:
              </label>
              <div className="input-wrapper">
                <FaUser className="icon" />
                <input
                  type="text"
                  id="reg-fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Ingresa tu Nombre y Apellido"
                  autoComplete="off"
                  required
                />
              </div>
            </div>
            <div className="input-group input-col-12">
              <label htmlFor="reg-edad" className="form-label">
                Edad:
              </label>
              <div className="input-wrapper">
                <FaUser className="icon" />
                <input
                  type="number"
                  id="reg-edad"
                  name="edad"
                  value={formData.edad}
                  onChange={handleInputChange}
                  placeholder="Ingresa tu edad"
                  autoComplete="off"
                  min="1"
                  max="120"
                  required
                />
              </div>
            </div>
            <div className="input-group input-col-12">
              <label htmlFor="reg-sexo" className="form-label">
                Sexo:
              </label>
              <div className="input-wrapper">
                <FaVenusMars className="icon" />
                <select
                  id="reg-sexo"
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>
            <div className="input-group input-col-12">
              <label htmlFor="reg-fecha_nacimiento" className="form-label">
                Fecha de nacimiento:
              </label>
              <div className="input-wrapper">
                <FaCalendarAlt className="icon" />
                <input
                  type="date"
                  id="reg-fecha_nacimiento"
                  name="fecha_nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="input-group input-col-12">
              <label htmlFor="reg-email">Correo Electrónico:</label>
              <div className="input-wrapper">
                <FaEnvelope className="icon" />
                <input
                  type="email"
                  id="reg-email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Ingresa tu correo electrónico"
                  autoComplete="off"
                  required
                />
              </div>
            </div>
            <div className="input-group input-col-12">
              <label htmlFor="reg-telefono1" className="form-label">
                Telefono 1:
              </label>
              <div className="input-wrapper">
                <FaPhone className="icon" />
                <input
                  type="text"
                  id="reg-telefono1"
                  name="telefono1"
                  value={formData.telefono1}
                  onChange={handleInputChange}
                  placeholder="Ingresa Teléfono 1"
                  required
                />
              </div>
            </div>
            <div className="input-group input-col-12">
              <label htmlFor="reg-telefono2" className="form-label">
                Telefono 2:
              </label>
              <div className="input-wrapper">
                <FaPhone className="icon" />
                <input
                  type="text"
                  id="reg-telefono2"
                  name="telefono2"
                  value={formData.telefono2}
                  onChange={handleInputChange}
                  placeholder="Ingresa Teléfono 2 (Opcional)"
                />
              </div>
            </div>
            <button
              type="button"
              className="submit-button"
              onClick={handleNextStep}
            >
              Siguiente
            </button>
            <div className="register-link-container">
              <p>
                ¿Ya tienes una cuenta? <Link to="/">Inicia Sesión aquí</Link>
              </p>
            </div>
          </>
        );

      case 2: // Now Documentation Step
        return (
          <>
            <h2>Documentación</h2>
            <div className="input-group input-col-12">
              <label htmlFor="reg-cedula-documentacion" className="form-label">
                Cédula de Identidad:
              </label>
              <div className="input-wrapper">
                <FaIdCard className="icon" />
                <input
                  type="text"
                  id="reg-cedula-documentacion"
                  name="cedula_documentacion"
                  value={formData.cedula_documentacion}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                  readOnly
                />
              </div>
            </div>
            <div className="input-group input-col-12">
              <label htmlFor="reg-foto-cedula" className="form-label">
                Foto de la Cédula:
              </label>
              <div className="input-wrapper">
                <FaCamera className="icon" />
                <input
                  type="file"
                  id="reg-foto-cedula"
                  name="foto_cedula"
                  onChange={handleFileChange}
                  className="form-control"
                  accept="image/*"
                  required
                />
              </div>
              {formData.foto_cedula && (
                <p className="file-name-display">
                  Archivo seleccionado: {formData.foto_cedula.name}
                </p>
              )}
            </div>
            <div className="input-group input-col-12">
              <label htmlFor="reg-foto-rostro" className="form-label">
                Foto del Rostro:
              </label>
              <div className="input-wrapper">
                <FaCamera className="icon" />
                <input
                  type="file"
                  id="reg-foto-rostro"
                  name="foto_rostro"
                  onChange={handleFileChange}
                  className="form-control"
                  accept="image/*"
                  required
                />
              </div>
              {formData.foto_rostro && (
                <p className="file-name-display">
                  Archivo seleccionado: {formData.foto_rostro.name}
                </p>
              )}
            </div>
            <button
              type="button"
              className="submit-button"
              onClick={handlePreviousStep}
            >
              Anterior
            </button>
            <button
              type="button"
              className="submit-button"
              onClick={handleNextStep}
            >
              Siguiente
            </button>
          </>
        );

      case 3: // Now Operational Data Step
        return (
          <>
            <h2>Datos de Situacion Operativa</h2>
            <div className="input-group input-col-12">
              <label htmlFor="reg-cedula-operativa" className="form-label">
                Cédula de Identidad:
              </label>
              <div className="input-wrapper">
                <FaIdCard className="icon" />
                <input
                  type="text"
                  id="reg-cedula-operativa"
                  name="cedula_datos_situacion_operativa"
                  value={formData.cedula_datos_situacion_operativa}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                  readOnly
                />
              </div>
            </div>
            <div className="input-group input-col-12">
              <label htmlFor="reg-operativo-e" className="form-label">
                Se encuentra operativo el emprendimiento:
              </label>
              <div className="input-wrapper">
                <FaCashRegister className="icon" />
                <select
                  id="reg-operativo-e"
                  name="operativo_e"
                  value={formData.operativo_e}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="Si">Si</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
            <div className="input-group input-col-12">
              <label htmlFor="reg-n-trabajadores" className="form-label">
                N° de Trabajadores
              </label>
              <div className="input-wrapper">
                <FaUser className="icon" />
                <input
                  type="number"
                  id="reg-n-trabajadores"
                  name="n_trabajadores"
                  value={formData.n_trabajadores}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Número de trabajadores"
                  min="0"
                  required
                />
              </div>
            </div>
            <div className="input-group input-col-12">
              <label htmlFor="reg-tiempo-opercional-e" className="form-label">
                Tiempo de operatividad del emprendimiento
              </label>
              <div className="input-wrapper">
                <FaCalendarAlt className="icon" />
                <select
                  id="reg-tiempo-opercional-e"
                  name="tiempo_opercional_e"
                  value={formData.tiempo_opercional_e}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="Menos de 1 Año">Menos de 1 Año</option>
                  <option value="Entre 1 y 2 años">Entre 1 y 2 años</option>
                  <option value="Entre 2 y 5 años">Entre 2 y 5 años</option>
                  <option value="Mas de 5 años">Mas de 5 años</option>
                </select>
              </div>
            </div>
            <div className="input-group input-col-12">
              <label htmlFor="reg-muestra-producto-f" className="form-label">
                El emprendimiento tiene componentes de diseño,forma de
                produccion o presentacion final:
              </label>
              <div className="input-wrapper">
                <FaCheckCircle className="icon" />
                <select
                  id="reg-muestra-producto-f"
                  name="muestra_producto_f"
                  value={formData.muestra_producto_f}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="Si">Si</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
            <button
              type="button"
              className="submit-button"
              onClick={handlePreviousStep}
            >
              Anterior
            </button>
            <button
              type="button"
              className="submit-button"
              onClick={handleNextStep}
            >
              Siguiente
            </button>
          </>
        );

      case 4: // Now Financial Data Step
        return (
          <>
            <h2>Datos Perfil Financiero</h2>
            <div className="input-group input-col-12">
              <label htmlFor="reg-cedula-financieros" className="form-label">
                Cédula de Identidad:
              </label>
              <div className="input-wrapper">
                <FaIdCard className="icon" />
                <input
                  type="text"
                  id="reg-cedula-financieros"
                  name="cedula_datos_financieros"
                  value={formData.cedula_datos_financieros}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                  readOnly
                />
              </div>
            </div>
            <div className="input-group input-col-12">
              <label htmlFor="reg-cuenta-bancaria" className="form-label">
                Posee una cuenta Bancaria?:
              </label>
              <div className="input-wrapper">
                <FaBuilding className="icon" />
                <select
                  id="reg-cuenta-bancaria"
                  name="cuenta_bancaria"
                  value={formData.cuenta_bancaria}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="Si">Si</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
            <div className="input-group input-col-12">
              <label className="form-label">Seleccionar el Banco:</label>
              <div
                className="input-wrapper checkbox-group-wrapper"
                style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
              >
                {[
                  "Banco de Venezuela",
                  "Banco Bicentenario",
                  "BBVA Provincial",
                  "Banco Mercantil",
                  "Bancamiga",
                  "Banco Exterior",
                  "Banpro (Banco Provincial)",
                  "Banco del Tesoro",
                  "Banco Nacional de Crédito (BNC)",
                  "Banesco",
                  "Banco Caroní",
                ].map((banco) => (
                  <div key={banco} className="checkbox-item">
                    <input
                      type="checkbox"
                      id={`reg-banco-${banco.toLowerCase().replace(/\s/g, "-")}`}
                      name="banco_seleccionado"
                      value={banco}
                      onChange={handleCheckboxChange}
                      checked={formData.banco_seleccionado.includes(banco)}
                    />
                    <label
                      htmlFor={`reg-banco-${banco
                        .toLowerCase()
                        .replace(/\s/g, "-")}`}
                    >
                      {banco}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="input-group input-col-12">
              <label className="form-label">Métodos de Pagos:</label>
              <div
                className="input-wrapper checkbox-group-wrapper"
                style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
              >
                {[
                  "Pago Movil",
                  "Puntos de Venta",
                  "Efectivo",
                  "BiopagoBDV",
                  "Criptomonedas",
                  "Zelle",
                  "Transferencias Bancarias",
                ].map((metodo) => (
                  <div key={metodo} className="checkbox-item">
                    <input
                      type="checkbox"
                      id={`reg-metodo-pago-${metodo
                        .toLowerCase()
                        .replace(/\s/g, "-")}`}
                      name="metodo_pago"
                      value={metodo}
                      onChange={handleCheckboxChange}
                      checked={formData.metodo_pago.includes(metodo)}
                    />
                    <label
                      htmlFor={`reg-metodo-pago-${metodo
                        .toLowerCase()
                        .replace(/\s/g, "-")}`}
                    >
                      {metodo}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="input-group input-col-12">
              <label htmlFor="reg-emprendimiento-credito" className="form-label">
                Tu emprendimiento cuenta con un credito?:
              </label>
              <div className="input-wrapper">
                <FaCreditCard className="icon" />
                <select
                  id="reg-emprendimiento-credito"
                  name="emprendimiento_credito"
                  value={formData.emprendimiento_credito}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="Si">Si</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
            <div className="input-group input-col-12">
              <label htmlFor="reg-numero-clientes-semanal" className="form-label">
                N° Clientes atiendes semanal:
              </label>
              <div className="input-wrapper">
                <FaUser className="icon" />
                <input
                  type="number"
                  id="reg-numero-clientes-semanal"
                  name="numero_clientes_semanal"
                  value={formData.numero_clientes_semanal}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Número de clientes"
                  min="0"
                  required
                />
              </div>
            </div>
            <div className="input-group input-col-12">
              <label htmlFor="reg-vendes-credito" className="form-label">
                Vendes de contado o a Credito:
              </label>
              <div className="input-wrapper">
                <FaMoneyBillWave className="icon" />
                <select
                  id="reg-vendes-credito"
                  name="vendes_credito"
                  value={formData.vendes_credito}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="Contado">Contado</option>
                  <option value="Credito">Credito</option>
                  <option value="Ambos">Ambos</option>
                </select>
              </div>
            </div>
            <div className="input-group input-col-12">
              <label htmlFor="reg-declara-iva" className="form-label">
                Declaras IVA?:
              </label>
              <div className="input-wrapper">
                <FaCheckCircle className="icon" />
                <select
                  id="reg-declara-iva"
                  name="declara_iva"
                  value={formData.declara_iva}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="Si">Si</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
            <div className="input-group input-col-12">
              <label htmlFor="reg-declara-islr" className="form-label">
                Declaras ISLR?:
              </label>
              <div className="input-wrapper">
                <FaCheckCircle className="icon" />
                <select
                  id="reg-declara-islr"
                  name="declara_islr"
                  value={formData.declara_islr}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="Si">Si</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
            <div className="input-group input-col-12">
              <label
                htmlFor="reg-compra-contrato-o-credito"
                className="form-label"
              >
                Le compras a tus proveedores de contado o crédito?:
              </label>
              <div className="input-wrapper">
                <FaMoneyBillWave className="icon" />
                <select
                  id="reg-compra-contrato-o-credito"
                  name="compra_contrato_o_credito"
                  value={formData.compra_contrato_o_credito}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="Contado">Contado</option>
                  <option value="Credito">Credito</option>
                  <option value="Ambos">Ambos</option>
                </select>
              </div>
            </div>
            <div className="input-group input-col-12">
              <label htmlFor="reg-mes-ventas" className="form-label">
                Mes con más ventas?:
              </label>
              <div className="input-wrapper">
                <FaCalendarAlt className="icon" />
                <select
                  id="reg-mes-ventas"
                  name="mes_ventas"
                  value={formData.mes_ventas}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">Seleccionar...</option>
                  {[
                    "Enero",
                    "Febrero",
                    "Marzo",
                    "Abril",
                    "Mayo",
                    "Junio",
                    "Julio",
                    "Agosto",
                    "Septiembre",
                    "Octubre",
                    "Noviembre",
                    "Diciembre",
                  ].map((mes) => (
                    <option key={mes} value={mes}>
                      {mes}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="input-group input-col-12">
              <label htmlFor="reg-exiges-ventas" className="form-label">
                Exiges porcentajes en tus ventas?:
              </label>
              <div className="input-wrapper">
                <FaCheckCircle className="icon" />
                <select
                  id="reg-exiges-ventas"
                  name="exiges_ventas"
                  value={formData.exiges_ventas}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="Si">Si</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
            <button
              type="button"
              className="submit-button"
              onClick={handlePreviousStep}
            >
              Anterior
            </button>
            <button
              type="button"
              className="submit-button"
              onClick={handleNextStep}
            >
              Siguiente
            </button>
          </>
        );

      case 5: // Now Additional Data Step
        return (
          <>
            <h2>Datos Adicionales</h2>
            <div className="input-group input-col-12">
              <label htmlFor="reg-cedula-adicionales" className="form-label">
                Cédula de Identidad:
              </label>
              <div className="input-wrapper">
                <FaIdCard className="icon" />
                <input
                  type="text"
                  id="reg-cedula-adicionales"
                  name="cedula_datos_adicionales"
                  value={formData.cedula_datos_adicionales}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                  readOnly
                />
              </div>
            </div>
            <div className="input-group input-col-12">
              <label htmlFor="reg-campo-adicional-a" className="form-label">
                Usuario:
              </label>
              <div className="input-wrapper">
                <FaUser className="icon" />
                <input
                  type="text"
                  id="reg-campo-adicional-a"
                  name="campo_adicional_a"
                  value={formData.campo_adicional_a}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Define tu nombre de usuario"
                  required
                />
              </div>
            </div>
            <div className="input-group input-col-12">
              <label htmlFor="reg-campo-adicional-b" className="form-label">
                Contraseña:
              </label>
              <div className="input-wrapper">
                <FaLock className="icon" />
                <input
                  type="password"
                  id="reg-campo-adicional-b"
                  name="campo_adicional_b"
                  value={formData.campo_adicional_b}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Define tu contraseña"
                  required
                />
              </div>
            </div>
            {/* Add Password Confirmation field if needed */}
            {/*
             <div className="input-group input-col-12">
               <label htmlFor="reg-password-confirm" className="form-label">Confirmar Contraseña:</label>
               <div className="input-wrapper">
                 <FaLock className="icon" />
                 <input
                   type="password"
                   id="reg-password-confirm"
                   name="password_confirm" // Add this field to your state
                   value={formData.password_confirm}
                   onChange={handleInputChange}
                   className="form-control"
                   placeholder="Confirma tu contraseña"
                   required
                 />
               </div>
             </div>
             */}
            <button
              type="button"
              className="submit-button"
              onClick={handlePreviousStep}
            >
              Anterior
            </button>
            <button type="submit" className="submit-button">
              Finalizar Registro
            </button>
          </>
        );

      default:
        return <div></div>;
    }
  };

  return (
    <div className="login-page-container">
      <div className="logo-page-container">
        <img src={logo} alt="Institution Logo" className="institution-logo" />
      </div>

      <div className="step-indicator-container">
        {[...Array(totalSteps)].map((_, index) => (
          <React.Fragment key={index}>
            <div
              className={`step-circle ${
                currentStep > index + 1 ? "completed" : ""
              }`}
            >
              {currentStep > index + 1 ? (
                <FaCheckCircle className="check-icon" />
              ) : (
                index + 1
              )}
            </div>
            {index < totalSteps - 1 && <div className="step-line"></div>}
          </React.Fragment>
        ))}
      </div>

      <div className="auth-container-wrapper">
        <div className="registration-form-box">
          <form className="auth-form" onSubmit={handleFinalSubmit}>
            {renderStep()}
          </form>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={handleCloseModal}>
        <p>{modalMessage}</p>
      </Modal>
    </div>
  );
};

export default Register;