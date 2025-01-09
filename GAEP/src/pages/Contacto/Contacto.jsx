import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar2 from '../../components/Navbar/Navbar2';
import Footer from '../../components/Footer/Footer';
import './Contacto.modules.css';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';

// Import icons
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Contacto = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombres: '',
    email: '',
    telefono: '',
    mensaje: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'mensajes'), {
        ...formData,
        estado: 'pendiente',
        fechaEnvio: new Date()
      });

      alert('Mensaje enviado con éxito');
      setFormData({
        nombres: '',
        email: '',
        telefono: '',
        mensaje: ''
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Error al enviar el mensaje');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar2 />
      <div className="contacto-container">
        <div className="contacto-header">
          <h1>Contacto</h1>
          <p>Estamos aquí para responder tus preguntas</p>
        </div>

        <div className="contacto-content">
          <div className="info-section">
            <div className="contact-card">
              <FaMapMarkerAlt className="contact-icon" />
              <h3>Dirección</h3>
              <p>Av. Santa Rosa 348</p>
              <p>San Vicente de Cañete</p>
            </div>
            <div className="contact-card">
              <FaPhone className="contact-icon" />
              <h3>Teléfono</h3>
              <p>+51 981 213 145</p>
            </div>
            <div className="contact-card">
              <FaEnvelope className="contact-icon" />
              <h3>Email</h3>
              <p>gaeppardo@gmail.com</p>
            </div>
          </div>

          <div className="form-section">
            <h2>Envíanos un mensaje</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombres completos</label>
                <input
                  type="text"
                  value={formData.nombres}
                  onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mensaje</label>
                <textarea
                  value={formData.mensaje}
                  onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                  required
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          </div>
        </div>

        <div className="map-section">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3881.02697562336!2d-76.13493825471228!3d-13.410656776644677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x911016601e9c636f%3A0x7987988e5dd7e151!2sColegio%20Jos%C3%A9%20Pardo%20y%20Barreda!5e0!3m2!1ses-419!2spe!4v1736444519800!5m2!1ses-419!2spe"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

        <div className="junta-section">
          <h2>¿Quiénes conforman la junta directiva?</h2>
          <p>Conoce a los miembros que lideran nuestra asociación</p>
          <button onClick={() => navigate('/junta-directiva')}>
            Conocer Junta Directiva
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contacto;