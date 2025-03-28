import React, { useState } from "react";
import { FaPlus, FaChevronLeft, FaChevronRight, FaCheckCircle, FaDollarSign, FaEuroSign } from "react-icons/fa";
import Header from "../components/Header";
import Menu from "../components/Menu";
import Footer from "../components/Footer";
import Modal from "../components/Modal"; 
import "../assets/styles/App.css";

const Usuario = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([
    { date: "2023-10-01", dollarPrice: "80.00", euroPrice: "85.50" },
    { date: "2023-10-02", dollarPrice: "81.10", euroPrice: "87.60" },
    { date: "2023-10-03", dollarPrice: "85.20", euroPrice: "90.70" },
    { date: "2023-10-04", dollarPrice: "96.30", euroPrice: "100.80" },
    { date: "2023-10-05", dollarPrice: "99.00", euroPrice: "110.90" },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletedModalOpen, setIsDeletedModalOpen] = useState(false);
  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [newRecord, setNewRecord] = useState({ date: "", dollarPrice: "", euroPrice: "" });
  const [recordToDelete, setRecordToDelete] = useState(null);

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
    setNewRecord({ date: "", dollarPrice: "", euroPrice: "" });
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
                    <td>{formatCurrency(record.dollarPrice)}</td>
                    <td>{formatCurrency(record.euroPrice)}</td>
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
              <label className="form-label">Fecha:</label>
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
              <label className="form-label"><FaDollarSign /> Precio Dólar:</label>
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
              <label className="form-label"><FaEuroSign /> Precio Euro:</label>
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
    </div>
  );
};

export default Usuario;