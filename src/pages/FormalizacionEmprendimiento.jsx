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
import emprendimientoImage from "../assets/images/empreder_juntos.png";
import Header from "../components/Header";
import Menu from "../components/Menu";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import "../assets/styles/App.css";

const Formalizacion = () => {
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
        <h2>Catálogo de formalizacion de Emprendimiento</h2>
        {/* Enlace para abrir en nueva pestaña */}
        <div className="link-container">
          <a
            href="https://emprenderjuntos.gob.ve/"
            target="_blank"
            rel="noopener noreferrer"
            className="styled-link"
          >
            <img
              src={emprendimientoImage} // Usar la variable importada
              alt="Descripción de la imagen"
              className="link-image" // Clase para aplicar estilos a la imagen
            />
          </a>
        </div>
        <br />
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
                    <td>{`${record.firstName} `}</td>
                    <td>{record.lastName}</td>
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

  // Function to generate fake data
  const generateFakeData = () => {
    const fakeRecords = [
      {
        identityCard: "123456789",
        firstName: "Juan",
        lastName: "Pérez",
        email: "juan.perez@example.com",
        type: "Emprendedor",
        gender: "67547983478",
        birthDate: "1990-01-01",
        phone: "1234567890",
      },
      {
        identityCard: "987654321",
        firstName: "María",
        lastName: "Gómez",
        email: "maria.gomez@example.com",
        type: "Emprendedor",
        gender: "Femenino",
        birthDate: "1992-02-02",
        phone: "0987654321",
      },
      {
        identityCard: "456789123",
        firstName: "Carlos",
        lastName: "López",
        email: "carlos.lopez@example.com",
        type: "Emprendedor",
        gender: "67547983478",
        birthDate: "1988-03-03",
        phone: "4567891230",
      },
      {
        identityCard: "321654987",
        firstName: "Ana",
        lastName: "Martínez",
        email: "ana.martinez@example.com",
        type: "Emprendedor",
        gender: "Femenino",
        birthDate: "1995-04-04",
        phone: "3216549870",
      },
      {
        identityCard: "654321789",
        firstName: "Luis",
        lastName: "Hernández",
        email: "luis.hernandez@example.com",
        type: "Emprendedor",
        gender: "67547983478",
        birthDate: "1985-05-05",
        phone: "6543217890",
      },
    ];
    setRecords(fakeRecords);
  };

  // Use effect to generate fake data on component mount
  useEffect(() => {
    generateFakeData();
  }, []);

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
        <h2>Datos de nueva formalizacion de Emprendimiento</h2>
        <form onSubmit={handleSubmit} className="modal-form">
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
            <div className="form-group input-col-3">
              <label>Fecha de Inscripcion:</label>
              <input
                type="date"
                name="firstName"
                value={newRecord.firstName}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-9">
              <label>
                N° de Registro del Certificado Emitido Pagina Emprender Juntos:
              </label>
              <input
                type="text"
                name="lastName"
                value={newRecord.lastName}
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
        <h2>Detalles de Formalizacion</h2>
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
              <strong>Fecha de Inscripcion:</strong> {viewRecord.birthDate}
            </p>
            <p>
              <strong>
                N° de Registro del Certificado Emitido Pagina Emprender Juntos:
              </strong>{" "}
              {viewRecord.gender}
            </p>
          </div>
        )}
      </Modal>

      {/* Modal para editar datos */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2>Actualizar Datos de Formalizacion</h2>
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
            <div className="form-group input-col-3">
              <label>Fecha de Inscripcion:</label>
              <input
                type="date"
                name="firstName"
                value={newRecord.birthDate}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-9">
              <label>
                N° de Registro del Certificado Emitido Pagina Emprender Juntos:
              </label>
              <input
                type="text"
                name="lastName"
                value={newRecord.lastName}
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

export default Formalizacion;
