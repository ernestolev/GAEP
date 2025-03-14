import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import Sidebar from '../components/Sidebar';
import styles from '../Styles/AdminDashboard.module.css';
import showToast from '../components/Toast';
import {
  FaCalendarAlt,
  FaNewspaper,
  FaUsers,
  FaUserGraduate,
  FaUserPlus,
  FaHandshake,
  FaImages,
  FaFutbol
} from 'react-icons/fa';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [darkTheme, setDarkTheme] = useState(localStorage.getItem('theme') === 'dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    
    // Check authentication
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setUserName(currentUser.displayName || currentUser.email);
      } else {
        navigate('/login');
      }
      setIsLoading(false);
    });

    // Apply theme
    document.body.classList.toggle('dark-theme', darkTheme);

    return () => {
      window.removeEventListener('resize', handleResize);
      unsubscribe();
    };
  }, [navigate, darkTheme]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
      showToast.success('Has cerrado sesión correctamente');
    } catch (error) {
      showToast.error('Error al cerrar sesión: ' + error.message);
    }
  };

  const toggleTheme = () => {
    const newTheme = !darkTheme;
    setDarkTheme(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.body.classList.toggle('dark-theme', newTheme);
  };

  if (isLoading) {
    return <div className={styles.loadingScreen}>Cargando...</div>;
  }

  return (
    <div className={`${styles.adminDashboard} ${darkTheme ? styles.darkTheme : ''}`}>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        darkTheme={darkTheme}
        toggleTheme={toggleTheme}
        userName={userName}
        handleLogout={handleLogout}
      />

      <main className={`${styles.dashboardContent} admin-content`}>
        <div className={styles.dashboardHeader}>
          <h1>Panel de Administración</h1>
          <p>Bienvenido, {userName}</p>
        </div>

        <div className={styles.dashboardGrid}>
          <div className={styles.dashboardCard} onClick={() => navigate('/admin/actividades')}>
            <FaCalendarAlt className={styles.cardIcon} />
            <h2>Actividades</h2>
            <p>Gestionar eventos y actividades</p>
          </div>
          
          <div className={styles.dashboardCard} onClick={() => navigate('/admin/noticias')}>
            <FaNewspaper className={styles.cardIcon} />
            <h2>Noticias</h2>
            <p>Administrar noticias y publicaciones</p>
          </div>
          
          <div className={styles.dashboardCard} onClick={() => navigate('/admin/consejo-directivo')}>
            <FaUsers className={styles.cardIcon} />
            <h2>Consejo Directivo</h2>
            <p>Gestionar miembros directivos</p>
          </div>
          
          <div className={styles.dashboardCard} onClick={() => navigate('/admin/exalumnos')}>
            <FaUserGraduate className={styles.cardIcon} />
            <h2>Exalumnos</h2>
            <p>Administrar exalumnos inscritos</p>
          </div>
          
          <div className={styles.dashboardCard} onClick={() => navigate('/admin/solicitudes')}>
            <FaUserPlus className={styles.cardIcon} />
            <h2>Solicitudes</h2>
            <p>Gestionar solicitudes de membresía</p>
          </div>
          
          <div className={styles.dashboardCard} onClick={() => navigate('/admin/sponsors')}>
            <FaHandshake className={styles.cardIcon} />
            <h2>Sponsors</h2>
            <p>Administrar patrocinadores</p>
          </div>

          <div className={styles.dashboardCard} onClick={() => navigate('/admin/galeria')}>
            <FaImages className={styles.cardIcon} />
            <h2>Galería</h2>
            <p>Gestionar fotos por promoción</p>
          </div>
          
          <div className={styles.dashboardCard} onClick={() => navigate('/admin/seleccion')}>
            <FaFutbol className={styles.cardIcon} />
            <h2>Selección</h2>
            <p>Gestionar fotos de selecciones</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;