import React, { useState, useEffect } from "react"; // Agregar useEffect aquí
import { FaPlus, FaCheckCircle } from "react-icons/fa";
import Header from "../components/Header";
import Menu from "../components/Menu";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import {
  fetchRecords,
  createRecord,
  updateRecord,
  deleteRecord,
} from "../services/requerimientosService";
import "../assets/styles/App.css";

const Requerimientos = () => {
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
  const [errors, setErrors] = useState({}); // Estado para manejar errores
  const [newRecord, setNewRecord] = useState({
    cedula_requerimientos_e: "", // Cambiado para coincidir con la tabla
    solicitud_credito: "",
    postulacion_ubch: "",
    inspeccion_emprendimiento: "",
    carta_residencia: "",
    copia_cedula: "",
    rif_personal: "",
    foto_e: "",
    rif_e: "",
    certificado_ej: "", // Agregado para coincidir con la tabla
    referencia_bancaria: "",
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

  // Función para toggle
  const toggleSolicitudCredito = () => {
    setSolicitudCredito((prev) => (prev === "si" ? "no" : "si"));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validaciones para requerimientos_e
    if (!newRecord.cedula_requerimientos_e) {
      newErrors.cedula_requerimientos_e = "La cédula es OBLIGATORIA.";
    }

    if (!newRecord.solicitud_credito) {
      newErrors.solicitud_credito = "La solicitud de crédito es OBLIGATORIA.";
    }

    if (!newRecord.postulacion_ubch) {
      newErrors.postulacion_ubch = "La postulación UBCH es OBLIGATORIA.";
    }

    if (!newRecord.inspeccion_emprendimiento) {
      newErrors.inspeccion_emprendimiento =
        "La inspección de emprendimiento es OBLIGATORIA.";
    }

    if (!newRecord.carta_residencia) {
      newErrors.carta_residencia = "La carta de residencia es OBLIGATORIA.";
    }

    if (!newRecord.copia_cedula) {
      newErrors.copia_cedula = "La copia de la cédula es OBLIGATORIA.";
    }

    if (!newRecord.rif_personal) {
      newErrors.rif_personal = "El RIF personal es OBLIGATORIO.";
    }

    if (!newRecord.foto_e) {
      newErrors.foto_e = "La foto es OBLIGATORIA.";
    }

    if (!newRecord.rif_e) {
      newErrors.rif_e = "El RIF empresarial es OBLIGATORIO.";
    }

    if (!newRecord.referencia_bancaria) {
      newErrors.referencia_bancaria = "La referencia bancaria es OBLIGATORIA.";
    }

    return newErrors;
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
          record.cedula_requerimientos_e === newRecord.cedula_requerimientos_e
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
        newRecord.cedula_requerimientos_e,
        newRecord
      );
      const updatedRecords = records.map((record) =>
        record.cedula_requerimientos_e === response.cedula_requerimientos_e
          ? response
          : record
      );
      setRecords(updatedRecords);

      // Actualiza viewRecord con los datos actualizados
      setViewRecord(response);

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
      cedula_requerimientos_e: "", // Cambiado para coincidir con la tabla
      solicitud_credito: "",
      postulacion_ubch: "",
      inspeccion_emprendimiento: "",
      carta_residencia: "",
      copia_cedula: "",
      rif_personal: "",
      foto_e: "",
      rif_e: "",
      certificado_ej: "", // Agregado para coincidir con la tabla
      referencia_bancaria: "",
    });
    setErrors({});
  };

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const renderDataTable = () => {
    const filteredRecords = records.filter((record) => {
      return (
        record.persona?.nombres
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) || // Accede a nombres a través de persona
        record.persona?.apellidos
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) || // Accede a apellidos a través de persona
        record.cedula_requerimientos_e.includes(searchTerm)
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
        <h2>Mis Requerimientos</h2>
        <div className="search-container">
          <button
            onClick={() => setIsModalOpen(true)}
            className="add-button"
            title="Agregar Nuevo Registro"
          >
            <FaPlus />
            Agregas los Requerimientos
          </button>
        </div>
<form onSubmit={handleSubmit} className="modal-form">
  <ul className="form-row form-list form-group">

    {/* Cédula de Identidad */}
    <li className="form-item input-col-12">
      <input
        type="hidden"
        name="cedula_requerimientos_e"
        value={newRecord.cedula_requerimientos_e}
        onChange={handleInputChange}
        className="form-control"
      />
      {errors.cedula_requerimientos_e && (
        <span className="error-message">{errors.cedula_requerimientos_e}</span>
      )}
    </li>

    {/* Solicitud de Crédito */}
    <li className="form-item input-col-12">
      <label className="form-label">Solicitud de Crédito:</label>
      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="solicitud_credito"
            checked={newRecord.solicitud_credito}
            onChange={(e) => handleCheckboxChange(e, 'solicitud_credito')}
          />
          <span className="custom-checkbox"></span>
          
        </label>
      </div>
      {errors.solicitud_credito && (
        <span className="error-message">{errors.solicitud_credito}</span>
      )}
    </li>

    {/* Postulación UBCH */}
    <li className="form-item input-col-12">
      <label className="form-label">Postulación UBCH:</label>
      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="postulacion_ubch"
            checked={newRecord.postulacion_ubch}
            onChange={(e) => handleCheckboxChange(e, 'postulacion_ubch')}
          />
          <span className="custom-checkbox"></span>
          
        </label>
      </div>
      {errors.postulacion_ubch && (
        <span className="error-message">{errors.postulacion_ubch}</span>
      )}
    </li>

    {/* Inspección de Emprendimiento */}
    <li className="form-item input-col-12">
      <label className="form-label">Inspección de Emprendimiento:</label>
      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="inspeccion_emprendimiento"
            checked={newRecord.inspeccion_emprendimiento}
            onChange={(e) => handleCheckboxChange(e, 'inspeccion_emprendimiento')}
          />
          <span className="custom-checkbox"></span>
          
        </label>
      </div>
      {errors.inspeccion_emprendimiento && (
        <span className="error-message">{errors.inspeccion_emprendimiento}</span>
      )}
    </li>

    {/* Carta de Aval o Residencia */}
    <li className="form-item input-col-12">
      <label className="form-label">Carta de Aval o Residencia:</label>
      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="carta_residencia"
            checked={newRecord.carta_residencia}
            onChange={(e) => handleCheckboxChange(e, 'carta_residencia')}
          />
          <span className="custom-checkbox"></span>
          
        </label>
      </div>
      {errors.carta_residencia && (
        <span className="error-message">{errors.carta_residencia}</span>
      )}
    </li>

    {/* Copia de Cédula */}
    <li className="form-item input-col-12">
      <label className="form-label">Copia de Cédula:</label>
      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="copia_cedula"
            checked={newRecord.copia_cedula}
            onChange={(e) => handleCheckboxChange(e, 'copia_cedula')}
          />
          <span className="custom-checkbox"></span>
          
        </label>
      </div>
      {errors.copia_cedula && (
        <span className="error-message">{errors.copia_cedula}</span>
      )}
    </li>

    {/* RIF Personal */}
    <li className="form-item input-col-12">
      <label className="form-label">RIF Personal:</label>
      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="rif_personal"
            checked={newRecord.rif_personal}
            onChange={(e) => handleCheckboxChange(e, 'rif_personal')}
          />
          <span className="custom-checkbox"></span>
          
        </label>
      </div>
      {errors.rif_personal && (
        <span className="error-message">{errors.rif_personal}</span>
      )}
    </li>

    {/* Fotos del Emprendimiento */}
    <li className="form-item input-col-12">
      <label className="form-label">Fotos del Emprendimiento:</label>
      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="foto_e"
            checked={newRecord.foto_e}
            onChange={(e) => handleCheckboxChange(e, 'foto_e')}
          />
          <span className="custom-checkbox"></span>
          
        </label>
      </div>
      {errors.foto_e && (
        <span className="error-message">{errors.foto_e}</span>
      )}
    </li>

    {/* RIF de Emprendimiento */}
    <li className="form-item input-col-12">
      <label className="form-label">RIF de Emprendimiento:</label>
      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="rif_e"
            checked={newRecord.rif_e}
            onChange={(e) => handleCheckboxChange(e, 'rif_e')}
          />
          <span className="custom-checkbox"></span>
          
        </label>
      </div>
      {errors.rif_e && (
        <span className="error-message">{errors.rif_e}</span>
      )}
    </li>

    {/* Certificado de Emprender Juntos */}
    <li className="form-item input-col-12">
      <label className="form-label">Certificado de Emprender Juntos:</label>
      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="certificado_ej"
            checked={newRecord.certificado_ej}
            onChange={(e) => handleCheckboxChange(e, 'certificado_ej')}
          />
          <span className="custom-checkbox"></span>
          
        </label>
      </div>
      {errors.certificado_ej && (
        <span className="error-message">{errors.certificado_ej}</span>
      )}
    </li>

    {/* Referencia Bancaria */}
    <li className="form-item input-col-12">
      <label className="form-label">Referencia Bancaria:</label>
      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="referencia_bancaria"
            checked={newRecord.referencia_bancaria}
            onChange={(e) => handleCheckboxChange(e, 'referencia_bancaria')}
          />
          <span className="custom-checkbox"></span>
          
        </label>
      </div>
      {errors.referencia_bancaria && (
        <span className="error-message">{errors.referencia_bancaria}</span>
      )}
    </li>

  </ul>
</form>
      </div>
    );
  };

  const confirmDelete = async () => {
    try {
      await deleteRecord(recordToDelete.cedula_requerimientos_e); // Usar el servicio para eliminar
      setRecords(
        records.filter(
          (record) =>
            record.cedula_requerimientos_e !==
            recordToDelete.cedula_requerimientos_e
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
      {/* Modal para agregar nuevo registro */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 style={{ textAlign: "center" }}>Registrar Requerimientos</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <ul className="form-row">
            {/* Solicitud de Crédito */}
    <li className="form-item">
      <label className="form-label">Solicitud de Crédito:</label>
      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="solicitud_credito"
            checked={newRecord.solicitud_credito}
            onChange={(e) => handleCheckboxChange(e, 'solicitud_credito')}
          />
          <span className="custom-checkbox"></span>
          <span className="checkbox-text">Sí</span>
        </label>
      </div>
      {errors.solicitud_credito && (
        <span className="error-message">{errors.solicitud_credito}</span>
      )}
    </li>

    {/* Postulación UBCH */}
    <li className="form-item">
      <label className="form-label">Postulación UBCH:</label>
      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="postulacion_ubch"
            checked={newRecord.postulacion_ubch}
            onChange={(e) => handleCheckboxChange(e, 'postulacion_ubch')}
          />
          <span className="custom-checkbox"></span>
          <span className="checkbox-text">Sí</span>
        </label>
      </div>
      {errors.postulacion_ubch && (
        <span className="error-message">{errors.postulacion_ubch}</span>
      )}
    </li>
            &nbsp;
            {/* Inspección de Emprendimiento */}
            <li className="form-item input-col-7">
              <label className="form-label">
                Inspección de Emprendimiento:
              </label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="inspeccion_emprendimiento"
                    value="si"
                    onChange={handleInputChange}
                    checked={newRecord.inspeccion_emprendimiento === "si"}
                  />
                  <span className="custom-radio">
                    <span className="icon-left icon"></span> Sí
                  </span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="inspeccion_emprendimiento"
                    value="no"
                    onChange={handleInputChange}
                    checked={newRecord.inspeccion_emprendimiento === "no"}
                  />
                  <span className="custom-radio">
                    No
                    <span className="icon-right icon"></span>
                  </span>
                </label>
              </div>
              {errors.inspeccion_emprendimiento && (
                <span className="error-message">
                  {errors.inspeccion_emprendimiento}
                </span>
              )}
            </li>

            {/* Carta de Aval o Residencia */}
            <li className="form-item input-col-7">
              <label className="form-label">Carta de Aval o Residencia:</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="carta_residencia"
                    value="si"
                    onChange={handleInputChange}
                    checked={newRecord.carta_residencia === "si"}
                  />
                  <span className="custom-radio">
                    <span className="icon-left icon"></span> Sí
                  </span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="carta_residencia"
                    value="no"
                    onChange={handleInputChange}
                    checked={newRecord.carta_residencia === "no"}
                  />
                  <span className="custom-radio">
                    No
                    <span className="icon-right icon"></span>
                  </span>
                </label>
              </div>
              {errors.carta_residencia && (
                <span className="error-message">{errors.carta_residencia}</span>
              )}
            </li>

            {/* Copia de Cédula */}
            <li className="form-item input-col-4">
              <label className="form-label">Copia de Cédula:</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="copia_cedula"
                    value="si"
                    onChange={handleInputChange}
                    checked={newRecord.copia_cedula === "si"}
                  />
                  <span className="custom-radio">
                    <span className="icon-left icon"></span> Sí
                  </span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="copia_cedula"
                    value="no"
                    onChange={handleInputChange}
                    checked={newRecord.copia_cedula === "no"}
                  />
                  <span className="custom-radio">
                    No
                    <span className="icon-right icon"></span>
                  </span>
                </label>
              </div>
              {errors.copia_cedula && (
                <span className="error-message">{errors.copia_cedula}</span>
              )}
            </li>

            {/* RIF Personal */}
            <li className="form-item input-col-5">
              <label className="form-label">RIF Personal:</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="rif_personal"
                    value="si"
                    onChange={handleInputChange}
                    checked={newRecord.rif_personal === "si"}
                  />
                  <span className="custom-radio">
                    <span className="icon-left icon"></span> Sí
                  </span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="rif_personal"
                    value="no"
                    onChange={handleInputChange}
                    checked={newRecord.rif_personal === "no"}
                  />
                  <span className="custom-radio">
                    No
                    <span className="icon-right icon"></span>
                  </span>
                </label>
              </div>
              {errors.rif_personal && (
                <span className="error-message">{errors.rif_personal}</span>
              )}
            </li>

            {/* Fotos del Emprendimiento */}
            <li className="form-item input-col-7">
              <label className="form-label">Fotos del Emprendimiento:</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="foto_e"
                    value="si"
                    onChange={handleInputChange}
                    checked={newRecord.foto_e === "si"}
                  />
                  <span className="custom-radio">
                    <span className="icon-left icon"></span> Sí
                  </span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="foto_e"
                    value="no"
                    onChange={handleInputChange}
                    checked={newRecord.foto_e === "no"}
                  />
                  <span className="custom-radio">
                    No
                    <span className="icon-right icon"></span>
                  </span>
                </label>
              </div>
              {errors.foto_e && (
                <span className="error-message">{errors.foto_e}</span>
              )}
            </li>

            {/* RIF de Emprendimiento */}
            <li className="form-item input-col-4">
              <label className="form-label">RIF de Emprendimiento:</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="rif_e"
                    value="si"
                    onChange={handleInputChange}
                    checked={newRecord.rif_e === "si"}
                  />
                  <span className="custom-radio">
                    <span className="icon-left icon"></span> Sí
                  </span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="rif_e"
                    value="no"
                    onChange={handleInputChange}
                    checked={newRecord.rif_e === "no"}
                  />
                  <span className="custom-radio">
                    No
                    <span className="icon-right icon"></span>
                  </span>
                </label>
              </div>
              {errors.rif_e && (
                <span className="error-message">{errors.rif_e}</span>
              )}
            </li>

            {/* Certificado de Emprender Juntos */}
            <li className="form-item input-col-4">
              <label className="form-label">
                Certificado de Emprender Juntos:
              </label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="certificado_ej"
                    value="si"
                    onChange={handleInputChange}
                    checked={newRecord.certificado_ej === "si"}
                  />
                  <span className="custom-radio">
                    <span className="icon-left icon"></span> Sí
                  </span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="certificado_ej"
                    value="no"
                    onChange={handleInputChange}
                    checked={newRecord.certificado_ej === "no"}
                  />
                  <span className="custom-radio">
                    No
                    <span className="icon-right icon"></span>
                  </span>
                </label>
              </div>
              {errors.certificado_ej && (
                <span className="error-message">{errors.certificado_ej}</span>
              )}
            </li>

            {/* Referencia Bancaria */}
            <li className="form-item input-col-4">
              <label className="form-label">Referencia Bancaria:</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="referencia_bancaria"
                    value="si"
                    onChange={handleInputChange}
                    checked={newRecord.referencia_bancaria === "si"}
                  />
                  <span className="custom-radio">
                    <span className="icon-left icon"></span> Sí
                  </span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="referencia_bancaria"
                    value="no"
                    onChange={handleInputChange}
                    checked={newRecord.referencia_bancaria === "no"}
                  />
                  <span className="custom-radio">
                    No
                    <span className="icon-right icon"></span>
                  </span>
                </label>
              </div>
              {errors.referencia_bancaria && (
                <span className="error-message">
                  {errors.referencia_bancaria}
                </span>
              )}
            </li>

            {/* Botón de registro */}
            <li className="form-item input-col-12">
              <button type="submit">Registrar</button>
            </li>
          </ul>
        </form>
      </Modal>
      {/* Modal para ver datos checked={viewRecord.solicitud_credito === "si"}*/}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
        <h2 style={{ textAlign: "center" }}>Detalles de Persona</h2>
        {viewRecord && (
          <div className="view-record-card">
            <div className="record-item">
              <strong>Cédula de Identidad:</strong>
              <span>{viewRecord.cedula_requerimientos_e}</span>
            </div>
            <div className="record-item">
              <strong>Nombre:</strong>
              <span>{viewRecord.nombres}</span>
            </div>
            <div className="record-item">
              <strong>Apellido:</strong>
              <span>{viewRecord.apellidos}</span>
            </div>
            <div className="record-item">
              <strong>Solicitud de Crédito:</strong>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="solicitud_credito"
                    value="si"
                    checked={viewRecord.solicitud_credito === "si"}
                    readOnly
                    style={{
                      accentColor:
                        viewRecord.solicitud_credito === "si" ? "green" : "red",
                    }}
                  />
                  Sí
                </label>
                <label>
                  <input
                    type="radio"
                    name="solicitud_credito"
                    value="no"
                    checked={viewRecord.solicitud_credito === "no"}
                    readOnly
                    style={{
                      accentColor:
                        viewRecord.solicitud_credito === "no" ? "red" : "green",
                    }}
                  />
                  No
                </label>
              </div>
            </div>
            <div className="record-item">
              <strong>Postulación UBCH:</strong>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="postulacion_ubch"
                    value="si"
                    checked={viewRecord.postulacion_ubch === "si"}
                    readOnly
                    style={{
                      accentColor:
                        viewRecord.postulacion_ubch === "si" ? "green" : "red",
                    }}
                  />
                  Sí
                </label>
                <label>
                  <input
                    type="radio"
                    name="postulacion_ubch"
                    value="no"
                    checked={viewRecord.postulacion_ubch === "no"}
                    readOnly
                    style={{
                      accentColor:
                        viewRecord.postulacion_ubch === "no" ? "red" : "green",
                    }}
                  />
                  No
                </label>
              </div>
            </div>
            <div className="record-item">
              <strong>Inspección de Emprendimiento:</strong>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="inspeccion_emprendimiento"
                    value="si"
                    checked={viewRecord.inspeccion_emprendimiento === "si"}
                    readOnly
                    style={{
                      accentColor:
                        viewRecord.inspeccion_emprendimiento === "si"
                          ? "green"
                          : "red",
                    }}
                  />
                  Sí
                </label>
                <label>
                  <input
                    type="radio"
                    name="inspeccion_emprendimiento"
                    value="no"
                    checked={viewRecord.inspeccion_emprendimiento === "no"}
                    readOnly
                    style={{
                      accentColor:
                        viewRecord.inspeccion_emprendimiento === "no"
                          ? "red"
                          : "green",
                    }}
                  />
                  No
                </label>
              </div>
            </div>
            <div className="record-item">
              <strong>Carta de Aval o Residencia:</strong>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="carta_residencia"
                    value="si"
                    checked={viewRecord.carta_residencia === "si"}
                    readOnly
                    style={{
                      accentColor:
                        viewRecord.carta_residencia === "si" ? "green" : "red",
                    }}
                  />
                  Sí
                </label>
                <label>
                  <input
                    type="radio"
                    name="carta_residencia"
                    value="no"
                    checked={viewRecord.carta_residencia === "no"}
                    readOnly
                    style={{
                      accentColor:
                        viewRecord.carta_residencia === "no" ? "red" : "green",
                    }}
                  />
                  No
                </label>
              </div>
            </div>
            <div className="record-item">
              <strong>Copia de Cédula:</strong>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="copia_cedula"
                    value="si"
                    checked={viewRecord.copia_cedula === "si"}
                    readOnly
                    style={{
                      accentColor:
                        viewRecord.copia_cedula === "si" ? "green" : "red",
                    }}
                  />
                  Sí
                </label>
                <label>
                  <input
                    type="radio"
                    name="copia_cedula"
                    value="no"
                    checked={viewRecord.copia_cedula === "no"}
                    readOnly
                    style={{
                      accentColor:
                        viewRecord.copia_cedula === "no" ? "red" : "green",
                    }}
                  />
                  No
                </label>
              </div>
            </div>
            <div className="record-item">
              <strong>RIF Personal:</strong>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="rif_personal"
                    value="si"
                    checked={viewRecord.rif_personal === "si"}
                    readOnly
                    style={{
                      accentColor:
                        viewRecord.rif_personal === "si" ? "green" : "red",
                    }}
                  />
                  Sí
                </label>
                <label>
                  <input
                    type="radio"
                    name="rif_personal"
                    value="no"
                    checked={viewRecord.rif_personal === "no"}
                    readOnly
                    style={{
                      accentColor:
                        viewRecord.rif_personal === "no" ? "red" : "green",
                    }}
                  />
                  No
                </label>
              </div>
            </div>
            <div className="record-item">
              <strong>Fotos del Emprendimiento:</strong>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="foto_e"
                    value="si"
                    checked={viewRecord.foto_e === "si"}
                    readOnly
                    style={{
                      accentColor: viewRecord.foto_e === "si" ? "green" : "red",
                    }}
                  />
                  Sí
                </label>
                <label>
                  <input
                    type="radio"
                    name="foto_e"
                    value="no"
                    checked={viewRecord.foto_e === "no"}
                    readOnly
                    style={{
                      accentColor: viewRecord.foto_e === "no" ? "red" : "green",
                    }}
                  />
                  No
                </label>
              </div>
            </div>
            <div className="record-item">
              <strong>RIF de Emprendimiento:</strong>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="rif_e"
                    value="si"
                    checked={viewRecord.rif_e === "si"}
                    readOnly
                    style={{
                      accentColor: viewRecord.rif_e === "si" ? "green" : "red",
                    }}
                  />
                  Sí
                </label>
                <label>
                  <input
                    type="radio"
                    name="rif_e"
                    value="no"
                    checked={viewRecord.rif_e === "no"}
                    readOnly
                    style={{
                      accentColor: viewRecord.rif_e === "no" ? "red" : "green",
                    }}
                  />
                  No
                </label>
              </div>
            </div>
            <div className="record-item">
              <strong>Certificado de Emprender junto:</strong>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="certificado_ej"
                    value="si"
                    checked={viewRecord.certificado_ej === "si"}
                    readOnly
                    style={{
                      accentColor:
                        viewRecord.certificado_ej === "si" ? "green" : "red",
                    }}
                  />
                  Sí
                </label>
                <label>
                  <input
                    type="radio"
                    name="certificado_ej"
                    value="no"
                    checked={viewRecord.certificado_ej === "no"}
                    readOnly
                    style={{
                      accentColor:
                        viewRecord.certificado_ej === "no" ? "red" : "green",
                    }}
                  />
                  No
                </label>
              </div>
            </div>
            <div className="record-item">
              <strong>Referencia Bancaria:</strong>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="referencia_bancaria"
                    value="si"
                    checked={viewRecord.referencia_bancaria === "si"}
                    readOnly
                    style={{
                      accentColor:
                        viewRecord.referencia_bancaria === "si"
                          ? "green"
                          : "red",
                    }}
                  />
                  Sí
                </label>
                <label>
                  <input
                    type="radio"
                    name="referencia_bancaria"
                    value="no"
                    checked={viewRecord.referencia_bancaria === "no"}
                    readOnly
                    style={{
                      accentColor:
                        viewRecord.referencia_bancaria === "no"
                          ? "red"
                          : "green",
                    }}
                  />
                  No
                </label>
              </div>
            </div>
          </div>
        )}
      </Modal>
      {/* Modal para editar datos */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2>Actualizar Datos Personales</h2>
        <form onSubmit={handleUpdate} className="modal-form">
          <ul className="form-row form-list form-group">
            {/* Cédula de Identidad */}
            <li className="form-item input-col-12">
              <label className="form-label">Cédula de Identidad:</label>
              <input
                type="number"
                name="cedula_requerimientos_e"
                value={newRecord.cedula_requerimientos_e}
                onChange={handleInputChange}
                className="form-control"
              />
              <button
                type="button"
                className="submit-button indigo"
                onClick={() => {
                  // Acción del botón
                }}
              >
                Buscar
              </button>
              {errors.cedula_requerimientos_e && (
                <span className="error-message">
                  {errors.cedula_requerimientos_e}
                </span>
              )}
            </li>

            {/* Solicitud de Crédito */}
            <li className="form-item input-col-4">
              <label className="form-label">Solicitud de Crédito:</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="solicitud_credito"
                    value="si"
                    onChange={handleInputChange}
                    checked={newRecord.solicitud_credito === "si"}
                    className="form-control"
                  />
                  Sí
                </label>
                <label>
                  <input
                    type="radio"
                    name="solicitud_credito"
                    value="no"
                    onChange={handleInputChange}
                    checked={newRecord.solicitud_credito === "no"}
                    className="form-control"
                  />
                  No
                </label>
              </div>
              {errors.solicitud_credito && (
                <span className="error-message">
                  {errors.solicitud_credito}
                </span>
              )}
            </li>

            {/* Postulación UBCH */}
            <li className="form-item input-col-3">
              <label className="form-label">Postulación UBCH:</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="postulacion_ubch"
                    value="si"
                    onChange={handleInputChange}
                    checked={newRecord.postulacion_ubch === "si"}
                    className="form-control"
                  />
                  Sí
                </label>
                <label>
                  <input
                    type="radio"
                    name="postulacion_ubch"
                    value="no"
                    onChange={handleInputChange}
                    checked={newRecord.postulacion_ubch === "no"}
                    className="form-control"
                  />
                  No
                </label>
              </div>
              {errors.postulacion_ubch && (
                <span className="error-message">{errors.postulacion_ubch}</span>
              )}
            </li>

            {/* Inspección de Emprendimiento */}
            <li className="form-item input-col-5">
              <label className="form-label">
                Inspección de Emprendimiento:
              </label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="inspeccion_emprendimiento"
                    value="si"
                    onChange={handleInputChange}
                    checked={newRecord.inspeccion_emprendimiento === "si"}
                    className="form-control"
                  />
                  Sí
                </label>
                <label>
                  <input
                    type="radio"
                    name="inspeccion_emprendimiento"
                    value="no"
                    onChange={handleInputChange}
                    checked={newRecord.inspeccion_emprendimiento === "no"}
                    className="form-control"
                  />
                  No
                </label>
              </div>
              {errors.inspeccion_emprendimiento && (
                <span className="error-message">
                  {errors.inspeccion_emprendimiento}
                </span>
              )}
            </li>

            {/* Carta de Aval o Residencia */}
            <li className="form-item input-col-5">
              <label className="form-label">Carta de Aval o Residencia:</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="carta_residencia"
                    value="si"
                    onChange={handleInputChange}
                    checked={newRecord.carta_residencia === "si"}
                    className="form-control"
                  />
                  Sí
                </label>
                <label>
                  <input
                    type="radio"
                    name="carta_residencia"
                    value="no"
                    onChange={handleInputChange}
                    checked={newRecord.carta_residencia === "no"}
                    className="form-control"
                  />
                  No
                </label>
              </div>
              {errors.carta_residencia && (
                <span className="error-message">{errors.carta_residencia}</span>
              )}
            </li>

            {/* Copia de Cédula */}
            <li className="form-item input-col-4">
              <label className="form-label">Copia de Cédula:</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="copia_cedula"
                    value="si"
                    onChange={handleInputChange}
                    checked={newRecord.copia_cedula === "si"}
                    className="form-control"
                  />
                  Sí
                </label>
                <label>
                  <input
                    type="radio"
                    name="copia_cedula"
                    value="no"
                    onChange={handleInputChange}
                    checked={newRecord.copia_cedula === "no"}
                    className="form-control"
                  />
                  No
                </label>
              </div>
              {errors.copia_cedula && (
                <span className="error-message">{errors.copia_cedula}</span>
              )}
            </li>

            {/* RIF Personal */}
            <li className="form-item input-col-2">
              <label className="form-label">RIF Personal:</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="rif_personal"
                    value="si"
                    onChange={handleInputChange}
                    checked={newRecord.rif_personal === "si"}
                    className="form-control"
                  />
                  Sí
                </label>
                <label>
                  <input
                    type="radio"
                    name="rif_personal"
                    value="no"
                    onChange={handleInputChange}
                    checked={newRecord.rif_personal === "no"}
                    className="form-control"
                  />
                  No
                </label>
              </div>
              {errors.rif_personal && (
                <span className="error-message">{errors.rif_personal}</span>
              )}
            </li>

            {/* Fotos del Emprendimiento */}
            <li className="form-item input-col-4">
              <label className="form-label">Fotos del Emprendimiento:</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="foto_e"
                    value="si"
                    onChange={handleInputChange}
                    checked={newRecord.foto_e === "si"}
                    className="form-control"
                  />
                  Sí
                </label>
                <label>
                  <input
                    type="radio"
                    name="foto_e"
                    value="no"
                    onChange={handleInputChange}
                    checked={newRecord.foto_e === "no"}
                    className="form-control"
                  />
                  No
                </label>
              </div>
              {errors.foto_e && (
                <span className="error-message">{errors.foto_e}</span>
              )}
            </li>

            {/* RIF de Emprendimiento */}
            <li className="form-item input-col-4">
              <label className="form-label">RIF de Emprendimiento:</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="rif_e"
                    value="si"
                    onChange={handleInputChange}
                    checked={newRecord.rif_e === "si"}
                    className="form-control"
                  />
                  Sí
                </label>
                <label>
                  <input
                    type="radio"
                    name="rif_e"
                    value="no"
                    onChange={handleInputChange}
                    checked={newRecord.rif_e === "no"}
                    className="form-control"
                  />
                  No
                </label>
              </div>
              {errors.rif_e && (
                <span className="error-message">{errors.rif_e}</span>
              )}
            </li>

            {/* Certificado de Emprender Juntos */}
            <li className="form-item input-col-4">
              <label className="form-label">
                Certificado de Emprender Juntos:
              </label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="certificado_ej"
                    value="si"
                    onChange={handleInputChange}
                    checked={newRecord.certificado_ej === "si"}
                    className="form-control"
                  />
                  Sí
                </label>
                <label>
                  <input
                    type="radio"
                    name="certificado_ej"
                    value="no"
                    onChange={handleInputChange}
                    checked={newRecord.certificado_ej === "no"}
                    className="form-control"
                  />
                  No
                </label>
              </div>
              {errors.certificado_ej && (
                <span className="error-message">{errors.certificado_ej}</span>
              )}
            </li>

            {/* Referencia Bancaria */}
            <li className="form-item input-col-4">
              <label className="form-label">Referencia Bancaria:</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="referencia_bancaria"
                    value="si"
                    onChange={handleInputChange}
                    checked={newRecord.referencia_bancaria === "si"}
                    className="form-control"
                  />
                  Sí
                </label>
                <label>
                  <input
                    type="radio"
                    name="referencia_bancaria"
                    value="no"
                    onChange={handleInputChange}
                    checked={newRecord.referencia_bancaria === "no"}
                    className="form-control"
                  />
                  No
                </label>
              </div>
              {errors.referencia_bancaria && (
                <span className="error-message">
                  {errors.referencia_bancaria}
                </span>
              )}
            </li>

            {/* Botón de registro */}
            <li className="form-item input-col-12">
              <button type="submit">Registrar</button>
            </li>
          </ul>
        </form>
      </Modal>
      {/* Modal para confirmar eliminación */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <h2>Confirmar Eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar este registro?</p>
        <p>
          <strong>Cédula de Identidad:</strong>{" "}
          {recordToDelete?.cedula_requerimientos_e}
        </p>
        <p>
          <strong>Nombre:</strong> {recordToDelete?.nombre}{" "}
          {recordToDelete?.apellido}
        </p>
        <div className="modal-actions">
          <button onClick={confirmDelete}>Eliminar</button>
          <button onClick={() => setIsDeleteModalOpen(false)}>Cancelar</button>
        </div>
      </Modal>
      {/* Modal para mostrar que el registro ha sido eliminado */}
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
      {/* Modal para mostrar que el registro ha sido creado */}
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
      {/* Modal para mostrar que el registro ha sido actualizado */}
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

export default Requerimientos;
