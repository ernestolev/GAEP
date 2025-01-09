import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar2 from '../../components/Navbar/Navbar2';
import Footer from '../../components/Footer/Footer';
import './Inscripciones.modules.css';

const Inscripciones = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Navbar2 />
            <div className="inscripciones-page">
                <div className="inscripciones-banner">
                    <h1>Únete a nuestra comunidad</h1>
                    <p>Sé parte de la familia GAEP y disfruta de beneficios exclusivos</p>
                </div>
                <div className="inscripciones-content">
                    <h2>¿Cómo puedo inscribirme como socio?</h2>
                    <p className="inscripciones-intro">
                        Seguir el proceso es fácil y rápido. A continuación, te detallamos los pasos para convertirte en socio de nuestra asociación de exalumnos:
                    </p>
                    
                    <div className="steps-container">
                        <div className="step">
                            <div className="step-number">1</div>
                            <h3>Verificación de exalumno</h3>
                            <p>Valida en línea que seas egresado del colegio José Pardo y Barreda.</p>
                        </div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <h3>Pago de la cuota</h3>
                            <p>Realiza el pago de S/. 10.00 como cuota de inscripción.</p>
                        </div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <h3>Formulario de inscripción</h3>
                            <p>Completa el formulario y adjunta tu comprobante de pago.</p>
                        </div>
                        <div className="step">
                            <div className="step-number">4</div>
                            <h3>Evaluación del comité</h3>
                            <p>Espera la revisión y confirmación por parte del comité de evaluación.</p>
                        </div>
                    </div>

                    <div className="inscripciones-cta">
                        <p>¡Una vez aprobado, formarás parte de nuestra comunidad de socios y podrás disfrutar de todos los beneficios exclusivos!</p>
                        <button onClick={() => setShowModal(true)} className="start-button">
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