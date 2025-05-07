// src/components/Modal.js
import React from "react";
import "../assets/styles/App.css"; // Asegúrate de que este archivo CSS esté importado (o preferiblemente Modal.css)

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // No renderizar si no está abierta

  return (
    <div className="modal-overlay" onClick={onClose}> {/* Cierra el modal al hacer clic fuera */}
      <div className="modal-content" onClick={e => e.stopPropagation()}> {/* Evita que el clic dentro cierre el modal */}
        <button className="close-button" onClick={onClose}>
          &times; {/* Icono de cerrar */}{" "}
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;