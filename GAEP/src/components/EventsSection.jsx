import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Styles/EventsSection.module.css';
import eventImage from '../assets/images/img-grupal.png';

const EventsSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className={styles.eventosmuestra} data-aos="fade-up">
      <div className={styles.eventosmuestraContent}>
        <div className={styles.eventosmuestraText}>
          <h3>Eventos que conectan</h3>
          <p>
            Nuestros eventos son una oportunidad única para reencontrarnos, 
            recordar buenos momentos y crear nuevas memorias. Participar en estas 
            actividades te permitirá fortalecer lazos con exalumnos de diferentes 
            promociones y ampliar tu red de contactos.
          </p>
          <button onClick={() => navigate('/eventos')} className={styles.btnEventos}>
            Ver próximos eventos
          </button>
        </div>
        <div className={styles.eventosmuestraImage}>
          <img src={eventImage} alt="Eventos" />
        </div>
      </div>
    </section>
  );
};

export default EventsSection;