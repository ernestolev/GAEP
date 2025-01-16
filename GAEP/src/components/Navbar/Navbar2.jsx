import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import styles from './Navbar2.module.css';
import escudo from '../../assets/images/img-gaepbanner.png';

const Navbar2 = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isJBPDropdownOpen, setIsJBPDropdownOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <a href="/">
        <img className={styles.logo} src={escudo} alt="Escudo de la GAEP" />
      </a>
      <div className={styles.hamburger} onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className={`${styles.menuOverlay} ${isOpen ? styles.active : ''}`}>
        <button className={styles.closeButton} onClick={toggleMenu}>X</button>
        <ul className={styles.menu}>
          <li><Link className={styles.link} to="/" onClick={toggleMenu}>Inicio</Link></li>
          <li className={styles.dropdown}>
            <Link
              className={styles.link}
              to="/"
              onClick={(e) => {
                e.preventDefault();
                setIsDropdownOpen(!isDropdownOpen);
              }}
            >
              Comunidad
              <div className={`${styles.dropdownContent} ${isDropdownOpen ? styles.show : ''}`}>
                <Link to="/junta-directiva" onClick={toggleMenu}>
                  Miembros de Junta Directiva
                </Link>
                <Link to="/miembros-gaep" onClick={toggleMenu}>
                  Miembros GAEP
                </Link>
                <Link to="/acerca-de" onClick={toggleMenu}>
                  Acerca de GAEP
                </Link>
              </div>
            </Link>
          </li>
          <li><Link className={styles.link} to="/" onClick={toggleMenu}>Beneficios y Servicios</Link></li>
          <li><Link className={styles.link} to="/actividades" onClick={toggleMenu}>Actividades</Link></li>
          <li><Link className={styles.link} to="/noticias" onClick={toggleMenu}>Noticias</Link></li>
          <li><Link className={styles.link} to="/contacto" onClick={toggleMenu}>Contacto</Link></li>
          <li className={styles.dropdown}>
            <Link
              className={styles.link}
              to="/"
              onClick={(e) => {
                e.preventDefault();
                setIsJBPDropdownOpen(!isJBPDropdownOpen);
              }}
            >
              JBP
              <div className={`${styles.dropdownContent} ${isJBPDropdownOpen ? styles.show : ''}`}>
                <Link to="/historia-colegio" onClick={toggleMenu}>
                  Historia del Colegio
                </Link>
                <Link to="/himno-colegio" onClick={toggleMenu}>
                  Himno del Colegio
                </Link>
              </div>
            </Link>
          </li>
          <li><Link className={styles.link} to="/inscripciones" onClick={toggleMenu}>Inscripciones</Link></li>
          {user ? (
            <li><button className={styles.link} onClick={handleLogout}>Cerrar sesión</button></li>
          ) : (
            <li><Link className={styles.link} to="/login" onClick={toggleMenu}>Login</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar2;