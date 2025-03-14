import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar2 from '../components/Navbar2';
import Footer from '../components/Footer';
import styles from '../Styles/Inscripciones.module.css';
import InscripcionModal from './InscripcionModal';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Inscripciones = () => {
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            easing: 'ease-out'
        });
    }, []);

    return (
        <>
            <Navbar2 />
            <InscripcionModal isOpen={showModal} onClose={() => setShowModal(false)} />
            <div className={styles.inscripcionesPage}>
                <div className={styles.inscripcionesBanner} data-aos="fade-down">
                    <h1>Únete a nuestra comunidad</h1>
                    <p>Sé parte de la familia GAEP y disfruta de beneficios exclusivos</p>
                </div>
                <div className={styles.inscripcionesContent} data-aos="fade-up">
                    <h2>¿Cómo puedo inscribirme como socio?</h2>
                    <p className={styles.inscripcionesIntro}>
                        Seguir el proceso es fácil y rápido. A continuación, te detallamos los pasos para convertirte en socio de nuestra asociación de exalumnos:
                    </p>

                    <div className={styles.stepsContainer}>
                        <div className={styles.step} data-aos="fade-up" data-aos-delay="100">
                            <div className={styles.stepNumber}>1</div>
                            <h3>Registro inicial</h3>
                            <p>Ingresa tu DNI, número de celular y año de promoción.</p>
                        </div>
                        <div className={styles.step} data-aos="fade-up" data-aos-delay="200">
                            <div className={styles.stepNumber}>2</div>
                            <h3>Pago de la cuota</h3>
                            <p>Realiza el pago de S/. 10.00 como cuota de inscripción.</p>
                        </div>
                        <div className={styles.step} data-aos="fade-up" data-aos-delay="300">
                            <div className={styles.stepNumber}>3</div>
                            <h3>Formulario de inscripción</h3>
                            <p>Completa tus datos personales y adjunta tu comprobante de pago.</p>
                        </div>
                        <div className={styles.step} data-aos="fade-up" data-aos-delay="400">
                            <div className={styles.stepNumber}>4</div>
                            <h3>Evaluación del comité</h3>
                            <p>Espera la revisión y confirmación por parte del comité de evaluación.</p>
                        </div>
                    </div>
                    <div className={styles.inscripcionesCta} data-aos="fade-up" data-aos-delay="500">
                        <p>¡Una vez aprobado, formarás parte de nuestra comunidad de socios y podrás disfrutar de todos los beneficios exclusivos!</p>
                        <button onClick={() => setShowModal(true)} className={styles.startButton}>
                            Comenzar inscripción
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Inscripciones;