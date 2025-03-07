// src/components/Modal.js
import React from "react";
import "../assets/styles/App.css"; // Asegúrate de que este archivo CSS esté importado

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // No renderizar si no está abierta

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times; {/* Icono de cerrar */}
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;