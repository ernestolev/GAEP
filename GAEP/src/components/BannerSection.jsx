import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Styles/BannerSection.module.css';

const BannerSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className={styles.parchin} data-aos="fade-up">
      <div className={styles.parchinContent}>
        <div className={styles.parchinText}>
          <h3>Pardinos por el mundo</h3>
          <p>
            Nuestros exalumnos están presentes en diferentes partes del mundo, llevando 
            consigo los valores y enseñanzas adquiridos en el Colegio José Pardo y Barreda. 
            ¿Quieres ver dónde se encuentran actualmente?
          </p>
        </div>
        <button onClick={() => navigate('/mapa')} className={styles.btnParchin}>
          Ver en el mapa
        </button>
      </div>
    </section>
  );
};

export default BannerSection;