import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';
import './Home.modules.css';
import 'leaflet/dist/leaflet.css';



import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';


import foto1 from '../../assets/images/img-flyer.png';
import foto2 from '../../assets/images/img-bannerbenef.png'; // Asegúrate de que la ruta sea correcta
import foto3 from '../../assets/images/img-bannerbenef.png';
import icon1 from '../../assets/icons/icon-unidos.png';
import icon2 from '../../assets/icons/icon-fortalecemos.png';
import icon3 from '../../assets/icons/icon-generamos.png';
import icon4 from '../../assets/icons/icon-calendar.png';
import Mapa from '../../components/Map/map';
import persona from '../../assets/images/img-hombre.png';
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
    const [fade, setFade] = useState(false); // Estado para la animación de fade

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
            image: foto2
        },
        {
            title: "Hazte miembro por un costo único de s/.10",
            text: (
                <div>
                    <p>Hazte miembro ahora y disfruta de los proximos eventos que estaremos realizando.</p>
                    <button className='boton-inscrip'>Inscribirme</button>
                </div>
            ),
            image: foto2
        }
    ];

    useEffect(() => {
        const fetchActividades = async () => {
            const querySnapshot = await getDocs(collection(db, 'actividades'));
            const actividadesData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    ...data,
                    id: doc.id,
                    fecha: data.fecha.toDate().toLocaleDateString() // Convertir Timestamp a fecha legible
                };
            });
            const actividadesOrdenadas = actividadesData.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
            setActividades(actividadesOrdenadas.slice(0, 5)); // Mostrar solo las primeras 5 actividades
        };

        const fetchUbicaciones = async () => {
            const querySnapshot = await getDocs(collection(db, 'ubicaciones'));
            const ubicacionesData = querySnapshot.docs.map(doc => doc.data());
            setUbicaciones(ubicacionesData);
        };

        const fetchNoticias = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'noticias'));
                const noticiasData = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                }));
                // Get only the first 3 noticias
                setNoticias(noticiasData.slice(0, 3));
            } catch (error) {
                console.error("Error fetching noticias:", error);
            }
        };

        fetchActividades();
        fetchUbicaciones();
        fetchNoticias();
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
                            <button className='btn2'>Acerca de la GAEP</button>
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
                        <h3>500+</h3>
                        <p>Miembros</p>
                    </div>
                    <div className='stat'>
                        <h3>1965</h3>
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
            <section className="beneficios" id='beneficios'>
                <div className="beneficios-grid">
                    <div className="beneficio-item">
                        <h3>Estas son algunas razones para que te nos unas...</h3>
                        <p>Join us today and become part of an organisation that makes a difference in the lives of those involved in local agriculture.</p>
                    </div>
                    <div className="beneficio-item1">
                        <img src={persona} alt="Beneficio 1" />
                        <div className="beneficio-content">
                            <div className="beneficio-number">1</div>
                            <div className="beneficio-text">
                                <h4>Beneficios exlusivos para miembros</h4>
                                <p>Lorem ipsum dolor sit amet adipisicing adipisicing adipisicing adipisicing adipisicing elit. </p>
                            </div>
                        </div>
                    </div>
                    <div className="beneficio-item2">
                        <img src={persona} alt="Beneficio 2" />
                        <div className="beneficio-content">
                            <div className="beneficio-number">2</div>
                            <div className="beneficio-text">
                                <h4>Beneficio 2</h4>
                                <p>Descripción del beneficio 2.</p>
                            </div>
                        </div>
                    </div>
                    <div className="beneficio-item1">
                        <img src={persona} alt="Beneficio 3" />
                        <div className="beneficio-content">
                            <div className="beneficio-number">3</div>
                            <div className="beneficio-text">
                                <h4>Beneficio 3</h4>
                                <p>Descripción del beneficio 3.</p>
                            </div>
                        </div>
                    </div>
                    <div className="beneficio-item2">
                        <img src={persona} alt="Beneficio 4" />
                        <div className="beneficio-content">
                            <div className="beneficio-number">4</div>
                            <div className="beneficio-text">
                                <h4>Beneficio 4</h4>
                                <p>Descripción del beneficio 4.</p>
                            </div>
                        </div>
                    </div>
                    <div className="beneficio-item1">
                        <img src={persona} alt="Beneficio 5" />
                        <div className="beneficio-content">
                            <div className="beneficio-number">5</div>
                            <div className="beneficio-text">
                                <h4>Beneficio 5</h4>
                                <p>Descripción del beneficio 5.</p>
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
                                <p>Promoción 1989</p>
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
                                    <img src={foto1} alt="Evento 1" className="evento-img2" />
                                    <p className="fecha-evento">Fecha: 01/01/2023</p>
                                    <h4>Evento 1</h4>
                                    <p>Descripción del evento 1.</p>
                                    <a href="/evento1" className="evento-enlace">Ver más</a>
                                </div>
                                <div className="evento">
                                    <img src={foto1} alt="Evento 2" className="evento-img2" />
                                    <p className="fecha-evento">Fecha: 02/01/2023</p>
                                    <h4>Evento 2</h4>
                                    <p>Descripción del evento 2.</p>
                                    <a href="/evento2" className="evento-enlace">Ver más</a>
                                </div>
                                <div className="evento">
                                    <img src={foto1} alt="Evento 3" className="evento-img2" />
                                    <p className="fecha-evento">Fecha: 03/01/2023</p>
                                    <h4>Evento 3</h4>
                                    <p>Descripción del evento 3.</p>
                                    <a href="/evento3" className="evento-enlace">Ver más</a>
                                </div>
                                <div className="evento">
                                    <img src={foto1} alt="Evento 4" className="evento-img2" />
                                    <p className="fecha-evento">Fecha: 04/01/2023</p>
                                    <h4>Evento 4</h4>
                                    <p>Descripción del evento 4.</p>
                                    <a href="/evento4" className="evento-enlace">Ver más</a>
                                </div>
                                <div className="evento">
                                    <img src={foto1} alt="Evento 5" className="evento-img2" />
                                    <p className="fecha-evento">Fecha: 05/01/2023</p>
                                    <h4>Evento 5</h4>
                                    <p>Descripción del evento 5.</p>
                                    <a href="/evento5" className="evento-enlace">Ver más</a>
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
                        <p>Ésta es una invitación para unirte a una extensa comunidad que crece saludablemente hace más de 60 años. Nuestros colegas, de todas las promociones, desarrollan las más diversas actividades, muchos de ellos con singular éxito en el Perú y en decenas de países alrededor del mundo. Colaborando mutuamente, cultivando la multiculturalidad y honrando nuestro legado.</p>
                        <div className='comunidad-button'>
                            <button>Unirme ahora</button>
                        </div>
                    </div>
                    <div className="nuestracomunidad-imagen">
                        <img src={foto1} alt="Nuestra Comunidad" className="comunidad-img" />
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
                                    style={{ backgroundImage: `url(${actividad.imagen})` }}
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
                                    src={noticia.imagen}
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
    );
};

export default Home;