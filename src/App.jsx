import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './assets/styles/App.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Persona from './pages/Persona'; // Asegúrate de que este componente exista

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/persona" element={<Persona />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;