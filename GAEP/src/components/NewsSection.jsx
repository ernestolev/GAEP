import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Styles/NewsSection.module.css';

const NewsSection = ({ noticias }) => {
  const navigate = useNavigate();
  
  const handleNoticiaClick = (id) => {
    navigate(`/noticias/${id}`);
  };
  
  return (
    <section className={styles.ultimasnoticias} data-aos="fade-up">
      <h3>Últimas noticias</h3>
      <div className={styles.noticiasGrid}>
        {noticias.map((noticia, index) => (
          <div
            key={noticia.id}
            className={styles.noticia}
            data-aos="fade-up"
            data-aos-delay={index * 200}
            onClick={() => handleNoticiaClick(noticia.id)}
          >
            <div className={styles.noticiaImagen}>
              <img src={noticia.imagen} alt={noticia.titulo} />
              {noticia.destacado && <div className={styles.destacadoBadge}>Destacado</div>}
            </div>
            <div className={styles.noticiaContenido}>
              <div className={styles.noticiaFecha}>
                {noticia.fecha ? new Date(noticia.fecha.seconds * 1000).toLocaleDateString() : 'Sin fecha'}
              </div>
              <h4 className={styles.noticiaTitulo}>{noticia.titulo}</h4>
              <p className={styles.noticiaResumen}>
                {noticia.contenido && noticia.contenido.length > 120
                  ? `${noticia.contenido.substring(0, 120)}...`
                  : noticia.contenido}
              </p>
              <div className={styles.noticiaMore}>Leer más</div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.btnNoticiasContainer}>
        <button className={styles.btnNoticias} onClick={() => navigate('/noticias')}>
          Ver todas las noticias
        </button>
      </div>
    </section>
  );
};

export default NewsSection;