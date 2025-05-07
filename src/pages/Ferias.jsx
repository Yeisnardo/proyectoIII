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
  fetchFerias,
  createFeria
} from "../services/feriaService";
import {
  fetchAsistencias,
  createAsistencia
} from "../services/asistencia_feriaService";
import "../assets/styles/App.css";

const ferias = () => {
  // Estado de visibilidad del menú
  const [isMenuVisible, setIsMenuVisible] = useState(true);

  // Estado de búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // Datos de ferias y asistentes
  const [ferias, setFerias] = useState([]);
  const [asistencias, setAsistencias] = useState([]);
  const [attendees, setAttendees] = useState([]); // Asistentes filtrados

  // Estados para modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletedModalOpen, setIsDeletedModalOpen] = useState(false);
  const [isRegisterAttendanceModalOpen, setIsRegisterAttendanceModalOpen] = useState(false);
  const [isSearchFairModalOpen, setIsSearchFairModalOpen] = useState(false);

  // Estado para datos de registros y edición
  const [viewRecord, setViewRecord] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [newRecord, setNewRecord] = useState({
    cedula_asistencia_feria: "",
    firstName: "",
    lastName: "",
    codigo_f: "",
    attendanceDate: "",
    descripcion: "",
  });

  // Estado para crear nueva feria
  const [newFeria, setNewFeria] = useState({
    id: "",
    codigo_f: "",
    fecha_r: "",
  });

  // Estado para búsqueda
  const [searchData, setSearchData] = useState({
    cedula_asistencia_feria: "",
    codigo_f: "",
    descripcion: "",
  });

  // Estado errores en formularios
  const [errors, setErrors] = useState({});

  // Paginación
  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Función para manejar cambios en input de búsqueda
  const handleSearchInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch datos al montar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const feriasData = await fetchFerias();
        setFerias(feriasData);
        const asistenciasData = await fetchAsistencias();
        setAsistencias(asistenciasData);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, []);

  // Manejadores inputs
  const handleFeriaInputChange = (e) => {
    const { name, value } = e.target;
    setNewFeria((prevFeria) => ({
      ...prevFeria,
      [name]: value,
    }));
  };

  const handleAsistenciaInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validaciones
  const validateFeriaForm = () => {
    const errors = {};
    if (!newFeria.codigo_f) errors.codigo_f = "El nombre de la feria es requerido";
    if (!newFeria.fecha_r) errors.fecha_r = "La fecha es requerida";
    return errors;
  };

  const validateAsistenciaForm = () => {
    const errors = {};
    if (!newRecord.cedula_asistencia_feria) errors.cedula_asistencia_feria = "La cédula es requerida";
    if (!newRecord.codigo_f) errors.codigo_f = "La feria es requerida";
    return errors;
  };

  // Función para limpiar formulario de feria
  const resetFeriaForm = () => {
    setNewFeria({ id: "", codigo_f: "", fecha_r: "" });
    setErrors({});
  };

  // Función para limpiar formulario de asistencia
  const resetAsistenciaForm = () => {
    setNewRecord({
      cedula_asistencia_feria: "",
      codigo_f: "",
      descripcion: "",
    });
    setErrors({});
  };

  // Función para registrar feria
  const handleFeriaSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFeriaForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await createFeria(newFeria);
      setFerias((prev) => [...prev, response]);
      resetFeriaForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al registrar la feria:", error);
      alert("Hubo un problema al registrar la feria. Inténtalo de nuevo.");
    }
  };

  // Función para registrar asistencia
  const handleAsistenciaSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateAsistenciaForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await createAsistencia(newRecord);
      setAsistencias((prev) => [...prev, response]);
      resetAsistenciaForm();
      setIsRegisterAttendanceModalOpen(false);
    } catch (error) {
      console.error("Error al registrar la asistencia:", error);
      alert("Hubo un problema al registrar la asistencia. Inténtalo de nuevo.");
    }
  };

  // Funciones para paginación
  const totalPages = Math.ceil(
    ferias.filter((rec) => {
      // Filtro de búsqueda
      return (
        rec.codigo_f.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.fecha_r.includes(searchTerm)
      );
    }).length / limit
  );

  const filteredFerias = ferias.filter((rec) => {
    return (
      rec.codigo_f.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.fecha_r.includes(searchTerm)
    );
  });

  const startIndex = (currentPage - 1) * limit;
  const currentRecords = filteredFerias.slice(startIndex, startIndex + limit);

  // Renderización de tabla con paginación
  const renderDataTable = () => (
    <div className="records-container">
      <h2>Catálogo de Ferias</h2>
      {/* Buscador y botones */}
      <div className="search-container">
        <label htmlFor="search">Buscar feria</label>
        <input
          type="text"
          id="search"
          placeholder="Buscar por código, nombre o fecha..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="search-input"
        />
        <button
          onClick={() => setIsRegisterAttendanceModalOpen(true)}
          className="add-button"
          title="Registrar Asistencia"
        >
          <FaPlus /> Registrar Asistencia
        </button>
        <button
          onClick={() => setIsSearchFairModalOpen(true)}
          className="add-button"
          title="Registrar Feria"
        >
          <FaPlus /> Registrar Feria
        </button>
      </div>
      {/* Control de registros por página */}
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
      {/* Tabla de registros */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre de la Feria</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((rec) => (
                <tr key={rec.id}>
                  <td>{rec.id}</td>
                  <td>{rec.codigo_f}</td>
                  <td>{rec.fecha_r}</td>
                  <td>
                    <button
                      onClick={() => handleView(rec.id)}
                      title="Ver Datos"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleEdit(rec.id)}
                      title="Actualizar"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(rec.id)}
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
      {/* Paginación */}
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
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );

  // Funciones para manejar acciones
  const handleView = (id) => {
    const record = ferias.find((rec) => rec.id === id);
    if (record) {
      setViewRecord(record);
      setIsViewModalOpen(true);
    }
  };

  const handleEdit = (id) => {
    const record = ferias.find((rec) => rec.id === id);
    if (record) {
      setNewFeria(record);
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = (id) => {
    const record = ferias.find((rec) => rec.id === id);
    if (record) {
      setRecordToDelete(record);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = () => {
    setFerias((prev) => prev.filter((rec) => rec.id !== recordToDelete.id));
    setRecordToDelete(null);
    setIsDeleteModalOpen(false);
    setIsDeletedModalOpen(true);
  };

  const toggleMenu = () => {
    setIsMenuVisible((prev) => !prev);
  };

  return (
    <div className={`dashboard-container ${isMenuVisible ? "" : "menu-hidden"}`}>
      <Header />
      <Menu isMenuVisible={isMenuVisible} toggleMenu={toggleMenu} />
      <div className="dashboard-content">
        {renderDataTable()}
      </div>
      <Footer />

      {/* Modal Registrar Asistencia */}
      <Modal
        isOpen={isRegisterAttendanceModalOpen}
        onClose={() => setIsRegisterAttendanceModalOpen(false)}
      >
        <h2>Registro de Asistencia a la Feria</h2>
        <form onSubmit={handleAsistenciaSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group input-col-6">
              <label className="form-label">Cédula de Identidad del Emprendedor:</label>
              <input
                type="number"
                name="cedula_asistencia_feria"
                value={newRecord.cedula_asistencia_feria}
                onChange={handleAsistenciaInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Código de la Feria:</label>
              <input
                type="text"
                name="codigo_f"
                value={newRecord.codigo_f}
                onChange={handleAsistenciaInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-12">
              <label className="form-label">Descripción:</label>
              <input
                type="text"
                name="descripcion"
                value={newRecord.descripcion}
                onChange={handleAsistenciaInputChange}
                className="form-control"
                required
              />
            </div>
          </div>
          <button type="submit">Registrar Asistencia</button>
        </form>
      </Modal>

      {/* Modal Registrar Feria */}
      <Modal
        isOpen={isSearchFairModalOpen}
        onClose={() => setIsSearchFairModalOpen(false)}
      >
        <h2>Registrar Feria</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Aquí puedes implementar búsqueda o lógica adicional
          }}
          className="modal-form"
        >
          <div className="form-row">
            <div className="form-group input-col-12">
              <label className="form-label">Código Identificador:</label>
              <input
                type="text"
                name="id"
                value={searchData.id}
                onChange={handleSearchInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group input-col-12">
              <label className="form-label">Nombre de la Feria:</label>
              <input
                type="text"
                name="nombre_f"
                value={searchData.nombre_f}
                onChange={handleSearchInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group input-col-12">
              <label className="form-label">Fecha a Realizar:</label>
              <input
                type="date"
                name="fecha_r"
                value={searchData.fecha_r}
                onChange={handleSearchInputChange}
                className="form-control"
              />
            </div>
          </div>
          <button type="submit">Registrar Feria</button>
        </form>
      </Modal>

      {/* Modal Ver asistentes */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
        <h2>Asistentes a la Feria</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Cédula de Identidad</th>
              <th>Nombre</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {attendees.length > 0 ? (
              attendees.map((att) => (
                <tr key={att.cedula_asistencia_feria}>
                  <td>{att.cedula_asistencia_feria}</td>
                  <td>{att.firstName} {att.lastName}</td>
                  <td>{att.descripcion}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No hay asistentes.</td>
              </tr>
            )}
          </tbody>
        </table>
      </Modal>

      {/* Modal Actualizar feria */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2>Actualizar Datos de Feria</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Aquí puedes agregar lógica de actualización si es necesario
          }}
          className="modal-form"
        >
          <div className="form-row">
            <div className="form-group input-col-12">
              <label className="form-label">Código de la Feria:</label>
              <input
                type="text"
                name="id"
                value={newFeria.id}
                onChange={handleFeriaInputChange}
                className="form-control"
                required
                disabled
              />
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Nombre de la Feria:</label>
              <input
                type="text"
                name="codigo_f"
                value={newFeria.codigo_f}
                onChange={handleFeriaInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Fecha de la Feria:</label>
              <input
                type="date"
                name="fecha_r"
                value={newFeria.fecha_r}
                onChange={handleFeriaInputChange}
                className="form-control"
                required
              />
            </div>
          </div>
          <button type="submit">Actualizar</button>
        </form>
      </Modal>

      {/* Modal eliminar */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <h2>Confirmar Eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar este registro?</p>
        <p>
          <strong>Código:</strong> {recordToDelete?.id}
        </p>
        <p>
          <strong>Nombre:</strong> {recordToDelete?.codigo_f}
        </p>
        <div className="modal-actions">
          <button onClick={confirmDelete}>Eliminar</button>
          <button onClick={() => setIsDeleteModalOpen(false)}>Cancelar</button>
        </div>
      </Modal>

      {/* Modal eliminado */}
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

export default ferias;