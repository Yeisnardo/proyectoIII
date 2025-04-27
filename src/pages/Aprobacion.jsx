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
  updateRecord,
  deleteRecord,
} from "../services/aprobacionService"; // Importa las funciones del servicio
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
  const [viewRecord, setViewRecord] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [errors, setErrors] = useState({});
  const [newRecord, setNewRecord] = useState({
    cedula_emprendedor_emprendedor: "",
    estatus: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRecords(); // Usar el servicio para obtener registros
        setRecords(data);
      } catch (error) {
        console.error("Error al obtener los registros:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord((prevRecord) => ({
      ...prevRecord,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!newRecord.cedula_emprendedor) errors.cedula_emprendedor = "La cédula es requerida";
    if (!newRecord.estatus) errors.estatus = "Los estatus son requeridos";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (records.some((record) => record.cedula_emprendedor === newRecord.cedula_emprendedor)) {
      alert("La cédula ya existe.");
      return;
    }

    try {
      const response = await createRecord(newRecord); // Usar el servicio para crear un registro
      setRecords([...records, response]);
      resetForm();
      setIsModalOpen(false);
      setIsCreatedModalOpen(true);
    } catch (error) {
      console.error("Error al registrar la persona:", error);
      alert("Hubo un problema al registrar la persona. Inténtalo de nuevo.");
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await updateRecord(newRecord.cedula_emprendedor, newRecord); // Usar el servicio para actualizar
      const updatedRecords = records.map((record) =>
        record.cedula_emprendedor === response.cedula_emprendedor ? response : record
      );
      setRecords(updatedRecords);
      resetForm();
      setIsEditModalOpen(false);
      setIsUpdatedModalOpen(true);
    } catch (error) {
      console.error("Error al actualizar la persona:", error);
      alert("Hubo un problema al actualizar la persona. Inténtalo de nuevo.");
    }
  };

  const resetForm = () => {
    setNewRecord({
      cedula_emprendedor: "",
    estatus: ""
    });
    setErrors({});
  };

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const renderDataTable = () => {
    const filteredRecords = records.filter((record) => {
      return (
        (record.nombres &&
          record.nombres.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (record.apellidos &&
          record.apellidos.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (record.cedula_emprendedor && record.cedula_emprendedor.includes(searchTerm))
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
        <h2>Catálogo de Aprobacion de Credito</h2>
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
                <th>C.I</th>
                <th>Nombre y Apellido</th>
                <th>Tipo de Persona</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((record) => (
                  <tr key={record.cedula_emprendedor}>
                    <td>{record.cedula_emprendedor}</td>
                    <td>{`${record.nombres} ${record.apellidos}`}</td>
                    <td>{record.tipo}</td>
                    <td>
                      <button
                        onClick={() => handleView(record.cedula_emprendedor)}
                        title="Ver Datos"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(record.cedula_emprendedor)}
                        title="Actualizar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(record.cedula_emprendedor)}
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
    const recordToView = records.find((record) => record.cedula_emprendedor === id);
    if (recordToView) {
      setViewRecord(recordToView);
      setIsViewModalOpen(true);
    }
  };

  const handleEdit = (id) => {
    const recordToEdit = records.find((record) => record.cedula_emprendedor === id);
    if (recordToEdit) {
      setNewRecord(recordToEdit);
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = (id) => {
    const recordToDelete = records.find((record) => record.cedula_emprendedor === id);
    if (recordToDelete) {
      setRecordToDelete(recordToDelete);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteRecord(recordToDelete.cedula_emprendedor); // Usar el servicio para eliminar
      setRecords(
        records.filter((record) => record.cedula_emprendedor !== recordToDelete.cedula_emprendedor)
      );
      setRecordToDelete(null);
      setIsDeleteModalOpen(false);
      setIsDeletedModalOpen(true);
    } catch (error) {
      console.error("Error al eliminar el registro:", error);
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Datos Personales</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group input-col-12">
              <label className="form-label">Cédula de Identidad:</label>
              <input
                type="text"
                name="cedula_emprendedor"
                value={newRecord.cedula_emprendedor}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.cedula && (
                <span className="error-message">{errors.cedula}</span>
              )}
            </div>
            <div className="form-group input-col-12">
              <label className="form-label">Estatus:</label>
              <select
                name="estatus"
                value={newRecord.estatus}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Seleccionar...</option>
                <option value="Aprobado">Aprobado</option>
                <option value="Desaprobado">Desaprobado</option>
              </select>
              {errors.tipo && (
                <span className="error-message">{errors.tipo}</span>
              )}
            </div>
          </div>
          <button type="submit">Guardar</button>
        </form>
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
        <h2>Detalles de Persona</h2>
        {viewRecord && (
          <div className="view-record-details">
            <p>
              <strong>Cédula de Identidad:</strong>{" "}
              {viewRecord.cedula_emprendedor}
            </p>
            <p>
              <strong>Nombress:</strong> {viewRecord.nombres}
            </p>
            <p>
              <strong>Apellidos:</strong> {viewRecord.apellidos}
            </p>
            <p>
              <strong>Tipo de Persona:</strong> {viewRecord.estatus}
            </p>
          </div>
        )}
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2>Actualizar Datos Personales</h2>
        <form onSubmit={handleUpdate} className="modal-form">
          <div className="form-row">
            <div className="form-group input-col-12">
              <label className="form-label">Cédula de Identidad:</label>
              <input
                type="text"
                name="cedula_emprendedor"
                value={newRecord.cedula_emprendedor}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.cedula_emprendedor && (
                <span className="error-message">
                  {errors.cedula_emprendedor}
                </span>
              )}
            </div>
            <div className="form-group input-col-12">
              <label className="form-label">Estatus:</label>
              <select
                name="estatus"
                value={newRecord.estatus}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Seleccionar...</option>
                <option value="Aprobado">Aprobado</option>
                <option value="Desaprobado">Desaprobado</option>
              </select>
              {errors.tipo && (
                <span className="error-message">{errors.tipo}</span>
              )}
            </div>
          </div>

          <button type="submit">Guardar</button>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <h2>Confirmar Eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar este registro?</p>
        <p>
          <strong>Cédula de Identidad:</strong> {recordToDelete?.cedula_emprendedor}
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
          <div className="confirmation-message">
            <FaCheckCircle className="confirmation-icon" />
            <p>El registro ha sido creado con éxito.</p>
          </div>
        </div>
      </Modal>

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
