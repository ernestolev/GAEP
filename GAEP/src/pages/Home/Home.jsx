import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { LoadingScreen } from '../../components/LoadingScreen/LoadingScreen';
import { Link } from 'react-router-dom';
import './Home.modules.css';
import 'leaflet/dist/leaflet.css';



import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Sponsors from '../../components/Sponsors/Sponsors.jsx';


import foto1 from '../../assets/images/img-flyer.png';
import foto2 from '../../assets/images/img-bannerbenef.png'; // Asegúrate de que la ruta sea correcta
import foto3 from '../../assets/images/img-bannerbenef.png';
import icon1 from '../../assets/icons/icon-unidos.png';
import icon2 from '../../assets/icons/icon-fortalecemos.png';
import icon3 from '../../assets/icons/icon-generamos.png';
import comubanner from '../../assets/images/img-comunidadbanner.png';
import imgvalores from '../../assets/images/img-valores.jpeg';
import imginscrip from '../../assets/images/img-bannerinscrip.png';

import em1 from '../../assets/images/img-almuerzo2025.jpeg';
import em2 from '../../assets/images/img-salud2025.jpeg';
import em3 from '../../assets/images/img-campeonato2025.jpeg';
import em4 from '../../assets/images/img-chocolatada2025.jpeg';

import benef01 from '../../assets/images/img-benef01.png';
import benef02 from '../../assets/images/img-benef02.png';
import benef03 from '../../assets/images/img-benef03.png';
import benef04 from '../../assets/images/img-benef04.png';
import benef05 from '../../assets/images/img-benef05.png';

import icon4 from '../../assets/icons/icon-calendar.png';
import Mapa from '../../components/Map/map';
import persona from '../../assets/icons/icon-userdefault.png';
import flecha from '../../assets/icons/icon-flecha.png';
import flecha2 from '../../assets/icons/icon-flecha2.png';
import Benefimg from '../../assets/images/img-grupaal.png';
import FormularioUbicaciones from '../../components/FormularioMap/formulario';
import Modal from '../../components/FormularioMap/modal';
import comillas from '../../assets/images/img-comillas.png'; // Asegúrate de que la ruta sea correcta
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [ubicaciones, setUbicaciones] = useState([]);
    const [noticias, setNoticias] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actividades, setActividades] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    const banners = [
        {
            title: "Los valores que manejamos",
            text: (
                <div className="comunidad-values">
                    <div className="value-bar">
                        <span>Respeto</span>
                        <span className='porcentaje'>100%</span>
                        <div className="bar">
                            <div className="fill" style={{ width: '100%' }}></div>
                        </div>
                    </div>
                    <div className="value-bar">
                        <span>Integridad</span>
                        <span className='porcentaje'>100%</span>
                        <div className="bar">
                            <div className="fill" style={{ width: '100%' }}></div>
                        </div>
                    </div>
                    <div className="value-bar">
                        <span>Compromiso</span>
                        <span className='porcentaje'>100%</span>
                        <div className="bar">
                            <div className="fill" style={{ width: '100%' }}></div>
                        </div>
                    </div>
                    <div className="value-bar">
                        <span>Excelencia</span>
                        <span className='porcentaje'>100%</span>
                        <div className="bar">
                            <div className="fill" style={{ width: '100%' }}></div>
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
                    <button className='boton-inscrip'>Inscribirme</button>
                </div>
            ),
            image: imginscrip
        }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [actividadesSnapshot, ubicacionesSnapshot, noticiasSnapshot] = await Promise.all([
                    getDocs(collection(db, 'actividades')),
                    getDocs(collection(db, 'ubicaciones')),
                    getDocs(collection(db, 'noticias'))
                ]);

                // Process actividades
                const actividadesData = actividadesSnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                    fecha: doc.data().fecha.toDate().toLocaleDateString()
                }));
                const actividadesOrdenadas = actividadesData.sort((a, b) =>
                    new Date(a.fecha) - new Date(b.fecha)
                );
                setActividades(actividadesOrdenadas.slice(0, 5));

                // Process ubicaciones
                const ubicacionesData = ubicacionesSnapshot.docs.map(doc => doc.data());
                setUbicaciones(ubicacionesData);

                // Process noticias
                const noticiasData = noticiasSnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                }));
                setNoticias(noticiasData.slice(0, 3));

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
    }, []);
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
            const newIndex = Math.min(currentIndex + 1, 1); // Asumiendo que hay 3 desplazamientos posibles
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

    return (
        <>
            {isLoading ? (
                <LoadingScreen />
            ) : (
                <div className="home-container">
                    <Navbar />
                    <section className="intro" id='intro'>
                        <div className="intro-box">
                            <div className="intro-content">
                                <h2>Conectando Generaciones,
                                    Fortaleciendo Vínculos</h2>
                                <div className='intro-text'>
                                    <p>
                                        Sé parte de la gran comunidad de exalumnos del colegio José Pardo y Barreda. Juntos, seguimos fortaleciendo los lazos que nos unen, celebrando nuestros logros y construyendo un legado que inspira a las nuevas generaciones. ¡Únete y seamos parte de esta historia que sigue creciendo!                            </p>

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
                            <div className="intro-image-container">
                                <div className="intro-image">
                                    <img src={foto1} alt="Foto de la galería" />
                                </div>
                            </div>
                        </div>
                        <div className="intro-stats">
                            <div className='stat'>
                                <h3>200+</h3>
                                <p>Miembros</p>
                            </div>
                            <div className='stat'>
                                <h3>1950</h3>
                                <p>Año de Fundación</p>
                            </div>
                            <div className='stat'>
                                <h3>120</h3>
                                <p>Voluntarios</p>
                            </div>
                            <div className='stat'>
                                <h3>50+</h3>
                                <p>Eventos Anuales</p>
                            </div>
                        </div>
                    </section>
                    <Sponsors />
                    <section className="beneficios" id='beneficios'>
                        <div className="beneficios-grid">
                            <div className="beneficio-item">
                                <h3>Estas son algunas razones para que te nos unas...</h3>
                                <p>Únete ahora y disfruta de los siguientes beneficios que tenemos para ti por ser miembro.</p>
                            </div>
                            <div className="beneficio-item1">
                                <img src={benef01} alt="Beneficio 1" />
                                <div className="contentbenf">
                                    <div className="beneficio-text">
                                        <h4>Acceso a actividades exclusivas</h4>
                                        <p>Participación preferente en actividades culturales, deportivas y académicas organizadas por la asociación, fortaleciendo el sentido de pertenencia y la unión entre sus miembros. </p>
                                    </div>
                                </div>
                            </div>
                            <div className="beneficio-item2">
                                <img src={benef02} alt="Beneficio 2" />
                                <div className="beneficio-content">
                                    <div className="beneficio-text">
                                        <h4>Descuentos en eventos sociales</h4>
                                        <p>Acceso a descuentos y facilidades para participar en eventos sociales organizados por la asociación. Además, se fomenta la colaboración con empresas de exalumnos y socios estratégicos a través de convenios vigentes.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="beneficio-item1">
                                <img src={benef03} alt="Beneficio 3" />
                                <div className="beneficio-content">
                                    <div className="beneficio-text">
                                        <h4>Red de contactos y oportunidades laborales</h4>
                                        <p>Acceso a una base de datos exclusiva de asociados para facilitar la conexión laboral entre miembros, fomentando oportunidades de trabajo y colaboraciones profesionales.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="beneficio-item2">
                                <img src={benef04} alt="Beneficio 4" />
                                <div className="beneficio-content">
                                    <div className="beneficio-text">
                                        <h4>Apoyo en salud y bienestar</h4>
                                        <p>Convenios exclusivos con clínicas y farmacias que ofrecen descuentos especiales en servicios médicos y medicamentos para los socios y sus familias.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="beneficio-item1">
                                <img src={benef05} alt="Beneficio 5" />
                                <div className="beneficio-content">
                                    <div className="beneficio-text">
                                        <h4>Promoción de emprendimientos de exalumnos</h4>
                                        <p>Espacios dedicados a promover empresas y emprendimientos liderados por exalumnos, fortaleciendo la comunidad y generando más visibilidad para sus proyectos.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="testimonio">
                        <div className="testimonio-background"></div>
                        <div className="testimonio-content">
                            <div className="testimonio-cuadro">
                                <p>"La GAEP es más que una asociación; es un puente que conecta generaciones de exalumnos del Colegio José Pardo y Barreda. A través de sus eventos y actividades, he redescubierto amistades, fortalecido vínculos y sentido el orgullo de pertenecer a una comunidad tan unida."</p>
                                <div className="testimonio-footer">
                                    <img src={persona} alt="Persona" className="testimonio-img" />
                                    <div>
                                        <h4>ORLANDO VILLEGAS</h4>
                                        <p>Promoción 1986</p>
                                    </div>
                                </div>
                                <img src={comillas} alt="Comilla" className="comilla" />
                            </div>
                            <div className="testimonio-cuadro">
                                <p>"Ser parte de la GAEP ha sido una experiencia increíble. Gracias a la asociación, he podido participar en eventos exclusivos, conectar con exalumnos de diferentes generaciones y disfrutar de beneficios que fortalecen nuestro vínculo como comunidad. Es gratificante ver cómo nuestra red de egresados del Colegio José Pardo y Barreda sigue creciendo y apoyándonos mutuamente."</p>
                                <div className="testimonio-footer">
                                    <img src={persona} alt="Persona" className="testimonio-img" />
                                    <div>
                                        <h4>VICTOR C. LEVANO ANGULO</h4>
                                        <p>Promoción 1992</p>
                                    </div>
                                </div>
                                <img src={comillas} alt="Comilla" className="comilla" />
                            </div>
                        </div>
                    </section>
                    <section className="eventosmuestra">
                        <div className="eventosmuestra-content">
                            <div className="eventosmuestra-text">
                                <h2>Nuestros eventos siempre son los mejores</h2>
                                <p>Descubre los eventos más importantes organizados por nuestra comunidad y entérate cuando los realizamos.</p>
                                <div className="carrusel-buttons">
                                    <button className="prev-button" onClick={handlePrevClick}>
                                        <img src={flecha2} alt="" />
                                    </button>
                                    <button className="next-button" onClick={handleNextClick}>
                                        <img src={flecha} alt="" />
                                    </button>
                                </div>
                                <div className="carrusel-dots">
                                    <span className={`dot ${currentIndex === 0 ? 'active' : ''}`}></span>
                                    <span className={`dot ${currentIndex === 1 ? 'active' : ''}`}></span>
                                    <span className={`dot ${currentIndex === 2 ? 'active' : ''}`}></span>
                                </div>
                            </div>
                            <div className="eventosmuestra-imagen">
                                <img src={foto1} alt="Evento destacado" className="evento-img" />
                                <div className="carrusel-eventos-container" ref={carruselRef}>
                                    <div className="carrusel-eventos">
                                        <div className="evento">
                                            <img src={em1} alt="Evento 1" className="evento-img2" />
                                            <div className='contenidoevento'>
                                                <h4>Almuerzo de exalumnos 2025</h4>
                                                <p>Almuerzo anual entre exalumnos para mantener la confraternidad y compartir buenos momentos.</p>
                                                <a href="/actividades" className="evento-enlace">Ver más</a>
                                            </div>
                                        </div>
                                        <div className="evento">
                                            <img src={em2} alt="Evento 2" className="evento-img2" />
                                            <div className='contenidoevento'>
                                                <h4>Campaña de salud 2025</h4>
                                                <p>Camapaña anual para que los asociados puedan hacer revision de su salud.</p>
                                                <a href="/actividades" className="evento-enlace">Ver más</a>
                                            </div>
                                        </div>
                                        <div className="evento">
                                            <img src={em3} alt="Evento 3" className="evento-img2" />
                                            <div className='contenidoevento'>
                                                <h4>Campeonato deportivo de exalumnos 2025</h4>
                                                <p>Torneo de futbol entre promociones, fomentando la buena practica y valores que nos representan.</p>
                                                <a href="/actividades" className="evento-enlace">Ver más</a>
                                            </div>
                                        </div>
                                        <div className="evento">
                                            <img src={em4} alt="Evento 4" className="evento-img2" />
                                            <div className='contenidoevento'>
                                                <h4>Chocolatada navideña 2025</h4>
                                                <p>Entrega de jueguetes y organizacion de chocolatadas para los niños mas necesitados de nuestra ciudad.</p>
                                                <a href="/actividades" className="evento-enlace">Ver más</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="nuestracomunidad" id='comunidad'>
                        <div className="nuestracomunidad-content">
                            <div className="nuestracomunidad-text">
                                <h2>NUESTRA COMUNIDAD</h2>
                                <p className='textocomp'>Ésta es una invitación para unirte a una extensa comunidad que crece saludablemente hace más de 60 años. Nuestros colegas, de todas las promociones, desarrollan las más diversas actividades, muchos de ellos con singular éxito en el Perú y en decenas de países alrededor del mundo. Colaborando mutuamente, cultivando la multiculturalidad y honrando nuestro legado.</p>
                                <div className='comunidad-button'>
                                    <button
                                        className='btn1'
                                        onClick={() => navigate('/inscripciones')}
                                    >
                                        Unirme ahora
                                    </button>
                                </div>
                            </div>
                            <div className="nuestracomunidad-imagen">
                                <img src={comubanner} alt="Nuestra Comunidad" className="comunidad-img" />
                            </div>
                        </div>
                    </section>
                    <section className="banners">
                        <div className={`banner-content ${fade ? 'fade' : ''}`} style={{ backgroundImage: `url(${banners[currentIndex].image})` }}>
                            <div className={`banner-cuadro ${fade ? 'fade' : ''}`}>
                                <h2>{banners[currentIndex].title}</h2>
                                <p>{banners[currentIndex].text}</p>
                            </div>
                            <button className="banner-button next-button" onClick={handleNextClick2}>
                                <img src={flecha} alt="Siguiente" />
                            </button>
                        </div>
                    </section>
                    <section className="mapapardinos">
                        <div className="mapapardinos-content">
                            <div className="mapapardinos-text">
                                <h2>Pardinos por el mundo</h2>
                                <p>Descubre dónde se encuentran nuestros exalumnos alrededor del mundo. Revisa desde que parte del mundo nuestros compañeros nos brindan su apoyo.</p>
                                <div className='registro-mapa'>
                                    <p>Si deseas estar en el mapa, llena este pequeño <a onClick={openModal}>formulario</a>.</p>
                                </div>
                            </div>
                            <div className="mapapardinos-mapa">
                                <Mapa ubicaciones={ubicaciones} />
                            </div>
                        </div>
                        <Modal isOpen={isModalOpen} onClose={closeModal}>
                            <FormularioUbicaciones agregarUbicacion={agregarUbicacion} onClose={closeModal} />
                        </Modal>
                    </section>
                    <section className="actividades">
                        <div className='actividades-header'>
                            <h2>Próximas actividades</h2>
                            <button onClick={() => navigate('/actividades')}>Ver todas</button>
                        </div>
                        <div className='actividades-content'>
                            <div className="tarjetas-actividades">
                                {actividades.map((actividad, index) => (
                                    <div
                                        key={index}
                                        className={`tarjeta-actividad ${index === 0 ? 'tarjeta-actividad-principal' : ''}`}
                                        onClick={() => navigate(`/actividades/${actividad.id}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div
                                            className="imagen-fondo"
                                            style={{
                                                backgroundImage: `url(${actividad.imagenes && actividad.imagenes.length > 0
                                                    ? actividad.imagenes[0]
                                                    : actividad.imagen || ''
                                                    })`
                                            }}
                                        ></div>
                                        <div className="contenido-actividad">
                                            <h3>{actividad.titulo}</h3>
                                            <p className="fecha-actividad">
                                                <img src={icon4} alt={"ss"} className="actividad-icon" />
                                                {actividad.fecha}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </section>
                    <section className="ultimasnoticias">
                        <div className="ultimasnoticias-header">
                            <h2>Últimas Noticias</h2>
                            <button onClick={() => navigate('/noticias')} className="ver-mas-noticias">Ver más noticias</button>                </div>
                        <div className='noticias-content'>
                            <div className="noticias-grid">
                                {noticias.map((noticia, index) => (
                                    <div
                                        key={index}
                                        className="noticia"
                                        onClick={() => navigate(`/noticias/${noticia.id}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img
                                            src={noticia.imagenes && noticia.imagenes.length > 0
                                                ? noticia.imagenes[0]
                                                : noticia.imagen || ''}
                                            alt={noticia.titulo}
                                            className="noticia-img"
                                        />
                                        <h3>{noticia.titulo}</h3>
                                        <p className="noticia-descripcion">
                                            {noticia.descripcion.replace(/<[^>]+>/g, '').slice(0, 100)}
                                            {noticia.descripcion.length > 100 ? '...' : ''}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                    <Footer />
                </div>
            )}
        </>
    );

};

export default Home;