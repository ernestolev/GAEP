import React from 'react';
import styles from '../Styles/TestimonialSection.module.css';
import testimonialImage from '../assets/images/img-almuerzo2025.jpeg';

const TestimonialSection = () => {
  return (
    <section className={styles.testimonio} data-aos="fade-up" data-aos-duration="1000">
      <div className={styles.testimonioBox}>
        <div className={styles.testimonioText}>
          <p>
            "Ser parte de la GAEP me ha permitido no solo mantener el contacto con mis antiguos
            compañeros de promoción, sino también crear nuevas conexiones profesionales
            que han impulsado mi carrera. Los eventos y actividades que organizan son de
            alta calidad y realmente fomentan el espíritu de comunidad".
          </p>
          <div className={styles.testimonioAuthor}>
            <p><strong>Carlos Rodríguez</strong></p>
            <p>Promoción 2005</p>
          </div>
        </div>
        <div className={styles.testimonioImage}>
          <img src={testimonialImage} alt="Testimonio" />
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;