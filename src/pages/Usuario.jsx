import React, { useState } from "react";
import { 
  FaEye, 
  FaEyeSlash, 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaChevronLeft, 
  FaChevronRight, 
  FaCheckCircle 
} from "react-icons/fa";
import Header from "../components/Header";
import Menu from "../components/Menu";
import Footer from "../components/Footer";
import Modal from "../components/Modal"; 
import "../assets/styles/App.css";

const Usuario = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([
    {
      identityCard: "12345678",
      firstName: "Juan",
      lastName: "Pérez",
      email: "juan.perez@example.com",
      birthDate: "1990-01-01",
      phone: "123456789",
      status: "activo",
    },
    {
      identityCard: "87654321",
      firstName: "María",
      lastName: "Gómez",
      email: "maria.gomez@example.com",
      birthDate: "1985-05-15",
      phone: "987654321",
      status: "inactivo",
    },
    {
      identityCard: "11223344",
      firstName: "Carlos",
      lastName: "López",
      email: "carlos.lopez@example.com",
      birthDate: "1992-03-20",
      phone: "456789123",
      status: "activo",
    },
    {
      identityCard: "44332211",
      firstName: "Ana",
      lastName: "Martínez",
      email: "ana.martinez@example.com",
      birthDate: "1995-07-30",
      phone: "321654987",
      status: "activo",
    },
    {
      identityCard: "55667788",
      firstName: "Luis",
      lastName: "Fernández",
      email: "luis.fernandez@example.com",
      birthDate: "1988-11-11",
      phone: "654321789",
      status: "inactivo",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletedModalOpen, setIsDeletedModalOpen] = useState(false);
  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewRecord, setViewRecord] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const initialRecordState = {
    identityCard: "",
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    phone: "",
    status: "activo",
  };

  const [newRecord, setNewRecord] = useState(initialRecordState);

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
    setRecords(records.map(record => 
      record.identityCard === newRecord.identityCard ? newRecord : record
    ));
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
    const currentRecords = filteredRecords.slice(startIndex, startIndex + limit);

    return (
      <div className="records-container">
        <h2>Catálogo de Usuario</h2>
        <div className="search-container">
          <label htmlFor="search" className="search-label">Buscar usuario</label>
          <input
            type="text"
            id="search"
            placeholder="Buscar por la cédula o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button onClick={() => setIsModalOpen(true)} className="add-button" title="Agregar Nuevo Registro">
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
                <th>Usuario</th>
                <th>Estatus</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((record) => (
                  <tr key={record.identityCard}>
                    <td>{record.identityCard}</td>
                    <td>{`${record.firstName}`}</td>
                    <td>{record.status}</td>
                    <td>
                      <button onClick={() => handleView(record.identityCard)} title="Ver Datos">
                        <FaEye />
                      </button>
                      <button onClick={() => handleEdit(record.identityCard)} title="Actualizar">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(record.identityCard)} title="Eliminar">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-results">No se encontraron registros.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="pagination-button">
            <FaChevronLeft />
          </button>
          <span>Página {currentPage} de {totalPages}</span>
          <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="pagination-button">
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
    setRecords(records.filter((record) => record.identityCard !== recordToDelete.identityCard));
    setRecordToDelete(null);
    setIsDeleteModalOpen(false);
    setIsDeletedModalOpen(true);
  };

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
        <h2>Datos de Usuario</h2>
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
              <label className="form-label">Nombre de Usuario:</label>
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
              <label className="form-label">Contraseña:</label>
              <div className="password-container">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  name="lastName" // Cambia esto si es necesario
                  value={newRecord.lastName}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="password-toggle-button"
                  title={isPasswordVisible ? "Ocultar Contraseña" : "Ver Contraseña"}
                >
                  {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="form-group input-col-12">
              <label className="form-label">Estado:</label>
              <select
                name="status"
                value={newRecord.status}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                <option value="activo">Activo</option>
              </select>
            </div>
          </div>
          <button type="submit">Guardar</button>
        </form>
      </Modal>

      {/* Modal para ver datos */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
        <h2>Detalles de Usuario</h2>
        {viewRecord && (
          <div className="view-record-details">
            <p><strong>Cédula de Identidad:</strong> {viewRecord.identityCard}</p>
            <p><strong>Usuario:</strong> {viewRecord.firstName}</p>
            <p><strong>Estatus:</strong> {viewRecord.status}</p>
          </div>
        )}
      </Modal>

      {/* Modal para editar datos */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2>Actualizar Datos de Usuario</h2>
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
              <label className="form-label">Nombre de Usuario:</label>
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
              <label className="form-label">Contraseña:</label>
              <div className="password-container">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  name="lastName" // Cambia esto si es necesario
                  value={newRecord.lastName}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="password-toggle-button"
                  title={isPasswordVisible ? "Ocultar Contraseña" : "Ver Contraseña"}
                >
                  {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="form-group input-col-12">
              <label className="form-label">Estado:</label>
              <select
                name="status"
                value={newRecord.status}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>
          <button type="submit">Actualizar</button>
        </form>
      </Modal>

      {/* Modal para confirmar eliminación */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <h2>Confirmar Eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar este registro?</p>
        <p><strong>Cédula de Identidad:</strong> {recordToDelete?.identityCard}</p>
        <p><strong>Nombre:</strong> {recordToDelete?.firstName} {recordToDelete?.lastName}</p>
        <div className="modal-actions">
          <button onClick={confirmDelete}>Eliminar</button>
          <button onClick={() => setIsDeleteModalOpen(false)}>Cancelar</button>
        </div>
      </Modal>

      {/* Modal para mostrar que el registro ha sido eliminado */}
      <Modal isOpen={isDeletedModalOpen} onClose={() => setIsDeletedModalOpen(false)}>
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