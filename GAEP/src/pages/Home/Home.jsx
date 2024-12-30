import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import './Home.modules.css';
import 'leaflet/dist/leaflet.css';

import foto1 from '../../assets/images/img-galeria1.png';
import icon1 from '../../assets/icons/icon-unidos.png';
import icon2 from '../../assets/icons/icon-fortalecemos.png';
import icon3 from '../../assets/icons/icon-generamos.png';
import icon4 from '../../assets/icons/icon-calendar.png';
import Mapa from '../../components/Map/map';
import Benefimg from '../../assets/images/img-grupaal.png';
import FormularioUbicaciones from '../../components/FormularioMap/formulario';
import Modal from '../../components/FormularioMap/modal';

const Home = () => {
    const [ubicaciones, setUbicaciones] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actividades, setActividades] = useState([]);

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
            setActividades(actividadesData);
        };

        const fetchUbicaciones = async () => {
            const querySnapshot = await getDocs(collection(db, 'ubicaciones'));
            const ubicacionesData = querySnapshot.docs.map(doc => doc.data());
            setUbicaciones(ubicacionesData);
        };

        fetchActividades();
        fetchUbicaciones();
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

    // Ordenar actividades por fecha
    const actividadesOrdenadas = [...actividades].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    return (
        <div className="home-container">
            <section className="intro">
                <div className="intro-box">
                    <button>Únete a nosotros</button>
                    <h2>¡Compañeros para un mundo <strong>mejor</strong>!</h2>
                    {/* <img src={foto1} alt="Foto de la galería" /> */}
                </div>
                <div className="intro-paragraphs">
                    <div className="intro-paragraph">
                        <img src={icon1} alt="Siempre unidos" />
                        <h3>Siempre unidos</h3>
                        <p>La Asociación de Exalumnos del Colegio José Pardo y Barreda va más allá de la amistad: somos herederos y continuadores de una historia dedicada a la educación de calidad.</p>
                    </div>
                    <div className="intro-paragraph">
                        <img src={icon2} alt="Fortalecemos legados" />
                        <h3>Fortalecemos legados</h3>
                        <p>Tenemos vocación y aptitud para unir tradición y modernidad. Nuestra visión se vuelca para generar acciones de impacto social relevante a nivel local y nacional.</p>
                    </div>
                    <div className="intro-paragraph">
                        <img src={icon3} alt="Generamos Conocimientos" />
                        <h3>Generamos Conocimientos</h3>
                        <p>A través de nuestra red, promovemos oportunidades y eventos académicos, profesionales y culturales entre exalumnos, para construir una sociedad más justa y solidaria.</p>
                    </div>
                </div>
            </section>
            <section className="comunidad">
                <div className="comunidad-box">
                    <h2>NUESTRA COMUNIDAD</h2>
                    <div className="comunidad-content">
                        <div className="comunidad-text">
                            <p>Ésta es una invitación para unirte a una extensa comunidad que crece saludablemente hace más de 60 años. Nuestros colegas, de todas las promociones, desarrollan las más diversas actividades, muchos de ellos con singular éxito en el Perú y en decenas de países alrededor del mundo. Colaborando mutuamente, cultivando la multiculturalidad y honrando nuestro legado, trabajamos para que nuestras ciudades, regiones, países de origen y nuestro planeta sean mejores para las futuras generaciones.</p>
                        </div>
                        <div className="comunidad-values">
                            <div className="value-bar">
                                <span>Respeto</span>
                                <div className="bar">
                                    <div className="fill" style={{ width: '100%' }}></div>
                                </div>
                            </div>
                            <div className="value-bar">
                                <span>Integridad</span>
                                <div className="bar">
                                    <div className="fill" style={{ width: '100%' }}></div>
                                </div>
                            </div>
                            <div className="value-bar">
                                <span>Compromiso</span>
                                <div className="bar">
                                    <div className="fill" style={{ width: '100%' }}></div>
                                </div>
                            </div>
                            <div className="value-bar">
                                <span>Excelencia</span>
                                <div className="bar">
                                    <div className="fill" style={{ width: '100%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="comunidad-footer">ORLANDO VILLEGAS - Presidente GAEP</p>
                </div>
                <Mapa ubicaciones={ubicaciones} />
            </section>
            <section className="mapa-ubicaciones">
                <p>Si deseas estar en el mapa, llena este pequeño formulario.</p>
                <button onClick={openModal}>Registrar mi ubicación</button>
            </section>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <FormularioUbicaciones agregarUbicacion={agregarUbicacion} onClose={closeModal} />
            </Modal>
            <section className="beneficios">
                <h2>BENEFICIOS Y SERVICIOS</h2>
                <div className='beneficios-content'>
                <p>La asociación facilita el acceso a un cuadro selecto de mentores, coachs o ponentes en actividades para alumnos, así como el acceso a investigaciones realizadas por alumnos. Actúa para intensificar la participación ciudadana en proyectos de cambio social, económico y político en la región y el país. Dispone de una red de fomento y acciones, on y offline, en eventos culturales e interculturales en el país y fuera de él. Del mismo modo, divulga y promueve participación en eventos deportivos.</p>
                <img src={Benefimg} alt="" />
                </div>
                
            </section>
            <section className="actividades">
                <h2>CRONOGRAMA DE ACTIVIDADES</h2>
                <div className="tarjetas-actividades">
                    {actividadesOrdenadas.map((actividad, index) => (
                        <div key={index} className="tarjeta-actividad">
                            <p className="fecha-actividad"><img src={icon4} alt={"ss"} className="actividad-icon" />{actividad.fecha}</p>
                            <img src={actividad.imagen} alt={actividad.titulo} className="imagen-actividad" />
                            <h3>{actividad.titulo}</h3>
                            <p>{actividad.descripcion}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;