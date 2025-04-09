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

const Usuario = () => {
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
    credito: "",
  };

  const [newRecord, setNewRecord] = useState(initialRecordState);

  // Handle input changes for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord({ ...newRecord, [name]: value });
  };

  // Handle form submission for adding a new record
  const handleSubmit = (e) => {
    e.preventDefault();
    setRecords([...records, newRecord]);
    resetForm();
    setIsModalOpen(false);
  };

  // Handle form submission for updating a record
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

  // Reset the form to its initial state
  const resetForm = () => {
    setNewRecord(initialRecordState);
  };

  // Toggle the visibility of the menu
  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  // Render the data table with pagination and search functionality
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
        <h2>Catálogo de Contrato</h2>
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
                    <td>{record.firstName}</td>
                    <td>{record.lastName}</td>
                    <td>
                      <button
                        onClick={() => handleView(record.identityCard)}
                        title="Ver Contrato"
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

  // Handle viewing a record
  const handleView = (id) => {
    const recordToView = records.find((record) => record.identityCard === id);
    if (recordToView) {
      setViewRecord(recordToView);
      setIsViewModalOpen(true);
    }
  };

  // Handle editing a record
  const handleEdit = (id) => {
    const recordToEdit = records.find((record) => record.identityCard === id);
    if (recordToEdit) {
      setNewRecord(recordToEdit);
      setIsEditModalOpen(true);
    }
  };

  // Handle deleting a record
  const handleDelete = (id) => {
    const recordToDelete = records.find((record) => record.identityCard === id);
    if (recordToDelete) {
      setRecordToDelete(recordToDelete);
      setIsDeleteModalOpen(true);
    }
  };

  // Confirm deletion of a record
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

  // Function to generate fake data
  const generateFakeData = () => {
    const fakeRecords = [
      {
        identityCard: "123456789",
        firstName: "Juan",
        lastName: "Pérez",
        email: "juan.perez@example.com",
        type: "Emprendedor",
        gender: "Masculino",
        birthDate: "1990-01-01",
        credito: "IFEMI/CRED/001-24",
      },
      {
        identityCard: "987654321",
        firstName: "María",
        lastName: "Gómez",
        email: "maria.gomez@example.com",
        type: "Emprendedor",
        gender: "Femenino",
        birthDate: "1992-02-02",
        credito: "IFEMI/CRED/002-24",
      },
      {
        identityCard: "456789123",
        firstName: "Carlos",
        lastName: "López",
        email: "carlos.lopez@example.com",
        type: "Emprendedor",
        gender: "Masculino",
        birthDate: "1988-03-03",
        credito: "IFEMI/CRED/003-24",
      },
      {
        identityCard: "321654987",
        firstName: "Ana",
        lastName: "Martínez",
        email: "ana.martinez@example.com",
        type: "Emprendedor",
        gender: "Femenino",
        birthDate: "1995-04-04",
        credito: "IFEMI/CRED/004-24",
      },
      {
        identityCard: "654321789",
        firstName: "Luis",
        lastName: "Hernández",
        email: "luis.hernandez@example.com",
        type: "Emprendedor",
        gender: "Masculino",
        birthDate: "1985-05-05",
        credito: "IFEMI/CRED/005-24",
      },
    ];
    setRecords(fakeRecords);
  };

  // Use effect to generate fake data on component mount
  useEffect(() => {
    generateFakeData();
  }, []);

  return (
    <div className={`dashboard-container ${isMenuVisible ? "" : "menu-hidden"}`}>
      <Header />
      <Menu isMenuVisible={isMenuVisible} toggleMenu={toggleMenu} />
      <div className="dashboard-content">
        <div className="container">{renderDataTable()}</div>
      </div>
      <Footer />

      {/* Modal para agregar nuevo registro */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
  <h2>Datos del Contrato</h2>
  <form onSubmit={handleSubmit} className="modal-form">
    <div className="form-row">
      <div className="form-group input-col-12">
        <label className="form-label">Cédula del Emprendedor</label>
        <div className="input-group">
          <input
            type="text"
            name="identityCard"
            value={newRecord.identityCard}
            onChange={handleInputChange}
            className="form-control"
            required
          />
          <button
            type="button"
            className="submit-button indigo"
            onClick={() => { /* Acción del botón */ }}
          >
            Buscar
          </button>
        </div>
      </div>
      <div className="form-group input-col-6">
        <label className="form-label">N° Contrato:</label>
        <input
          type="text"
          name="credito"
          value={newRecord.credito}
          onChange={handleInputChange}
          className="form-control"
          required
        />
      </div>
      <div className="form-group input-col-6">
        <label className="form-label">Fecha de Apertura:</label>
        <input
          type="text"
          name="fechaApertura"
          value={newRecord.fechaApertura}
          onChange={handleInputChange}
          className="form-control"
          required
        />
      </div>
      <div className="form-group input-col-12">
        <label className="form-label">Estatus</label>
        <input
          type="text"
          name="condicion"
          value="Activo(a)"
          onChange={handleInputChange}
          className="form-control"
          required
          disabled
        />
      </div>
    </div>
    <button type="submit" className="submit-button">Guardar</button>
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
              <strong>Nombre:</strong> {viewRecord.firstName}
            </p>
            <p>
              <strong>Apellido:</strong> {viewRecord.lastName}
            </p>
            <p>
              <strong>N° Contrato:</strong> {viewRecord.credito}
            </p>
            <p>
              <strong>Fecha de Apertura:</strong> {viewRecord.birthDate}
            </p>
          </div>
        )}
      </Modal>

      {/* Modal para editar datos */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2>Actualizar Datos de Usuario</h2>
        <form onSubmit={handleUpdate} className="modal-form">
          <div className="form-row">
            <div className="form-group input-col-11 ">
              <label className="form-label">Cédula del Emprendedor</label>
              <input
                type="text"
                name="identityCard"
                value={newRecord.identityCard}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-7">
              <label className="form-label">Nombres:</label>
              <input
                type="text"
                name="firstName"
                value={newRecord.firstName}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-7">
              <label className="form-label">Apellidos:</label>
              <input
                type="text"
                name="lastName"
                value={newRecord.lastName}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-5">
              <label className="form-label">Fecha de Apertura:</label>
              <input
                type="date"
                name="birthDate"
                value={newRecord.birthDate}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-7">
              <label className="form-label">N° Contrato:</label>
              <input
                type="text"
                name="credito"
                value={newRecord.credito}
                onChange={handleInputChange}
                className="form-control"
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
          <strong>Nombre:</strong> {recordToDelete?.firstName} {recordToDelete?.lastName}
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