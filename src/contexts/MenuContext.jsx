// src/contexts/MenuContext.jsx
import React, { createContext, useState } from 'react';

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const abrirMenu = () => setIsMenuOpen(true);
  const cerrarMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  return (
    <MenuContext.Provider value={{ isMenuOpen, abrirMenu, cerrarMenu, toggleMenu }}>
      {children}
    </MenuContext.Provider>
  );
};