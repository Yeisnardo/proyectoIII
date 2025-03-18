import React, { useState } from "react";
import { FaEye, FaEdit, FaTrash, FaPlus, FaChevronLeft, FaChevronRight, FaCheckCircle, FaDollarSign, FaEuroSign } from "react-icons/fa";
import Header from "../components/Header";
import Menu from "../components/Menu";
import Footer from "../components/Footer";
import Modal from "../components/Modal"; 
import "../assets/styles/App.css";

const Usuario = () => {
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
    date: "",
    dollarPrice: "",
    euroPrice: "",
  };

  const [newRecord, setNewRecord] = useState(initialRecordState);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'VES',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value).replace(/\./g, ",").replace(/,/g, "."); // Cambiar el formato a 5.666,00
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord({ ...newRecord, [name]: value });
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setNewRecord({ ...newRecord, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setRecords([...records, { 
      ...newRecord, 
      dollarPrice: parseFloat(newRecord.dollarPrice.replace(/\./g, "").replace(/,/g, ".")), 
      euroPrice: parseFloat(newRecord.euroPrice.replace(/\./g, "").replace(/,/g, ".")) 
    }]);
    resetForm();
    setIsModalOpen(false);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setRecords(records.map(record => 
      record.date === newRecord.date ? { 
        ...newRecord, 
        dollarPrice: parseFloat(newRecord.dollarPrice.replace(/\./g, "").replace(/,/g, ".")), 
        euroPrice: parseFloat(newRecord.euroPrice.replace(/\./g, "").replace(/,/g, ".")) 
      } : record
    ));
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
        record.date.includes(searchTerm) ||
        record.dollarPrice.toString().includes(searchTerm) ||
        record.euroPrice.toString().includes(searchTerm)
      );
    });
  
    const totalPages = Math.ceil(filteredRecords.length / limit);
    const startIndex = (currentPage - 1) * limit;
    const currentRecords = filteredRecords.slice(startIndex, startIndex + limit);
  
    return (
      <div className="records-container">
        <h2>Catalago de Precio de la Divisa</h2>
        <div className="search-container">
          <label htmlFor="search" className="search-label">Buscar registro</label>
          <input
            type="text"
            id="search"
            placeholder="Buscar por fecha, precio Dólar o Euro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button onClick={() => setIsModalOpen(true)} className="add-button" title="Agregar Nuevo Registro">
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
                <th>Fecha</th>
                <th><FaDollarSign /> Precio Dólar</th>
                <th><FaEuroSign /> Precio Euro</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((record) => (
                  <tr key={record.date}>
                    <td>{record.date}</td>
                    <td>{formatCurrency(record.dollarPrice)} <FaDollarSign /></td>
                    <td>{formatCurrency(record.euroPrice)} <FaEuroSign /></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="no-results">No se encontraron registros.</td>
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

  const handleView = (date) => {
    const recordToView = records.find((record) => record.date === date);
    if (recordToView) {
      setViewRecord(recordToView);
      setIsViewModalOpen(true);
    }
  };

  const handleEdit = (date) => {
    const recordToEdit = records.find((record) => record.date === date);
    if (recordToEdit) {
      setNewRecord(recordToEdit);
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = (date) => {
    const recordToDelete = records.find((record) => record.date === date);
    if (recordToDelete) {
      setRecordToDelete(recordToDelete);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = () => {
    setRecords(records.filter((record) => record.date !== recordToDelete.date));
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
        <h2>Registrar Precios de Divisas</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group input-col-12">
              <label>Fecha:</label>
              <input
                type="date"
                name="date"
                value={newRecord.date}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-6">
              <label><FaDollarSign /> Precio Dólar:</label>
              <input
                type="text"
                name="dollarPrice"
                value={newRecord.dollarPrice}
                onChange={handlePriceChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-6">
              <label><FaEuroSign /> Precio Euro:</label>
              <input
                type="text"
                name="euroPrice"
                value={newRecord.euroPrice}
                onChange={handlePriceChange}
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
        <h2>Detalles de Precios de Divisas</h2>
        {viewRecord && (
          <div className="view-record-details">
            <p><strong>Fecha:</strong> {viewRecord.date}</p>
            <p><strong>Precio Dólar:</strong> {formatCurrency(viewRecord.dollarPrice)} <FaDollarSign /></p>
            <p><strong>Precio Euro:</strong> {formatCurrency(viewRecord.euroPrice)} <FaEuroSign /></p>
          </div>
        )}
      </Modal>

      {/* Modal para editar datos */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2>Actualizar Precios de Divisas</h2>
        <form onSubmit={handleUpdate} className="modal-form">
          <div className="form-row">
            <div className="form-group input-col-12">
              <label>Fecha:</label>
              <input
                type="date"
                name="date"
                value={newRecord.date}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-6">
              <label><FaDollarSign /> Precio Dólar:</label>
              <input
                type="text"
                name="dollarPrice"
                value={newRecord.dollarPrice}
                onChange={handlePriceChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-6">
              <label><FaEuroSign /> Precio Euro:</label>
              <input
                type="text"
                name="euroPrice"
                value={newRecord.euroPrice}
                onChange={handlePriceChange}
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
        <p><strong>Fecha:</strong> {recordToDelete?.date}</p>
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

export default Usuario;