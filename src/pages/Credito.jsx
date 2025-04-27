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
} from "../services/CreditoService"; // Importa las funciones del servicio
import "../assets/styles/App.css";

const Credito = () => {
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
    n_contrato: "",
    euro: "",
    bolivares: "",
    cincoflax: "",
    diezinteres: "",
    interes_semanal: "",
    semanal_sin_interes: "",
    couta: "",
    desde: "",
    hasta: "",
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
    // Aquí puedes agregar tus validaciones
    if (!newRecord.n_contrato) {
      errors.n_contrato = "El número de contrato es obligatorio.";
    }
    if (!newRecord.euro) {
      errors.euro = "El monto en euros es obligatorio.";
    }
    // Agrega más validaciones según sea necesario
  
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (records.some((record) => record.n_contrato === newRecord.n_contrato)) {
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
      const response = await updateRecord(newRecord.n_contrato, newRecord); // Usar el servicio para actualizar
      const updatedRecords = records.map((record) =>
        record.n_contrato === response.n_contrato ? response : record
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
      n_contrato: "",
      euro: "",
      bolivares: "",
      cincoflax: "",
      diezinteres: "",
      interes_semanal: "",
      semanal_sin_interes: "",
      couta: "",
      desde: "",
      hasta: "",
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
        (record.n_contrato && record.n_contrato.includes(searchTerm))
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
        <h2>Catálogo de Credito</h2>
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
                <th>N° Contrato</th>
                <th>Nombre y Apellido</th>
                <th>Tipo de Credito</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((record) => (
                  <tr key={record.n_contrato}>
                    <td>{record.n_contrato}</td>
                    <td>{`${record.nombres} ${record.apellidos}`}</td>
                    <td>{record.tipo}</td>
                    <td>
                      <button
                        onClick={() => handleView(record.n_contrato)}
                        title="Ver Datos"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(record.n_contrato)}
                        title="Actualizar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(record.n_contrato)}
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
    const recordToView = records.find((record) => record.n_contrato === id);
    if (recordToView) {
      setViewRecord(recordToView);
      setIsViewModalOpen(true);
    }
  };

  const handleEdit = (id) => {
    const recordToEdit = records.find((record) => record.n_contrato === id);
    if (recordToEdit) {
      setNewRecord(recordToEdit);
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = (id) => {
    const recordToDelete = records.find((record) => record.n_contrato === id);
    if (recordToDelete) {
      setRecordToDelete(recordToDelete);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteRecord(recordToDelete.n_contrato); // Usar el servicio para eliminar
      setRecords(
        records.filter((record) => record.n_contrato !== recordToDelete.n_contrato)
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
      <h2>Datos para la gestión de crédito</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group input-col-12">
              <label className="form-label">N° de Contrato:</label>
              <div className="input-group">
                <input
                  type="text"
                  name="n_contrato" // Cambié el nombre para que sea único
                  value={newRecord.n_contrato} // Cambié para que use el valor correcto
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
                  Acción
                </button>
              </div>
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Monto en Euros</label>
              <input
                type="text"
                name="euro" // Cambié el nombre para que sea único
                value={newRecord.euro} // Cambié para que use el valor correcto
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Monto en Bolivares:</label>
              <input
                type="text"
                name="bolivares" // Cambié el nombre para que sea único
                value={newRecord.bolivares} // Cambié para que use el valor correcto
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-3">
              <label className="form-label">5% FLAT:</label>
              <input
                type="text"
                name="cincoflax" // Cambié el nombre para que sea único
                value={newRecord.cincoflax} // Cambié para que use el valor correcto
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-3">
              <label className="form-label">10% de Interes:</label>
              <input
                type="text"
                name="diezinteres" // Cambié el nombre para que sea único
                value={newRecord.diezinteres} // Cambié para que use el valor correcto
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-3">
              <label className="form-label">Interes Semanal:</label>
              <input
                type="text"
                name="interes_semanal" // Cambié el nombre para que sea único
                value={newRecord.interes_semanal} // Cambié para que use el valor correcto
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-3">
              <label className="form-label">Semana Sin Interes:</label>
              <input
                type="text"
                name="semanal_sin_interes" // Cambié el nombre para que sea único
                value={newRecord.semanal_sin_interes} // Cambié para que use el valor correcto
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-12">
              <label className="form-label">Cuota a Cancelar:</label>
              <input
                type="text"
                name="couta" // Cambié el nombre para que sea único
                value={newRecord.couta} // Cambié para que use el valor correcto
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Desde:</label>
              <input
                type="date"
                name="desde" // Cambié el nombre para que sea único
                value={newRecord.desde} // Cambié para que use el valor correcto
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Hasta:</label>
              <input
                type="date"
                name="hasta" // Cambié el nombre para que sea único
                value={newRecord.hasta} // Cambié para que use el valor correcto
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
          </div>
          <button type="submit">Registrar</button>
        </form>
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
        <h2>Detalles de crédito</h2>
                {viewRecord && (
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Método de Pago</th>
                          {viewRecord.payments.map((payment, index) => (
                            <React.Fragment key={index}>
                              {payment.accountType === "Transferencia" && (
                                <>
                                  <th>Banco</th>
                                  <th>N° de Cuenta</th>
                                </>
                              )}
                            </React.Fragment>
                          ))}
                          <th>Monto en Dólar</th>
                          <th>Cambio en Bolívares</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewRecord.payments.map((payment, index) => (
                          <tr key={index}>
                            <td>{payment.accountType}</td>
                            {payment.accountType === "Transferencia" && (
                              <>
                                <td>{payment.bank}</td>
                                <td>{payment.accountNumber}</td>
                              </>
                            )}
                            <td>{payment.amountInDollars}</td>
                            <td>{payment.exchangeInBolivares || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2>Actualizar Datos Creditoles</h2>
        <form onSubmit={handleUpdate} className="modal-form">
          <div className="form-row">
            <div className="form-group input-col-12">
              <label className="form-label">Cédula de Identidad:</label>
              <input
                type="text"
                name="n_contrato"
                value={newRecord.n_contrato}
                onChange={handleInputChange}
                className="form-control"
                readOnly // Campo de solo lectura
              />
              {errors.n_contrato && (
                <span className="error-message">{errors.n_contrato}</span>
              )}
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Nombres:</label>
              <input
                type="text"
                name="nombres"
                value={newRecord.nombres}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.nombres && (
                <span className="error-message">{errors.nombres}</span>
              )}
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Apellidos:</label>
              <input
                type="text"
                name="apellidos"
                value={newRecord.apellidos}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.apellidos && (
                <span className="error-message">{errors.apellidos}</span>
              )}
            </div>
            <div className="form-group input-col-4">
              <label className="form-label">Estado:</label>
              <input
                type="text"
                name="estado"
                value={newRecord.estado}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.estado && (
                <span className="error-message">{errors.estado}</span>
              )}
            </div>
            <div className="form-group input-col-4">
              <label className="form-label">Municipio:</label>
              <input
                type="text"
                name="municipio"
                value={newRecord.municipio}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.municipio && (
                <span className="error-message">{errors.municipio}</span>
              )}
            </div>
            <div className="form-group input-col-4">
              <label className="form-label">Parroquia:</label>
              <input
                type="text"
                name="parroquia"
                value={newRecord.parroquia}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.parroquia && (
                <span className="error-message">{errors.parroquia}</span>
              )}
            </div>
            <div className="form-group input-col-12">
              <label className="form-label">Dirección:</label>
              <input
                type="text"
                name="direccion"
                value={newRecord.direccion}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.direccion && (
                <span className="error-message">{errors.direccion}</span>
              )}
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Teléfono 1:</label>
              <input
                type="text"
                name="telefono1"
                value={newRecord.telefono1}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.telefono1 && (
                <span className="error-message">{errors.telefono1}</span>
              )}
            </div>
            <div className="form-group input-col-6">
              <label className="form-label">Teléfono 2:</label>
              <input
                type="text"
                name="telefono2"
                value={newRecord.telefono2}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.telefono2 && (
                <span className="error-message">{errors.telefono2}</span>
              )}
            </div>
            <div className="form-group input-col-12">
              <label className="form-label">Tipo de Credito:</label>
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

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <h2>Confirmar Eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar este registro?</p>
        <p>
          <strong>Cédula de Identidad:</strong> {recordToDelete?.n_contrato}
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

export default Credito;
