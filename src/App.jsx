import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './assets/styles/App.css';

// Pages Import

import { MenuProvider } from './contexts/MenuContext';
import Header from './components/Header';
import NavigationMenu from './components/Menu';

import Login from './pages/Login';
import Caracterizacion from './pages/Caracterizacion';
import Informacion_personal from './pages/Informacion_personal';
import Emprendimiento from './pages/Emprendimiento';
import Reportar_pago from './pages/Reportar_pago';
import Registro2 from './pages/registro2';
import Persona from './pages/Persona';

import Dashboard from './pages/Dashboard';
import Usuario from './pages/Usuario';
import Requerimientos from './pages/requerimientos';
import Ferias from './pages/Ferias';
import Aprobacion from './pages/Aprobacion';

import AlCambio from './pages/AlCambio';
import Bancos from './pages/bancos';
import Credito from './pages/Credito';
import Contrato from './pages/Contrato';
import Amortizacion from './pages/Amortizacion';

import PerfilFinanciero from './pages/PerfilFinanciero';
import UbicacionActivEmprende from './pages/UbicacionActivEmprende';
import CadenaProductiva from './pages/CadenaProductiva';
import SituacionOperativa from './pages/SituacionOperativa';

function App() {
  return (
    <MenuProvider>
      {/* Envolver toda la app en BrowserRouter */}
      <BrowserRouter>
        <Header />
        <NavigationMenu />
        <div className="App">
          <Routes>
            {/* Rutas */}
            <Route path="/" element={<Login />} />
            <Route path="/Caracterizacion" element={<Caracterizacion />} />
            <Route path="/Informacion_personal" element={<Informacion_personal />} />
            <Route path="/Emprendimiento" element={<Emprendimiento />} />
            <Route path="/Reportar_pago" element={<Reportar_pago />} />
            <Route path="/registro2" element={<Registro2 />} />
            <Route path="/persona" element={<Persona />} />

            {/* Información adicional */}
            <Route path="/perfil-financiero" element={<PerfilFinanciero />} />
            <Route path="/UbicacionActivEmprende" element={<UbicacionActivEmprende />} />
            <Route path="/cadena-productiva" element={<CadenaProductiva />} />
            <Route path="/situacion-operativa" element={<SituacionOperativa />} />

            {/* Dashboard y gestión */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/usuario" element={<Usuario />} />
            <Route path="/requerimientos" element={<Requerimientos />} />
            <Route path="/ferias" element={<Ferias />} />
            <Route path="/Aprobacion" element={<Aprobacion />} />

            {/* Otros módulos */}
            <Route path="/AlCambio" element={<AlCambio />} />
            <Route path="/bancos" element={<Bancos />} />
            <Route path="/Credito" element={<Credito />} />
            <Route path="/contrato" element={<Contrato />} />
            <Route path="/amortizacion" element={<Amortizacion />} />
          </Routes>
        </div>
      </BrowserRouter>
    </MenuProvider>
  );
}

export default App;