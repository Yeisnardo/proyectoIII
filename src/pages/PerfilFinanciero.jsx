import React, { useState, useEffect } from "react";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
} from "react-icons/fa";
import Header from "../components/Header";
import Menu from "../components/Menu";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import {
  fetchRecords,
  createRecord,
  updateRecord,
  deleteRecord,
} from "../services/finacieroService"; // Importa las funciones del servicio
import "../assets/styles/App.css";

const PerfilFinanciero = () => {
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
    banco_seleccionado: "",
    metodo_pago: "",
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
        const data = await fetchRecords();
        setRecords(data);
      } catch (error) {
        console.error("Error al obtener los registros:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord((prevRecord) => ({
      ...prevRecord,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    // Validaciones para los campos de datos_financieros
    if (!newRecord.cedula_datos_financieros)
      newErrors.cedula_datos_financieros = "La cédula es OBLIGATORIA.";
    if (!newRecord.cuenta_bancaria)
      newErrors.cuenta_bancaria = "La cuenta bancaria es OBLIGATORIA.";
    if (!newRecord.banco_seleccionado)
      newErrors.banco_seleleccionado = "El banco seleccionado es OBLIGATORIO.";
    if (!newRecord.metodo_pago)
      newErrors.metodo_pago = "El método de pago es OBLIGATORIO.";
    if (!newRecord.emprendimiento_credito)
      newErrors.emprendimiento_credito =
        "El emprendimiento crédito es OBLIGATORIO.";
    if (!newRecord.numero_clientes_semanal)
      newErrors.numero_clientes_semanal =
        "El número de clientes semanal es OBLIGATORIO.";
    if (!newRecord.declara_iva)
      newErrors.declara_iva = "Indicar si declara IVA es OBLIGATORIO.";
    if (!newRecord.declara_islr)
      newErrors.declara_islr = "Indicar si declara ISLR es OBLIGATORIO.";
    if (!newRecord.compra_contrato_o_credito)
      newErrors.compra_contrato_o_credito =
        "Indicar si compra contrato o crédito es OBLIGATORIO.";
    if (!newRecord.mes_ventas)
      newErrors.mes_ventas = "El mes de ventas es OBLIGATORIO.";
    if (!newRecord.exiges_ventas)
      newErrors.exiges_ventas = "Indicar si exiges ventas es OBLIGATORIO.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (
      records.some(
        (record) =>
          record.cedula_datos_financieros === newRecord.cedula_datos_financieros
      )
    ) {
      alert("La cédula ya existe.");
      return;
    }

    try {
      const response = await createRecord(newRecord);
      setRecords([...records, response]);
      resetForm();
      setIsModalOpen(false);
      setIsCreatedModalOpen(true);
    } catch (error) {
      console.error("Error al registrar la persona:", error);
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
      const response = await updateRecord(
        newRecord.cedula_datos_financieros,
        newRecord
      );
      const updatedRecords = records.map((record) =>
        record.cedula_datos_financieros === response.cedula_datos_financieros
          ? response
          : record
      );
      setRecords(updatedRecords);
      resetForm();
      setIsEditModalOpen(false);
      setIsUpdatedModalOpen(true);
    } catch (error) {
      console.error("Error al actualizar la persona:", error);
      alert("Hubo un problema al actualizar la persona. Inténtalo de nuevo.");
    }
  };

  const resetForm = () => {
    setNewRecord({
      cedula_datos_financieros: "",
      cuenta_bancaria: "",
      banco_seleccionado: "",
      metodo_pago: "",
      emprendimiento_credito: "",
      numero_clientes_semanal: "",
      declara_iva: "",
      declara_islr: "",
      compra_contrato_o_credito: "",
      mes_ventas: "",
      exiges_ventas: "",
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
          record.nombres.toLowerCase().includes(searchTerm.toLowerCase())) || // Name filter
        (record.apellidos &&
          record.apellidos.toLowerCase().includes(searchTerm.toLowerCase())) || // Surname filter
        (record.cedula_datos_financieros &&
          record.cedula_datos_financieros.includes(searchTerm)) // Cedula filter
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
        <h2>Catálogo de Perfil Financiero</h2>
        <div className="search-container">
          <label htmlFor="search" className="search-label">
            Buscar persona
          </label>
          <input
            type="text"
            id="search"
            placeholder="Buscar por la cédula o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="add-button"
            title="Agregar Nuevo Registro"
          >
            <FaPlus />
          </button>
        </div>

        <div className="limit-container">
          <label htmlFor="limit">Entradas de registros:</label>
          <select
            id="limit"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="limit-select"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>C.I</th>
                <th>Nombre y Apellido</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((record) => (
                  <tr key={record.cedula_datos_financieros}>
                    <td>{record.cedula_datos_financieros}</td>
                    <td>{`${record.nombres || ""} ${
                      record.apellidos || ""
                    }`}</td>
                    <td>
                      <button
                        onClick={() =>
                          handleView(record.cedula_datos_financieros)
                        }
                        title="Ver Datos"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() =>
                          handleEdit(record.cedula_datos_financieros)
                        }
                        title="Actualizar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(record.cedula_datos_financieros)
                        }
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-results">
                    No se encontraron registros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            <FaChevronLeft />
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    );
  };

  const handleView = (id) => {
    const recordToView = records.find(
      (record) => record.cedula_datos_financieros === id
    );
    if (recordToView) {
      setViewRecord(recordToView);
      setIsViewModalOpen(true);
    }
  };

  const handleEdit = (id) => {
    const recordToEdit = records.find(
      (record) => record.cedula_datos_financieros === id
    );
    if (recordToEdit) {
      setNewRecord(recordToEdit);
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = (id) => {
    const recordToDelete = records.find(
      (record) => record.cedula_datos_financieros === id
    );
    if (recordToDelete) {
      setRecordToDelete(recordToDelete);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteRecord(recordToDelete.cedula_datos_financieros);
      setRecords(
        records.filter(
          (record) =>
            record.cedula_datos_financieros !==
            recordToDelete.cedula_datos_financieros
        )
      );
      setRecordToDelete(null);
      setIsDeleteModalOpen(false);
      setIsDeletedModalOpen(true);
    } catch (error) {
      console.error("Error al eliminar el registro:", error);
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
      {/* Modal para agregar nuevo registro */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Datos Perfil Financiero</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group input-col-12">
              <label className="form-label">Cédula de Identidad:</label>
              <input
                type="text"
                name="cedula_datos_financieros"
                value={newRecord.cedula_datos_financieros}
                onChange={handleInputChange}
                className="form-control"
              />
              <button
                type="button"
                className="submit-button indigo"
                onClick={() => {
                  /* Acción del botón */
                }}
              >
                Buscar
              </button>
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
            <div className="form-group input-col-12">
              <label className="form-label">Seleccionar el Banco:</label>
              <select
                name="banco_seleccionado"
                className="form-control"
                multiple
                onChange={handleInputChange}
                style={{ height: "150px" }}
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
                  <option key={banco} value={banco}>
                    {banco}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group input-col-12">
              <label className="form-label">Métodos de Pagos:</label>
              <div style={{ display: "flex" }}>
                {["Pago Movil", "Punto de Venta", "Efectivo", "Biopago"].map(
                  (metodo) => (
                    <div key={metodo}>
                      <input
                        type="checkbox"
                        name="metodo_pago"
                        className="form-control"
                        value={metodo}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="">{metodo}</label>
                    </div>
                  )
                )}
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
          <button type="submit">Guardar</button>
        </form>
      </Modal>
      {/* Modal para ver datos */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
        <h2>Detalles de perfilFinanciero</h2>
        {viewRecord && (
          <div className="view-record-details">
            <p>
              <strong>Cédula de Identidad:</strong>{" "}
              {viewRecord.cedula_datos_financieros}
            </p>
            <p>
              <strong>Cuenta Bancaria:</strong> {viewRecord.cuenta_bancaria}
            </p>
            <p>
              <strong>Banco Seleccionado:</strong>{" "}
              {viewRecord.banco_seleccionado}
            </p>
            <p>
              <strong>Método de Pago:</strong> {viewRecord.metodo_pago}
            </p>
            <p>
              <strong>Emprendimiento Crédito:</strong>{" "}
              {viewRecord.emprendimiento_credito}
            </p>
            <p>
              <strong>N° Clientes Semanales:</strong>{" "}
              {viewRecord.numero_clientes_semanal}
            </p>
            <p>
              <strong>Declaras IVA:</strong> {viewRecord.declara_iva}
            </p>
            <p>
              <strong>Declaras ISLR:</strong> {viewRecord.declara_islr}
            </p>
            <p>
              <strong>Compra a Crédito o Contado:</strong>{" "}
              {viewRecord.compra_contrato_o_credito}
            </p>
            <p>
              <strong>Mes con Más Ventas:</strong> {viewRecord.mes_ventas}
            </p>
            <p>
              <strong>Exiges Porcentajes en Ventas:</strong>{" "}
              {viewRecord.exiges_ventas}
            </p>
          </div>
        )}
      </Modal>{" "}
      {/* Modal para editar datos */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2>Actualizar Datos perfilFinancieroles</h2>
        <form onSubmit={handleUpdate} className="modal-form">
          <div className="form-row">
            <div className="form-group input-col-12">
              <label className="form-label">Cédula de Identidad:</label>
              <input
                type="text"
                name="cedula_datos_financieros"
                value={newRecord.cedula_datos_financieros}
                onChange={handleInputChange}
                className="form-control"
              />
              <button
                type="button"
                className="submit-button indigo"
                onClick={() => {
                  /* Acción del botón */
                }}
              >
                Buscar
              </button>
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
            <div className="form-group input-col-12">
  <label className="form-label">Seleccionar el Banco:</label>
  <select
    name="banco_seleccionado"
    className="form-control"
    multiple
    onChange={handleInputChange}
    style={{ height: "150px" }}
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
      <option key={banco} value={banco} selected={newRecord.banco_seleccionado.includes(banco)}>
        {banco}
      </option>
    ))}
  </select>
</div>
            <div className="form-group input-col-12">
              <label className="form-label">Métodos de Pagos:</label>
              <div style={{ display: "flex" }}>
                {["Pago Movil", "Punto de Venta", "Efectivo", "Biopago"].map(
                  (metodo) => (
                    <div key={metodo}>
                      <input
                        type="checkbox"
                        name="metodo_pago"
                        className="form-control"
                        value={metodo}
                        onChange={handleInputChange}
                        checked={newRecord.metodo_pago.includes(metodo)} // Verifica si está seleccionado

                      />
                      <label htmlFor="">{metodo}</label>
                    </div>
                  )
                )}
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

          <button type="submit">Guardar</button>
        </form>
      </Modal>
      {/* Modal para confirmar eliminación */}
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
          <strong>Nombre:</strong> {recordToDelete?.nombre}{" "}
          {recordToDelete?.apellido}
        </p>
        <div className="modal-actions">
          <button onClick={confirmDelete}>Eliminar</button>
          <button onClick={() => setIsDeleteModalOpen(false)}>Cancelar</button>
        </div>
      </Modal>
      {/* Modal para mostrar que el registro ha sido eliminado */}
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
      {/* Modal para mostrar que el registro ha sido creado */}
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
      {/* Modal para mostrar que el registro ha sido actualizado */}
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

export default PerfilFinanciero;
