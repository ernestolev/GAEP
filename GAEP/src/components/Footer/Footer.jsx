import React from 'react';
import './Footer.modules.css';

import iconenlace from '../../assets/icons/icon-link.png';
import iconfb from '../../assets/icons/icon-fb.png';
import iconig from '../../assets/icons/icon-ig.png';

import { icon } from 'leaflet';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; Asociación de Exalumnos José Pardo y Barreda | Chincha Alta - Perú</p>
        <p><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Consejo directivo <img className='icon-enlace' src={iconenlace} alt="" /></a></p>
        <p>Powered by<a href="https://facebook.com" target="_blank" rel="noopener noreferrer"> EDG group <img className='icon-enlace' src={iconenlace} alt="" /> </a></p>
      </div>
      <div className='redes'>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><img className='icon-red' src={iconfb} alt="" /></a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><img className='icon-red' src={iconig} alt="" /></a>
        </div>
    </footer>
  );
};

export default Footer;