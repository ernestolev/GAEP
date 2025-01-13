import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Home from './pages/Home/Home';
import Contacto from './pages/Contacto/Contacto';
import AdminPage from './pages/Admin/Admin';
import Login from './pages/Login/Login';
import Actividades from './pages/Actividades/actividades';
import Noticias from './pages/Noticias/noticias';
import ActividadDetalle from './pages/Actividades/ActividadDetalle';
import NoticiaDetalle from './pages/Noticias/NoticiaDetalle';
import Inscripciones from './pages/Inscripciones/Inscripciones';
import JuntaDirectiva from './pages/Junta-Directiva/JuntaDirectiva';
import AcercaDe from './pages/AcercaDe/AcercaDe';
import MiembrosGAEP from './pages/MiembrosGAEP/MiembrosGAEP';
import ProtectedRoute from './pages/ProtectedRoute/ProtectedRoute';



import { useNavigate } from 'react-router-dom';




const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route 
                    path="/admin" 
                    element={
                        <ProtectedRoute>
                            <AdminPage />
                        </ProtectedRoute>
                    } 
                />
        <Route path="/login" element={<Login />} />
        <Route path="/actividades" element={<Actividades />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/actividades/:id" element={<ActividadDetalle />} />
        <Route path="/noticias/:id" element={<NoticiaDetalle />} /> 
        <Route path="/inscripciones" element={<Inscripciones />} />
        <Route path="/junta-directiva" element={<JuntaDirectiva />} />
        <Route path="/acerca-de" element={<AcercaDe />} />
        <Route path="/miembros-gaep" element={<MiembrosGAEP />} />
                {/*
                <Route path="/admin" element={<Admin />} />
                */}
      </Routes>
    </Router>
  );
};

export default App;
