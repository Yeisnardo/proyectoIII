import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './assets/styles/App.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Persona from './pages/Persona';
import Usuario from './pages/Usuario';
import Cambio from './pages/Al-cambio.jsx';
import Cuentas from './pages/Cuentas.jsx';
import FormalizacionEmprendimiento from './pages/FormalizacionEmprendimiento'; // Importar nuevo componente
import NuevoEmprendimiento from './pages/NuevoEmprendimiento'; // Importar nuevo componente
import Contrato from './pages/Contrato'; // Importar nuevo componente
import Amortizacion from './pages/Amortizacion.jsx'; // Importar nuevo componente

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/persona" element={<Persona />} />
          <Route path="/usuario" element={<Usuario />} />
          <Route path="/Al-cambio" element={<Cambio />} />
          <Route path="/Cuentas" element={<Cuentas />} />
          <Route path="/formalizacion-emprendimiento" element={<FormalizacionEmprendimiento />} /> {/* Nueva ruta */}
          <Route path="/nuevo-emprendimiento" element={<NuevoEmprendimiento />} /> {/* Nueva ruta */}
          <Route path="/contrato" element={<Contrato />} /> {/* Nueva ruta */}
          <Route path="/amortizacion" element={<Amortizacion />} /> {/* Nueva ruta */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;