import React, { useEffect } from 'react';
import Navbar2 from '../../components/Navbar/Navbar2';
import Footer from '../../components/Footer/Footer';
import './AcercaDe.modules.css';
import { Link } from 'react-router-dom';
import AOS from 'aos';

import img1 from '../../assets/images/img-bannerbenef.png';
import 'aos/dist/aos.css';

const AcercaDe = () => {
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
                <h1>HISTORIA DE LA GAEP</h1>
                <div className="acercaoverlay"></div>
            </div>

            <div className="acerca-container">
                <div className="acerca-guion">
                    <Link to="/">Inicio</Link>
                    <span>/</span>
                    <span>Acerca de la GAEP</span>
                </div>

                <section className="content-section" data-aos="fade-up">
                    <h2>Nuestra Historia</h2>
                    <div className="section-content">
                        <div className="text-content">
                            <p>Desde su fundación en 1917, el colegio "José Pardo y Barreda" ha sido un símbolo de excelencia educativa y un referente cultural en nuestra provincia. Por más de un siglo, ha formado generaciones de estudiantes, inculcándoles valores y conocimientos que los han convertido en ciudadanos comprometidos con el desarrollo de la sociedad. La conexión entre los exalumnos y su querido colegio se ha mantenido viva a través de los años, manifestándose en celebraciones memorables como las bodas de oro en 1968 y el centenario en 2018, que reunieron a miles de pardinos de diversas promociones. Estos hitos son testimonio de la unión y orgullo que caracteriza a la comunidad pardina.</p>
                        </div>
                        <div className="image-content">
                            <img src={img1} alt="Historia GAEP" />
                        </div>
                    </div>
                </section>

                <div className="parallax-divider"></div>

                <section className="content-section reverse" data-aos="fade-up">
                    <h2>El Origen de la Organización</h2>
                    <div className="section-content">
                        <div className="image-content">
                            <img src={img1} alt="Origen GAEP" />
                        </div>
                        <div className="text-content">
                            <p>La idea de unir formalmente a los exalumnos pardinos tomó forma en los años 50, bajo el liderazgo de visionarios como el médico y profesor Elisbán García He-Tera. Con el tiempo, las iniciativas de los exalumnos fueron consolidándose, culminando en la creación de la Gran Asociación de Exalumnos Pardinos en 2011, liderada por el médico Hugo Medina Bendrell. A pesar de los esfuerzos de varias directivas para formalizarla, fue en marzo de 2023 cuando se logró fundar oficialmente la Gloriosa Asociación de Exalumnos Pardinos (GAEP), registrada legalmente y liderada inicialmente por Arturo Maurolagoitia Valdivieso. Desde entonces, la GAEP ha trabajado para fortalecer los lazos entre exalumnos y mantener viva la herencia del colegio.</p>
                        </div>
                    </div>
                </section>

                {/* Continue with other sections similarly */}

                <section className="timeline-section" data-aos="fade-up">
                    <h2>Hitos Importantes</h2>
                    <div className="timeline">
                        <div className="timeline-item">
                            <div className="timeline-content">
                                <h3>1917</h3>
                                <p>Fundación del colegio "José Pardo y Barreda", que se convierte en un pilar educativo y social de la provincia.</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-content">
                                <h3>1923</h3>
                                <p>Primera promoción de egresados del colegio.</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-content">
                                <h3>1950</h3>
                                <p>Los exalumnos comienzan a organizarse bajo la conducción del médico y profesor Elisbán García He-Tera.</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-content">
                                <h3>1960</h3>
                                <p>El director Eloy Arriola Senisse fortalece la cohesión entre los exalumnos.</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-content">
                                <h3>1968</h3>
                                <p>Celebración de las bodas de oro del colegio, con una gran fiesta provincial que reúne a exalumnos de todas las promociones desde los años 20.</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-content">
                                <h3>1970-90</h3>
                                <p>Joaquín Ormeño Cabrera (promoción 1946) se convierte en un ícono de los exalumnos, apoyando a varias promociones con viajes y eventos.</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-content">
                                <h3>2011</h3>
                                <p>Se formaliza la Gran Asociación de Exalumnos Pardinos bajo el liderazgo del médico Hugo Medina Bendrell (promoción 1959).</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-content">
                                <h3>2013-2019</h3>
                                <p>Gestiones lideradas por Juan Crisóstomo Munayco y luego por otros líderes enfrentan dificultades para consolidar la formalización legal.</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-content">
                                <h3>2018</h3>
                                <p>Celebración del centenario del colegio, liderada por Hugo Vásquez Matías (promoción 1988), en un evento histórico que marcó la comunidad pardina.</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-content">
                                <h3>2023</h3>
                                <p>En enero, se decide fundar una nueva asociación formal y legal.</p>
                                <p>En marzo, nace oficialmente la Gloriosa Asociación de Exalumnos Pardinos (GAEP), liderada por Arturo Maurolagoitia Valdivieso (promoción 1989), y queda registrada en Sunarp.</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-content">
                                <h3>2024</h3>
                                <p>En marzo, Orlando Villegas Violeta (promoción 1986) asumirá el liderazgo con el compromiso de repotenciar la institución y fortalecer el espíritu pardino.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="cta-section" data-aos="fade-up">
                    <h2>¡Únete a la GAEP!</h2>
                    <p>Sé parte de nuestra historia y ayúdanos a construir el futuro.</p>
                    <Link to="/inscripciones" className="cta-button">
                        Inscríbete Ahora
                    </Link>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default AcercaDe;