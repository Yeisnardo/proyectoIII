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
    if (!newRecord.nombre) newErrors.nombre = "El nombre es OBLIGATORIO.";
    if (!newRecord.apellido) newErrors.apellido = "El apellido es OBLIGATORIO.";
    if (!newRecord.telefono) newErrors.telefono = "El teléfono es OBLIGATORIO.";
    if (!newRecord.tipo) newErrors.tipo = "El tipo de persona es OBLIGATORIO.";
    return newErrors;
  };

  const handleSubmit = (e) => {
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

    setRecords([...records, newRecord]);
    resetForm();
    setIsModalOpen(false);
    setIsCreatedModalOpen(true);
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
        <h2>Catálogo de Perfil Financiero</h2>
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
        <h2>Datos Perfil Financiero</h2>
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
              <button
                type="button"
                className="submit-button indigo"
                onClick={() => {
                  /* Acción del botón */
                }}
              >
                Buscar
              </button>
              {errors.cedula && (
                <span className="error-message">{errors.cedula}</span>
              )}
            </div>
            <div className="form-group input-col-12">
              <label className="form-label">Posee una cuanta Bancaria?:</label>
              <select
                name="tipo"
                value={newRecord.tipo}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Seleccionar...</option>
                <option value="Si">Si</option>
                <option value="No">
                  No
                </option>
              </select>
              {errors.nombre && (
                <span className="error-message">{errors.nombre}</span>
              )}
            </div>
            <div className="form-group input-col-2">
              <label className="form-label">Seleccionar el Banco:</label>
              <label htmlFor="">Banco de Venezuela</label>
              <input
                type="checkbox"
                name="apellido"
                value={newRecord.apellido}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.apellido && (
                <span className="error-message">{errors.apellido}</span>
              )}
            </div>
            <div className="form-group input-col-3"><br /><br />
              <label htmlFor="">Banco Nacional de Credito</label>
              <input
                type="checkbox"
                name="apellido"
                value={newRecord.apellido}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.apellido && (
                <span className="error-message">{errors.apellido}</span>
              )}
            </div>
            <div className="form-group input-col-2"><br /><br />
              <label htmlFor="">Banco Bicentenario</label>
              <input
                type="checkbox"
                name="apellido"
                value={newRecord.apellido}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.apellido && (
                <span className="error-message">{errors.apellido}</span>
              )}
            </div>
            <div className="form-group input-col-2"><br /><br />
              <label htmlFor="">Banco del Tesoro</label>
              <input
                type="checkbox"
                name="apellido"
                value={newRecord.apellido}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.apellido && (
                <span className="error-message">{errors.apellido}</span>
              )}
            </div>
            <div className="form-group input-col-2"><br /><br />
              <label htmlFor="">Banco Fondo Comun</label>
              <input
                type="checkbox"
                name="apellido"
                value={newRecord.apellido}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.apellido && (
                <span className="error-message">{errors.apellido}</span>
              )}
            </div>
            <br /><br />
            <div className="form-group input-col-2">
              <label className="form-label">Metodos de Pagos:</label>
              <label htmlFor="">Pago Movil</label>
              <input
                type="checkbox"
                name="apellido"
                value={newRecord.apellido}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.apellido && (
                <span className="error-message">{errors.apellido}</span>
              )}
            </div>
            <div className="form-group input-col-3"><br /><br />
              <label htmlFor="">Punto de Venta</label>
              <input
                type="checkbox"
                name="apellido"
                value={newRecord.apellido}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.apellido && (
                <span className="error-message">{errors.apellido}</span>
              )}
            </div>
            <div className="form-group input-col-2"><br /><br />
              <label htmlFor="">Efectivo</label>
              <input
                type="checkbox"
                name="apellido"
                value={newRecord.apellido}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.apellido && (
                <span className="error-message">{errors.apellido}</span>
              )}
            </div>
            <div className="form-group input-col-7">
              <label className="form-label">Tu emprendimiento cuenta con un credito?:</label>
              <select
                name="tipo"
                value={newRecord.tipo}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Seleccionar...</option>
                <option value="Si">Si</option>
                <option value="No">
                  No
                </option>
              </select>
              {errors.apellido && (
                <span className="error-message">{errors.apellido}</span>
              )}
            </div>
            <div className="form-group input-col-5">
              <label className="form-label">N° Clientes atiendes semanal:</label>
              <input
                type="number"
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
              <label className="form-label">Vendes de contado o a Credito:</label>
              <select
                name="tipo"
                value={newRecord.tipo}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Seleccionar...</option>
                <option value="contado">contado</option>
                <option value="Credito">Credito</option>
                <option value="Ambos">Ambos</option>
              </select>
              {errors.apellido && (
                <span className="error-message">{errors.apellido}</span>
              )}
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Declaras IVA?:</label>
              <select
                name="tipo"
                value={newRecord.tipo}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Seleccionar...</option>
                <option value="Si">Si</option>
                <option value="No">No</option>
              </select>
              {errors.telefono && (
                <span className="error-message">{errors.telefono}</span>
              )}
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Declaras ISLR?:</label>
              <select
                name="tipo"
                value={newRecord.tipo}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Seleccionar...</option>
                <option value="Si">Si</option>
                <option value="No">No</option>
              </select>
              {errors.telefono && (
                <span className="error-message">{errors.telefono}</span>
              )}
            </div>
            <div className="form-group input-col-12">
              <label className="form-label">Le compras a tus proveedores de contado o credito?:</label>
              <select
                name="tipo"
                value={newRecord.tipo}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Seleccionar...</option>
                <option value="Contado">Contado</option>
                <option value="Credito">Credito</option>
                <option value="Ambos">Ambos</option>
              </select>
              {errors.telefono && (
                <span className="error-message">{errors.telefono}</span>
              )}
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Mes con mas ventas?:</label>
              <select
                name="tipo"
                value={newRecord.tipo}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Seleccionar...</option>
                <option value="Enero">Enero</option>
                <option value="Febrero">Febrero</option>
                <option value="Marzo">Marzo</option>
                <option value="Abril">Abril</option>
                <option value="Mayo">Mayo</option>
                <option value="junio">junio</option>
                <option value="Julio">Julio</option>
                <option value="Agosto">Agosto</option>
                <option value="Septiembre">Septiembre</option>
                <option value="Octubre">Octubre</option>
                <option value="Noviembre">Noviembre</option>
                <option value="Diciembre">Diciembre</option>

              </select>
              {errors.tipo && (
                <span className="error-message">{errors.tipo}</span>
              )}
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Exiges porcentanjes en tus ventas?:</label>
              <select
                name="tipo"
                value={newRecord.tipo}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Seleccionar...</option>
                <option value="Si">Si</option>
                <option value="No">No</option>
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
            <div className="form-group input-col-12">
              <label className="form-label">Teléfono:</label>
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
