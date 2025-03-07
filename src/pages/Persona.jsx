import React, { useState } from "react";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Header from "../components/Header";
import Menu from "../components/Menu";
import Footer from "../components/Footer";
import Modal from "../components/Modal"; // Importar el componente Modal
import "../assets/styles/App.css";

const Persona = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([
    {
      identityCard: "30608606",
      firstName: "Yeisnardo",
      lastName: "Bravo",
      type: "Natural",
    },
    {
      identityCard: "12345678",
      firstName: "Juan",
      lastName: "Pérez",
      type: "Natural",
    },
    {
      identityCard: "87654321",
      firstName: "María",
      lastName: "González",
      type: "Jurídica",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
  const [newRecord, setNewRecord] = useState({
    identityCard: "",
    firstName: "",
    lastName: "",
    email: "",
    type: "Natural",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord({ ...newRecord, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Evitar el comportamiento por defecto del formulario
    setRecords([...records, newRecord]); // Agregar el nuevo registro
    setNewRecord({
      identityCard: "",
      firstName: "",
      lastName: "",
      email: "",
      type: "Natural",
    }); // Reiniciar el formulario
    setIsModalOpen(false); // Cerrar el modal después de agregar el registro
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

    return (
      <div className="records-table">
        <h2>Registro de Persona</h2>
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
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <tr key={record.identityCard}>
                  <td>{record.identityCard}</td>
                  <td>{`${record.firstName} ${record.lastName}`}</td>
                  <td>{record.type}</td>
                  <td>
                    <button
                      onClick={() => handleView(record.identityCard)}
                      title="Ver Datos"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleEdit(record.identityCard)}
                      title="Actualizar"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(record.identityCard)}
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
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2>Datos Personales</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group input-col-12">
                <label>Cédula de Identidad:</label>
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
                <label>Nombre / Apellido:</label>
                <input
                  type="text"
                  name="firstName"
                  value={newRecord.firstName}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group input-col-2">
                <label>Edad</label>
                <input
                  type="number"
                  name="lastName"
                  value={newRecord.lastName}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group input-col-4">
                <label>Sexo:</label>
                <select
                  name="type"
                  value={newRecord.type}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="F">F</option>
                  <option value="M">M</option>
                </select>
              </div>
              <div className="form-group input-col-12">
                <label>Fecha de Nacimiento:</label>
                <input
                  type="date"
                  name="email"
                  value={newRecord.email}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group input-col-6">
                <label>Telefono:</label>
                <input
                  type="text"
                  name="email"
                  value={newRecord.email}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group input-col-6">
                <label>Correo Electrónico:</label>
                <input
                  type="email"
                  name="email"
                  value={newRecord.email}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group input-col-12">
                <label>Tipo de Persona:</label>
                <select
                  name="type"
                  value={newRecord.type}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="Administrador(a)">Administrador(a)</option>
                  <option value="Asistente">Asistente</option>
                  <option value="Coordinador(a)">Coordinador(a)</option>
                </select>
              </div>
            </div>
            <button type="submit">Guardar</button>
          </form>
        </Modal>
      </div>
    );
  };

  const handleView = (id) => {
    console.log("Ver datos de:", id);
  };

  const handleEdit = (id) => {
    const recordToEdit = records.find((record) => record.identityCard === id);
    if (recordToEdit) {
      setNewRecord(recordToEdit);
      setIsModalOpen(true);
    }
  };

  const handleDelete = (id) => {
    console.log("Eliminar datos de:", id);
    setRecords(records.filter((record) => record.identityCard !== id)); // Eliminar el registro
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
    </div>
  );
};

export default Persona;
