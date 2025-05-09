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
} from "../services/cadenaProductivaService"; // Importa las funciones del servicio
import "../assets/styles/App.css";

const CadenaProductiva = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletedModalOpen, setIsDeletedModalOpen] = useState(false);
  const [isRegisterAttendanceModalOpen, setIsRegisterAttendanceModalOpen] =
    useState(false);
  const [attendees, setAttendees] = useState([]);
  const [limit, setLimit] = useState(5);
  const [viewRecord, setViewRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [newRecord, setNewRecord] = useState({
    cedula_datos_cadena_p: "",
    actividad_e: "",
    division_actividad_e: "",
    claseactividad_e: "",
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
    if (!newRecord.cedula_datos_cadena_p)
      errors.cedula = "La cédula es requerida";
    // Add other validations as needed
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      alert("Please fix the errors in the form.");
      return;
    }

    if (
      records.some(
        (record) =>
          record.cedula_datos_cadena_p === newRecord.cedula_datos_cadena_p
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
      setIsDeletedModalOpen(true); // Assuming this is to show success
    } catch (error) {
      console.error("Error al registrar la persona:", error);
      alert("Hubo un problema al registrar la persona. Inténtalo de nuevo.");
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      alert("Please fix the errors in the form.");
      return;
    }

    try {
      const response = await updateRecord(
        newRecord.cedula_datos_cadena_p,
        newRecord
      ); // Usar el servicio para actualizar
      const updatedRecords = records.map((record) =>
        record.cedula_datos_cadena_p === response.cedula_datos_cadena_p
          ? response
          : record
      );
      setRecords(updatedRecords);
      resetForm();
      setIsEditModalOpen(false);
      setIsDeletedModalOpen(true); // Assuming this is to show success
    } catch (error) {
      console.error("Error al actualizar la persona:", error);
      alert("Hubo un problema al actualizar la persona . Inténtalo de nuevo.");
    }
  };

  const resetForm = () => {
    setNewRecord({
      cedula_datos_cadena_p: "",
      actividad_e: "",
      division_actividad_e: "",
      claseactividad_e: "",
    });
  };

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const renderDataTable = () => {
    const filteredRecords = records.filter((record) => {
      return (
        (record.firstName &&
          record.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (record.lastName &&
          record.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (record.cedula_datos_cadena_p &&
          record.cedula_datos_cadena_p.includes(searchTerm))
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
        <h2>Catálogo de Cadena Productiva</h2>
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
            onClick={() => setIsRegisterAttendanceModalOpen(true)}
            className="add-button"
            title="Registrar Asistencia"
          >
            <FaPlus /> Registrar Cadena Productiva
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
                <th>Cedula de Identidad</th>
                <th>Nombres y Apellidos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((record) => (
                  <tr key={record.cedula_datos_cadena_p}>
                    <td>{record.cedula_datos_cadena_p}</td>
                    <td>{record.attendanceDate}</td>
                    <td>
                      <button
                        onClick={() => handleView(record.cedula_datos_cadena_p)}
                        title="Ver Datos"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(record.cedula_datos_cadena_p)}
                        title="Actualizar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(record.cedula_datos_cadena_p)
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
    const recordToView = records.find((record) => record.cedula_datos_cadena_p === id);
    if (recordToView) {
      // Assuming recordToView has an 'attendees' property
      setAttendees(recordToView.attendees || []); // Adjust based on your data structure
      setIsViewModalOpen(true);
    }
  };

  const handleEdit = (id) => {
    const recordToEdit = records.find(
      (record) => record.cedula_datos_cadena_p === id
    );
    if (recordToEdit) {
      setNewRecord(recordToEdit);
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = (id) => {
    const recordToDelete = records.find(
      (record) => record.cedula_datos_cadena_p === id
    );
    if (recordToDelete) {
      setRecordToDelete(recordToDelete);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteRecord(recordToDelete.cedula_datos_cadena_p); // Usar el servicio para eliminar
      setRecords(
        records.filter(
          (record) =>
            record.cedula_datos_cadena_p !==
            recordToDelete.cedula_datos_cadena_p
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

  const renderDivisionOptions = () => {
    switch (newRecord.actividad_e) {
      case "Agricultura, ganadería y Pesca":
        return (
          <>
            <option value="Agricultura">Agricultura</option>
            <option value="Ganadería">Ganadería</option>
            <option value="Pesca">Pesca</option>
          </>
        );
      case "Manufactura":
        return (
          <>
            <option value="Textiles">Textiles</option>
            <option value="Alimentos">Alimentos</option>
            <option value="Electrónica">Electrónica</option>
          </>
        );
      case "Servicio de Distribucion de agua, gestion de Desechos y actividades de Seneamiento":
        return (
          <>
            <option value="Distribución de Agua">Distribución de Agua</option>
            <option value="Gestión de Desechos">Gestión de Desechos</option>
          </>
        );
      case "transporte y Almacenamiento":
        return (
          <>
            <option value="Transporte Terrestre">Transporte Terrestre</option>
            <option value="Almacenamiento">Almacenamiento</option>
          </>
        );
      case "Actividades de alojamiento, Posadas y Hoteles":
        return (
          <>
            <option value="Hoteles">Hoteles</option>
            <option value="Posadas">Posadas</option>
          </>
        );
      case "Servicio de Alimentos y Bebidas, Restaurantes y Puestos de Comida":
        return (
          <>
            <option value="Restaurantes">Restaurantes</option>
            <option value="Puestos de Comida">Puestos de Comida</option>
          </>
        );
      case "Comunicaciones, Informacion, Audiovisuales, Medios Digitales":
        return (
          <>
            <option value="Telecomunicaciones">Telecomunicaciones</option>
            <option value="Medios Digitales">Medios Digitales</option>
          </>
        );
      case "Actividades Financieras (Consultoria, Trading, Criptomonedas)":
        return (
          <>
            <option value="Consultoría">Consultoría</option>
            <option value="Trading">Trading</option>
            <option value="Criptomonedas">Criptomonedas</option>
          </>
        );
      case "Servivio Profesionales":
        return (
          <>
            <option value="Consultoría Profesional">
              Consultoría Profesional
            </option>
            <option value="Servicios Legales">Servicios Legales</option>
          </>
        );
      case "Servicio de Soporte(Administrativo, Seguridad, y Otros)":
        return (
          <>
            <option value="Soporte Administrativo">
              Soporte Administrativo
            </option>
            <option value="Seguridad">Seguridad</option>
          </>
        );
      case "Servicio de Enseñanza, Formacion, Capacitacion":
        return (
          <>
            <option value="Educación Formal">Educación Formal</option>
            <option value="Capacitación">Capacitación</option>
          </>
        );
      case "Servicio de Antencion de Salud":
        return (
          <>
            <option value="Hospitales">Hospitales</option>
            <option value="Clínicas">Clínicas</option>
          </>
        );
      case "Entretenimiento, Recreacion y Arte":
        return (
          <>
            <option value="Teatros">Teatros</option>
            <option value="Eventos">Eventos</option>
          </>
        );
      case "Otros Servicios Profesionales(Oficios Especializados y Tecnicos)":
        return (
          <>
            <option value="Servicios Técnicos">Servicios Técnicos</option>
            <option value="Oficios Especializados">
              Oficios Especializados
            </option>
          </>
        );
      case "Actividades y Servicios a las Familias y Mascotas":
        return (
          <>
            <option value="Cuidado de Mascotas">Cuidado de Mascotas</option>
            <option value="Servicios a Familias">Servicios a Familias </option>
          </>
        );
      case "Comercio (Establecimientos, Distribucion y Otros)":
        return (
          <>
            <option value="Tiendas">Tiendas</option>
            <option value="Supermercados">Supermercados</option>
            <option value="Distribuidores">Distribuidores</option>
          </>
        );
      default:
        return null;
    }
  };

  const renderClaseOptions = () => {
    switch (newRecord.division_actividad_e) {
      case "Agricultura":
        return (
          <>
            <option value="Cultivos">Cultivos</option>
            <option value="Frutales">Frutales</option>
          </>
        );
      case "Ganadería":
        return (
          <>
            <option value="Bovinos">Bovinos</option>
            <option value="Porcinos">Porcinos</option>
          </>
        );
      case "Pesca":
        return (
          <>
            <option value="Pesca Comercial">Pesca Comercial</option>
            <option value="Pesca Recreativa">Pesca Recreativa</option>
          </>
        );
      case "Textiles":
        return (
          <>
            <option value="Ropa">Ropa</option>
            <option value="Accesorios">Accesorios</option>
          </>
        );
      case "Alimentos":
        return (
          <>
            <option value="Alimentos Procesados">Alimentos Procesados</option>
            <option value="Bebidas">Bebidas</option>
          </>
        );
      case "Electrónica":
        return (
          <>
            <option value="Dispositivos Móviles">Dispositivos Móviles</option>
            <option value="Electrodomésticos">Electrodomésticos</option>
          </>
        );
      case "Distribución de Agua":
        return (
          <>
            <option value="Suministro Residencial">
              Suministro Residencial
            </option>
            <option value="Suministro Comercial">Suministro Comercial</option>
          </>
        );
      case "Gestión de Desechos":
        return (
          <>
            <option value="Recolección de Desechos">
              Recolección de Desechos
            </option>
            <option value="Reciclaje">Reciclaje</option>
          </>
        );
      case "Transporte Terrestre":
        return (
          <>
            <option value="Transporte de Carga">Transporte de Carga</option>
            <option value="Transporte de Pasajeros">
              Transporte de Pasajeros
            </option>
          </>
        );
      case "Almacenamiento":
        return (
          <>
            <option value="Almacenes Fríos">Almacenes Fríos</option>
            <option value="Almacenes Generales">Almacenes Generales</option>
          </>
        );
      case "Hoteles":
        return (
          <>
            <option value="Hoteles de Lujo">Hoteles de Lujo</option>
            <option value="Hoteles Económicos">Hoteles Económicos</option>
          </>
        );
      case "Posadas":
        return (
          <>
            <option value="Posadas Rurales">Posadas Rurales</option>
            <option value="Posadas Urbanas">Posadas Urbanas</option>
          </>
        );
      case "Puestos de Comida":
        return (
          <>
            <option value="Comida Rápida">Comida Rápida</option>
            <option value="Comida Típica">Comida Típica</option>
          </>
        );
      case "Telecomunicaciones":
        return (
          <>
            <option value="Servicios de Internet">Servicios de Internet</option>
            <option value="Telefonía Móvil">Telefonía Móvil</option>
          </>
        );
      case "Medios Digitales":
        return (
          <>
            <option value="Producción de Contenido">
              Producción de Contenido
            </option>
            <option value="Publicidad Digital">Publicidad Digital</option>
          </>
        );
      case "Consultoría":
        return (
          <>
            <option value="Consultoría Empresarial">
              Consultoría Empresarial
            </option>
            <option value="Consultoría Financiera">
              Consultoría Financiera
            </option>
          </>
        );
      case "Trading":
        return (
          <>
            <option value="Trading de Acciones">Trading de Acciones</option>
            <option value="Trading de Criptomonedas">
              Trading de Criptomonedas
            </option>
          </>
        );
      case "Criptomonedas":
        return (
          <>
            <option value="Intercambio de Criptomonedas">
              Intercambio de Criptomonedas
            </option>
            <option value="Minería de Criptomonedas">
              Minería de Criptomonedas
            </option>
          </>
        );
      case "Servicios Técnicos":
        return (
          <>
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="Instalaciones">Instalaciones</option>
          </>
        );
      case "Oficios Especializados":
        return (
          <>
            <option value="Electricidad">Electricidad</option>
            <option value="Fontanería">Fontanería</option>
          </>
        );
      case "Soporte Administrativo":
        return (
          <>
            <option value="Asistencia Administrativa">
              Asistencia Administrativa
            </option>
            <option value="Gestión de Proyectos">Gestión de Proyectos</option>
          </>
        );
      case "Seguridad":
        return (
          <>
            <option value="Seguridad Privada">Seguridad Privada</option>
            <option value="Seguridad Electrónica">Seguridad Electrónica</option>
          </>
        );
      case "Educación Formal":
        return (
          <>
            <option value="Escuelas Primarias">Escuelas Primarias</option>
            <option value="Institutos Técnicos">Institutos Técnicos</option>
          </>
        );
      case "Capacitación":
        return (
          <>
            <option value="Cursos Online">Cursos Online</option>
            <option value="Talleres Presenciales">Talleres Presenciales</option>
          </>
        );
      case "Hospitales":
        return (
          <>
            <option value="Hospitales Públicos">Hospitales Públicos</option>
            <option value="Hospitales Privados">Hospitales Privados</option>
          </>
        );
      case "Clínicas":
        return (
          <>
            <option value="Clínicas Especializadas">
              Clínicas Especializadas
            </option>
            <option value="Clínicas Generales">Clínicas Generales</option>
          </>
        );
      case "Teatros":
        return (
          <>
            <option value="Teatro de Ópera">Teatro de Ópera</option>
            <option value="Teatro de Comedia">Teatro de Comedia</option>
          </>
        );
      case "Eventos":
        return (
          <>
            <option value="Conciertos">Conciertos</option>
            <option value="Festivales">Festivales</option>
          </>
        );
      case "Cuidado de Mascotas":
        return (
          <>
            <option value="Paseo de Mascotas">Paseo de Mascotas</option>
            <option value="Cuidado a Domicilio">Cuidado a Domicilio</option>
          </>
        );
      case "Servicios a Familias":
        return (
          <>
            <option value="Asesoría Familiar">Asesoría Familiar</option>
            <option value="Servicios de Limpieza">Servicios de Limpieza</option>
          </>
        );
      case "Supermercados":
        return (
          <>
            <option value="Alimentos Frescos">Alimentos Frescos</option>
            <option value="Productos de Limpieza">Productos de Limpieza</option>
          </>
        );
      case "Distribuidores":
        return (
          <>
            <option value="Distribución Mayorista">
              Distribución Mayorista
            </option>
            <option value="Distribución Minorista">
              Distribución Minorista
            </option>
          </>
        );
      default:
        return null;
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

      {/* Modal para registrar asistencia a la feria */}
      <Modal
        isOpen={isRegisterAttendanceModalOpen}
        onClose={() => setIsRegisterAttendanceModalOpen(false)}
      >
        <h2>Datos de Cadena Productiva</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group input-col-12">
              <label className="form-label">Cédula de Identidad:</label>
              <input
                type="number"
                name="cedula_datos_cadena_p"
                value={newRecord.cedula_datos_cadena_p}
                onChange={handleInputChange}
                className="form-control"
                required
              />
              <button
                type="button"
                className="add-button"
                onClick={() => {
                  /* Acción del botón */
                }}
              >
                Buscar
              </button>
            </div>
            <div className="form-group input-col-12">
              <div className="form-group input-col-12">
                <label className="form-label">Actividad Economica:</label>
                <select
                  name="actividad_e"
                  value={newRecord.actividad_e}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Agricultura, ganadería y Pesca">
                    Agricultura, ganadería y Pesca
                  </option>
                  <option value="Manufactura">Manufactura</option>
                  <option value="">Seleccionar...</option>
                  <option value="Agriculta, ganaderia y Pesca">
                    Agriculta, ganaderia y Pesca
                  </option>
                  <option value="Manufactura">Manufactura</option>
                  <option value="Servicio de Distribucion de agua, gestion de Desechos y actividades de Seneamiento">
                    Servicio de Distribucion de agua, gestion de Desechos y
                    actividades de Seneamiento
                  </option>
                  <option value="transporte y Almacenamiento">
                    transporte y Almacenamiento
                  </option>
                  <option value="Actividades de alojamiento, Posadas y Hoteles">
                    Actividades de alojamiento, Posadas y Hoteles
                  </option>
                  <option value="Servicio de Alimentos y Bebidas, Restaurantes y Puestos de Comida">
                    Servicio de Alimentos y Bebidas, Restaurantes y Puestos de
                    Comida
                  </option>
                  <option value="Comunicaciones, Informacion, Audiovisuales, Medios Digitales">
                    Comunicaciones, Informacion, Audiovisuales, Medios Digitales
                  </option>
                  <option value="Actividades Financieras (Consultoria, Trading, Criptomonedas)">
                    Actividades Financieras (Consultoria, Trading,
                    Criptomonedas)
                  </option>
                  <option value="Servivio Profesionales">
                    Servivio Profesionales
                  </option>
                  <option value="Servicio de Soporte(Administrativo, Seguridad, y Otros)">
                    Servicio de Soporte(Administrativo, Seguridad, y Otros)
                  </option>
                  <option value="Servicio de Enseñanza, Formacion, Capacitacion">
                    Servicio de Enseñanza, Formacion, Capacitacion
                  </option>
                  <option value="Servicio de Antencion de Salud">
                    Servicio de Antencion de Salud
                  </option>
                  <option value="Entretenimiento, Recreacion y Arte">
                    Entretenimiento, Recreacion y Arte
                  </option>
                  <option value="Otros Servicios Profesionales(Oficios Especializados y Tecnicos)">
                    Otros Servicios Profesionales(Oficios Especializados y
                    Tecnicos)
                  </option>
                  <option value="Actividades y Servicios a las Familias y Mascotas">
                    Actividades y Servicios a las Familias y Mascotas
                  </option>
                  <option value="Comercio (Establecimientos, Distribucion y Otros)">
                    Comercio (Establecimientos, Distribucion y Otros)
                  </option>
                </select>
              </div>

              {newRecord.actividad_e && (
                <div className="form-group input-col-12">
                  <label className="form-label">
                    División Actividad Económica:
                  </label>
                  <select
                    name="division_actividad_e"
                    value={newRecord.division_actividad_e}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="">Seleccionar...</option>
                    {renderDivisionOptions()}
                  </select>
                </div>
              )}

              {newRecord.division_actividad_e && (
                <div className="form-group input-col-12">
                  <label className="form-label">
                    Clase de Actividad Económica:
                  </label>
                  <select
                    name="claseactividad_e"
                    value={newRecord.claseActividadEconomeconomica}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="">Seleccionar...</option>
                    {renderClaseOptions()}
                  </select>
                </div>
              )}
            </div>
          </div>
          <button className="add-button" type="submit">Registrar</button>
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
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {attendees.length > 0 ? (
              attendees.map((attendee) => (
                <tr key={attendee.identityCard}>
                  <td>{attendee.identityCard}</td>
                  <td>
                    {attendee.firstName} {attendee.lastName}
                  </td>
                  <td>{attendee.comments}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="no-results">
                  No se encontraron asistentes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Modal>

      {/* Modal para editar datos */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2>Actualizar Datos de Cadena Productiva</h2>
        <form onSubmit={handleUpdate} className="modal-form">
          <div className="form-row">
            <div className="form-group input-col-12">
              <label className="form-label">Cédula de Identidad:</label>
              <input
                type="text"
                name="cedula_datos_cadena_p"
                value={newRecord.cedula_datos_cadena_p}
                onChange={handleInputChange}
                className="form-control"
                required
              />
              <button
                type="button"
                className="add-button"
                onClick={() => {
                  /* Acción del botón */
                }}
              >
                Buscar
              </button>
            </div>
            <div className="form-group input-col-12">
              <div className="form-group input-col-12">
                <label className="form-label">Actividad Economica:</label>
                <select
                  name="actividad_e"
                  value={newRecord.actividad_e}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Agricultura, ganadería y Pesca">
                    Agricultura, ganadería y Pesca
                  </option>
                  <option value="Manufactura">Manufactura</option>
                  <option value="">Seleccionar...</option>
                  <option value="Agriculta, ganaderia y Pesca">
                    Agriculta, ganaderia y Pesca
                  </option>
                  <option value="Manufactura">Manufactura</option>
                  <option value="Servicio de Distribucion de agua, gestion de Desechos y actividades de Seneamiento">
                    Servicio de Distribucion de agua, gestion de Desechos y
                    actividades de Seneamiento
                  </option>
                  <option value="transporte y Almacenamiento">
                    transporte y Almacenamiento
                  </option>
                  <option value="Actividades de alojamiento, Posadas y Hoteles">
                    Actividades de alojamiento, Posadas y Hoteles
                  </option>
                  <option value="Servicio de Alimentos y Bebidas, Restaurantes y Puestos de Comida">
                    Servicio de Alimentos y Bebidas, Restaurantes y Puestos de
                    Comida
                  </option>
                  <option value="Comunicaciones, Informacion, Audiovisuales, Medios Digitales">
                    Comunicaciones, Informacion, Audiovisuales, Medios Digitales
                  </option>
                  <option value="Actividades Financieras (Consultoria, Trading, Criptomonedas)">
                    Actividades Financieras (Consultoria, Trading,
                    Criptomonedas)
                  </option>
                  <option value="Servivio Profesionales">
                    Servivio Profesionales
                  </option>
                  <option value="Servicio de Soporte(Administrativo, Seguridad, y Otros)">
                    Servicio de Soporte(Administrativo, Seguridad, y Otros)
                  </option>
                  <option value="Servicio de Enseñanza, Formacion, Capacitacion">
                    Servicio de Enseñanza, Formacion, Capacitacion
                  </option>
                  <option value="Servicio de Antencion de Salud">
                    Servicio de Antencion de Salud
                  </option>
                  <option value="Entretenimiento, Recreacion y Arte">
                    Entretenimiento, Recreacion y Arte
                  </option>
                  <option value="Otros Servicios Profesionales(Oficios Especializados y Tecnicos)">
                    Otros Servicios Profesionales(Oficios Especializados y
                    Tecnicos)
                  </option>
                  <option value="Actividades y Servicios a las Familias y Mascotas">
                    Actividades y Servicios a las Familias y Mascotas
                  </option>
                  <option value="Comercio (Establecimientos, Distribucion y Otros)">
                    Comercio (Establecimientos, Distribucion y Otros)
                  </option>
                </select>
              </div>

              {newRecord.actividad_e && (
                <div className="form-group input-col-12">
                  <label className="form-label">
                    División Actividad Económica:
                  </label>
                  <select
                    name="division_actividad_e"
                    value={newRecord.division_actividad_e}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="">Seleccionar...</option>
                    {renderDivisionOptions()}
                  </select>
                </div>
              )}

              {newRecord.division_actividad_e && (
                <div className="form-group input-col-12">
                  <label className="form-label">
                    Clase de Actividad Económica:
                  </label>
                  <select
                    name="claseactividad_e"
                    value={newRecord.claseActividadEconomeconomica}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="">Seleccionar...</option>
                    {renderClaseOptions()}
                  </select>
                </div>
              )}
            </div>
          </div>
          <button type="submit">Actualizar</button>
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
          {recordToDelete?.cedula_datos_cadena_p}
        </p>
        <p>
          <strong>Nombre:</strong> {recordToDelete?.firstName}{" "}
          {recordToDelete?.lastName}
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
    </div>
  );
};

export default CadenaProductiva;
