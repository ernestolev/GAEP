import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import styles from '../Styles/Navbar.module.css';
import escudo from '../assets/images/img-gaepbanner.png';
import { FaUser } from 'react-icons/fa'; // Import user icon

const Navbar = () => {
  const [isShrunk, setIsShrunk] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null); // Único estado para controlar todos los dropdowns
  

  const scrollToSection = (sectionId, e) => {
    e.preventDefault();
    
    if (window.location.pathname === '/') {
      // Si estamos en la página principal, usamos Lenis para scroll suave
      if (window.lenis) {
        window.scrollToElement(sectionId);
      }
    } else {
      // Si no estamos en la página principal, navegamos a la principal con el hash
      window.location.href = `/#${sectionId}`;
    }
    
    setIsOpen(false);
    setActiveDropdown(null);
  };


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

  // Función para abrir/cerrar dropdown y cerrar otros
  const toggleDropdown = (dropdownName, e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
    setActiveDropdown(null); // Cerrar todos los dropdowns
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  // Cerrar dropdown si se hace clic fuera
  useEffect(() => {
    const closeDropdowns = (e) => {
      // Si el clic fue en un elemento que no es parte de un dropdown
      if (!e.target.closest(`.${styles.dropdown}`)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', closeDropdowns);
    return () => document.removeEventListener('click', closeDropdowns);
  }, []);

  return (
    <nav className={`${styles.navbar} ${isShrunk ? styles.shrink : ''}`}>
      <div className={styles.navwidth}>
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
          <div className={styles.containermenu}>
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
                    handleLinkClick();
                  }}
                >
                  Inicio
                </Link>
              </li>

              <li className={styles.dropdown}>
                <Link
                  className={styles.link}
                  to="/"
                  onClick={(e) => toggleDropdown('comunidad', e)}
                >
                  Comunidad
                  <div className={`${styles.dropdownContent} ${activeDropdown === 'comunidad' ? styles.show : ''}`}>
                    <Link to="/junta-directiva" onClick={handleLinkClick}>
                      Miembros de Junta Directiva
                    </Link>
                    <Link to="/presidentes-promociones" onClick={handleLinkClick}>
                      Presidentes de Promociones
                    </Link>
                    <Link to="/miembros-gaep" onClick={handleLinkClick}>
                      Miembros GAEP
                    </Link>
                    <Link to="/acerca-de" onClick={handleLinkClick}>
                      Acerca de GAEP
                    </Link>
                  </div>
                </Link>
              </li>
              
              <li className={styles.dropdown}>
                <Link
                  className={styles.link}
                  to="/"
                  onClick={(e) => toggleDropdown('galeria', e)}
                >
                  Galería
                  <div className={`${styles.dropdownContent} ${activeDropdown === 'galeria' ? styles.show : ''}`}>
                    <Link to="/galeria-fotos" onClick={handleLinkClick}>
                      Fotos de Promociones
                    </Link>
                    <Link to="/fotos-selecciones" onClick={handleLinkClick}>
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
                    handleLinkClick();
                  }}
                >
                  Beneficios
                </Link>
              </li>
              
              <li><Link className={styles.link} to="/actividades" onClick={handleLinkClick}>Actividades</Link></li>
              <li><Link className={styles.link} to="/noticias" onClick={handleLinkClick}>Noticias</Link></li>
              <li><Link className={styles.link} to="/contacto" onClick={handleLinkClick}>Contacto</Link></li>
              
              <li className={styles.dropdown}>
                <Link
                  className={styles.link}
                  to="/"
                  onClick={(e) => toggleDropdown('jpb', e)}
                >
                  JPB
                  <div className={`${styles.dropdownContent} ${activeDropdown === 'jpb' ? styles.show : ''}`}>
                    <Link to="/historia-colegio" onClick={handleLinkClick}>
                      Historia del Colegio
                    </Link>
                    <Link to="/himno-colegio" onClick={handleLinkClick}>
                      Himno del Colegio
                    </Link>
                  </div>
                </Link>
              </li>
              
              <li><Link className={styles.link} to="/inscripciones" onClick={handleLinkClick}>Inscripciones</Link></li>
              
              {user ? (
                <li className={styles.dropdown}>
                  <a
                    className={styles.link}
                    href="#"
                    onClick={(e) => toggleDropdown('user', e)}
                  >
                    <FaUser style={{ marginRight: '5px' }} />
                    <div className={`${styles.dropdownContent} ${activeDropdown === 'user' ? styles.show : ''}`}>
                      {user.email && <div className={styles.userEmail}>{user.email}</div>}
                      {user.displayName && <div className={styles.userName}>{user.displayName}</div>}
                      <Link to="/admin" onClick={handleLinkClick}>
                        Panel Administrador
                      </Link>
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        handleLogout();
                        handleLinkClick();
                      }}>
                        Cerrar Sesión
                      </a>
                    </div>
                  </a>
                </li>
              ) : (
                <li><Link className={styles.link} to="/login" onClick={handleLinkClick}><FaUser style={{ marginRight: '5px' }} /> </Link></li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;