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
import "../assets/styles/App.css";

const NuevoEmprendimiento = () => {
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

  const initialRecordState = {
    identityCard: "",
    firstName: "",
    lastName: "",
    email: "",
    type: "",
    gender: "",
    birthDate: "",
    phone: "",
    rif: "",
    businessName: "",
    address: "",
  };

  const [newRecord, setNewRecord] = useState(initialRecordState);

  // Sample data
  useEffect(() => {
    const sampleRecords = [
      {
        identityCard: "12345678",
        firstName: "Juan",
        lastName: "Pérez",
        email: "juan.perez@example.com",
        type: "Emprendimiento",
        gender: "Masculino",
        birthDate: "1990-01-01",
        phone: "1234567890",
        rif: "J-12345678-9",
        businessName: "Emprendimiento Uno",
        address: "Calle Falsa 123",
      },
      {
        identityCard: "87654321",
        firstName: "María",
        lastName: "Gómez",
        email: "maria.gomez@example.com",
        type: "Emprendimiento",
        gender: "Femenino",
        birthDate: "1992-02-02",
        phone: "0987654321",
        rif: "J-87654321-0",
        businessName: "Emprendimiento Dos",
        address: "Avenida Siempre Viva 742",
      },
      {
        identityCard: "11223344",
        firstName: "Carlos",
        lastName: "López",
        email: "carlos.lopez@example.com",
        type: "Emprendimiento",
        gender: "Masculino",
        birthDate: "1985-03-03",
        phone: "1122334455",
        rif: "J-11223344-1",
        businessName: "Emprendimiento Tres",
        address: "Boulevard de los Sueños 456",
      },
    ];
    setRecords(sampleRecords);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord({ ...newRecord, [name]: value });
  };

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
        <h2>Catálogo de Nuevo Emprendimiento</h2>
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
                        title="Ver Emprendimiento"
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
        <h2>Datos del Emprendimiento</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group input-col-12">
              <label className="form-label">Cédula de Identidad:</label>
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
              <label className="form-label">Fecha de Emisión:</label>
              <input
                type="date"
                name="birthDate" // Changed to birthDate for consistency
                value={newRecord.birthDate}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Tipo de Emprendimiento:</label>
              <input
                type="text"
                name="type" // Changed to type for consistency
                value={newRecord.type}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-4">
              <label className="form-label">RIF:</label>
              <input
                type="text"
                name="rif" // Changed to rif for consistency
                value={newRecord.rif}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-8">
              <label className="form-label">Nombre del Emprendimiento:</label>
              <input
                type="text"
                name="businessName" // Changed to businessName for clarity
                value={newRecord.businessName}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-12">
              <label className="form-label">Estado Actual Emprendimiento:</label>
              <input
                type="text"
                name="businessStatus" // Changed to businessStatus for clarity
                value={newRecord.businessStatus}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-12">
              <label className="form-label">Dirección del Emprendimiento:</label>
              <textarea
                name="address"
                value={newRecord.address}
                onChange={handleInputChange}
                className="form-control"
                rows="6" // Increase the number of rows
                cols="50" // Set the number of columns
                required
              />
            </div>
          </div>
          <button type="submit">Guardar</button>
        </form>
      </Modal>
      {/* Modal para ver datos */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
        <h2>Detalles de NuevoEmprendimiento</h2>
        {viewRecord && (
          <div className="view-record-details">
            <p>
              <strong>Cédula de Identidad:</strong> {viewRecord.identityCard}
            </p>
            <p>
              <strong>Nombres:</strong> {viewRecord.firstName}
            </p>
            <p>
              <strong>Apellidos:</strong> {viewRecord.lastName}
            </p>
            <p>
              <strong>Fecha de Emision:</strong> {viewRecord.birthDate}
            </p>
            <p>
              <strong>Tipo de Emprendimiento:</strong> {viewRecord.type}
            </p>
            <p>
              <strong>RIF:</strong> {viewRecord.rif}
            </p>
            <p>
              <strong>Nombre del Emprendimiento:</strong> {viewRecord.businessName}
            </p>
            <p>
              <strong>Estado Actual de Emprendimiento:</strong> {viewRecord.businessStatus}
            </p>
            <p>
              <strong>Direccion de Emprendimiento:</strong> {viewRecord.address}
            </p>
          </div>
        )}
      </Modal>

      {/* Modal para editar datos */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2>Actualizar Datos de NuevoEmprendimiento</h2>
        <form onSubmit={handleUpdate} className="modal-form">
          <div className="form-row">
            <div className="form-group input-col-12">
              <label className="form-label">Cédula de Identidad:</label>
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
              <label className="form-label">Fecha de Emisión:</label>
              <input
                type="date"
                name="birthDate" // Changed to birthDate for consistency
                value={newRecord.birthDate}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Tipo de Emprendimiento:</label>
              <input
                type="text"
                name="type" // Changed to type for consistency
                value={newRecord.type}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-4">
              <label className="form-label">RIF:</label>
              <input
                type="text"
                name="rif" // Changed to rif for consistency
                value={newRecord.rif}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-8">
              <label className="form-label">Nombre del Emprendimiento:</label>
              <input
                type="text"
                name="businessName" // Changed to businessName for clarity
                value={newRecord.businessName}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-12">
              <label className="form-label">Estado Actual Emprendimiento:</label>
              <input
                type="text"
                name="businessStatus" // Changed to businessStatus for clarity
                value={newRecord.businessStatus}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-12">
              <label className="form-label">Dirección del Emprendimiento:</label>
              <textarea
                name="address"
                value={newRecord.address}
                onChange={handleInputChange}
                className="form-control"
                rows="6" // Increase the number of rows
                cols="50" // Set the number of columns
                required
              />
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

export default NuevoEmprendimiento;