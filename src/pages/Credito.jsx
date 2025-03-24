import React, { useState } from "react";
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
import "../assets/styles/App.css";

const Usuario = () => {
  // State management
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletedModalOpen, setIsDeletedModalOpen] = useState(false);
  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewRecord, setViewRecord] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);

  // Bank options
  const bancos = [
    "Banco Central de Venezuela",
    "Banco de Venezuela S.A.C.A.",
    "Venezolano de Crédito, S.A.",
    "Banco Mercantil, C.A.",
    "Banco Provincial, S.A.",
    "Bancaribe C.A.",
    "Banco Exterior C.A.",
    "Banco Occidental de Descuento, C.A.",
    "Banco Caroní C.A.",
    "Banesco Banco Universal S.A.C.A.",
    "Banco Sofitasa, C.A.",
    "Banco Plaza, C.A.",
    "Banco de la Gente Emprendedora C.A.",
    "BFC Banco Fondo Común C.A.",
    "100% Banco, C.A.",
    "DelSur Banco Universal C.A.",
    "Banco del Tesoro, C.A.",
    "Banco Agrícola de Venezuela, C.A.",
    "Bancrecer, S.A.",
    "Mi Banco, C.A.",
    "Banco Activo, C.A.",
    "Bancamiga, C.A.",
    "Banco Internacional de Desarrollo, C.A.",
    "Banplus Banco Universal, C.A.",
    "Banco Bicentenario del Pueblo de la Clase Obrera, Mujer y Comunas B.U.",
  ];

  // Initial record state
  const initialRecordState = {
    identityCard: "",
    firstName: "",
    lastName: "",
    email: "",
    type: "",
    gender: "",
    birthDate: "",
    phone: "",
    bank: "",
    accountType: "",
    accountNumber: "",
    amountInDollars: "",
    exchangeInBolivares: "",
  };

  const [newRecord, setNewRecord] = useState(initialRecordState);

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord({ ...newRecord, [name]: value });
  };

  // Form submission handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    setRecords([...records, newRecord]);
    resetForm();
    setIsModalOpen(false);
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

  // Menu toggle
  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  // Data table rendering
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
        <h2>Catálogo de Gestión de Crédito</h2>
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
                        title="Ver Datos"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(record.identityCard)}
                        title="Actualizar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(record.identityCard)}
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

  // Record handling functions
  const handleView = (id) => {
    const recordToView = records.find((record) => record.identityCard === id);
    if (recordToView) {
      setViewRecord(recordToView);
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
        <h2>Datos para la gestión de crédito</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group input-col-11">
              <label>N° de Contrato:</label>
              <input
                type="text"
                name="identityCard"
                value={newRecord.identityCard}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-12">
              <label>Método de Pago:</label>
              <select
                name="accountType"
                value={newRecord.accountType}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                <option value="">Seleccionar...</option>
                <option value="Divisa">Divisa</option>
                <option value="Transferencia">Transferencia</option>
              </select>
            </div>

            {newRecord.accountType === "Transferencia" && (
              <>
                <div className="form-group input-col-6">
                  <label>Nombre del Banco:</label>
                  <select
                    name="bank"
                    value={newRecord.bank}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  >
                    <option value="">Seleccionar Banco...</option>
                    {bancos.map((banco, index) => (
                      <option key={index} value={banco}>
                        {banco}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group input-col-6">
                  <label>N° de Cuenta:</label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={newRecord.accountNumber}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group input-col-6">
                  <label>Monto en Dólar:</label>
                  <input
                    type="text"
                    name="amountInDollars"
                    value={newRecord.amountInDollars}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group input-col-6">
                  <label>Cambio en Bolívares:</label>
                  <input
                    type="text"
                    name="exchangeInBolivares"
                    value={newRecord.exchangeInBolivares}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
              </>
            )}

            {newRecord.accountType === "Divisa" && (
              <div className="form-group input-col-12">
                <label>Monto en Dólar:</label>
                <input
                  type="text"
                  name="amountInDollars"
                  value={newRecord.amountInDollars}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
            )}
          </div>
          <button type="submit">Guardar</button>
        </form>
      </Modal>

      {/* Modal para ver datos */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
        <h2>Detalles de Usuario</h2>
        {viewRecord && (
          <div className="view-record-details">
            <p>
              <strong>Cédula de Identidad:</strong> {viewRecord.identityCard}
            </p>
            <p>
              <strong>Usuario:</strong> {viewRecord.firstName}
            </p>
            <p>
              <strong>Estatus:</strong> {viewRecord.lastName}
            </p>
            <p>
              <strong>Tipo de Usuario:</strong> {viewRecord.gender}
            </p>
            <p>
              <strong>Banco:</strong> {viewRecord.bank}
            </p>
            <p>
              <strong>Tipo de Cuenta:</strong> {viewRecord.accountType}
            </p>
            <p>
              <strong>N° de Cuenta:</strong> {viewRecord.accountNumber}
            </p>
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
              <label>Nombre del Banco:</label>
              <select
                name="bank"
                value={newRecord.bank}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                <option value="">Seleccionar Banco...</option>
                {bancos.map((banco, index) => (
                  <option key={index} value={banco}>
                    {banco}
                  </option>
                ))}
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
    </div>
  );
};

export default Usuario;