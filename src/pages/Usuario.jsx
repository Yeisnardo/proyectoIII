import React, { useState, useEffect } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaEdit,
  FaTrash,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
} from "react-icons/fa";
import {
  getAllUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "../services/usuarioService"; // Importar funciones del servicio
import Header from "../components/Header";
import Menu from "../components/Menu";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import "../assets/styles/App.css";

const Usuario = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([]);
  const [modals, setModals] = useState({
    isModalOpen: false,
    isViewModalOpen: false,
    isEditModalOpen: false,
    isDeleteModalOpen: false,
    isDeletedModalOpen: false,
    isCreatedModalOpen: false,
    isUpdatedModalOpen: false,
  });
  const [viewRecord, setViewRecord] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [limit, setLimit] = useState(5);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [errors, setErrors] = useState({});
  const [newRecord, setNewRecord] = useState({
    cedula_usuario: "",
    usuario: "",
    contrasena: "",
    estatus: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllUsuarios(); // Usar el servicio para obtener registros
        setRecords(data);
      } catch (error) {
        console.error("Error al obtener los registros:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord((prevRecord) => ({ ...prevRecord, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newRecord.cedula_usuario)
      newErrors.cedula_usuario = "La cédula es OBLIGATORIA.";
    if (!newRecord.usuario) newErrors.usuario = "El usuario es OBLIGATORIO.";
    if (!newRecord.contrasena)
      newErrors.contrasena = "La contraseña es OBLIGATORIA.";
    if (!newRecord.estatus) newErrors.estatus = "El estado es OBLIGATORIO.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await createUsuario(newRecord);
      setRecords((prevRecords) => [...prevRecords, response]); // Actualizar el estado de los registros
      resetForm();
      setModals({ ...modals, isModalOpen: false, isCreatedModalOpen: true });
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      alert("Hubo un problema al registrar el usuario. Inténtalo de nuevo.");
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
      const response = await updateUsuario(newRecord.cedula_usuario, newRecord);
      const updatedRecords = records.map((record) =>
        record.cedula_usuario === response.cedula_usuario ? response : record
      );
      setRecords(updatedRecords);
      resetForm();
      setModals({
        ...modals,
        isEditModalOpen: false,
        isUpdatedModalOpen: true,
      });
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      alert("Hubo un problema al actualizar el usuario. Inténtalo de nuevo.");
    }
  };

  const resetForm = () => {
    setNewRecord({
      cedula_usuario: "",
      usuario: "",
      contrasena: "",
      estatus: "",
    });
    setErrors({});
  };

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const renderDataTable = () => {
    const filteredRecords = records.filter(
      (record) =>
        record.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.cedula_usuario.includes(searchTerm)
    );

    const totalPages = Math.ceil(filteredRecords.length / limit);
    const startIndex = (currentPage - 1) * limit;
    const currentRecords = filteredRecords.slice(
      startIndex,
      startIndex + limit
    );

    return (
      <div className="records-container">
        <h2>Catálogo de Usuarios</h2>
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
            onClick={() => setModals({ ...modals, isModalOpen: true })}
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
            {[5, 10, 20, 50].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
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
                  <tr key={record.cedula_usuario}>
                    <td>{record.cedula_usuario}</td>
                    <td>{record.usuario}</td>
                    <td>{record.estatus}</td>
                    <td>
                      <button
                        onClick={() => handleView(record.cedula_usuario)}
                        title="Ver Datos"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(record.cedula_usuario)}
                        title="Actualizar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(record.cedula_usuario)}
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
    const recordToView = records.find((record) => record.cedula_usuario === id);
    if (recordToView) {
      setViewRecord(recordToView);
      setModals({ ...modals, isViewModalOpen: true });
    }
  };

  const handleEdit = (id) => {
    const recordToEdit = records.find((record) => record.cedula_usuario === id);
    if (recordToEdit) {
      setNewRecord({ ...recordToEdit }); // Clonar el objeto para evitar mutaciones
      setModals({ ...modals, isEditModalOpen: true });
    }
  };

  const handleDelete = (id) => {
    const recordToDelete = records.find(
      (record) => record.cedula_usuario === id
    );
    if (recordToDelete) {
      setRecordToDelete(recordToDelete);
      setModals({ ...modals, isDeleteModalOpen: true });
    }
  };

  const confirmDelete = async () => {
    try {
        await deleteUsuario(recordToDelete.cedula_usuario);
        setRecords(records.filter((record) => record.cedula_usuario !== recordToDelete.cedula_usuario));
        setRecordToDelete(null);
        setModals({ ...modals, isDeleteModalOpen: false, isDeletedModalOpen: true });
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        alert("Hubo un problema al eliminar el usuario. Inténtalo de nuevo.");
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

      {/* Modals for various actions */}
      <Modal
        isOpen={modals.isModalOpen}
        onClose={() => setModals({ ...modals, isModalOpen: false })}
      >
        <h2>Datos de Usuario</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group input-col-12">
              <label className="form-label">Cédula de Identidad:</label>
              <input
                type="text"
                name="cedula_usuario"
                value={newRecord.cedula_usuario}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.cedula_usuario && (
                <span className="error-message">{errors.cedula_usuario}</span>
              )}
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Nombre de Usuario:</label>
              <input
                type="text"
                name="usuario"
                value={newRecord.usuario}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.usuario && (
                <span className="error-message">{errors.usuario}</span>
              )}
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Contraseña:</label>
              <div className="password-container">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  name="contrasena"
                  value={newRecord.contrasena}
                  onChange={handleInputChange}
                  className="form-control"
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="password-toggle-button"
                  title={
                    isPasswordVisible ? "Ocultar Contraseña" : "Ver Contraseña"
                  }
                >
                  {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.contrasena && (
                <span className="error-message">{errors.contrasena}</span>
              )}
            </div>
            <div className="form-group input-col-12">
              <label className="form-label">Estatus:</label>
              <select
                name="estatus"
                value={newRecord.estatus}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                <option value="">Seleccionar Estatus</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
              {errors.estatus && (
                <span className="error-message">{errors.estatus}</span>
              )}
            </div>
          </div>
          <button type="submit">Guardar</button>
        </form>
      </Modal>

      <Modal
        isOpen={modals.isViewModalOpen}
        onClose={() => setModals({ ...modals, isViewModalOpen: false })}
      >
        <h2>Detalles de Usuario</h2>
        {viewRecord && (
          <div className="view-record-details">
            <p>
              <strong>Cédula de Identidad:</strong> {viewRecord.cedula_usuario}
            </p>
            <p>
              <strong>Usuario:</strong> {viewRecord.usuario}
            </p>
            <p>
              <strong>Estatus:</strong> {viewRecord.estatus}
            </p>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={modals.isEditModalOpen}
        onClose={() => setModals({ ...modals, isEditModalOpen: false })}
      >
        <h2>Actualizar Datos de Usuario</h2>
        <form onSubmit={handleUpdate} className="modal-form">
          <div className="form-row">
            <div className="form-group input-col-12">
              <label className="form-label">Cédula de Identidad:</label>
              <input
                type="text"
                name="cedula_usuario"
                value={newRecord.cedula_usuario}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.cedula_usuario && (
                <span className="error-message">{errors.cedula_usuario}</span>
              )}
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Nombre de Usuario:</label>
              <input
                type="text"
                name="usuario"
                value={newRecord.usuario}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.usuario && (
                <span className="error-message">{errors.usuario}</span>
              )}
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Contraseña:</label>
              <div className="password-container">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  name="contrasena"
                  value={newRecord.contrasena}
                  onChange={handleInputChange}
                  className="form-control"
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="password-toggle-button"
                  title={
                    isPasswordVisible ? "Ocultar Contraseña" : "Ver Contraseña"
                  }
                >
                  {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.contrasena && (
                <span className="error-message">{errors.contrasena}</span>
              )}
            </div>
            <div className="form-group input-col-12">
              <label className="form-label">Estado:</label>
              <select
                name="estatus"
                value={newRecord.estatus}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>
          <button type="submit">Actualizar</button>
        </form>
      </Modal>

      <Modal
        isOpen={modals.isDeleteModalOpen}
        onClose={() => setModals({ ...modals, isDeleteModalOpen: false })}
      >
        <h2>Confirmar Eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar este registro?</p>
        <p>
          <strong>Cédula de Identidad:</strong> {recordToDelete?.cedula_usuario}
        </p>
        <p>
          <strong>Nombre:</strong> {recordToDelete?.usuario}
        </p>
        <div className="modal-actions">
          <button onClick={confirmDelete}>Eliminar</button>
          <button
            onClick={() => setModals({ ...modals, isDeleteModalOpen: false })}
          >
            Cancelar
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={modals.isDeletedModalOpen}
        onClose={() => setModals({ ...modals, isDeletedModalOpen: false })}
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
