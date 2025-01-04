import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Home from './pages/Home/Home';
import Contacto from './pages/Contacto/Contacto';
import AdminPage from './pages/Admin/Admin';
import Login from './pages/Login/Login';

{/*
import Inscripciones from './pages/Inscripciones/Inscripciones';

*/}

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/login" element={<Login />} />
        {/* 
                <Route path="/inscripciones" element={<Inscripciones />} />
                
                <Route path="/admin" element={<Admin />} />
                */}
      </Routes>
    </Router>
  );
};

export default App;
