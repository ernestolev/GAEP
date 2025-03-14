
import React from 'react';
import { useNavigate } from 'react-router-dom';
import fotointro from '../assets/images/img-introhome.png';

const HeroSection = () => {
    const navigate = useNavigate();
    
    return (
        <section className="intro" id='intro'>
            <div className="intro-box">
                <div className="intro-content" data-aos="fade-up" data-aos-delay="100">
                    <h2>Conectando Generaciones,
                        Fortaleciendo Vínculos</h2>
                    <div className='intro-text'>
                        <p>
                            Sé parte de la gran comunidad de exalumnos del colegio José Pardo y Barreda. Juntos, seguimos fortaleciendo los lazos que nos unen, celebrando nuestros logros y construyendo un legado que inspira a las nuevas generaciones. ¡Únete y seamos parte de esta historia que sigue creciendo!
                        </p>
                    </div>
                    <div className='intro-buttons'>
                        <button
                            className='btn1'
                            onClick={() => navigate('/inscripciones')}
                        >
                            Unirme ahora
                        </button>
                        <button className='btn2' onClick={() => navigate('/acerca-de')}>
                            Acerca de la GAEP
                        </button>
                    </div>
                </div>
                <div className="intro-image-container" data-aos="fade-up">
                    <div className="intro-image">
                        <img src={fotointro} alt="Foto de la galería" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;