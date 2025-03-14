import React from 'react';
import styles from '../Styles/CommunitySection.module.css';
import communityImage from '../assets/images/img-comunidadbanner.png';

const CommunitySection = () => {
  return (
    <section className={styles.nuestracomunidad} id='comunidad' data-aos="fade-up">
      <div className={styles.nuestracomunidadContent}>
        <div className={styles.nuestracomunidadText} data-aos="fade-right" data-aos-delay="200">
          <h3>Nuestra comunidad</h3>
          <p>
            Somos más que una asociación, somos una familia unida por los valores y experiencias 
            compartidas en el Colegio José Pardo y Barreda. Nuestra comunidad está formada por 
            profesionales de diversas áreas que comparten un objetivo común: mantener vivo el 
            espíritu pardino y contribuir al desarrollo de nuestra sociedad.
          </p>
          <p>
            Al unirte a nosotros, encontrarás un espacio donde tu voz es valorada y donde podrás 
            seguir cultivando las amistades que comenzaron en las aulas de nuestro querido colegio.
          </p>
        </div>
        <div className={styles.nuestracomunidadImagen} data-aos="fade-left" data-aos-delay="400">
          <img src={communityImage} alt="Nuestra Comunidad" />
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;