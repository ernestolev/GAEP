import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, query, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../firebase.js';
import { LoadingScreen } from '../components/LoadingScreen.jsx';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import styles from '../Styles/Home.module.css';

// Importaciones de imágenes y recursos
import fotointro from '../assets/images/img-introhome.png';
import foto1 from '../assets/images/img-flyer.png';
import benef01 from '../assets/images/img-benef01.png';
import benef02 from '../assets/images/img-benef02.png';
import benef03 from '../assets/images/img-benef03.png';
import benef04 from '../assets/images/img-benef04.png';
import benef05 from '../assets/images/img-benef05.png';
import icon1 from '../assets/icons/icon-unidos.png';
import icon2 from '../assets/icons/icon-fortalecemos.png';
import icon3 from '../assets/icons/icon-generamos.png';
import icon4 from '../assets/icons/icon-calendar.png';
import comubanner from '../assets/images/img-comunidadbanner.png';
import imgvalores from '../assets/images/img-valores.jpeg';
import imginscrip from '../assets/images/img-bannerinscrip.png';
import em1 from '../assets/images/img-almuerzo2025.jpeg';
import em2 from '../assets/images/img-salud2025.jpeg';
import em3 from '../assets/images/img-campeonato2025.jpeg';
import em4 from '../assets/images/img-chocolatada2025.jpeg';
import persona from '../assets/icons/icon-userdefault.png';
import flecha from '../assets/icons/icon-flecha.png';
import flecha2 from '../assets/icons/icon-flecha2.png';
import comillas from '../assets/images/img-comillas.png';

// Componentes
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import Sponsors from '../components/Sponsors.jsx';
import Mapa from '../components/map.jsx';
import FormularioUbicaciones from '../components/formulario.jsx';
import Modal from '../components/modal.jsx';

const Home = () => {
    const [ubicaciones, setUbicaciones] = useState([]);
    const [noticias, setNoticias] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actividades, setActividades] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [lastVisible, setLastVisible] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const loadingRef = useRef(null);
    const ITEMS_PER_PAGE = 5;

    const navigate = useNavigate();
    const banners = [
        {
            title: "Los valores que manejamos",
            text: (
                <div className={styles["comunidad-values"]}>
                    <div className={styles["value-bar"]}>
                        <span>Respeto</span>
                        <span className={styles.porcentaje}>100%</span>
                        <div className={styles.bar}>
                            <div className={styles.fill} style={{ width: '100%' }}></div>
                        </div>
                    </div>
                    <div className={styles["value-bar"]}>
                        <span>Integridad</span>
                        <span className={styles.porcentaje}>100%</span>
                        <div className={styles.bar}>
                            <div className={styles.fill} style={{ width: '100%' }}></div>
                        </div>
                    </div>
                    <div className={styles["value-bar"]}>
                        <span>Compromiso</span>
                        <span className={styles.porcentaje}>100%</span>
                        <div className={styles.bar}>
                            <div className={styles.fill} style={{ width: '100%' }}></div>
                        </div>
                    </div>
                    <div className={styles["value-bar"]}>
                        <span>Excelencia</span>
                        <span className={styles.porcentaje}>100%</span>
                        <div className={styles.bar}>
                            <div className={styles.fill} style={{ width: '100%' }}></div>
                        </div>
                    </div>
                </div>
            ),
            image: imgvalores
        },
        {
            title: "Hazte miembro por un costo único de s/.10",
            text: (
                <div>
                    <p>Hazte miembro ahora y disfruta de los proximos eventos que estaremos realizando.</p>
                    <div className={styles["comunidad-button"]}>
                        <button
                            className={styles.btn1}
                            onClick={() => navigate('/inscripciones')}
                        >
                            Inscribirme
                        </button>
                    </div>
                </div>
            ),
            image: imginscrip
        }
    ];

    useEffect(() => {
        const fetchData = async (isInitial = true) => {
            AOS.init({
                duration: 800,
                once: true,
                easing: 'ease-out'
            });

            try {
                let actividadesQuery;

                if (isInitial) {
                    actividadesQuery = query(
                        collection(db, 'actividades'),
                        orderBy('fecha', 'desc'),
                        limit(ITEMS_PER_PAGE)
                    );
                } else if (lastVisible) {
                    actividadesQuery = query(
                        collection(db, 'actividades'),
                        orderBy('fecha', 'desc'),
                        startAfter(lastVisible),
                        limit(ITEMS_PER_PAGE)
                    );
                }

                // Obtener documentos de las colecciones
                const [actividadesSnapshot, ubicacionesSnapshot, noticiasSnapshot] = await Promise.all([
                    getDocs(actividadesQuery || collection(db, 'actividades')),
                    getDocs(collection(db, 'ubicaciones')),
                    getDocs(collection(db, 'noticias'))
                ]);

                // Process actividades con manejo de diferentes formatos de fecha
                const actividadesData = actividadesSnapshot.docs.map(doc => {
                    const data = doc.data();
                    let fechaFormateada = '';

                    // Manejar diferentes formatos de fecha
                    if (data.fecha) {
                        if (data.fecha.toDate && typeof data.fecha.toDate === 'function') {
                            // Si es un timestamp de Firestore
                            fechaFormateada = data.fecha.toDate().toLocaleDateString();
                        } else if (data.fecha instanceof Date) {
                            // Si ya es un objeto Date
                            fechaFormateada = data.fecha.toLocaleDateString();
                        } else if (typeof data.fecha === 'string') {
                            // Si es un string
                            fechaFormateada = data.fecha;
                        } else {
                            // Si es otro formato, usar como está
                            fechaFormateada = String(data.fecha);
                        }
                    }

                    return {
                        ...data,
                        id: doc.id,
                        fecha: fechaFormateada
                    };
                });

                if (actividadesData.length < ITEMS_PER_PAGE) {
                    setHasMore(false);
                }

                setLastVisible(actividadesSnapshot.docs[actividadesSnapshot.docs.length - 1]);

                if (isInitial) {
                    // Ordenar por fecha (tratando con posibles formatos de fecha ya convertidos)
                    const actividadesOrdenadas = [...actividadesData].sort((a, b) => {
                        // Intenta convertir a Date si es posible
                        const fechaA = new Date(a.fecha);
                        const fechaB = new Date(b.fecha);

                        // Si las fechas son válidas, compáralas
                        if (!isNaN(fechaA) && !isNaN(fechaB)) {
                            return fechaA - fechaB;
                        }

                        // Si no son válidas, usa comparación de strings
                        return String(a.fecha).localeCompare(String(b.fecha));
                    });

                    setActividades(actividadesOrdenadas.slice(0, 5));
                } else {
                    setActividades(prev => [...prev, ...actividadesData]);
                }

                // Process ubicaciones - asegurarse de que haya datos
                if (ubicacionesSnapshot.docs.length > 0) {
                    const ubicacionesData = ubicacionesSnapshot.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id
                    }));
                    setUbicaciones(ubicacionesData);
                } else {
                    console.log("No hay ubicaciones disponibles");
                    setUbicaciones([]);
                }

                // Process noticias - asegurarse de que haya datos
                if (noticiasSnapshot.docs.length > 0) {
                    const noticiasData = noticiasSnapshot.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id
                    }));
                    setNoticias(noticiasData.slice(0, 3));
                } else {
                    console.log("No hay noticias disponibles");
                    setNoticias([]);
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                // Add slight delay for smooth transition
                setTimeout(() => {
                    setIsLoading(false);
                }, 800);
            }
        };

        fetchData();

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore) {
                    fetchData(false);
                }
            },
            { threshold: 0.5 }
        );

        if (loadingRef.current) {
            observer.observe(loadingRef.current);
        }

        return () => observer.disconnect();
    }, [hasMore, lastVisible]);

    const agregarUbicacion = (nuevaUbicacion) => {
        setUbicaciones([...ubicaciones, nuevaUbicacion]);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const carruselRef = useRef(null);

    const handlePrevClick = () => {
        if (carruselRef.current) {
            const newIndex = Math.max(currentIndex - 1, 0);
            setCurrentIndex(newIndex);
            carruselRef.current.scrollBy({
                left: -carruselRef.current.offsetWidth / 1,
                behavior: 'smooth'
            });
        }
    };

    const handleNextClick = () => {
        if (carruselRef.current) {
            const newIndex = Math.min(currentIndex + 1, 1);
            setCurrentIndex(newIndex);
            carruselRef.current.scrollBy({
                left: carruselRef.current.offsetWidth / 1,
                behavior: 'smooth'
            });
        }
    };

    const handleNextClick2 = () => {
        setFade(true);
        setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex === banners.length - 1 ? 0 : prevIndex + 1));
            setFade(false);
        }, 500); // Duración de la animación de fade
    };

    if (isLoading) return <LoadingScreen />;

    return (
        <div className={styles["home-container"]}>
            <Navbar />
            <section className={styles.intro} id='intro'>
                <div className={styles["intro-box"]}>
                    <div className={styles["intro-content"]} data-aos="fade-up" aos-delay="100">
                        <h2>Conectando Generaciones,
                            Fortaleciendo Vínculos</h2>
                        <div className={styles["intro-text"]}>
                            <p>
                                Sé parte de la gran comunidad de exalumnos del colegio José Pardo y Barreda. Juntos, seguimos fortaleciendo los lazos que nos unen, celebrando nuestros logros y construyendo un legado que inspira a las nuevas generaciones. ¡Únete y seamos parte de esta historia que sigue creciendo!
                            </p>
                        </div>
                        <div className={styles["intro-buttons"]}>
                            <button
                                className={styles.btn1}
                                onClick={() => navigate('/inscripciones')}
                            >
                                Unirme ahora
                            </button>
                            <button
                                className={styles.btn2}
                                onClick={() => navigate('/acerca-de')}
                            >
                                Acerca de la GAEP
                            </button>
                        </div>
                    </div>
                    <div className={styles["intro-image-container"]} data-aos="fade-up">
                        <div className={styles["intro-image"]}>
                            <img src={fotointro} alt="Foto de la galería" />
                        </div>
                    </div>
                </div>
                <div className={styles["intro-stats"]} data-aos="fade-up">
                    <div className={styles.stat}>
                        <h3>200+</h3>
                        <p>Miembros</p>
                    </div>
                    <div className={styles.stat}>
                        <h3>1950</h3>
                        <p>Año de Fundación</p>
                    </div>
                    <div className={styles.stat}>
                        <h3>20+</h3>
                        <p>Actividades anuales</p>
                    </div>
                    <div className={styles.stat}>
                        <h3>5+</h3>
                        <p>Proyectos propuestos</p>
                    </div>
                </div>
            </section>

            <div data-aos="fade-up">
                <Sponsors />
            </div>

            <section className={styles.beneficios} id='beneficios'>
                <div className={styles["beneficios-grid"]}>
                    <div className={styles["beneficio-item"]} data-aos="fade-right" data-aos-delay="100">
                        <h3>Estas son algunas razones para que te nos unas...</h3>
                        <p>Únete ahora y disfruta de los siguientes beneficios que tenemos para ti por ser miembro.</p>
                    </div>
                    <div className={styles["beneficio-item1"]} data-aos="fade-up" data-aos-delay="200">
                        <img src={benef01} alt="Beneficio 1" />
                        <div className={styles.contentbenef}>
                            <div className={styles["beneficio-text"]}>
                                <h4>Acceso a actividades exclusivas</h4>
                                <p>Participación preferente en actividades culturales, deportivas y académicas organizadas por la asociación, fortaleciendo el sentido de pertenencia y la unión entre sus miembros.</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles["beneficio-item2"]} data-aos="fade-up" data-aos-delay="300">
                        <img src={benef02} alt="Beneficio 2" />
                        <div className={styles["beneficio-content"]}>
                            <div className={styles["beneficio-text"]}>
                                <h4>Descuentos en eventos sociales</h4>
                                <p>Acceso a descuentos y facilidades para participar en eventos sociales organizados por la asociación. Además, se fomenta la colaboración con empresas de exalumnos y socios estratégicos a través de convenios vigentes.</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles["beneficio-item1"]} data-aos="fade-up" data-aos-delay="400">
                        <img src={benef03} alt="Beneficio 3" />
                        <div className={styles["beneficio-content"]}>
                            <div className={styles["beneficio-text"]}>
                                <h4>Red de contactos y oportunidades laborales</h4>
                                <p>Acceso a una base de datos exclusiva de asociados para facilitar la conexión laboral entre miembros, fomentando oportunidades de trabajo y colaboraciones profesionales.</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles["beneficio-item2"]} data-aos="fade-up" data-aos-delay="500">
                        <img src={benef04} alt="Beneficio 4" />
                        <div className={styles["beneficio-content"]}>
                            <div className={styles["beneficio-text"]}>
                                <h4>Apoyo en salud y bienestar</h4>
                                <p>Convenios exclusivos con clínicas y farmacias que ofrecen descuentos especiales en servicios médicos y medicamentos para los socios y sus familias.</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles["beneficio-item1"]} data-aos="fade-up" data-aos-delay="600">
                        <img src={benef05} alt="Beneficio 5" />
                        <div className={styles["beneficio-content"]}>
                            <div className={styles["beneficio-text"]}>
                                <h4>Promoción de emprendimientos de exalumnos</h4>
                                <p>Espacios dedicados a promover empresas y emprendimientos liderados por exalumnos, fortaleciendo la comunidad y generando más visibilidad para sus proyectos.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.testimonio}>
                <div className={styles["testimonio-background"]}></div>
                <div className={styles["testimonio-content"]}>
                    <div className={styles["testimonio-cuadro"]} data-aos="fade-up" data-aos-delay="200">
                        <p>"La GAEP es más que una asociación; es un puente que conecta generaciones de exalumnos del Colegio José Pardo y Barreda. A través de sus eventos y actividades, he redescubierto amistades, fortalecido vínculos y sentido el orgullo de pertenecer a una comunidad tan unida."</p>
                        <div className={styles["testimonio-footer"]}>
                            <img src={persona} alt="Persona" className={styles["testimonio-img"]} />
                            <div>
                                <h4>ORLANDO VILLEGAS</h4>
                                <p>Promoción 1986</p>
                            </div>
                        </div>
                        <img src={comillas} alt="Comilla" className={styles.comilla} />
                    </div>
                    <div className={styles["testimonio-cuadro"]} data-aos="fade-up" data-aos-delay="600">
                        <p>"Ser parte de la GAEP ha sido una experiencia increíble. Gracias a la asociación, he podido participar en eventos exclusivos, conectar con exalumnos de diferentes generaciones y disfrutar de beneficios que fortalecen nuestro vínculo como comunidad. Es gratificante ver cómo nuestra red de egresados del Colegio José Pardo y Barreda sigue creciendo y apoyándonos mutuamente."</p>
                        <div className={styles["testimonio-footer"]}>
                            <img src={persona} alt="Persona" className={styles["testimonio-img"]} />
                            <div>
                                <h4>VICTOR C. LEVANO ANGULO</h4>
                                <p>Promoción 1992</p>
                            </div>
                        </div>
                        <img src={comillas} alt="Comilla" className={styles.comilla} />
                    </div>
                </div>
            </section>


            <section className={styles.eventosmuestra}>
                <div className={styles["eventosmuestra-content"]} data-aos="fade-up" data-aos-delay="100">
                    <div className={styles["eventosmuestra-text"]}>
                        <h2>Nuestros eventos siempre son los mejores</h2>
                        <p>Descubre los eventos más importantes organizados por nuestra comunidad y entérate cuando los realizamos.</p>
                        <div className={styles["carrusel-controls"]}>
                            <div className={styles["carrusel-buttons"]}>
                                <button className={styles["prev-button"]} onClick={handlePrevClick}>
                                    <img src={flecha2} alt="Anterior" />
                                </button>
                                <button className={styles["next-button"]} onClick={handleNextClick}>
                                    <img src={flecha} alt="Siguiente" />
                                </button>
                            </div>
                            <div className={styles["carrusel-dots"]}>
                                <span className={`${styles.dot} ${currentIndex === 0 ? styles.active : ''}`} onClick={() => setCurrentIndex(0)}></span>
                                <span className={`${styles.dot} ${currentIndex === 1 ? styles.active : ''}`} onClick={() => setCurrentIndex(1)}></span>
                                <span className={`${styles.dot} ${currentIndex === 2 ? styles.active : ''}`} onClick={() => setCurrentIndex(2)}></span>
                            </div>
                        </div>
                    </div>
                    <div className={styles["eventosmuestra-imagen"]}>
                        <img src={foto1} alt="Evento destacado" className={styles["evento-img"]} />
                        <div className={styles["carrusel-eventos-container"]} ref={carruselRef}>
                            <div className={styles["carrusel-eventos"]} data-aos="fade-up" data-aos-delay="300">
                                <div className={styles.evento}>
                                    <img src={em1} alt="Evento 1" className={styles["evento-img2"]} />
                                    <div className={styles.contenidoevento}>
                                        <span className={styles["fecha-evento"]}>25 Marzo, 2025</span>
                                        <h4>Almuerzo de exalumnos 2025</h4>
                                        <p>Almuerzo anual entre exalumnos para mantener la confraternidad y compartir buenos momentos.</p>
                                        <a href="/actividades" className={styles["evento-enlace"]}>Ver más</a>
                                    </div>
                                </div>
                                <div className={styles.evento}>
                                    <img src={em2} alt="Evento 2" className={styles["evento-img2"]} />
                                    <div className={styles.contenidoevento}>
                                        <span className={styles["fecha-evento"]}>18 Abril, 2025</span>
                                        <h4>Campaña de salud 2025</h4>
                                        <p>Campaña anual para que los asociados puedan hacer revisión de su salud.</p>
                                        <a href="/actividades" className={styles["evento-enlace"]}>Ver más</a>
                                    </div>
                                </div>
                                <div className={styles.evento}>
                                    <img src={em3} alt="Evento 3" className={styles["evento-img2"]} />
                                    <div className={styles.contenidoevento}>
                                        <span className={styles["fecha-evento"]}>10 Mayo, 2025</span>
                                        <h4>Campeonato deportivo de exalumnos 2025</h4>
                                        <p>Torneo de fútbol entre promociones, fomentando la buena práctica y valores que nos representan.</p>
                                        <a href="/actividades" className={styles["evento-enlace"]}>Ver más</a>
                                    </div>
                                </div>
                                <div className={styles.evento}>
                                    <img src={em4} alt="Evento 4" className={styles["evento-img2"]} />
                                    <div className={styles.contenidoevento}>
                                        <span className={styles["fecha-evento"]}>20 Diciembre, 2025</span>
                                        <h4>Chocolatada navideña 2025</h4>
                                        <p>Entrega de juguetes y organización de chocolatadas para los niños más necesitados de nuestra ciudad.</p>
                                        <a href="/actividades" className={styles["evento-enlace"]}>Ver más</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.nuestracomunidad} id='comunidad'>
                <div className={styles["nuestracomunidad-content"]}>
                    <div className={styles["nuestracomunidad-text"]} data-aos="fade-right" data-aos-delay="200">
                        <h2>NUESTRA COMUNIDAD</h2>
                        <p>Ésta es una invitación para unirte a una extensa comunidad que crece saludablemente hace más de 60 años. Nuestros colegas, de todas las promociones, desarrollan las más diversas actividades, muchos de ellos con singular éxito en el Perú y en decenas de países alrededor del mundo.</p>

                        <div className={styles["comunidad-counter"]}>
                            <div className={styles["counter-item"]}>
                                <h3 className={styles["counter-number"]}><span>60+</span></h3>
                                <p className={styles["counter-text"]}>Años de historia</p>
                            </div>
                            <div className={styles["counter-item"]}>
                                <h3 className={styles["counter-number"]}><span>200+</span></h3>
                                <p className={styles["counter-text"]}>Miembros activos</p>
                            </div>
                            <div className={styles["counter-item"]}>
                                <h3 className={styles["counter-number"]}><span>30+</span></h3>
                                <p className={styles["counter-text"]}>Países</p>
                            </div>
                        </div>

                        <div className={styles["comunidad-button"]}>
                            <button onClick={() => navigate('/inscripciones')}>
                                Unirme ahora
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className={styles["nuestracomunidad-imagen"]} data-aos="fade-left" data-aos-delay="300">
                        <img src={comubanner} alt="Nuestra Comunidad" className={styles["comunidad-img"]} />
                    </div>
                </div>
            </section>

            <section className={styles.banners}>
                <div
                    className={`${styles["banner-content"]} ${fade ? styles.fade : ''}`}
                    style={{ backgroundImage: `url(${banners[currentIndex].image})` }}
                >
                    <div className={`${styles["banner-cuadro"]} ${fade ? styles.fade : ''}`} >
                        <h2>{banners[currentIndex].title}</h2>

                        {currentIndex === 0 ? (
                            <div className={styles["value-bar-container"]}>
                                <div className={styles["value-bar"]}>
                                    <span>Respeto</span>
                                    <span className={styles.porcentaje}>100%</span>
                                    <div className={styles.bar}>
                                        <div className={styles.fill} style={{ width: '100%' }}></div>
                                    </div>
                                </div>
                                <div className={styles["value-bar"]}>
                                    <span>Integridad</span>
                                    <span className={styles.porcentaje}>100%</span>
                                    <div className={styles.bar}>
                                        <div className={styles.fill} style={{ width: '100%' }}></div>
                                    </div>
                                </div>
                                <div className={styles["value-bar"]}>
                                    <span>Compromiso</span>
                                    <span className={styles.porcentaje}>100%</span>
                                    <div className={styles.bar}>
                                        <div className={styles.fill} style={{ width: '100%' }}></div>
                                    </div>
                                </div>
                                <div className={styles["value-bar"]}>
                                    <span>Excelencia</span>
                                    <span className={styles.porcentaje}>100%</span>
                                    <div className={styles.bar}>
                                        <div className={styles.fill} style={{ width: '100%' }}></div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p>Hazte miembro ahora y disfruta de los próximos eventos que estaremos realizando. Únete a nuestra comunidad de exalumnos con solo un pago único.</p>
                                <div className={styles["boton-inscrip"]}>
                                    <button onClick={() => navigate('/inscripciones')}>
                                        Inscribirme ahora
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles["banner-navigation"]}>
                        <div className={styles["banner-dots"]}>
                            {banners.map((_, index) => (
                                <div
                                    key={index}
                                    className={`${styles["banner-dot"]} ${currentIndex === index ? styles.active : ''}`}
                                    onClick={() => {
                                        setFade(true);
                                        setTimeout(() => {
                                            setCurrentIndex(index);
                                            setFade(false);
                                        }, 500);
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <button className={`${styles["banner-button"]} ${styles["next-button"]}`} onClick={handleNextClick2}>
                        <img src={flecha} alt="Siguiente" />
                    </button>
                </div>
            </section>

            <section className={styles.mapapardinos}>
                <div className={styles["mapapardinos-content"]}>
                    <div className={styles["mapapardinos-text"]}>
                        <h2>Pardinos por el mundo</h2>
                        <p>Descubre las ubicaciones de nuestros exalumnos alrededor del mundo. Explora nuestro mapa interactivo y conecta con la comunidad Pardina global.</p>

                        <div className={styles["registro-mapa"]}>
                            <p>¿Quieres aparecer en el mapa? <a onClick={openModal} style={{ cursor: 'pointer' }}>Regístrate aquí</a></p>
                        </div>
                    </div>

                    <div className={styles["mapapardinos-mapa"]}>
                        {ubicaciones.length > 0 ? (
                            <Mapa ubicaciones={ubicaciones} />
                        ) : (
                            <p>Cargando mapa de ubicaciones...</p>
                        )}
                    </div>
                </div>

                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <FormularioUbicaciones agregarUbicacion={agregarUbicacion} onClose={closeModal} />
                </Modal>
            </section>

            <section className={styles.actividades}>
                <div className={styles["actividades-header"]} data-aos="fade-up" data-aos-delay="200">
                    <h2>Próximas actividades</h2>
                    <button onClick={() => navigate('/actividades')}>Ver todas</button>
                </div>
                <div className={styles["actividades-content"]} data-aos="fade-up" data-aos-delay="500">
                    <div className={styles["tarjetas-actividades"]}>
                        {actividades.length > 0 ? (
                            actividades.map((actividad, index) => (
                                <div
                                    key={index}
                                    ref={index === actividades.length - 1 ? loadingRef : null}
                                    className={`${styles["tarjeta-actividad"]} ${index === 0 ? styles["tarjeta-actividad-principal"] : ''}`}
                                    onClick={() => navigate(`/actividades/${actividad.id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div
                                        className={styles["imagen-fondo"]}
                                        style={{
                                            backgroundImage: `url(${actividad.imagenes && actividad.imagenes.length > 0
                                                ? actividad.imagenes[0]
                                                : actividad.imagen || ''
                                                })`
                                        }}
                                    ></div>
                                    <div className={styles["contenido-actividad"]}>
                                        <h3>{actividad.titulo}</h3>
                                        <p className={styles["fecha-actividad"]}>
                                            <img src={icon4} alt="Calendario" className={styles["actividad-icon"]} />
                                            {actividad.fecha}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No hay actividades disponibles</p>
                        )}
                    </div>
                </div>
            </section>

            <section className={styles.ultimasnoticias}>
                <div className={styles["ultimasnoticias-header"]} data-aos="fade-up" data-aos-delay="300">
                    <h2>Últimas Noticias</h2>
                    <button onClick={() => navigate('/noticias')} className={styles["ver-mas-noticias"]}>Ver más noticias</button>
                </div>
                <div className={styles["noticias-content"]}>
                    <div className={styles["noticias-grid"]} data-aos="fade-up" data-aos-delay="500">
                        {noticias.length > 0 ? (
                            noticias.map((noticia, index) => (
                                <div
                                    key={index}
                                    className={styles.noticia}
                                    onClick={() => navigate(`/noticias/${noticia.id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img
                                        src={noticia.imagenes && noticia.imagenes.length > 0
                                            ? noticia.imagenes[0]
                                            : noticia.imagen || ''}
                                        alt={noticia.titulo}
                                        className={styles["noticia-img"]}
                                    />
                                    <h3>{noticia.titulo}</h3>
                                    <p className={styles["noticia-descripcion"]}>
                                        {noticia.descripcion ?
                                            (typeof noticia.descripcion === 'string' ?
                                                noticia.descripcion.replace(/<[^>]+>/g, '').slice(0, 100) +
                                                (noticia.descripcion.length > 100 ? '...' : '') :
                                                'Sin descripción') :
                                            'Sin descripción'
                                        }
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p>No hay noticias disponibles</p>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;