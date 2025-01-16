import React, { useEffect } from 'react';
import Navbar2 from '../../components/Navbar/Navbar2';
import Footer from '../../components/Footer/Footer';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './HistoriaColegio.modules.css';

import imgColegio from '../../assets/images/img-h1.jpeg'; // Update with actual image
import img2 from '../../assets/images/img-h2.jpg'; // Update with actual image
import img3 from '../../assets/images/img-h3.jpg'; // Update with actual image
import img4 from '../../assets/images/img-h4.jpg'; // Update with actual image


const HistoriaColegio = () => {
    useEffect(() => {
        AOS.init({
            duration: 500,
            once: true
        });
    }, []);

    return (
        <>
            <Navbar2 />
            <div className="hero-section">
                <h1>Historia del Colegio José Pardo y Barreda</h1>
                <div className="historiaoverlay"></div>
            </div>

            <div className="historia-container">
                <div className="historia-guion">
                    <Link to="/">Inicio</Link>
                    <span>/</span>
                    <Link to="/historia-colegio">Historia del Colegio</Link>
                </div>

                <section className="content-section" data-aos="fade-up">
                    <h2>Orígenes del Sueño Educativo</h2>
                    <div className="section-content">
                        <div className="text-content">
                            <p>Desde finales del siglo XIX, surgió la necesidad de contar con un Colegio de Educación Secundaria con valor oficial en Chincha Alta. Esta necesidad se intensificó en 1900, cuando la ciudad se convirtió en la capital de la provincia. Con más de 25 escuelas primarias y alrededor de 80 alumnos egresados anualmente, la idea de un colegio era crucial. Además, desde 1829, un decreto había destinado fondos provenientes del arrendamiento de terrenos locales para la educación, acumulando una significativa suma de dinero destinada a este propósito.</p>
                        </div>
                        <div className="image-content">
                            <img src={imgColegio} alt="Colegio antiguo" />
                        </div>
                    </div>
                </section>

                <div className="parallax-divider"></div>

                <section className="timeline-section" data-aos="fade-up">
                    <h2>Línea de tiempo: Historia del Colegio Nacional "Pardo"</h2>
                    <div className="timeline">
                        <div className="timeline-item">
                            <div className="timeline-content">
                                <h3>1829</h3>
                                <p>Decreto que establece destinar las rentas de los fundos "El Cote" y "Lurinchincha" para la educación en Chincha Alta.</p>
                            </div>
                        </div>

                        <div className="timeline-item">
                            <div className="timeline-content">
                                <h3>1900</h3>
                                <p>Chincha Alta se convierte en la capital de la provincia, intensificando la necesidad de un colegio secundario oficial.</p>
                            </div>
                        </div>

                        <div className="timeline-item">
                            <div className="timeline-content">
                                <h3>1912</h3>
                                <p>Juan Manuel Torres Balcázar presenta un proyecto de ley para crear un Colegio Nacional en Chincha, financiado por las rentas acumuladas desde 1829.</p>
                            </div>
                        </div>

                        <div className="timeline-item">
                            <div className="timeline-content">
                                <h3>1917</h3>
                                <p>13 de noviembre: El Congreso aprueba la Ley N° 2560, promulgada por el presidente José Pardo y Barreda el 20 de noviembre, creando el Colegio Nacional "Pardo".</p>
                            </div>
                        </div>

                        <div className="timeline-item">
                            <div className="timeline-content">
                                <h3>1918</h3>
                                <div className="timeline-events">
                                    <p><strong>27 de abril:</strong> Resolución Suprema nombra a Luis Gálvez Chipoco como director del colegio.</p>
                                    <p><strong>24 de agosto:</strong> Inician las clases en un local provisional en la Calle Los Ángeles N° 246 con 40 alumnos inscritos.</p>
                                    <p><strong>10 de junio:</strong> Se aprueba la ubicación para el local definitivo del colegio.</p>
                                    <p><strong>23 de junio:</strong> Juan de Matta Mármol dona el terreno para el colegio mediante escritura pública.</p>
                                    <p><strong>31 de agosto:</strong> El Ministerio de Instrucción acepta oficialmente la donación del terreno.</p>
                                </div>
                            </div>
                        </div>

                        <div className="timeline-item">
                            <div className="timeline-content">
                                <h3>1919</h3>
                                <div className="timeline-events">
                                    <p>Se encargan los planos del colegio al ingeniero Agustín Ferrari, incluyendo un campo deportivo y la construcción de una nueva avenida.</p>
                                    <p><strong>12 de octubre:</strong> Inauguración de la Avenida de la Juventud, trazada y ornamentada en homenaje al nuevo colegio.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="parallax-divider"></div>

                <section className="content-section reverse" data-aos="fade-up">
                    <h2>El Primer Proyecto: Una Lucha por Chincha</h2>
                    <div className="section-content">
                        <div className="image-content">
                            <img src={img2} alt="Construcción del colegio" />
                        </div>
                        <div className="text-content">
                            <p>En 1912, Juan Manuel Torres Balcázar, diputado y residente de Chincha, presentó un proyecto de ley para crear un Colegio Nacional financiado con los fondos acumulados. Sin embargo, la propuesta enfrentó resistencia, principalmente de parlamentarios iqueños. En su lugar, se priorizó un proyecto que fortalecía al Colegio San Luis Gonzaga en Ica, dejando a Chincha a la espera.</p>
                        </div>
                    </div>
                </section>


                <section className="content-section" data-aos="fade-up">
                    <h2>La Ley que Dio Vida al Colegio</h2>
                    <div className="section-content">
                        <div className="text-content">
                            <p>Gracias a los esfuerzos del senador Fernando Carrillo, un nuevo proyecto de ley fue aprobado en 1917. Este establecía un impuesto al algodón y al vino producido en la provincia para financiar el colegio. Así, el 20 de noviembre de 1917, se promulgó la Ley N.º 2560, creando el Colegio Nacional "Pardo", con secciones primaria, secundaria, agrícola y de comercio.</p>
                        </div>
                        <div className="image-content">
                            <img src={img3} alt="Colegio actual" />
                        </div>
                    </div>
                </section>
                <section className="content-section reverse" data-aos="fade-up">
                    <h2>Un Hogar para el Colegio: La Construcción del Local</h2>
                    <div className="section-content">
                        <div className="image-content">
                            <img src={img4} alt="Construcción del colegio" />
                        </div>
                        <div className="text-content">
                            <p>La comunidad mostró gran apoyo en la construcción de un local propio. En 1918, el hacendado Juan de Matta Mármol donó un terreno de más de 12,000 m². A partir de ahí, con la colaboración del ingeniero Agustín Ferrari, se diseñaron los planos del colegio y su campo deportivo. Mientras tanto, se trabajó en la apertura de la primera avenida de Chincha, la Av. de la Juventud, como homenaje al nuevo colegio.</p>
                        </div>
                    </div>
                </section>

                <section className="content-section" data-aos="fade-up">
                    <h2>Un Legado Vivo</h2>
                    <div className="section-content">
                        <div className="text-content">
                            <p>El esfuerzo conjunto de autoridades, vecinos y estudiantes marcó el inicio de una nueva era educativa en Chincha. Desde sus humildes inicios en una casa alquilada hasta la construcción de su propio local, el Colegio Nacional "Pardo" se consolidó como un pilar de la educación en la región. Hoy, sigue siendo un símbolo del compromiso y visión de los chinchanos por la formación de futuras generaciones.</p>
                        </div>
                        <div className="image-content">
                            <img src={img2} alt="Colegio actual" />
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default HistoriaColegio;