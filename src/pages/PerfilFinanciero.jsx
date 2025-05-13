import React, { useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import Header from "../components/Header";
import Menu from "../components/Menu";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import {
  fetchRecords,
  createRecord,
  updateRecord,
  deleteRecord,
} from "../services/finacieroService"; // Import service functions
import "../assets/styles/App.css";

const Persona = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletedModalOpen, setIsDeletedModalOpen] = useState(false);
  const [isCreatedModalOpen, setIsCreatedModalOpen] = useState(false);
  const [isUpdatedModalOpen, setIsUpdatedModalOpen] = useState(false);
  const [viewRecord, setViewRecord] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [errors, setErrors] = useState({});
  const [newRecord, setNewRecord] = useState({
    cedula_datos_financieros: "",
    cuenta_bancaria: "",
    banco_seleccionado: [],
    metodo_pago: [],
    emprendimiento_credito: "",
    numero_clientes_semanal: "",
    declara_iva: "",
    declara_islr: "",
    compra_contrato_o_credito: "",
    mes_ventas: "",
    exiges_ventas: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRecords(); // Fetch records from service
        setRecords(data);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };

    fetchData();
  }, []);

  const bancos = [
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
  ];

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setNewRecord((prevRecord) => ({
      ...prevRecord,
      [name]: value,
    }));

    if (name === "banco_seleccionado") {
      let newSelected = [...newRecord.banco_seleccionado];
      if (checked) {
        newSelected.push(value);
      } else {
        newSelected = newSelected.filter((item) => item !== value);
      }
      setNewRecord({ ...newRecord, banco_seleccionado: newSelected });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!newRecord.cedula) errors.cedula = "La cédula es requerida";
    if (!newRecord.nombres) errors.nombres = "Los nombres son requeridos";
    if (!newRecord.apellidos) errors.apellidos = "Los apellidos son requeridos";
    if (!newRecord.estado) errors.estado = "El estado es requerido";
    if (!newRecord.municipio) errors.municipio = "El municipio es requerido";
    if (!newRecord.parroquia) errors.parroquia = "La parroquia es requerida";
    if (!newRecord.direccion) errors.direccion = "La dirección es requerida";
    if (!newRecord.telefono1) errors.telefono1 = "El teléfono 1 es requerido";
    if (!newRecord.telefono2) errors.telefono2 = "El teléfono 2 es requerido";
    if (!newRecord.tipo) errors.tipo = "El tipo de persona es requerido";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (records.some ((record) => record.cedula === newRecord.cedula)) {
      alert("La cédula ya existe.");
      return;
    }

    try {
      const response = await createRecord(newRecord); // Create a new record using the service
      setRecords([...records, response]);
      resetForm();
      setIsModalOpen(false);
      setIsCreatedModalOpen(true);
    } catch (error) {
      console.error("Error registering the person:", error);
      alert("Hubo un problema al registrar la persona. Inténtalo de nuevo.");
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await updateRecord(newRecord.cedula, newRecord); // Update the record using the service
      const updatedRecords = records.map((record) =>
        record.cedula === response.cedula ? response : record
      );
      setRecords(updatedRecords);
      resetForm();
      setIsEditModalOpen(false);
      setIsUpdatedModalOpen(true);
    } catch (error) {
      console.error("Error updating the person:", error);
      alert("Hubo un problema al actualizar la persona. Inténtalo de nuevo.");
    }
  };

  const resetForm = () => {
    setNewRecord({
      cedula: "",
      nombres: "",
      apellidos: "",
      estado: "",
      municipio: "",
      parroquia: "",
      direccion: "",
      telefono1: "",
      telefono2: "",
      tipo: "",
    });
    setErrors({});
  };

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const renderDataTable = () => {
    const filteredRecords = records.filter((record) => {
      return (
        (record.nombres &&
          record.nombres.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (record.apellidos &&
          record.apellidos.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (record.cedula && record.cedula.includes(searchTerm))
      );
    });

    const totalPages = Math.ceil(filteredRecords.length / limit);
    const startIndex = (currentPage - 1) * limit;
    const currentRecords = filteredRecords.slice(
      startIndex,
      startIndex + limit
    );

    return (
      <div className="records-container">
        <button type="submit" className="update-button">
          Actualizar
        </button>
        <h2>Perfil Financiero</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group input-col-12">
              <input
                type="hidden"
                name="cedula_datos_financieros"
                value={newRecord.cedula_datos_financieros}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.cedula_datos_financieros && (
                <span className="error-message">
                  {errors.cedula_datos_financieros}
                </span>
              )}
            </div>
            <div className="form-group input-col-12">
              <label className="form-label">Posee una cuenta Bancaria?:</label>
              <select
                name="cuenta_bancaria"
                value={newRecord.cuenta_bancaria}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Seleccionar...</option>
                <option value="Si">Si</option>
                <option value="No">No</option>
              </select>
              {errors.cuenta_bancaria && (
                <span className="error-message">{errors.cuenta_bancaria}</span>
              )}
            </div>
            <div className="input-group input-col-12">
              <label className="form-label">Seleccionar el Banco:</label>
              <div className="checkbox-group-wrapper flex-wrap-gap">
                {bancos.map((banco) => (
                  <div key={banco} className="checkbox-item">
                    <input
                      type="checkbox"
                      id={`reg-banco-${banco.toLowerCase().replace(/\s/g, "-")}`}
                      name="banco_seleccionado"
                      value={banco}
                      onChange={handleInputChange}
                      checked={newRecord.banco_seleccionado.includes(banco)}
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
            </ div>
            <div className="input-group input-col-12">
              <label className="form-label">Métodos de Pagos:</label>
              <div className="checkbox-group-wrapper flex-wrap-gap">
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
                      id={`reg-metodo-pago-${metodo.toLowerCase().replace(/\s/g, "-")}`}
                      name="metodo_pago"
                      value={metodo}
                      onChange={handleInputChange}
                      checked={newRecord.metodo_pago.includes(metodo)}
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
            <div className="form-group input-col-7">
              <label className="form-label">
                Tu emprendimiento cuenta con un credito?:
              </label>
              <select
                name="emprendimiento_credito"
                value={newRecord.emprendimiento_credito}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Seleccionar...</option>
                <option value="Si">Si</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="form-group input-col-5">
              <label className="form-label">
                N° Clientes atiendes semanal:
              </label>
              <input
                type="number"
                name="numero_clientes_semanal"
                value={newRecord.numero_clientes_semanal}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group input-col-12">
              <label className="form-label">
                Vendes de contado o a Credito:
              </label>
              <select
                name="vendes_credito"
                value={newRecord.vendes_credito}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Seleccionar...</option>
                <option value="contado">contado</option>
                <option value="Credito">Credito</option>
                <option value="Ambos">Ambos</option>
              </select>
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Declaras IVA?:</label>
              <select
                name="declara_iva"
                value={newRecord.declara_iva}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Seleccionar...</option>
                <option value="Si">Si</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Declaras ISLR?:</label>
              <select
                name="declara_islr"
                value={newRecord.declara_islr}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Seleccionar...</option>
                <option value="Si">Si</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="form-group input-col-12">
              <label className="form-label">
                Le compras a tus proveedores de contado o crédito?:
              </label>
              <select
                name="compra_contrato_o_credito"
                value={newRecord.compra_contrato_o_credito}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Seleccionar...</option>
                <option value="Contado">Contado</option>
                <option value="Credito">Credito</option>
                <option value="Ambos">Ambos</option>
              </select>
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Mes con más ventas?:</label>
              <select
                name="mes_ventas"
                value={newRecord.mes_ventas}
                onChange={handleInputChange}
                className="form-control"
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
            <div className="form-group input-col-6">
              <label className="form-label">
                Exiges porcentajes en tus ventas?:
              </label>
              <select
                name="exiges_ventas"
                value={newRecord.exiges_ventas}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Seleccionar...</option>
                <option value="Si">Si</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
        </form>
      </div>
    );
  };

  const confirmDelete = async () => {
    try {
      await deleteRecord(recordToDelete.cedula); // Delete the record using the service
      setRecords(
        records.filter((record) => record.cedula !== recordToDelete.cedula)
      );
      setRecordToDelete(null);
      setIsDeleteModalOpen(false);
      setIsDeletedModalOpen(true);
    } catch (error) {
      console.error("Error deleting the record:", error);
      alert("Hubo un problema al eliminar el registro. Inténtalo de nuevo.");
    }
  };

  return (
    <div
      className={`dashboard-container ${isMenuVisible ? "" : "menu-hidden"}`}
    >
      <Header />
      <Menu isMenuVisible={isMenuVisible} toggleMenu={toggleMenu} />
      <div className="dashboard-content">
        <div className="container">{renderDataTable()}</div>
      </div>
      <Footer />

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2>Actualizar Datos Personales</h2>
        <form onSubmit={handleUpdate} className="modal-form">
          <div className="form-row">
            <div className="form-group input-col-12">
              <label className="form-label">Cédula de Identidad:</label>
              <input
                type="text"
                name="cedula"
                value={newRecord.cedula}
                onChange={handleInputChange}
                className="form-control"
                readOnly // Read-only field
              />
              {errors.cedula && (
                <span className="error-message">{errors.cedula}</span>
              )}
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Nombres:</label>
              <input
                type="text"
                name="nombres"
                value={newRecord.nombres}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.nombres && (
                <span className="error-message">{errors.nombres}</span>
              )}
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Apellidos:</label>
              <input
                type="text"
                name="apellidos"
                value={newRecord.apellidos}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.apellidos && (
                <span className="error-message">{errors.apellidos}</span>
              )}
            </div>
            <div className="form-group input-col-4">
              <label className="form-label">Estado:</label>
              <input
                type="text"
                name="estado"
                value={newRecord.estado}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.estado && (
                <span className="error-message">{errors.estado}</span>
              )}
            </div>
            <div className="form-group input-col-4">
              <label className="form-label">Municipio:</label>
              <input
                type="text"
                name="municipio"
                value={newRecord.municipio}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.municipio && (
                <span className="error-message">{errors.municipio}</span>
              )}
            </div>
            <div className="form-group input-col-4">
              <label className="form-label">Parroquia:</label>
              <input
                type="text"
                name="parroquia"
                value={newRecord.parroquia}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.parroquia && (
                <span className="error-message">{errors.parroquia}</span>
              )}
            </div>
            <div className="form-group input-col-12">
              <label className="form-label">Dirección:</label>
              <input
                type="text"
                name="direccion"
                value={newRecord.direccion}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.direccion && (
                <span className="error-message">{errors.direccion}</span>
              )}
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Teléfono 1:</label>
              <input
                type="text"
                name="telefono1"
                value={newRecord.telefono1}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.telefono1 && (
                <span className="error-message">{errors.telefono1}</span>
              )}
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Teléfono 2:</label>
              <input
                type="text"
                name="telefono2"
                value={newRecord.telefono2}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.telefono2 && (
                <span className="error-message">{errors.telefono2}</span>
              )}
            </div>
          </div>
          <button type="submit">Guardar</button>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <h2>Confirmar Eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar este registro?</p>
        <p>
          <strong>Cédula de Identidad:</strong> {recordToDelete?.cedula}
        </p>
        <p>
          <strong>Nombre:</strong> {recordToDelete?.nombres}{" "}
          {recordToDelete?.apellidos}
        </p>
        <div className="modal-actions">
          <button onClick={confirmDelete}>Eliminar</button>
          <button onClick={() => setIsDeleteModalOpen(false)}>Cancelar</button>
        </div>
      </Modal>

      <Modal
        isOpen={isDeletedModalOpen}
        onClose={() => setIsDeletedModalOpen(false)}
      >
        <h2>Registro Eliminado</h2>
        <div className="deleted-message">
          <FaCheckCircle className="deleted-icon" />
          <p>El registro ha sido eliminado con éxito.</p>
        </div>
      </Modal>

      <Modal
        isOpen={isCreatedModalOpen}
        onClose={() => setIsCreatedModalOpen(false)}
      >
        <h2>Registro Creado</h2>
        <div className="confirmation-modal">
          <div className="confirmation-message">
            <FaCheckCircle className="confirmation-icon" />
            <p>El registro ha sido creado con éxito.</p>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isUpdatedModalOpen}
        onClose={() => setIsUpdatedModalOpen(false)}
      >
        <h2>Registro Actualizado</h2>
        <div className="confirmation-modal">
          <div className="confirmation-message">
            <FaCheckCircle className="confirmation-icon" />
            <p>El registro ha sido actualizado con éxito.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Persona;