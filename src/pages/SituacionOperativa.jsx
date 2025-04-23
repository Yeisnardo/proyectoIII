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
} from "../services/situacionOperativaService"; // Importa las funciones del servicio
import "../assets/styles/App.css";

const situacionOperativa = () => {
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
    cedula_datos_situacion_operativa: "",
    operativo_e: "",
    n_trabajadores: "",
    tiempo_opercional_e: "",
    muestra_producto_f: "",
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
    
    // Validate required fields
    if (!newRecord.cedula_datos_situacion_operativa) 
        errors.cedula_datos_situacion_operativa = "La cédula es requerida";
    
    if (!newRecord.operativo_e) 
        errors.operativo_e = "El estado operativo es requerido";
    
    if (!newRecord.n_trabajadores) 
        errors.n_trabajadores = "El número de trabajadores es requerido";
    
    if (!newRecord.tiempo_opercional_e) 
        errors.tiempo_opercional_e = "El tiempo operacional es requerido";
    
    if (!newRecord.muestra_producto_f) 
        errors.muestra_producto_f = "La muestra del producto es requerida";

    return errors;
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (
      records.some(
        (record) =>
          record.cedula_datos_situacion_operativa ===
          newRecord.cedula_datos_situacion_operativa
      )
    ) {
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
      const response = await updateRecord(
        newRecord.cedula_datos_situacion_operativa,
        newRecord
      ); // Usar el servicio para actualizar
      const updatedRecords = records.map((record) =>
        record.cedula_datos_situacion_operativa ===
        response.cedula_datos_situacion_operativa
          ? response
          : record
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
      cedula_datos_situacion_operativa: "",
      operativo_e: "",
      n_trabajadores: "",
      tiempo_opercional_e: "",
      muestra_producto_f: "",
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
        (record.cedula_datos_situacion_operativa &&
          record.cedula_datos_situacion_operativa.includes(searchTerm))
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
        <h2>Catálogo de situacionOperativas</h2>
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
                <th>Tipo de situacionOperativa</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((record) => (
                  <tr key={record.cedula_datos_situacion_operativa}>
                    <td>{record.cedula_datos_situacion_operativa}</td>
                    <td>{`${record.nombres} ${record.apellidos}`}</td>
                    <td>{record.tipo}</td>
                    <td>
                      <button
                        onClick={() =>
                          handleView(record.cedula_datos_situacion_operativa)
                        }
                        title="Ver Datos"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() =>
                          handleEdit(record.cedula_datos_situacion_operativa)
                        }
                        title="Actualizar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(record.cedula_datos_situacion_operativa)
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
    const recordToView = records.find(
      (record) => record.cedula_datos_situacion_operativa === id
    );
    if (recordToView) {
      setViewRecord(recordToView);
      setIsViewModalOpen(true);
    }
  };

  const handleEdit = (id) => {
    const recordToEdit = records.find(
      (record) => record.cedula_datos_situacion_operativa === id
    );
    if (recordToEdit) {
      setNewRecord(recordToEdit);
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = (id) => {
    const recordToDelete = records.find(
      (record) => record.cedula_datos_situacion_operativa === id
    );
    if (recordToDelete) {
      setRecordToDelete(recordToDelete);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteRecord(recordToDelete.cedula_datos_situacion_operativa); // Usar el servicio para eliminar
      setRecords(
        records.filter(
          (record) =>
            record.cedula_datos_situacion_operativa !==
            recordToDelete.cedula_datos_situacion_operativa
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
        <h2>Datos de Situacion Operativa</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group input-col-12">
              <label className="form-label">Cédula de Identidad:</label>
              <input
                type="text"
                name="cedula_datos_situacion_operativa"
                value={newRecord.cedula_datos_situacion_operativa}
                onChange={handleInputChange}
                className="form-control"
                required
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
            <div className="form-group input-col-7">
              <label className="form-label">
                Se encuantra operativo el emprendimiento:
              </label>
              <select
                name="operativo_e"
                value={newRecord.operativo_e}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Seleccionar...</option>
                <option value="Si">Si</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="form-group input-col-5">
              <label className="form-label">N° de Trajadores</label>
              <input
                type="text"
                name="n_trabajadores"
                value={newRecord.n_trabajadores}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">
                Tiempo de operatividad del emprendimiento
              </label>
              <br />
              <select
                name="tiempo_opercional_e"
                value={newRecord.tiempo_opercional_e}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Seleccionar...</option>
                <option value="Menos de 1 Año">Menos de 1 Año</option>
                <option value="Entre 1 y 2 años">Entre 1 y 2 años</option>
                <option value="Entre 2 y 5 años">Entre 2 y 5 años</option>
                <option value="Mas de 5 años">Mas de 5 años</option>
              </select>
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">
                El emprendimiento tiene componentes de diseño,forma de
                produccion o presentacion final:
              </label>
              <select
                name="muestra_producto_f"
                value={newRecord.muestra_producto_f}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Seleccionar...</option>
                <option value="Si">Si</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
          <button type="submit">Registrar</button>
        </form>
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
        <h2>Detalles de situacionOperativa</h2>
        {viewRecord && (
          <div className="view-record-details">
            <p>
              <strong>Cédula de Identidad:</strong>{" "}
              {viewRecord.cedula_datos_situacion_operativa}
            </p>
            <p>
              <strong>Nombress:</strong> {viewRecord.nombres}
            </p>
            <p>
              <strong>Apellidos:</strong> {viewRecord.apellidos}
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
              <strong>Teléfono 1:</strong> {viewRecord.telefono1}
            </p>
            <p>
              <strong>Teléfono 2:</strong> {viewRecord.telefono2}
            </p>
            <p>
              <strong>Tipo de situacionOperativa:</strong> {viewRecord.tipo}
            </p>
          </div>
        )}
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2>Datos de Situacion Operativa</h2>
        <form onSubmit={handleUpdate} className="modal-form">
          <div className="form-row">
            <div className="form-group input-col-12">
              <label className="form-label">Cédula de Identidad:</label>
              <input
                type="text"
                name="cedula_datos_situacion_operativa"
                value={newRecord.cedula_datos_situacion_operativa}
                onChange={handleInputChange}
                className="form-control"
                required
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
            <div className="form-group input-col-7">
              <label className="form-label">
                Se encuantra operativo el emprendimiento:
              </label>
              <select
                name="operativo_e"
                value={newRecord.operativo_e}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Seleccionar...</option>
                <option value="Si">Si</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="form-group input-col-5">
              <label className="form-label">N° de Trajadores</label>
              <input
                type="text"
                name="attendanceDate"
                value={newRecord.attendanceDate}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">
                Tiempo de operatividad del emprendimiento
              </label>
              <br />
              <select
                name="tiempo_opercional_e"
                value={newRecord.tiempo_opercional_e}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Seleccionar...</option>
                <option value="Menos de 1 Año">Menos de 1 Año</option>
                <option value="Entre 1 y 2 años">Entre 1 y 2 años</option>
                <option value="Entre 2 y 5 años">Entre 2 y 5 años</option>
                <option value="Mas de 5 años">Mas de 5 años</option>
              </select>
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">
                El emprendimiento tiene componentes de diseño,forma de
                produccion o presentacion final:
              </label>
              <select
                name="muestra_producto_f"
                value={newRecord.muestra_producto_f}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Seleccionar...</option>
                <option value="Si">Si</option>
                <option value="No">No</option>
              </select>
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
          {recordToDelete?.cedula_datos_situacion_operativa}
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

export default situacionOperativa;
