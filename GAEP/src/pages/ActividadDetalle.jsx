import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import ImageGallery from '../components/ImageGallery';
import { LoadingScreen } from '../components/LoadingScreen';
import styles from '../Styles/ActividadDetalle.module.css';
import Navbar from '../components/Navbar2';
import Footer from '../components/Footer';
import { 
    FaCalendarAlt, 
    FaMapMarkerAlt, 
    FaUserAlt, 
    FaClock, 
    FaInfoCircle,
    FaExternalLinkAlt,
    FaRegClipboard
} from 'react-icons/fa';

const ActividadDetalle = () => {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [actividad, setActividad] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActividad = async () => {
            try {
                const docRef = doc(db, 'actividades', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();

                    // Verificar y formatear la fecha de manera segura
                    let fechaFormateada = "Fecha no disponible";

                    if (data.fecha) {
                        // Verificar si es un Timestamp de Firestore
                        if (data.fecha instanceof Timestamp ||
                            (data.fecha.seconds !== undefined && data.fecha.nanoseconds !== undefined)) {
                            fechaFormateada = data.fecha.toDate().toLocaleDateString('es-ES', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            });
                        }
                        // Si es una fecha como cadena ISO
                        else if (typeof data.fecha === 'string') {
                            try {
                                fechaFormateada = new Date(data.fecha).toLocaleDateString('es-ES', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                });
                            } catch (e) {
                                console.warn("No se pudo convertir la fecha de string:", e);
                                fechaFormateada = data.fecha; // Usar el string tal cual
                            }
                        }
                        // Si es un número (timestamp en milisegundos)
                        else if (typeof data.fecha === 'number') {
                            fechaFormateada = new Date(data.fecha).toLocaleDateString('es-ES', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            });
                        }
                        // Para cualquier otro caso, usar el valor como string
                        else {
                            fechaFormateada = String(data.fecha);
                        }
                    }

                    // Asegurarse de que hay un array de imágenes
                    let imagenes = [];

                    if (data.imagenes && Array.isArray(data.imagenes)) {
                        imagenes = data.imagenes;
                    } else if (data.imagen) {
                        imagenes = [data.imagen];
                    }

                    setActividad({
                        ...data,
                        fecha: fechaFormateada,
                        imagenes: imagenes
                    });
                } else {
                    setError("No se encontró la actividad");
                }
            } catch (error) {
                console.error("Error fetching actividad:", error);
                setError("Error al cargar la actividad: " + error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchActividad();
    }, [id]);

    // Formatear la descripción con infoboxes si hay ciertos patrones
    const formatDescription = (html) => {
        if (!html) return '';
        
        // Detectar patrones que podrían ser consejos o información importante
        // y reemplazarlos con cajas de información visualmente distintas
        const withInfoBoxes = html
            .replace(
                /<p>⚠️ (.*?)<\/p>/g,
                `<div class="${styles.infoBox}" style="border-color: #FFA726;">
                    <div class="${styles.infoBoxHeader}"><span class="${styles.infoBoxIcon}">⚠️</span> Importante</div>
                    <p>$1</p>
                </div>`
            )
            .replace(
                /<p>💡 (.*?)<\/p>/g,
                `<div class="${styles.infoBox}">
                    <div class="${styles.infoBoxHeader}"><span class="${styles.infoBoxIcon}">💡</span> Consejo</div>
                    <p>$1</p>
                </div>`
            );
        
        return withInfoBoxes;
    };

    if (isLoading) return <LoadingScreen />;

    if (error) return (
        <>
            <Navbar />
            <div className={styles.errorContainer}>
                <h2>Error</h2>
                <p>{error}</p>
                <Link to="/actividades" className={styles.backButton}>
                    Volver a Actividades
                </Link>
            </div>
            <Footer />
        </>
    );

    if (!actividad) return (
        <>
            <Navbar />
            <div className={styles.errorContainer}>
                <h2>Actividad no encontrada</h2>
                <Link to="/actividades" className={styles.backButton}>
                    Volver a Actividades
                </Link>
            </div>
            <Footer />
        </>
    );

    return (
        <>
            <Navbar />
            <div className={styles.actividadDetallePage}>
                <div className={styles.detalleGuion}>
                    <Link to="/">Inicio</Link>
                    <span>/</span>
                    <Link to="/actividades">Actividades</Link>
                    <span>/</span>
                    <span>{actividad.titulo}</span>
                </div>

                <div className={styles.actividadHeader}>
                    <div className={styles.actividadTitleSection}>
                        <p className={styles.fecha}>
                            <FaCalendarAlt className={styles.actividadIcon} />
                            {actividad.fecha}
                        </p>
                        <h1>{actividad.titulo}</h1>
                    </div>
                    <div className={styles.actividadImageSection}>
                        <ImageGallery images={actividad.imagenes} />
                    </div>
                </div>

                <div className={styles.actividadContent}>
                    <div className={styles.actividadDescripcion}>
                        <div dangerouslySetInnerHTML={{ __html: formatDescription(actividad.descripcion) }} />
                    </div>

                    <div className={styles.actividadDetalles}>
                        <div className={styles.detallesContainer}>
                            <div className={styles.detallesTitulo}>
                                <FaRegClipboard /> Detalles del Evento
                            </div>
                            <div className={styles.detallesBody}>
                                <div className={styles.detalleSeccion}>
                                    <h3>
                                        <FaClock className={styles.detalleIcon} /> 
                                        ¿Cuándo?
                                    </h3>
                                    <p className={styles.fechaDetalle}>{actividad.fecha}</p>
                                    {actividad.horario && <p>{actividad.horario}</p>}
                                </div>

                                <div className={styles.detalleSeccion}>
                                    <h3>
                                        <FaMapMarkerAlt className={styles.detalleIcon} /> 
                                        ¿Dónde?
                                    </h3>
                                    <p>{actividad.lugar || "Colegio GAEP"}</p>
                                </div>

                                <div className={styles.detalleSeccion}>
                                    <h3>
                                        <FaUserAlt className={styles.detalleIcon} /> 
                                        Organizador
                                    </h3>
                                    <p>{actividad.organizador || "Administración GAEP"}</p>
                                </div>

                                {actividad.adicionales && (
                                    <div className={styles.accionesActividad}>
                                        <a 
                                            href={actividad.adicionales} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className={styles.accionBoton}
                                        >
                                            Ver información adicional <FaExternalLinkAlt />
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ActividadDetalle;