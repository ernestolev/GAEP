import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import styles from './Navbar.module.css';
import escudo from '../../assets/images/img-gaepbanner.png';

const Navbar = () => {
  const [isShrunk, setIsShrunk] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isJBPDropdownOpen, setIsJBPDropdownOpen] = useState(false);


  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsShrunk(true);
      } else {
        setIsShrunk(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
    <nav className={`${styles.navbar} ${isShrunk ? styles.shrink : ''}`}>
      <a href="">
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
          <li>
            <Link
              className={styles.link}
              to="/"
              onClick={(e) => {
                e.preventDefault();
                if (window.location.pathname === '/') {
                  const element = document.getElementById('intro');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                } else {
                  window.location.href = '/#intro';
                }
                toggleMenu();
              }}
            >
              Inicio
            </Link>
          </li>
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
          <li>
            <Link
              className={styles.link}
              to="/"
              onClick={(e) => {
                e.preventDefault();
                if (window.location.pathname === '/') {
                  const element = document.getElementById('beneficios');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                } else {
                  window.location.href = '/#beneficios';
                }
                toggleMenu();
              }}
            >
              Beneficios
            </Link>
          </li>
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

export default Navbar;