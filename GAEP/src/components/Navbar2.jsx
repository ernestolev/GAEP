import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import styles from '../Styles/Navbar.module.css';
import escudo from '../assets/images/img-gaepbanner.png';
import { FaUser } from 'react-icons/fa'; // Import user icon

const Navbar2 = () => {
  const [isOpen, setIsOpen] = useState(false);
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const [user, setUser] = useState(null);
   const [isJBPDropdownOpen, setIsJBPDropdownOpen] = useState(false);
   const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false); // New state for user dropdown
 
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
    <nav className={`${styles.navbar} `}>
      <div className={styles.navwidth}>
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
                  <Link to="/presidentes-promociones" onClick={toggleMenu}>
                    Presidentes de Promociones
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
            <li className={styles.dropdown}>
              <Link
                className={styles.link}
                to="/"
                onClick={(e) => {
                  e.preventDefault();
                  setIsJBPDropdownOpen(!isJBPDropdownOpen);
                }}
              >
                Galería
                <div className={`${styles.dropdownContent} ${isJBPDropdownOpen ? styles.show : ''}`}>

                  <Link to="/galeria-fotos" onClick={toggleMenu}>
                    Fotos de Promociones
                  </Link>
                  <Link to="/fotos-selecciones" onClick={toggleMenu}>
                    Fotos de Selecciones
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
                JPB
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
              <li className={styles.dropdown}>
                <a 
                  className={styles.link}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsUserDropdownOpen(!isUserDropdownOpen);
                  }}
                >
                  <FaUser style={{marginRight: '5px'}} /> 
                  <div className={`${styles.dropdownContent} ${isUserDropdownOpen ? styles.show : ''}`}>
                    {user.email && <div className={styles.userEmail}>{user.email}</div>}
                    {user.displayName && <div className={styles.userName}>{user.displayName}</div>}
                    <Link to="/admin" onClick={toggleMenu}>
                      Panel Administrador
                    </Link>
                    <a href="#" onClick={handleLogout}>
                      Cerrar Sesión
                    </a>
                  </div>
                </a>
              </li>
            ) : (
              <li><Link className={styles.link} to="/login" onClick={toggleMenu}><FaUser style={{marginRight: '5px'}} /> </Link></li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar2;