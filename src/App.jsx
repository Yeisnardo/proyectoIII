import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './assets/styles/App.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Persona from './pages/Persona';
import Usuario from './pages/Usuario';
import Ferias from './pages/Ferias';
import Requerimientos from './pages/requerimientos'; 
import Cambio from './pages/AlCambio'; // Ensure the file name matches
import Credito from './pages/Credito'; 
import Contrato from './pages/Contrato'; 
import Amortizacion from './pages/Amortizacion'; 
import PerfilFinanciero from './pages/PerfilFinanciero';
import UbicacionActivEmprende from './pages/UbicacionActivEmprende';
import CadenaProductiva from './pages/CadenaProductiva';
import SituacionOperativa from './pages/SituacionOperativa';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/persona" element={<Persona />} />
          <Route path="/usuario" element={<Usuario />} />
          <Route path="/requerimientos" element={<Requerimientos />} />
          <Route path="/perfil-financiero" element={<PerfilFinanciero />} />
          <Route path="/UbicacionActivEmprende" element={<UbicacionActivEmprende />} />
          <Route path="/cadena-productiva" element={<CadenaProductiva />} />
          <Route path="/situacion-operativa" element={<SituacionOperativa />} />
          <Route path="/ferias" element={<Ferias />} />
          <Route path="/al-cambio" element={<Cambio />} />
          <Route path="/credito" element={<Credito />} />
          <Route path="/contrato" element={<Contrato />} />
          <Route path="/amortizacion" element={<Amortizacion />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;