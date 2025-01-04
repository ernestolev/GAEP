import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home/Home';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Contacto from './pages/Contacto/Contacto';
import AdminPage from './pages/Admin/Admin';
import Login from './pages/Login/Login';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/login" element={<Login />} /> {/* Asegúrate de que la ruta esté en minúsculas */}
        <Route path="/finishSignUp" element={<Login />} /> 
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;