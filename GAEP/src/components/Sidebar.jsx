import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaCalendarAlt,
  FaNewspaper,
  FaUsers,
  FaUserGraduate,
  FaUserPlus,
  FaHandshake,
  FaImages,
  FaFutbol,
  FaTachometerAlt,
  FaMoon,
  FaSun,
  FaHome
} from 'react-icons/fa';
import styles from '../Styles/Sidebar.module.css';
import imggaepbanner from '../assets/images/img-gaepbanner.png';

const Sidebar = ({ 
  isSidebarOpen, 
  setIsSidebarOpen, 
  darkTheme, 
  toggleTheme,
  userName,
  handleLogout
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Banner images based on theme
  const bannerLight = "/assets/banner-light.png"; // Replace with actual path
  const bannerDark = "/assets/banner-dark.png";   // Replace with actual path

  const navigationItems = [
    { path: '/admin', label: 'Dashboard', icon: <FaTachometerAlt className={styles.sidebarIcon} /> },
    { path: '/admin/actividades', label: 'Actividades', icon: <FaCalendarAlt className={styles.sidebarIcon} /> },
    { path: '/admin/noticias', label: 'Noticias', icon: <FaNewspaper className={styles.sidebarIcon} /> },
    { path: '/admin/consejo-directivo', label: 'Consejo Directivo', icon: <FaUsers className={styles.sidebarIcon} /> },
    { path: '/admin/exalumnos', label: 'Exalumnos Inscritos', icon: <FaUserGraduate className={styles.sidebarIcon} /> },
    { path: '/admin/solicitudes', label: 'Solicitudes Miembros', icon: <FaUserPlus className={styles.sidebarIcon} /> },
    { path: '/admin/sponsors', label: 'Sponsors', icon: <FaHandshake className={styles.sidebarIcon} /> },
    { path: '/admin/galeria', label: 'Galería de Fotos', icon: <FaImages className={styles.sidebarIcon} /> },
    { path: '/admin/seleccion', label: 'Fotos Selección Fútbol', icon: <FaFutbol className={styles.sidebarIcon} /> },
  ];

  // Navigate to a different page
  const navigateTo = (path) => {
    navigate(path);
    // On mobile, close sidebar after navigation
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile navigation bar */}
      <div className={styles.mobileNav}>
        <button
          className={styles.sidebarToggle}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
       
      </div>

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''} ${darkTheme ? styles.dark : ''}`}>
        <img
          src={imggaepbanner}
          alt="GAEP Banner"
          className={styles.sidebarBanner}
        />
        
        <div className={styles.navigationContainer}>
          {/* Home button to return to main page */}
          <button
            onClick={() => navigateTo('/')}
            className={`${styles.navButton} ${location.pathname === '/' ? styles.active : ''}`}
          >
            <FaHome className={styles.sidebarIcon} />
            <span>Página Principal</span>
          </button>
          
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigateTo(item.path)}
              className={`${styles.navButton} ${location.pathname === item.path ? styles.active : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        
        <div className={styles.sidebarFooter}>
          
          <button 
            onClick={handleLogout}
            className={styles.logoutButton}
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
      
      {/* Backdrop overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className={styles.backdrop}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;