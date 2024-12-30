import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import escudo from '../../assets/images/img-escudoGAEP.png';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className={styles.navbar}>
            <img className={styles.logo} src={escudo} alt="Escudo de la GAEP" />
            <div className={styles.hamburger} onClick={toggleMenu}>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <ul className={`${styles.menu} ${isOpen ? styles.active : ''}`}>
                <li><Link className={styles.link} to="/" onClick={toggleMenu}>Inicio</Link></li>
                <li><Link className={styles.link} to="/comunidad" onClick={toggleMenu}>Comunidad</Link></li>
                <li><Link className={styles.link} to="/beneficios" onClick={toggleMenu}>Beneficios y Servicios</Link></li>
                <li><Link className={styles.link} to="/actividades" onClick={toggleMenu}>Actividades</Link></li>
                <li><Link className={styles.link} to="/contacto" onClick={toggleMenu}>Contacto</Link></li>
                <li><Link className={styles.link} to="/inscripciones" onClick={toggleMenu}>Inscripciones</Link></li>
                <li><Link className={styles.link} to="/Admin" onClick={toggleMenu}>Login</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;