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
} from "../services/pagosService";
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
  const [pagos, setPagos] = useState([]);
  const [newPago, setNewPago] = useState({
    contrato_e: "",
    referencia: "",
    fecha: "",
    monto: "",
    dueda: "",
    estatus: "",
  });

  const [exchangeRate, setExchangeRate] = useState(0);
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

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

  const validateForm = () => {
    const errors = {};
    if (!newRecord.contrato_e)
      errors.contrato_e = "El número de contrato es obligatorio.";
    if (!newRecord.euro) errors.euro = "El monto en euros es obligatorio.";
    return errors;
  };

  const handlePagoSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createRecord(newPago);
      setPagos([...pagos, response]);
      resetPagoForm();
      setIsCreatedModalOpen(true);
    } catch (error) {
      console.error("Error creando pago:", error);
      alert("Hubo un problema al registrar el nuevo pago. Inténtalo de nuevo.");
    }
  };

  

  const resetPagoForm = () => {
    setNewPago({
      contrato_e: "",
      referencia: "",
      fecha: "",
      monto: "",
      dueda: "",
      estatus: "",
    });
  };

  const toggleMenu = () => setIsMenuVisible(!isMenuVisible);

  const renderDataTable = () => {
    // Agrupar registros por contrato_e
    const uniqueRecords = Array.from(
      new Map(records.map((record) => [record.contrato_e, record])).values()
    );

    const filteredRecords = uniqueRecords.filter(
      (record) =>
        (record.nombres &&
          record.nombres.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (record.apellidos &&
          record.apellidos.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (record.contrato_e && record.contrato_e.includes(searchTerm))
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
                  <tr key={record.contrato_e}>
                    <td>{record.contrato_e}</td>
                    <td>{`${record.nombres} ${record.apellidos}`}</td>
                    <td>
                      <button
                        onClick={() => handleView(record.contrato_e)}
                        title="Ver Datos"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleDelete(record.contrato_e)}
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
  const handleView = (contrato_e) => {
    const relatedRecords = records.filter(
      (record) => record.contrato_e === contrato_e
    );
    setSelectedRecord(relatedRecords);
    setIsViewModalOpen(true);
  };

  const handleDelete = (id) => {
    const recordToDelete = records.find((record) => record.contrato_e === id);
    if (recordToDelete) {
      setRecordToDelete(recordToDelete);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteRecord(recordToDelete.contrato_e);
      setRecords(
        records.filter(
          (record) => record.contrato_e !== recordToDelete.contrato_e
        )
      );
      setRecordToDelete(null);
      setIsDeleteModalOpen(false);
      setIsDeletedModalOpen(true);
    } catch (error) {
      console.error("Error eliminando registro:", error);
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
        <h2>Registrar Pago</h2>
        <form onSubmit={handlePagoSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group input-col-12">
              <label className="form-label">Contrato:</label>
              <input
                type="text"
                name="contrato_e"
                value={newPago.contrato_e}
                onChange={(e) =>
                  setNewPago({ ...newPago, contrato_e: e.target.value })
                }
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-12">
              <label className="form-label">Referencia:</label>
              <input
                type="text"
                name="referencia"
                value={newPago.referencia}
                onChange={(e) =>
                  setNewPago({ ...newPago, referencia: e.target.value })
                }
                className="form-control"
              />
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Fecha:</label>
              <input
                type="date"
                name="fecha"
                value={newPago.fecha}
                onChange={(e) =>
                  setNewPago({ ...newPago, fecha: e.target.value })
                }
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Monto:</label>
              <input
                type="text"
                name="monto"
                value={newPago.monto}
                onChange={(e) =>
                  setNewPago({ ...newPago, monto: e.target.value })
                }
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Deuda:</label>
              <input
                type="text"
                name="dueda"
                value={newPago.dueda}
                onChange={(e) =>
                  setNewPago({ ...newPago, dueda: e.target.value })
                }
                className="form-control"
              />
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Estatus:</label>
              <input
                type="text"
                name="estatus"
                value={newPago.estatus}
                onChange={(e) =>
                  setNewPago({ ...newPago, estatus: e.target.value })
                }
                className="form-control"
              />
            </div>
          </div>
          <button type="submit">Registrar Pago</button>
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
                    <td>{selectedRecord[0].contrato_e}</td>
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
          <strong>Cédula de Identidad:</strong> {recordToDelete?.contrato_e}
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
