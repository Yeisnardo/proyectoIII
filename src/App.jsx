import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './assets/styles/App.css';
import Login from './pages/Login';
import Registro from "./pages/Registro";
import Registro2 from './pages/registro2'; // Ensure correct import name
import Dashboard from './pages/Dashboard';
import Persona from './pages/Persona';
import Usuario from './pages/Usuario';
import Ferias from './pages/Ferias';
import Aprobacion from './pages/Aprobacion';
import Requerimientos from './pages/requerimientos';
import Cambio from './pages/AlCambio';
import Credito from './pages/Credito';
import Bancos from './pages/bancos';
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
          {/* Initial Registration Page */}
          <Route path="/registro" element={<Registro />} />

          {/* Subsequent Registration/Information Pages (in sequence) */}
          <Route path="/registro2" element={<Registro2 />} />
          <Route path="/persona" element={<Persona />} />
          {/* Add other forms in the desired order */}
          <Route path="/perfil-financiero" element={<PerfilFinanciero />} />
          <Route path="/UbicacionActivEmprende" element={<UbicacionActivEmprende />} />
          <Route path="/cadena-productiva" element={<CadenaProductiva />} />
          <Route path="/situacion-operativa" element={<SituacionOperativa />} />


          {/* Other Application Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/usuario" element={<Usuario />} />
          <Route path="/requerimientos" element={<Requerimientos />} />
          <Route path="/ferias" element={<Ferias />} />
          <Route path="/Aprobacion" element={<Aprobacion />} />
          <Route path="/al-cambio" element={<Cambio />} />
          <Route path="/bancos" element={<Bancos />} />
          <Route path="/credito" element={<Credito />} />
          <Route path="/contrato" element={<Contrato />} />
          <Route path="/amortizacion" element={<Amortizacion />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;