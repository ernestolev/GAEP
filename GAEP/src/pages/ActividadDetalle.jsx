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
    FaRegClipboard,
    FaCheckCircle,
    FaBroadcastTower
} from 'react-icons/fa';

const ActividadDetalle = () => {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [actividad, setActividad] = useState(null);
    const [error, setError] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    
    // Actualizar la hora actual cada minuto para verificar estado "en vivo"
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Cada minuto
        
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchActividad = async () => {
            try {
                const docRef = doc(db, 'actividades', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    console.log("Datos originales de la actividad:", data);

                    // Verificar y formatear la fecha de manera segura
                    let fechaFormateada = "Fecha no disponible";
                    let fechaObj = null;

                    // Preferir fechaTexto si existe (es más confiable)
                    if (data.fechaTexto) {
                        try {
                            const [year, month, day] = data.fechaTexto.split('-').map(Number);
                            fechaObj = new Date(year, month - 1, day);

                            fechaFormateada = new Intl.DateTimeFormat('es-ES', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            }).format(fechaObj);

                            console.log(`Usando fechaTexto: ${data.fechaTexto}, convertida a: ${fechaFormateada}`);
                        } catch (e) {
                            console.error("Error al procesar fechaTexto:", e);
                        }
                    }
                    // Si no hay fechaTexto, intentar con fecha
                    else if (data.fecha) {
                        console.log("Tipo de fecha:", typeof data.fecha, data.fecha);

                        // Verificar si es un Timestamp de Firestore
                        if (data.fecha instanceof Timestamp ||
                            (data.fecha.seconds !== undefined && data.fecha.nanoseconds !== undefined)) {
                            fechaObj = data.fecha.toDate();
                            fechaFormateada = new Intl.DateTimeFormat('es-ES', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            }).format(fechaObj);

                            console.log(`Fecha convertida desde Timestamp: ${fechaFormateada}`);
                        }
                        // Si es una fecha como cadena ISO YYYY-MM-DD
                        else if (typeof data.fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data.fecha)) {
                            try {
                                const [year, month, day] = data.fecha.split('-').map(Number);
                                fechaObj = new Date(year, month - 1, day);

                                fechaFormateada = new Intl.DateTimeFormat('es-ES', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }).format(fechaObj);

                                console.log(`Fecha convertida desde string ISO: ${fechaFormateada}`);
                            } catch (e) {
                                console.error("Error al procesar fecha ISO:", e);
                                fechaFormateada = data.fecha; // Usar el string tal cual
                            }
                        }
                        // Si es otro tipo de string
                        else if (typeof data.fecha === 'string') {
                            try {
                                const timestamp = Date.parse(data.fecha);
                                if (!isNaN(timestamp)) {
                                    const tempDate = new Date(timestamp);
                                    fechaObj = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate());
                                    fechaFormateada = new Intl.DateTimeFormat('es-ES', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    }).format(fechaObj);

                                    console.log(`Fecha convertida desde string general: ${fechaFormateada}`);
                                } else {
                                    fechaFormateada = data.fecha; // Usar el string tal cual
                                    console.log(`No se pudo parsear la fecha, usando original: ${fechaFormateada}`);
                                }
                            } catch (e) {
                                console.error("No se pudo convertir la fecha de string:", e);
                                fechaFormateada = data.fecha; // Usar el string tal cual
                            }
                        }
                        // Si es un número (timestamp en milisegundos)
                        else if (typeof data.fecha === 'number') {
                            const tempDate = new Date(data.fecha);
                            fechaObj = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate());
                            fechaFormateada = new Intl.DateTimeFormat('es-ES', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            }).format(fechaObj);

                            console.log(`Fecha convertida desde número: ${fechaFormateada}`);
                        }
                        // Para cualquier otro caso, usar el valor como string
                        else {
                            fechaFormateada = String(data.fecha);
                            console.log(`Usando fecha como string: ${fechaFormateada}`);
                        }
                    }

                    // Asegurarse de que hay un array de imágenes
                    let imagenes = [];

                    if (data.imagenes && Array.isArray(data.imagenes)) {
                        imagenes = data.imagenes;
                    } else if (data.imagen) {
                        imagenes = [data.imagen];
                    }

                    // Determinar el estado de la actividad (en vivo o realizada)
                    const hoy = new Date();
                    const hoyNormalizada = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
                    
                    let enVivo = false;
                    let realizada = false;
                    
                    // Verificar si la actividad está en curso (hoy y dentro del horario)
                    if (fechaObj && 
                        fechaObj.getDate() === hoy.getDate() && 
                        fechaObj.getMonth() === hoy.getMonth() && 
                        fechaObj.getFullYear() === hoy.getFullYear()) {
                        
                        // Extraer horario de inicio y fin si existen
                        let horaInicio = null;
                        let horaFin = null;
                        
                        if (data.horarioInicio) {
                            try {
                                const [hora, minutos] = data.horarioInicio.split(':').map(Number);
                                horaInicio = { hora, minutos };
                            } catch (e) {
                                console.error("Error procesando horarioInicio:", e);
                            }
                        }
                        
                        if (data.horarioFin) {
                            try {
                                const [hora, minutos] = data.horarioFin.split(':').map(Number);
                                horaFin = { hora, minutos };
                            } catch (e) {
                                console.error("Error procesando horarioFin:", e);
                            }
                        }
                        
                        if (horaInicio && horaFin) {
                            // Si tenemos hora inicio y fin, verificar si estamos en ese rango
                            const horaActual = hoy.getHours();
                            const minutosActuales = hoy.getMinutes();
                            
                            const inicioMinutos = horaInicio.hora * 60 + horaInicio.minutos;
                            const finMinutos = horaFin.hora * 60 + horaFin.minutos;
                            const actualMinutos = horaActual * 60 + minutosActuales;
                            
                            enVivo = (actualMinutos >= inicioMinutos && actualMinutos <= finMinutos);
                        } else if (horaInicio) {
                            // Si solo tenemos hora de inicio, asumimos que dura 2 horas por defecto
                            const horaActual = hoy.getHours();
                            const minutosActuales = hoy.getMinutes();
                            
                            const inicioMinutos = horaInicio.hora * 60 + horaInicio.minutos;
                            const finMinutos = inicioMinutos + 120; // 2 horas por defecto
                            const actualMinutos = horaActual * 60 + minutosActuales;
                            
                            enVivo = (actualMinutos >= inicioMinutos && actualMinutos <= finMinutos);
                        } else {
                            // Si no tenemos horario, asumimos que está en vivo todo el día
                            enVivo = true;
                        }
                    }
                    
                    // Una actividad está realizada si es anterior a hoy (y no está en vivo)
                    realizada = !enVivo && fechaObj && !isNaN(fechaObj.getTime()) && fechaObj < hoyNormalizada;
                    
                    console.log(`Estado de la actividad: En vivo: ${enVivo}, Realizada: ${realizada}`);

                    setActividad({
                        ...data,
                        fecha: fechaFormateada,
                        imagenes: imagenes,
                        horario: formatarHorario(data.horarioInicio, data.horarioFin),
                        enVivo: enVivo,
                        realizada: realizada
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
    }, [id, currentTime]);

    // Función auxiliar para formatear el horario
    const formatarHorario = (inicio, fin) => {
        if (!inicio) return '';

        let horarioStr = `${inicio}`;
        if (fin) {
            horarioStr += ` a ${fin}`;
        }

        return horarioStr;
    };

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
                        <div className={styles.fechaContainer}>
                            <p className={styles.fecha}>
                                <FaCalendarAlt className={styles.actividadIcon} />
                                {actividad.fecha}
                            </p>
                            
                            {/* Estado de la actividad */}
                            {actividad.enVivo && (
                                <div className={styles.estadoActividad + ' ' + styles.enVivo}>
                                    <div className={styles.livestreamBar}>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                    <FaBroadcastTower className={styles.estadoIcon} />
                                    EN VIVO
                                </div>
                            )}
                            
                            {actividad.realizada && (
                                <div className={styles.estadoActividad + ' ' + styles.realizada}>
                                    <FaCheckCircle className={styles.estadoIcon} />
                                    REALIZADO
                                </div>
                            )}
                        </div>
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
                                
                                {/* Mostrar estado de la actividad en la sección de detalles */}
                                {(actividad.enVivo || actividad.realizada) && (
                                    <div className={styles.estadoActividadDetalle}>
                                        {actividad.enVivo ? (
                                            <>
                                                <span className={styles.estadoDot + ' ' + styles.enVivoDot}></span>
                                                En vivo ahora
                                            </>
                                        ) : (
                                            <>
                                                <span className={styles.estadoDot + ' ' + styles.realizadoDot}></span>
                                                Evento realizado
                                            </>
                                        )}
                                    </div>
                                )}
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