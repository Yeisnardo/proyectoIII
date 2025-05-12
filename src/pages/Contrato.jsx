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
  deleteRecord,
} from "../services/CreditoService.js";
import axios from "axios";
import "../assets/styles/App.css";

const Credito = () => {
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
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [errors, setErrors] = useState({});
  const [newRecord, setNewRecord] = useState({
    id: null, // Cambiado para ser asignado automáticamente
    n_contrato: "",
    euro: "",
    bolivares: "",
    cincoflax: "",
    diezinteres: "",
    interes_semanal: "",
    semanal_sin_interes: "",
    couta: "",
    desde: "",
    hasta: "",
  });

  const [exchangeRate, setExchangeRate] = useState(0);
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [nextId, setNextId] = useState(1); // Estado para el ID auto-incrementabl

  const fetchExchangeRate = async () => {
    try {
      const response = await axios.get(
        "https://api.exchangerate-api.com/v4/latest/EUR"
      );
      setExchangeRate(response.data.rates.VES);
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRecords();
        setRecords(data);
        fetchExchangeRate();
        // Establecer el siguiente ID basado en los registros existentes
        const maxId = data.reduce(
          (max, record) => Math.max(max, parseInt(record.id)),
          0
        );
        setNextId(maxId + 1);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(window.navigator.onLine);
      if (window.navigator.onLine) fetchExchangeRate();
    };

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewRecord((prevRecord) => {
      const updatedRecord = {
        ...prevRecord,
        [name]: value,
      };

      // Realizar cálculos automáticos
      if (name === "euro") {
        const euroAmount = parseFloat(value) || 0;
        const bolivaresAmount = (euroAmount * exchangeRate).toFixed(2);

        // Actualizar el monto en bolívares
        updatedRecord.bolivares = bolivaresAmount;

        // Calcular el 5% flat
        updatedRecord.cincoflax = (parseFloat(bolivaresAmount) * 0.05).toFixed(
          2
        );
        // Calcular el 10% de interés
        updatedRecord.diezinteres = (euroAmount * 0.1).toFixed(2);
        // Calcular el interés semanal
        const diezInteres = parseFloat(updatedRecord.diezinteres) || 0;
        updatedRecord.interes_semanal = (diezInteres / 14).toFixed(2);
        // Calcular la semana sin interés
        updatedRecord.semanal_sin_interes = (euroAmount / 14).toFixed(2);
        // Calcular la cuota a cancelar
        const semanalSinInteres =
          parseFloat(updatedRecord.semanal_sin_interes) || 0;
        updatedRecord.couta = (
          semanalSinInteres + parseFloat(updatedRecord.interes_semanal)
        ).toFixed(2);
      }

      // Actualizar la fecha "hasta" en función de la fecha "desde"
      if (name === "desde") {
        const startDate = new Date(value);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 98); // Agregar 14 semanas
        updatedRecord.hasta = endDate.toISOString().split("T")[0]; // Formato para el input de tipo date
      }

      return updatedRecord;
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!newRecord.n_contrato)
      errors.n_contrato = "El número de contrato es obligatorio.";
    if (!newRecord.euro) errors.euro = "El monto en euros es obligatorio.";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    newRecord.id = nextId; // Asignar el ID auto-incrementable

    try {
      const response = await createRecord(newRecord);
      setRecords([...records, response]);
      setNextId(nextId + 1); // Incrementar el ID para el siguiente registro
      resetForm();
      setIsModalOpen(false);
      setIsCreatedModalOpen(true);
    } catch (error) {
      console.error("Error creando registro:", error);
      alert(
        "Hubo un problema al registrar el nuevo registro. Inténtalo de nuevo."
      );
    }
  };

  const resetForm = () => {
    setNewRecord({
      id: null,
      n_contrato: "",
      euro: "",
      bolivares: "",
      cincoflax: "",
      diezinteres: "",
      interes_semanal: "",
      semanal_sin_interes: "",
      couta: "",
      desde: "",
      hasta: "",
    });
    setErrors({});
  };

  const toggleMenu = () => setIsMenuVisible(!isMenuVisible);

  const renderDataTable = () => {
    // Agrupar registros por n_contrato
    const uniqueRecords = Array.from(
      new Map(records.map((record) => [record.n_contrato, record])).values()
    );

    const filteredRecords = uniqueRecords.filter(
      (record) =>
        (record.nombres &&
          record.nombres.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (record.apellidos &&
          record.apellidos.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (record.n_contrato && record.n_contrato.includes(searchTerm))
    );

    const totalPages = Math.ceil(filteredRecords.length / limit);
    const startIndex = (currentPage - 1) * limit;
    const currentRecords = filteredRecords.slice(
      startIndex,
      startIndex + limit
    );

    return (
      <div className="records-container">
        <h2>Catálogo de Crédito</h2>
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
            <FaPlus /> Nuevo
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
                <th>N° Contrato</th>
                <th>Nombre y Apellido</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((record) => (
                  <tr key={record.n_contrato}>
                    <td>{record.n_contrato}</td>
                    <td>{`${record.nombres} ${record.apellidos}`}</td>
                    <td>
                      <button
                        onClick={() => handleView(record.n_contrato)}
                        title="Ver Datos"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleDelete(record.n_contrato)}
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

  // Función para manejar la visualización
  const handleView = (n_contrato) => {
    const relatedRecords = records.filter(
      (record) => record.n_contrato === n_contrato
    );
    setSelectedRecord(relatedRecords);
    setIsViewModalOpen(true);
  };

  const handleDelete = (id) => {
    const recordToDelete = records.find((record) => record.n_contrato === id);
    if (recordToDelete) {
      setRecordToDelete(recordToDelete);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteRecord(recordToDelete.n_contrato);
      setRecords(
        records.filter(
          (record) => record.n_contrato !== recordToDelete.n_contrato
        )
      );
      setRecordToDelete(null);
      setIsDeleteModalOpen(false);
      setIsDeletedModalOpen(true);
    } catch (error) {
      console.error("Error deleting record:", error);
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
        <h2>Gestión de crédito</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <input type="hidden" name="id" />
            <div className="form-group input-col-12">
              <label className="form-label">N° de Contrato:</label>
              <input
                type="text"
                name="n_contrato"
                value={newRecord.n_contrato}
                onChange={handleInputChange}
                className="form-control"
                required
              />
              {errors.n_contrato && (
                <span className="error-message">{errors.n_contrato}</span>
              )}
            </div>
            <div className="form-group input-col-12">
              <label className="form-label">Metodo de Pago:</label>
              <select
                name="metodo_pago"
                value={newRecord.metodo_pago}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Seleccionar...</option>
                <option value="Divisas">Divisas</option>
                <option value="Transferencia">Transferencia</option>
              </select>
              {errors.tipo && (
                <span className="error-message">{errors.tipo}</span>
              )}
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Monto en Euros:</label>
              <input
                type="number"
                name="euro"
                value={newRecord.euro}
                onChange={handleInputChange}
                className="form-control"
                required
              />
              {errors.euro && (
                <span className="error-message">{errors.euro}</span>
              )}
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Monto en Bolívares:</label>
              <input
                type="text"
                name="bolivares"
                value={newRecord.bolivares}
                readOnly
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-3">
              <label className="form-label">5% FLAT:</label>
              <input
                type="text"
                name="cincoflax"
                value={newRecord.cincoflax}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-3">
              <label className="form-label">10% de Interés:</label>
              <input
                type="text"
                name="diezinteres"
                value={newRecord.diezinteres}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-3">
              <label className="form-label">Interés Semanal:</label>
              <input
                type="text"
                name="interes_semanal"
                value={newRecord.interes_semanal}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-3">
              <label className="form-label">Semana Sin Interés:</label>
              <input
                type="text"
                name="semanal_sin_interes"
                value={newRecord.semanal_sin_interes}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-12">
              <label className="form-label">Cuota a Cancelar:</label>
              <input
                type="text"
                name="couta"
                value={newRecord.couta}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Desde:</label>
              <input
                type="date"
                name="desde"
                value={newRecord.desde}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Hasta:</label>
              <input
                type="date"
                name="hasta"
                value={newRecord.hasta}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
          </div>
          <button type="submit">Registrar</button>
        </form>
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        className="view-modal"
      >
        <div className="modal-header">
          <h2>Detalles del Crédito</h2>
          <button
            onClick={() => setIsViewModalOpen(false)}
            className="close-button"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          {selectedRecord && selectedRecord.length > 0 ? (
            <>
              {/* Sección de detalles del beneficiado (toma datos del primer registro) */}
              <h4>Detalles del beneficiado</h4>
              <table className="details-table">
                <tbody>
                  <tr>
                    <td>
                      <strong>N° Contrato:</strong>
                    </td>
                    <td>{selectedRecord[0].n_contrato}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Nombres:</strong>
                    </td>
                    <td>{selectedRecord[0].nombres}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Apellidos:</strong>
                    </td>
                    <td>{selectedRecord[0].apellidos}</td>
                  </tr>
                </tbody>
              </table>

              {/* Tabla de detalles del crédito */}
              <h4>Detalles del Crédito</h4>
              <table className="status-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Método de Pago</th>
                    <th>Euros</th>
                    <th>Bolívares</th>
                    <th>5% FLAT</th>
                    <th>10% de Interés</th>
                    <th>Interés Semanal</th>
                    <th>Semana Sin Interés</th>
                    <th>Cuota a Cancelar</th>
                    <th>Desde</th>
                    <th>Hasta</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRecord.map((record, index) => (
                    <tr key={index}>
                      <td>{record.id || "N/A"}</td>
                      <td>{record.metodo_pago || "N/A"}</td>
                      <td>{record.euro || "N/A"}</td>
                      <td>{record.bolivares || "N/A"}</td>
                      <td>{record.cincoflax || "N/A"}</td>
                      <td>{record.diezinteres || "N/A"}</td>
                      <td>{record.interes_semanal || "N/A"}</td>
                      <td>{record.semanal_sin_interes || "N/A"}</td>
                      <td>{record.couta || "N/A"}</td>
                      <td>{record.desde || "N/A"}</td>
                      <td>{record.hasta || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p>No hay registros para mostrar.</p>
          )}
        </div>

        <div className="modal-footer">
          <button
            onClick={() => setIsViewModalOpen(false)}
            className="close-modal-button"
          >
            Cerrar
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <h2>Confirmar Eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar este registro?</p>
        <p>
          <strong>Cédula de Identidad:</strong> {recordToDelete?.n_contrato}
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
          <FaCheckCircle className="confirmation-icon" />
          <p>El registro ha sido creado con éxito.</p>
        </div>
      </Modal>

      <Modal
        isOpen={isUpdatedModalOpen}
        onClose={() => setIsUpdatedModalOpen(false)}
      >
        <h2>Registro Actualizado</h2>
        <div className="confirmation-modal">
          <FaCheckCircle className="confirmation-icon" />
          <p>El registro ha sido actualizado con éxito.</p>
        </div>
      </Modal>
    </div>
  );
};

export default Credito;