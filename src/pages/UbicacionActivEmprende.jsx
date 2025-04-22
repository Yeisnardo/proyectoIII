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
} from "../services/ubicacionActivEmprendeService"; 
import "../assets/styles/App.css";

const UbicacionActivEmprende = () => {
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
    cedula_ubicacion_actividad_e: "",
    donde_actividad_e: "",
    espacio: "",
    estado: "",
    municipio: "",
    parroquia: "",
    ubicacion: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRecords();
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
    if (!newRecord.cedula_ubicacion_actividad_e)
      errors.cedula_ubicacion_actividad_e = "La cédula es requerida";
    if (!newRecord.donde_actividad_e) errors.donde_actividad_e = "El lugar es requerido";
    if (!newRecord.espacio) errors.espacio = "El espacio es requerido";
    if (!newRecord.estado) errors.estado = "El estado es requerido";
    if (!newRecord.municipio) errors.municipio = "El municipio es requerido";
    if (!newRecord.parroquia) errors.parroquia = "La parroquia es requerida";
    if (!newRecord.ubicacion) errors.ubicacion = "La ubicación es requerida";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await createRecord(newRecord);
      setRecords([...records, response]);
      resetForm();
      setIsModalOpen(false);
      setIsCreatedModalOpen(true);
    } catch (error) {
      console.error("Error al registrar la ubicación:", error);
      alert("Hubo un problema al registrar la ubicación. Inténtalo de nuevo.");
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
      const response = await updateRecord(
        newRecord.cedula_ubicacion_actividad_e,
        newRecord
      );
      const updatedRecords = records.map((record) =>
        record.cedula_ubicacion_actividad_e === response.cedula_ubicacion_actividad_e
          ? response
          : record
      );
      setRecords(updatedRecords);
      resetForm();
      setIsEditModalOpen(false);
      setIsUpdatedModalOpen(true);
    } catch (error) {
      console.error("Error al actualizar la ubicación:", error);
      alert("Hubo un problema al actualizar la ubicación. Inténtalo de nuevo.");
    }
  };

  const resetForm = () => {
    setNewRecord({
      cedula_ubicacion_actividad_e: "",
      donde_actividad_e: "",
      espacio: "",
      estado: "",
      municipio: "",
      parroquia: "",
      ubicacion: ""
    });
    setErrors({});
  };

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const renderDataTable = () => {
    const filteredRecords = records.filter((record) => {
      return (
        (record.donde_actividad_e &&
          record.donde_actividad_e.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (record.cedula_ubicacion_actividad_e &&
          record.cedula_ubicacion_actividad_e.includes(searchTerm))
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
        <h2>Catálogo de UbicacionActivEmprendes</h2>
        <div className="search-container">
          <label htmlFor="search" className="search-label">
            Buscar ubicación
          </label>
          <input
            type="text"
            id="search"
            placeholder="Buscar por cédula o lugar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="add-button"
            title="Agregar Nueva Ubicación"
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
                <th>Lugar de Actividad</th>
                <th>Tipo de Espacio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((record) => (
                  <tr key={record.cedula_ubicacion_actividad_e}>
                    <td>{record.cedula_ubicacion_actividad_e}</td>
                    <td>{record.donde_actividad_e}</td>
                    <td>{record.espacio}</td>
                    <td>
                      <button
                        onClick={() =>
                          handleView(record.cedula_ubicacion_actividad_e)
                        }
                        title="Ver Datos"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() =>
                          handleEdit(record.cedula_ubicacion_actividad_e)
                        }
                        title="Actualizar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(record.cedula_ubicacion_actividad_e)
                        }
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
          <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
    const recordToView = records.find(
      (record) => record.cedula_ubicacion_actividad_e === id
    );
    if (recordToView) {
      setViewRecord(recordToView);
      setIsViewModalOpen(true);
    }
  };

  const handleEdit = (id) => {
    const recordToEdit = records.find(
      (record) => record.cedula_ubicacion_actividad_e === id
    );
    if (recordToEdit) {
      setNewRecord(recordToEdit);
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = (id) => {
    const recordToDelete = records.find(
      (record) => record.cedula_ubicacion_actividad_e === id
    );
    if (recordToDelete) {
      setRecordToDelete(recordToDelete);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteRecord(recordToDelete.cedula_ubicacion_actividad_e);
      setRecords(
        records.filter(
          (record) =>
            record.cedula_ubicacion_actividad_e !==
            recordToDelete.cedula_ubicacion_actividad_e
        )
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
        <h2>Registro de ubicación actividad Emprendedora</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group input-col-12">
              <label className="form-label">Cédula de Identidad:</label>
              <input
                type="text"
                name="cedula_ubicacion_actividad_e"
                value={newRecord.cedula_ubicacion_actividad_e}
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
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">
                Donde Realizas tu actividad Emprendedora:
              </label>
              <select
                name="donde_actividad_e"
                value={newRecord.donde_actividad_e}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Seleccionar...</option>
                <option value="En el Hogar">En el Hogar</option>
                <option value="Fuera del Hogar">Fuera del Hogar</option>
              </select>
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">El espacio es?:</label>
              <select
                name="espacio"
                value={newRecord.espacio}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Seleccionar...</option>
                <option value="Alquilado">Alquilado</option>
                <option value="Comodato">Comodato</option>
                <option value="Propio">Propio</option>
                <option value="Cedido">Cedido</option>
              </select>
            </div>
            <div className ="form-group input-col-4">
              <label className="form-label">Estado:</label>
              <select
                name="estado"
                value={newRecord.estado}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Seleccionar...</option>
                <option value="Yaracuy">Yaracuy</option>
              </select>
            </div>
            <div className="form-group input-col-4">
              <label className="form-label">Municipio:</label>
              <select
                name="municipio"
                value={newRecord.municipio}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Seleccionar...</option>
                <option value="Independencia">Independencia</option>
              </select>
            </div>
            <div className="form-group input-col-4">
              <label className="form-label">Parroquia:</label>
              <select
                name="parroquia"
                value={newRecord.parroquia}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Seleccionar...</option>
                <option value="Parroquia 1">Parroquia 1</option>
                <option value="Parroquia 2">Parroquia 2</option>
              </select>
            </div>
            <div className="form-group input-col-12">
              <label className="form-label">Ubicación:</label>
              <input
                type="text"
                name="ubicacion"
                value={newRecord.ubicacion}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
          </div>
          <button type="submit">Registrar</button>
        </form>
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
        <h2>Detalles de UbicacionActivEmprende</h2>
        {viewRecord && (
          <div className="view-record-details">
            <p>
              <strong>Cédula de Identidad:</strong>{" "}
              {viewRecord.cedula_ubicacion_actividad_e}
            </p>
            <p>
              <strong>Lugar de Actividad:</strong> {viewRecord.donde_actividad_e}
            </p>
            <p>
              <strong>Tipo de Espacio:</strong> {viewRecord.espacio}
            </p>
            <p>
              <strong>Estado:</strong> {viewRecord.estado}
            </p>
            <p>
              <strong>Municipio:</strong> {viewRecord.municipio}
            </p>
            <p>
              <strong>Parroquia:</strong> {viewRecord.parroquia}
            </p>
            <p>
              <strong>Ubicación:</strong> {viewRecord.ubicacion}
            </p>
          </div>
        )}
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2>Actualizar Datos UbicacionActivEmprendeles</h2>
        <form onSubmit={handleUpdate} className="modal-form">
          <div className="form-row">
            <div className="form-group input-col-12">
              <label className="form-label">Cédula de Identidad:</label>
              <input
                type="text"
                name="cedula_ubicacion_actividad_e"
                value={newRecord.cedula_ubicacion_actividad_e}
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
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">
                Donde Realizas tu actividad Emprendedora:
              </label>
              <select
                name="donde_actividad_e"
                value={newRecord.donde_actividad_e}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Seleccionar...</option>
                <option value="En el Hogar">En el Hogar</option>
                <option value="Fuera del Hogar">Fuera del Hogar</option>
              </select>
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">El espacio es?:</label>
              <select
                name="espacio"
                value={newRecord.espacio }
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Seleccionar...</option>
                <option value="Alquilado">Alquilado</option>
                <option value="Comodato">Comodato</option>
                <option value="Propio">Propio</option>
                <option value="Cedido">Cedido</option>
              </select>
            </div>
            <div className="form-group input-col-4">
              <label className="form-label">Estado:</label>
              <select
                name="estado"
                value={newRecord.estado}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Seleccionar...</option>
                <option value="Yaracuy">Yaracuy</option>
              </select>
            </div>
            <div className="form-group input-col-4">
              <label className="form-label">Municipio:</label>
              <select
                name="municipio"
                value={newRecord.municipio}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Seleccionar...</option>
                <option value="Independencia">Independencia</option>
              </select>
            </div>
            <div className="form-group input-col-4">
              <label className="form-label">Parroquia:</label>
              <select
                name="parroquia"
                value={newRecord.parroquia}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Seleccionar...</option>
                <option value="Parroquia 1">Parroquia 1</option>
                <option value="Parroquia 2">Parroquia 2</option>
              </select>
            </div>
            <div className="form-group input-col-12">
              <label className="form-label">Ubicación:</label>
              <input
                type="text"
                name="ubicacion"
                value={newRecord.ubicacion}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
          </div>
          <button type="submit">Actualizar</button>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <h2>Confirmar Eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar este registro?</p>
        <p>
          <strong>Cédula de Identidad:</strong>{" "}
          {recordToDelete?.cedula_ubicacion_actividad_e}
        </p>
        <p>
          <strong>Lugar de Actividad:</strong> {recordToDelete?.donde_actividad_e}
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

export default UbicacionActivEmprende;