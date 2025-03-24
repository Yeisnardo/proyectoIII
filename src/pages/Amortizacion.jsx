import React, { useState } from "react";
import {
  FaEye,
  FaEdit,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
} from "react-icons/fa";
import Header from "../components/Header";
import Menu from "../components/Menu";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import "../assets/styles/App.css";

const Usuario = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletedModalOpen, setIsDeletedModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewRecord, setViewRecord] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState([]);

  const initialRecordState = {
    identityCard: "",
    firstName: "",
    lastName: "",
    email: "",
    type: "",
    gender: "",
    birthDate: "",
    phone: "",
    contractNumber: "",
    weeks: "",
    payments: [],
  };

  const [newRecord, setNewRecord] = useState(initialRecordState);
  const [newPayment, setNewPayment] = useState({
    week: "",
    paymentDate: "",
    weeklyPayment: "",
    balance: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord({ ...newRecord, [name]: value });
  };

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setNewPayment({ ...newPayment, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setRecords([...records, newRecord]);
    resetForm();
    setIsModalOpen(false);
  };

  const handleAddPayment = (e) => {
    e.preventDefault();
    const updatedRecords = records.map((record) => {
      if (record.identityCard === viewRecord.identityCard) {
        return {
          ...record,
          payments: [...record.payments, newPayment],
        };
      }
      return record;
    });
    setRecords(updatedRecords);
    resetPaymentForm();
    setIsPaymentModalOpen(false);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setRecords(
      records.map((record) =>
        record.identityCard === newRecord.identityCard ? newRecord : record
      )
    );
    resetForm();
    setIsEditModalOpen(false);
  };

  const resetForm = () => {
    setNewRecord(initialRecordState);
  };

  const resetPaymentForm = () => {
    setNewPayment({
      week: "",
      paymentDate: "",
      weeklyPayment: "",
      balance: "",
    });
  };

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const renderDataTable = () => {
    const filteredRecords = records.filter((record) => {
      return (
        record.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.identityCard.includes(searchTerm)
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
        <h2>Catálogo de Amortizacion</h2>
        <div className="search-container">
          <label htmlFor="search" className="search-label">
            Buscar usuario
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
            <FaPlus /> Añadir tiempo de plazo
          </button>
          &nbsp;
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="add-button"
            title="Agregar Pagos"
          >
            <FaPlus /> Añadir Pagos
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
                <th>C.I Emprendedor</th>
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((record) => (
                  <tr key={record.identityCard}>
                    <td>{record.identityCard}</td>
                    <td>{`${record.firstName} ${record.lastName}`}</td>
                    <td>{record.type}</td>
                    <td>
                      <button
                        onClick={() => handleView(record.identityCard)}
                        title="Ver Pagos"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(record.identityCard)}
                        title="Actualizar"
                      >
                        <FaEdit />
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
    const recordToView = records.find((record) => record.identityCard === id);
    if (recordToView) {
      setViewRecord(recordToView);
      setPaymentDetails(recordToView.payments);
      setIsViewModalOpen(true);
    }
  };

  const handleEdit = (id) => {
    const recordToEdit = records.find((record) => record.identityCard === id);
    if (recordToEdit) {
      setNewRecord(recordToEdit);
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = (id) => {
    const recordToDelete = records.find((record) => record.identityCard === id);
    if (recordToDelete) {
      setRecordToDelete(recordToDelete);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = () => {
    setRecords(
      records.filter(
        (record) => record.identityCard !== recordToDelete.identityCard
      )
    );
    setRecordToDelete(null);
    setIsDeleteModalOpen(false);
    setIsDeletedModalOpen(true);
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
        <h2>Agregar tiempo de pago de Credito</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group input-col-11">
              <label>N° de Contrato</label>
              <input
                type="text"
                name="contractNumber"
                value={newRecord.contractNumber}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-1">
              <button type="submit">B</button>
            </div>
            <div className="form-group input-col-6">
              <label>Desde</label>
              <input
                type="date"
                name="weeks"
                value={newRecord.weeks}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-6">
              <label>Hasta</label>
              <input
                type="date"
                name="weeks"
                value={newRecord.weeks}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
          </div>
          <button type="submit">Guardar</button>
        </form>
      </Modal>

      {/* Modal para ver datos */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
        <h2>Detalles de Cobros</h2>
        {viewRecord && (
          <div>
            <p>
              <strong>Cédula de Identidad:</strong> {viewRecord.identityCard}
            </p>
            <p>
              <strong>Nombre:</strong> {viewRecord.firstName}{" "}
              {viewRecord.lastName}
            </p>
            <p>
              <strong>Apellido:</strong> {viewRecord.email}
            </p>

            <h3>Detalles de Pagos</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Semana</th>
                  <th>Fecha de Pago</th>
                  <th>Monto pagado</th>
                  <th>Saldo</th>
                </tr>
              </thead>
              <tbody>
                {paymentDetails.length > 0 ? (
                  paymentDetails.map((payment, index) => (
                    <tr key={index}>
                      <td>{payment.week}</td>
                      <td>{payment.paymentDate}</td>
                      <td>{payment.weeklyPayment}</td>
                      <td>{payment.balance}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-results">
                      No hay detalles de pagos disponibles.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Modal>

      {/* Modal para editar datos */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2>Actualizar Datos de Usuario</h2>
        <form onSubmit={handleUpdate} className="modal-form">
          <div className="form-row">
            <div className="form-group input-col-12">
              <label>Cédula de Identidad:</label>
              <input
                type="text"
                name="identityCard"
                value={newRecord.identityCard}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-6">
              <label>Nombre de Usuario:</label>
              <input
                type="text"
                name="firstName"
                value={newRecord.firstName}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-6">
              <label>Contraseña:</label>
              <input
                type="password"
                name="lastName"
                value={newRecord.lastName}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-6">
              <label>Tipo de Usuario:</label>
              <select
                name="gender"
                value={newRecord.gender}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                <option value="">Seleccionar...</option>
                <option value="F">F</option>
                <option value="M">M</option>
              </select>
            </div>
            <div className="form-group input-col-6">
              <label>Estatus:</label>
              <select
                name="status"
                value={newRecord.status}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                <option value="">Seleccionar...</option>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
          </div>
          <button type="submit">Actualizar</button>
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
          <strong>Cédula de Identidad:</strong> {recordToDelete?.identityCard}
        </p>
        <p>
          <strong>Nombre:</strong> {recordToDelete?.firstName}{" "}
          {recordToDelete?.lastName}
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

      {/* Modal para agregar pago */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      >
        <h2>Agregar Pago</h2>
        <form onSubmit={handleAddPayment} className="modal-form">
          <div className="form-row">
            <div className="form-group input-col-4">
              <label>Referencia Bancaria</label>
              <input
                type="text"
                name="week"
                value={newPayment.week}
                onChange={handlePaymentInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-4">
              <label>Fecha de Pago</label>
              <input
                type="date"
                name="paymentDate"
                value={newPayment.paymentDate}
                onChange={handlePaymentInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-4">
              <label>Monto Pagado</label>
              <input
                type="number"
                name="weeklyPayment"
                value={newPayment.weeklyPayment}
                onChange={handlePaymentInputChange}
                className="form-control"
                required
              />
            </div>
          </div>
          <button type="submit">Guardar Pago</button>
        </form>
      </Modal>
    </div>
  );
};

export default Usuario;
