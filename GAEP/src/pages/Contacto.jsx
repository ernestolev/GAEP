import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar2 from '../components/Navbar2';
import Footer from '../components/Footer';
import styles from '../Styles/Contacto.module.css';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Import icons
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

const Contacto = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombres: '',
    email: '',
    telefono: '',
    mensaje: ''
  });
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormState('loading');

    try {
      await addDoc(collection(db, 'mensajes'), {
        ...formData,
        estado: 'pendiente',
        fechaEnvio: new Date()
      });

      setFormState('success');
      setFormData({
        nombres: '',
        email: '',
        telefono: '',
        mensaje: ''
      });
      
      setTimeout(() => {
        setFormState('idle');
      }, 3000);
      
    } catch (error) {
      console.error('Error:', error);
      setFormState('error');
      
      setTimeout(() => {
        setFormState('idle');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar2 />
      <div className={styles["contacto-container"]}>
        <div className={styles["contacto-header"]}>
          <h1>Contacto</h1>
          <p>Estamos aquí para responder tus preguntas</p>
        </div>

        <div className={styles["contacto-content"]}>
          <div className={styles["info-section"]}>
            <div className={styles["contact-card"]}>
              <div className={styles["icon-container"]}>
                <FaMapMarkerAlt className={styles["contact-icon"]} />
              </div>
              <h3>Dirección</h3>
              <p>Av. Pardo</p>
              <p>Chincha Alta</p>
            </div>
            <div className={styles["contact-card"]}>
              <div className={styles["icon-container"]}>
                <FaPhone className={styles["contact-icon"]} />
              </div>
              <h3>Teléfono</h3>
              <p>+51 987 654 321</p>
            </div>
            <div className={styles["contact-card"]}>
              <div className={styles["icon-container"]}>
                <FaEnvelope className={styles["contact-icon"]} />
              </div>
              <h3>Email</h3>
              <p>gaeppardo@gmail.com</p>
            </div>
          </div>

          <div className={styles["form-section"]}>
            <h2>Envíanos un mensaje</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles["form-group"]}>
                <label>Nombres completos</label>
                <input
                  type="text"
                  value={formData.nombres}
                  onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                  placeholder="Tu nombre completo"
                  required
                />
              </div>
              <div className={styles["form-group"]}>
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tu.email@ejemplo.com"
                  required
                />
              </div>
              <div className={styles["form-group"]}>
                <label>Teléfono</label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="+51 999 999 999"
                  required
                />
              </div>
              <div className={styles["form-group"]}>
                <label>Mensaje</label>
                <textarea
                  value={formData.mensaje}
                  onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                  placeholder="Escribe tu mensaje aquí..."
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className={`${styles["submit-button"]} ${styles[formState]}`}
              >
                {formState === 'loading' && <span className={styles["loading-spinner"]}></span>}
                {formState === 'success' && 'Mensaje enviado'}
                {formState === 'error' && 'Error al enviar'}
                {(formState === 'idle') && (
                  <>
                    <FaPaperPlane className={styles["send-icon"]} />
                    <span>Enviar mensaje</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className={styles["map-section"]}>
          <div className={styles["map-container"]}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3881.02697562336!2d-76.13493825471228!3d-13.410656776644677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x911016601e9c636f%3A0x7987988e5dd7e151!2sColegio%20Jos%C3%A9%20Pardo%20y%20Barreda!5e0!3m2!1ses-419!2spe!4v1736444519800!5m2!1ses-419!2spe"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>

        <div className={styles["junta-section"]}>
          <div className={styles["junta-content"]}>
            <h2>¿Quiénes conforman la junta directiva?</h2>
            <p>Conoce a los miembros que lideran nuestra asociación</p>
            <button 
              onClick={() => navigate('/junta-directiva')}
              className={styles["junta-button"]}
            >
              Conocer Junta Directiva
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contacto;