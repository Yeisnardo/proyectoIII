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

  const [newRecord, setNewRecord] = useState({
    cedula: "",
    nombre: "",
    apellido: "",
    sexo: "",
    f_nacimiento: "",
    telefono: "",
    correo: "",
    tipo: "",
  });

  const [viewRecord, setViewRecord] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord({ ...newRecord, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check for duplicate cedula
    if (records.some((record) => record.cedula === newRecord.cedula)) {
      alert("La cédula ya existe.");
      return;
    }
    setRecords([...records, newRecord]);
    resetForm();
    setIsModalOpen(false);
    setIsCreatedModalOpen(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    // Check for duplicate cedula
    if (
      records.some(
        (record) =>
          record.cedula === newRecord.cedula &&
          record.cedula !== newRecord.cedula
      )
    ) {
      alert("La cédula ya existe.");
      return;
    }
    setRecords(
      records.map((record) =>
        record.cedula === newRecord.cedula ? newRecord : record
      )
    );
    resetForm();
    setIsEditModalOpen(false);
    setIsUpdatedModalOpen(true);
  };

  const resetForm = () => {
    setNewRecord({
      cedula: "",
      nombre: "",
      apellido: "",
      sexo: "",
      f_nacimiento: "",
      telefono: "",
      correo: "",
      tipo: "",
    });
  };

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const renderDataTable = () => {
    const filteredRecords = records.filter((record) => {
      return (
        record.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.cedula.includes(searchTerm)
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
        <h2>Catálogo de Personas</h2>
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
                <th>Tipo de Persona</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((record) => (
                  <tr key={record.cedula}>
                    <td>{record.cedula}</td>
                    <td>{`${record.nombre} ${record.apellido}`}</td>
                    <td>{record.tipo}</td>
                    <td>
                      <button
                        onClick={() => handleView(record.cedula)}
                        title="Ver Datos"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(record.cedula)}
                        title="Actualizar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(record.cedula)}
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
    const recordToView = records.find((record) => record.cedula === id);
    if (recordToView) {
      setViewRecord(recordToView);
      setIsViewModalOpen(true);
    }
  };

  const handleEdit = (id) => {
    const recordToEdit = records.find((record) => record.cedula === id);
    if (recordToEdit) {
      setNewRecord(recordToEdit);
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = (id) => {
    const recordToDelete = records.find((record) => record.cedula === id);
    if (recordToDelete) {
      setRecordToDelete(recordToDelete);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = () => {
    setRecords(
      records.filter((record) => record.cedula !== recordToDelete.cedula)
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
        <h2>Datos Personales</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group input-col-12">
              <label>Cédula de Identidad:</label>
              <input
                type="text"
                name="cedula"
                value={newRecord.cedula}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-6">
              <label>Nombres:</label>
              <input
                type="text"
                name="nombre"
                value={newRecord.nombre}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-6">
              <label>Apellidos:</label>
              <input
                type="text"
                name="apellido"
                value={newRecord.apellido}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-12">
              <label>Teléfono:</label>
              <input
                type="text"
                name="telefono"
                value={newRecord.telefono}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-12">
              <label>Tipo de Persona:</label>
              <select
                name="tipo"
                value={newRecord.tipo}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                <option value="">Seleccionar...</option>
                <option value="Presidente">Presidente</option>
                <option value="Coord. Creditos y Cobranzas">
                  Coord. Creditos y Cobranzas
                </option>
                <option value="Asist. Creditos y Cobranzas">
                  Asist. Creditos y Cobranzas
                </option>
                <option value="Coord. Formalizacion de Emprendimiento">
                  Coord. Formalizacion de Emprendimiento
                </option>
                <option value="Coord. Nuevo Emprendimento">
                  Coord. Nuevo Emprendimento
                </option>
                <option value="Coord. Nuevo Emprendimento">
                  Coord. Ferias
                </option>
                <option value="Emprendedor">Emprendedor</option>
              </select>
            </div>
          </div>
          <button type="submit">Guardar</button>
        </form>
      </Modal>

      {/* Modal para ver datos */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
        <h2>Detalles de Persona</h2>
        {viewRecord && (
          <div className="view-record-details">
            <p>
              <strong>Cédula de Identidad:</strong> {viewRecord.cedula}
            </p>
            <p>
              <strong>Nombre:</strong> {viewRecord.nombre}
            </p>
            <p>
              <strong>Apellido:</strong> {viewRecord.apellido}
            </p>
            <p>
              <strong>Sexo:</strong> {viewRecord.sexo}
            </p>
            <p>
              <strong>Fecha de Nacimiento:</strong> {viewRecord.f_nacimiento}
            </p>
            <p>
              <strong>Teléfono:</strong> {viewRecord.telefono}
            </p>
            <p>
              <strong>Correo Electrónico:</strong> {viewRecord.correo}
            </p>
            <p>
              <strong>Tipo de Persona:</strong> {viewRecord.tipo}
            </p>
          </div>
        )}
      </Modal>

      {/* Modal para editar datos */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2>Actualizar Datos Personales</h2>
        <form onSubmit={handleUpdate} className="modal-form">
          <div className="form-row">
            <div className="form-group input-col-12">
              <label>Cédula de Identidad:</label>
              <input
                type="text"
                name="cedula"
                value={newRecord.cedula}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-6">
              <label>Nombres:</label>
              <input
                type="text"
                name="nombre"
                value={newRecord.nombre}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-6">
              <label>Apellidos:</label>
              <input
                type="text"
                name="apellido"
                value={newRecord.apellido}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-12">
              <label>Teléfono:</label>
              <input
                type="text"
                name="telefono"
                value={newRecord.telefono}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-12">
              <label>Tipo de Persona:</label>
              <select
                name="tipo"
                value={newRecord.tipo}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                <option value="">Seleccionar...</option>
                <option value="Presidente">Presidente</option>
                <option value="Coord. Creditos y Cobranzas">
                  Coord. Creditos y Cobranzas
                </option>
                <option value="Asist. Creditos y Cobranzas">
                  Asist. Creditos y Cobranzas
                </option>
                <option value="Coord. Formalizacion de Emprendimiento">
                  Coord. Formalizacion de Emprendimiento
                </option>
                <option value="Coord. Nuevo Emprendimento">
                  Coord. Nuevo Emprendimento
                </option>
                <option value="Emprendedor">Emprendedor</option>
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

export default Persona;
