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
  import axios from "axios";
  import Header from "../components/Header";
  import Menu from "../components/Menu";
  import Footer from "../components/Footer";
  import Modal from "../components/Modal";
  import "../assets/styles/App.css";

  const Persona = () => {
    const [isMenuVisible, setIsMenuVisible] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [records, setRecords] = useState([
      {
        cedula: "12345678",
        nombre: "Juan",
        apellido: "Pérez",
        sexo: "Masculino",
        f_nacimiento: "1990-01-01",
        telefono: "123456789",
        correo: "juan.perez@example.com",
        tipo: "Presidente",
      },
      {
        cedula: "87654321",
        nombre: "María",
        apellido: "Gómez",
        sexo: "Femenino",
        f_nacimiento: "1985-05-15",
        telefono: "987654321",
        correo: "maria.gomez@example.com",
        tipo: "Emprendedor",
      },
      {
        cedula: "11223344",
        nombre: "Carlos",
        apellido: "López",
        sexo: "Masculino",
        f_nacimiento: "1992-03-20",
        telefono: "456789123",
        correo: "carlos.lopez@example.com",
        tipo: "Coord. Creditos y Cobranzas",
      },
      {
        cedula: "44332211",
        nombre: "Ana",
        apellido: "Martínez",
        sexo: "Femenino",
        f_nacimiento: "1988-07-30",
        telefono: "321654987",
        correo: "ana.martinez@example.com",
        tipo: "Asist. Creditos y Cobranzas",
      },
      {
        cedula: "55667788",
        nombre: "Luis",
        apellido: "Fernández",
        sexo: "Masculino",
        f_nacimiento: "1995-11-11",
        telefono: "654321789",
        correo: "luis.fernandez@example.com",
        tipo: "Coord. Nuevo Emprendimento",
      },
    ]);

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
    const [errors, setErrors] = useState({}); // Estado para manejar errores

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewRecord({ ...newRecord, [name]: value });
      setErrors({ ...errors, [name]: "" }); // Limpiar error al cambiar el valor
    };

    const validateForm = () => {
      const newErrors = {};
      if (!newRecord.cedula) newErrors.cedula = "La cedula es OBLIGATORIO.";
      if (!newRecord.nombres) newErrors.nombres = "El nombre es OBLIGATORIO.";
      if (!newRecord.apellidos)
        newErrors.apellidos = "El apellido es OBLIGATORIO.";
      if (!newRecord.telefono1)
        newErrors.telefono1 = "El teléfono es OBLIGATORIO.";
      if (!newRecord.tipo) newErrors.tipo = "El tipo de persona es OBLIGATORIO.";
      return newErrors;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      // Check for duplicate cedula
      if (records.some((record) => record.cedula === newRecord.cedula)) {
        alert("La cédula ya existe.");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:5000/api/personas",
          newRecord
        );
        setRecords([...records, response.data]);
        resetForm();
        setIsModalOpen(false);
        setIsCreatedModalOpen(true);
      } catch (error) {
        console.error("Error al registrar la persona:", error);
        alert("Hubo un problema al registrar la persona. Inténtalo de nuevo.");
      }
    };

    const handleUpdate = (e) => {
      e.preventDefault();
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

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
      setErrors({});
    };

    const toggleMenu = () => {
      setIsMenuVisible(!isMenuVisible);
    };

    const renderDataTable = () => {
      const filteredRecords = records.filter((record) => {
        return (
          (record.nombre && record.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (record.apellido && record.apellido.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (record.cedula && record.cedula.includes(searchTerm))
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
              &nbsp;
              Nuevo
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
                <label className="form-label">Cédula de Identidad:</label>
                <input
                  type="text"
                  name="cedula"
                  value={newRecord.cedula}
                  onChange={handleInputChange}
                  className="form-control"
                />
                {errors.cedula && (
                  <span className="error-message">{errors.cedula}</span>
                )}
              </div>
              <div className="form-group input-col-6">
                <label className="form-label">Nombres:</label>
                <input
                  type="text"
                  name="nombres" // Cambiado a "nombres"
                  value={newRecord.nombres} // Cambiado a "nombres"
                  onChange={handleInputChange}
                  className="form-control"
                />
                {errors.nombres && (
                  <span className="error-message">{errors.nombres}</span>
                )}
              </div>
              <div className="form-group input-col-6">
                <label className="form-label">Apellidos:</label>
                <input
                  type="text"
                  name="apellidos" // Cambiado a "apellidos"
                  value={newRecord.apellidos} // Cambiado a "apellidos"
                  onChange={handleInputChange}
                  className="form-control"
                />
                {errors.apellidos && (
                  <span className="error-message">{errors.apellidos}</span>
                )}
              </div>
              <div className="form-group input-col-4">
                <label className="form-label">Estado:</label>
                <input
                  type="text"
                  name="estado" // Cambiado a "estado"
                  value={newRecord.estado} // Cambiado a "estado"
                  onChange={handleInputChange}
                  className="form-control"
                />
                {errors.estado && (
                  <span className="error-message">{errors.estado}</span>
                )}
              </div>
              <div className="form-group input-col-4">
                <label className="form-label">Municipio:</label>
                <input
                  type="text"
                  name="municipio" // Cambiado a "municipio"
                  value={newRecord.municipio} // Cambiado a "municipio"
                  onChange={handleInputChange}
                  className="form-control"
                />
                {errors.municipio && (
                  <span className="error-message">{errors.municipio}</span>
                )}
              </div>
              <div className="form-group input-col-4">
                <label className="form-label">Parroquia:</label>
                <input
                  type="text"
                  name="parroquia" // Cambiado a "parroquia"
                  value={newRecord.parroquia} // Cambiado a "parroquia"
                  onChange={handleInputChange}
                  className="form-control"
                />
                {errors.parroquia && (
                  <span className="error-message">{errors.parroquia}</span>
                )}
              </div>
              <div className="form-group input-col-12">
                <label className="form-label">Dirección:</label>
                <input
                  type="text"
                  name="direccion" // Cambiado a "direccion"
                  value={newRecord.direccion} // Cambiado a "direccion"
                  onChange={handleInputChange}
                  className="form-control"
                />
                {errors.direccion && (
                  <span className="error-message">{errors.direccion}</span>
                )}
              </div>
              <div className=" form-group input-col-6">
                <label className="form-label">Teléfono 1:</label>
                <input
                  type="text"
                  name="telefono1" // Cambiado a "telefono1"
                  value={newRecord.telefono1} // Cambiado a "telefono1"
                  onChange={handleInputChange}
                  className="form-control"
                />
                {errors.telefono1 && (
                  <span className="error-message">{errors.telefono1}</span>
                )}
              </div>
              <div className="form-group input-col-6">
                <label className="form-label">Teléfono 2:</label>
                <input
                  type="text"
                  name="telefono2" // Cambiado a "telefono2"
                  value={newRecord.telefono2} // Cambiado a "telefono2"
                  onChange={handleInputChange}
                  className="form-control"
                />
                {errors.telefono2 && (
                  <span className="error-message">{errors.telefono2}</span>
                )}
              </div>
              <div className="form-group input-col-12">
                <label className="form-label">Tipo de Persona:</label>
                <select
                  name="tipo"
                  value={newRecord.tipo}
                  onChange={handleInputChange}
                  className="form-control"
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
                    Coord. Nuevo Emprendimiento
                  </option>
                  <option value="Emprendedor">Emprendedor</option>
                </select>
                {errors.tipo && (
                  <span className="error-message">{errors.tipo}</span>
                )}
              </div>
            </div>
            <button type="submit">Guardar</button>
          </form>
        </Modal>
        {/* Modal para ver datos */}
        <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
          <h2>Detalles de Persona</h2>
          {viewRecord && (
            <div className="view-record -details">
              <p>
                <strong>Cédula de Identidad:</strong> {viewRecord.cedula}
              </p>
              <p>
                <strong>Nombres:</strong> {viewRecord.nombre}
              </p>
              <p>
                <strong>Apellidos:</strong> {viewRecord.apellido}
              </p>
              <p>
                <strong>Estado:</strong> {viewRecord.sexo}
              </p>
              <p>
                <strong>Municipio:</strong> {viewRecord.sexo}
              </p>
              <p>
                <strong>Parroquia:</strong> {viewRecord.sexo}
              </p>
              <p>
                <strong>Telefono 1:</strong> {viewRecord.sexo}
              </p>
              <p>
                <strong>Telefono 2:</strong> {viewRecord.sexo}
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
                <label className="form-label">Cédula de Identidad:</label>
                <input
                  type="text"
                  name="cedula"
                  value={newRecord.cedula}
                  onChange={handleInputChange}
                  className="form-control"
                />
                {errors.cedula && (
                  <span className="error-message">{errors.cedula}</span>
                )}
              </div>
              <div className="form-group input-col-6">
                <label className="form-label">Nombres:</label>
                <input
                  type="text"
                  name="nombre"
                  value={newRecord.nombre}
                  onChange={handleInputChange}
                  className="form-control"
                />
                {errors.nombre && (
                  <span className="error-message">{errors.nombre}</span>
                )}
              </div>
              <div className="form-group input-col-6">
                <label className="form-label">Apellidos:</label>
                <input
                  type="text"
                  name="apellido"
                  value={newRecord.apellido}
                  onChange={handleInputChange}
                  className="form-control"
                />
                {errors.apellido && (
                  <span className="error-message">{errors.apellido}</span>
                )}
              </div>
              <div className="form-group input-col-4">
                <label className="form-label">Estado:</label>
                <input
                  type="text"
                  name="apellido"
                  value={newRecord.apellido}
                  onChange={handleInputChange}
                  className="form-control"
                />
                {errors.apellido && (
                  <span className="error-message">{errors.apellido}</span>
                )}
              </div>
              <div className="form-group input-col-4">
                <label className="form-label">Municipio:</label>
                <input
                  type="text"
                  name="apellido"
                  value={newRecord.apellido}
                  onChange={handleInputChange}
                  className="form-control"
                />
                {errors.apellido && (
                  <span className="error-message">{errors.apellido}</span>
                )}
              </div>
              <div className="form-group input-col-4">
                <label className="form-label">Parroquia:</label>
                <input
                  type="text"
                  name="apellido"
                  value={newRecord.apellido}
                  onChange={handleInputChange}
                  className="form-control"
                />
                {errors.apellido && (
                  <span className="error-message">{errors.apellido}</span>
                )}
              </div>
              <div className="form-group input-col-12">
                <label className="form-label">Direccion:</label>
                <input
                  type="text"
                  name="apellido"
                  value={newRecord.apellido}
                  onChange={handleInputChange}
                  className="form-control"
                />
                {errors.apellido && (
                  <span className="error-message">{errors.apellido}</span>
                )}
              </div>
              <div className="form-group input-col-6">
                <label className="form-label">Teléfono 1:</label>
                <input
                  type="text"
                  name="telefono"
                  value={newRecord.telefono}
                  onChange={handleInputChange}
                  className="form-control"
                />
                {errors.telefono && (
                  <span className="error-message">{errors.telefono}</span>
                )}
              </div>
              <div className="form-group input-col-6">
                <label className="form-label">Teléfono 2:</label>
                <input
                  type="text"
                  name="telefono"
                  value={newRecord.telefono}
                  onChange={handleInputChange}
                  className="form-control"
                />
                {errors.telefono && (
                  <span className="error-message">{errors.telefono}</span>
                )}
              </div>
              <div className="form-group input-col-12">
                <label className="form-label">Tipo de Persona:</label>
                <select
                  name="tipo"
                  value={newRecord.tipo}
                  onChange={handleInputChange}
                  className="form-control"
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
                {errors.tipo && (
                  <span className="error-message">{errors.tipo}</span>
                )}
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
