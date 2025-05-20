import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './Rotas/Rotas';
import './styles/main.scss';

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;