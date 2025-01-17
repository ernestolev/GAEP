import React from 'react';
import './Footer.modules.css';

import iconenlace from '../../assets/icons/icon-link.png';
import iconfb from '../../assets/icons/icon-fb.png';
import iconig from '../../assets/icons/icon-ig.png';
import link from '../../assets/icons/icon-link2.png';
import logo from '../../assets/images/img-gaepbanner2.png'; // Asegúrate de que la ruta sea correcta

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-left">
          <img src={logo} alt="Logo" className="footer-logo" />
        </div>
        <div className="footer-right">
          <div className="footer-info">
            <h4>Ubicación</h4>
            <p>Chincha Alta, Perú</p>
          </div>
          <div className="footer-info">
            <h4>Teléfono</h4>
            <p>+51 956647620</p>
          </div>
          <div className="footer-info">
            <h4>Email</h4>
            <p>gaepjpb@gmail.com</p>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-legal">
          <p>&copy; Asociación de Exalumnos José Pardo y Barreda | Chincha Alta - Perú</p>
        </div>
        <div className="footer-links">
          <p><a href="/consejodirect">Consejo directivo<img className='linkimg' src={link} alt="" /></a></p>
          <p><a href="/privacy">Privacy/Cookies<img className='linkimg' src={link} alt="" /></a></p>
          <p>Website by <a href="https://edggroup.com" target="_blank" rel="noopener noreferrer">EDG group<img className='linkimg' src={link} alt="" /></a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;