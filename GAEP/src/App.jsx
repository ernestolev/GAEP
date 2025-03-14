import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from './components/Toast';
import Lenis from '@studio-freight/lenis';

import Home from './pages/Home';
import Contacto from './pages/Contacto';
import AdminPage from './pages/Admin';
import Login from './pages/Login';
import Actividades from './pages/actividades';
import Noticias from './pages/noticias';
import ActividadDetalle from './pages/ActividadDetalle';
import NoticiaDetalle from './pages/NoticiaDetalle';
import Inscripciones from './pages/Inscripciones';
import JuntaDirectiva from './pages/JuntaDirectiva';
import AcercaDe from './pages/AcercaDe';
import MiembrosGAEP from './pages/MiembrosGAEP';
import ProtectedRoute from './pages/ProtectedRoute';
import SponsorsLista from './pages/SponsorsLista';
import HistoriaColegio from './pages/HistoriaColegio';
import HimnoColegio from './pages/HimnoColegio';
import GaleriaFotos from './pages/GaleriaFotos';
import PresidentesPromociones from './pages/PresidentesPromociones';
import FotosSelecciones from './pages/FotosSelecciones';
import PrivacyCookiesPage from './pages/Privacy-Cookies';

// Admin components
import AdminDashboard from './pages/AdminDashboard';
import AdminActividades from './pages/AdminActividades';
import AdminNoticias from './pages/AdminNoticias';
import AdminConsejoDirectivo from './pages/AdminConsejoDirectivo';
import AdminExalumnos from './pages/AdminExalumnos';
import AdminSolicitudes from './pages/AdminSolicitudes';
import AdminSponsors from './pages/AdminSponsors';
import AdminGaleriaFotos from './pages/AdminGaleriaFotos';
import AdminSeleccionFotos from './pages/AdminSeleccionFotos';

// Componente para inicializar Lenis y manejar cambios de ruta
const ScrollManager = ({ children }) => {
  const lenisRef = useRef(null);
  const location = useLocation();
  
  // Inicializar Lenis
  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenisRef.current?.destroy();
    };
  }, []);

  // Regresar al inicio de la página cuando cambia la ruta
  useEffect(() => {
    window.scrollTo(0, 0);
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [location]);

  // Método para hacer scroll a un elemento
  useEffect(() => {
    window.lenis = lenisRef.current;
    
    // Extender la navegación para hacer scroll a un elemento específico
    window.scrollToElement = (elementId, offset = 0) => {
      const element = document.getElementById(elementId);
      if (element) {
        lenisRef.current?.scrollTo(element, { 
          offset,
          duration: 1.2
        });
      }
    };
  }, []);

  return <>{children}</>;
};

const App = () => {
  return (
    <Router>
      <ScrollManager>
        <ToastContainer />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/actividades" element={<Actividades />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/actividades/:id" element={<ActividadDetalle />} />
          <Route path="/noticias/:id" element={<NoticiaDetalle />} /> 
          <Route path="/inscripciones" element={<Inscripciones />} />
          <Route path="/junta-directiva" element={<JuntaDirectiva />} />
          <Route path="/acerca-de" element={<AcercaDe />} />
          <Route path="/miembros-gaep" element={<MiembrosGAEP />} />
          <Route path="/sponsors-lista" element={<SponsorsLista />} />
          <Route path="/historia-colegio" element={<HistoriaColegio />} />
          <Route path="/himno-colegio" element={<HimnoColegio />} />
          <Route path="/galeria-fotos" element={<GaleriaFotos />} />
          <Route path="/presidentes-promociones" element={<PresidentesPromociones />} />
          <Route path="/fotos-selecciones" element={<FotosSelecciones />} />
          <Route path="/privacy" element={<PrivacyCookiesPage />} />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/actividades" 
            element={
              <ProtectedRoute>
                <AdminActividades />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/noticias" 
            element={
              <ProtectedRoute>
                <AdminNoticias />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/consejo-directivo" 
            element={
              <ProtectedRoute>
                <AdminConsejoDirectivo />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/exalumnos" 
            element={
              <ProtectedRoute>
                <AdminExalumnos />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/solicitudes" 
            element={
              <ProtectedRoute>
                <AdminSolicitudes />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/sponsors" 
            element={
              <ProtectedRoute>
                <AdminSponsors />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/galeria" 
            element={
              <ProtectedRoute>
                <AdminGaleriaFotos />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/seleccion" 
            element={
              <ProtectedRoute>
                <AdminSeleccionFotos />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </ScrollManager>
    </Router>
  );
};

export default App;