import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Styles/ActivitiesSection.module.css';

const ActivitiesSection = ({ actividades, loadingRef }) => {
  const navigate = useNavigate();
  
  return (
    <section className={styles.actividades} data-aos="fade-up">
      <div className={styles.actividadesHeader}>
        <h3>Próximas actividades</h3>
        <button onClick={() => navigate('/actividades')} className={styles.btnVerTodas}>
          Ver todas
        </button>
      </div>
      <div className={styles.tarjetasActividades}>
        {actividades.map((actividad, index) => (
          <div
            ref={index === actividades.length - 1 ? loadingRef : null}
            key={actividad.id}
            className={`${styles.tarjetaActividad} ${index === 0 ? styles.tarjetaActividadPrincipal : ''}`}
            data-aos="fade-up"
            data-aos-delay={index * 100}
            onClick={() => navigate(`/actividades/${actividad.id}`)}
          >
            <div className={styles.tarjetaActividadImagen}>
              <img src={actividad.imagen} alt={actividad.titulo} />
            </div>
            <div className={styles.tarjetaActividadContenido}>
              <div className={styles.tarjetaActividadFecha}>{actividad.fecha}</div>
              <h4 className={styles.tarjetaActividadTitulo}>{actividad.titulo}</h4>
              <p className={styles.tarjetaActividadDescripcion}>
                {actividad.descripcion && actividad.descripcion.length > 100
                  ? `${actividad.descripcion.substring(0, 100)}...`
                  : actividad.descripcion}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ActivitiesSection;