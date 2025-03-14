import React from 'react';
import styles from '../Styles/Footer.module.css';

import iconenlace from '../assets/icons/icon-link.png';
import iconfb from '../assets/icons/icon-fb.png';
import iconig from '../assets/icons/icon-ig.png';
import link from '../assets/icons/icon-link2.png';
import logo from '../assets/images/img-gaepbanner2.png'; // Asegúrate de que la ruta sea correcta

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles["footer-top"]}>
        <div className={styles["footer-left"]}>
          <img src={logo} alt="Logo" className={styles["footer-logo"]} />
        </div>
        <div className={styles["footer-right"]}>
          <div className={styles["footer-info"]}>
            <h4>Ubicación</h4>
            <p>Chincha Alta, Perú</p>
          </div>
          <div className={styles["footer-info"]}>
            <h4>Teléfono</h4>
            <p>+51 956647620</p>
          </div>
          <div className={styles["footer-info"]}>
            <h4>Email</h4>
            <p>gaepjpb@gmail.com</p>
          </div>
        </div>
      </div>
      <div className={styles["footer-bottom"]}>
        <div className={styles["footer-legal"]}>
          <p>&copy; Asociación de Exalumnos José Pardo y Barreda | Chincha Alta - Perú</p>
        </div>
        <div className={styles["footer-links"]}>
          <p><a href="/junta-directiva">Consejo directivo<img className={styles.linkimg} src={link} alt="" /></a></p>
          <p><a href="/privacy">Privacy/Cookies<img className={styles.linkimg} src={link} alt="" /></a></p>
          <p>Website by <a href="https://end-s0luti0ns.web.app/" target="_blank" rel="noopener noreferrer">END Solutions<img className={styles.linkimg} src={link} alt="" /></a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;