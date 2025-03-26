import React, { useState } from "react";
import { FaEye, FaEdit, FaTrash, FaPlus, FaChevronLeft, FaChevronRight, FaCheckCircle } from "react-icons/fa";
import Header from "../components/Header";
import Menu from "../components/Menu";
import Footer from "../components/Footer";
import Modal from "../components/Modal"; 
import "../assets/styles/App.css";

const Ferias = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([
    {
      identityCard: "12345678",
      firstName: "Juan",
      lastName: "Pérez",
      fairName: "Feria de Emprendedores",
      attendanceDate: "2023-10-01",
      comments: "Asistió con éxito.",
    },
    {
      identityCard: "87654321",
      firstName: "María",
      lastName: "Gómez",
      fairName: "Feria de Innovación",
      attendanceDate: "2023-09-15",
      comments: "Interesada en nuevas oportunidades.",
    },
    {
      identityCard: "11223344",
      firstName: "Carlos",
      lastName: "López",
      fairName: "Feria de Tecnología",
      attendanceDate: "2023-08-20",
      comments: "Buscando socios estratégicos.",
    },
    {
      identityCard: "44332211",
      firstName: "Ana",
      lastName: "Martínez",
      fairName: "Feria de Artesanía",
      attendanceDate: "2023-07-10",
      comments: "Exhibió productos artesanales.",
    },
    {
      identityCard: "55667788",
      firstName: "Luis",
      lastName: "Fernández",
      fairName: "Feria de Gastronomía",
      attendanceDate: "2023-06-05",
      comments: "Presentó su nuevo menú.",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletedModalOpen, setIsDeletedModalOpen] = useState(false);
  const [isRegisterAttendanceModalOpen, setIsRegisterAttendanceModalOpen] = useState(false);
  const [isSearchFairModalOpen, setIsSearchFairModalOpen] = useState(false);
  const [attendees, setAttendees] = useState([]); // Nuevo estado para almacenar asistentes
  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewRecord, setViewRecord] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const initialRecordState = {
    identityCard: "",
    firstName: "",
    lastName: "",
    fairName: "",
    attendanceDate: "",
    comments: "",
  };

  const [newRecord, setNewRecord] = useState(initialRecordState);

  // Estado para registrar ferias
  const initialFairState = {
    fairCode: "",
    fairName: "",
    fairDate: "",
  };

  const [newFair, setNewFair] = useState(initialFairState);
  
  // Estado para buscar ferias
  const initialSearchState = {
    searchCode: "",
    entrepreneurName: "",
    searchDate: "",
  };

  const [searchData, setSearchData] = useState(initialSearchState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord({ ...newRecord, [name]: value });
  };

  const handleFairInputChange = (e) => {
    const { name, value } = e.target;
    setNewFair({ ...newFair, [name]: value });
  };

  const handleSearchInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData({ ...searchData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setRecords([...records, newRecord]);
    resetForm();
    setIsModalOpen(false);
  };

  const handleRegisterFairSubmit = (e) => {
    e.preventDefault();
    console.log("Feria registrada:", newFair);
    resetFairForm();
    setIsRegisterAttendanceModalOpen(false);
  };

  const handleSearchFairSubmit = (e) => {
    e.preventDefault();
    const filteredAttendees = records.filter(record => 
      record.fairName.includes(searchData.searchCode) || 
      record.firstName.includes(searchData.entrepreneurName) || 
      record.attendanceDate === searchData.searchDate
    );
    setAttendees(filteredAttendees);
    setIsSearchFairModalOpen(false);
    setIsViewModalOpen(true); // Mostrar el modal de asistentes
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

  const resetFairForm = () => {
    setNewFair(initialFairState);
  };

  const resetSearchForm = () => {
    setSearchData(initialSearchState);
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
        <h2>Catálogo de Ferias</h2>
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
          <button onClick={() => setIsRegisterAttendanceModalOpen(true)} className="add-button" title="Registrar Asistencia">
            <FaPlus /> Registrar Asistencia
          </button>
          &nbsp;
          <button onClick={() => setIsSearchFairModalOpen(true)} className="add-button" title="Buscar Feria">
            <FaPlus /> Registrar Feria  
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
                <th>ID</th>
                <th>Nombre de la Feria</th>
                <th>Fecha de Realización</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((record) => (
                  <tr key={record.identityCard}>
                    <td>{record.identityCard}</td>
                    <td>{record.fairName}</td>
                    <td>{record.attendanceDate}</td>
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
        <h2>Datos de nueva formalización de Emprendimiento</h2>
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
            <div className="form-group input-col-3">
              <label className="form-label">Fecha de Inscripción:</label>
              <input
                type="date"
                name="attendanceDate"
                value={newRecord.attendanceDate}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-9">
              <label className="form-label">N° de Registro del Certificado Emitido Página Emprender Juntos:</label>
              <input
                type="text"
                name="comments"
                value={newRecord.comments}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
          </div>
          <button type="submit">Guardar</button>
        </form>
      </Modal>

      {/* Modal para registrar asistencia a la feria */}
      <Modal isOpen={isRegisterAttendanceModalOpen} onClose={() => setIsRegisterAttendanceModalOpen(false)}>
        <h2>Registro de Asistencia a la Feria</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group input-col-12">
              <label className="form-label">Cédula de Identidad del Emprendedor:</label>
              <input
                type="text"
                name="identityCard"
                value={newRecord.identityCard}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-4">
              <label className="form-label">Código de la Feria:</label>
              <input
                type="text"
                name="fairName"
                value={newRecord.fairName}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-7">
              <label className="form-label">Fecha de Asistencia:</label>
              <input
                type="date"
                name="attendanceDate"
                value={newRecord.attendanceDate}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
          </div>
          <button type="submit">Registrar Asistencia</button>
        </form>
      </Modal>

      {/* Modal para buscar feria */}
      <Modal isOpen={isSearchFairModalOpen} onClose={() => setIsSearchFairModalOpen(false)}>
        <h2>Buscar Feria</h2>
        <form onSubmit={handleSearchFairSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group input-col-12">
              <label className="form-label">Código Identificador:</label>
              <input
                type="text"
                name="searchCode"
                value={searchData.searchCode}
                onChange={handleSearchInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group input-col-12">
              <label className="form-label">Nombre del Emprendedor:</label>
              <input
                type="text"
                name="entrepreneurName"
                value={searchData.entrepreneurName}
                onChange={handleSearchInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group input-col-12">
              <label className="form-label">Fecha de la Feria:</label>
              <input
                type="date"
                name="searchDate"
                value={searchData.searchDate}
                onChange={handleSearchInputChange}
                className="form-control"
              />
            </div>
          </div>
          <button type="submit">Buscar Feria</button>
        </form>
      </Modal>

      {/* Modal para ver datos */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
        <h2>Asistentes a la Feria</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Cédula de Identidad</th>
              <th>Nombre</th>
              <th>Descripcion</th>
            </tr>
          </thead>
          <tbody>
            {/* Datos ficticios de asistentes */}
            <tr>
              <td>12345678</td>
              <td>Juan Pérez</td>
              <td>Asistió con éxito.</td>
            </tr>
            <tr>
              <td>87654321</td>
              <td>María Gómez</td>
              <td>Interesada en nuevas oportunidades.</td>
            </tr>
            <tr>
              <td>11223344</td>
              <td>Carlos López</td>
              <td>Buscando socios estratégicos.</td>
            </tr>
            <tr>
              <td>44332211</td>
              <td>Ana Martínez</td>
              <td>Exhibió productos artesanales.</td>
            </tr>
            <tr>
              <td>55667788</td>
              <td>Luis Fernández</td>
              <td>Presentó su nuevo menú.</td>
            </tr>
          </tbody>
        </table>
      </Modal>

      {/* Modal para editar datos */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2>Actualizar Datos de Ferias</h2>
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
              <label className="form-label">Nombre de la Feria:</label>
              <input
                type="text"
                name="fairName"
                value={newRecord.fairName}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Fecha de Asistencia:</label>
              <input
                type="date"
                name="attendanceDate"
                value={newRecord.attendanceDate}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-12">
              <label className="form-label">Comentarios:</label>
              <input
                type="text"
                name="comments"
                value={newRecord.comments}
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

export default Ferias;