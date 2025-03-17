import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../Styles/Actividades.module.css';
import Navbar from '../components/Navbar2';
import Footer from '../components/Footer';
import calendar from '../assets/icons/icon-calendar.png';
import { LoadingScreen } from '../components/LoadingScreen';
import { FaCheckCircle } from 'react-icons/fa';

const Actividades = () => {
    const [actividades, setActividades] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    
    // Estado para actualizar el estado "en vivo" cada minuto
    const [currentTime, setCurrentTime] = useState(new Date());

    // Efecto para actualizar la hora actual cada minuto
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // cada minuto
        
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchActividades = async () => {
            try {
                console.log("Iniciando fetchActividades...");
                const querySnapshot = await getDocs(collection(db, 'actividades'));
                const actividadesData = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    let fechaObj = null;
                    let fechaFormateada = '';

                    console.log(`\n--- Procesando actividad: ${doc.id} - ${data.titulo} ---`);

                    // Determinar fechaObj basado en los datos disponibles
                    // 1. Prioridad: fechaTexto (formato YYYY-MM-DD)
                    if (data.fechaTexto && typeof data.fechaTexto === 'string') {
                        try {
                            const [year, month, day] = data.fechaTexto.split('-').map(Number);
                            fechaObj = new Date(year, month - 1, day);
                            console.log(`Usando fechaTexto: ${data.fechaTexto} -> fecha objeto: ${fechaObj.toDateString()}`);
                        } catch (e) {
                            console.error("Error procesando fechaTexto:", e);
                        }
                    }
                    // 2. Si no hay fechaTexto, intentar con fecha
                    else if (data.fecha) {
                        // 2.1 Si es un timestamp de Firestore
                        if (data.fecha.toDate && typeof data.fecha.toDate === 'function') {
                            try {
                                const tempDate = data.fecha.toDate();
                                fechaObj = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate());
                                console.log(`Usando Timestamp: ${tempDate.toISOString()} -> fecha objeto: ${fechaObj.toDateString()}`);
                            } catch (e) {
                                console.error("Error procesando Timestamp:", e);
                            }
                        }
                        // 2.2 Si es una cadena en formato YYYY-MM-DD
                        else if (typeof data.fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data.fecha)) {
                            try {
                                const [year, month, day] = data.fecha.split('-').map(Number);
                                fechaObj = new Date(year, month - 1, day);
                                console.log(`Usando fecha ISO: ${data.fecha} -> fecha objeto: ${fechaObj.toDateString()}`);
                            } catch (e) {
                                console.error("Error procesando fecha ISO:", e);
                            }
                        }
                        // 2.3 Otros formatos de fecha
                        else {
                            try {
                                const timestamp = Date.parse(data.fecha);
                                if (!isNaN(timestamp)) {
                                    const tempDate = new Date(timestamp);
                                    fechaObj = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate());
                                    console.log(`Usando fecha string general: ${data.fecha} -> fecha objeto: ${fechaObj.toDateString()}`);
                                }
                            } catch (e) {
                                console.error("Error procesando fecha string:", e);
                            }
                        }
                    }

                    // Formatear la fecha para mostrar
                    if (fechaObj && !isNaN(fechaObj.getTime())) {
                        fechaFormateada = new Intl.DateTimeFormat('es-ES', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        }).format(fechaObj);
                    } else {
                        fechaFormateada = data.fecha || data.fechaTexto || 'Fecha no disponible';
                        console.log(`No se pudo crear un objeto fecha válido. Usando texto: ${fechaFormateada}`);
                    }

                    // Determinar si la actividad ya se realizó o está en vivo
                    const hoy = new Date();
                    const hoyNormalizada = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
                    
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
                    
                    // Verificar si la actividad está en curso (hoy y dentro del horario)
                    let enVivo = false;
                    
                    if (fechaObj && 
                        fechaObj.getDate() === hoy.getDate() && 
                        fechaObj.getMonth() === hoy.getMonth() && 
                        fechaObj.getFullYear() === hoy.getFullYear()) {
                        
                        if (horaInicio && horaFin) {
                            // Si tenemos hora inicio y fin, verificar si estamos en ese rango
                            const horaActual = hoy.getHours();
                            const minutosActuales = hoy.getMinutes();
                            
                            const inicioMinutos = horaInicio.hora * 60 + horaInicio.minutos;
                            const finMinutos = horaFin.hora * 60 + horaFin.minutos;
                            const actualMinutos = horaActual * 60 + minutosActuales;
                            
                            enVivo = (actualMinutos >= inicioMinutos && actualMinutos <= finMinutos);
                            console.log(`Actividad: ${data.titulo} - Hora actual: ${horaActual}:${minutosActuales} - Rango: ${horaInicio.hora}:${horaInicio.minutos} a ${horaFin.hora}:${horaFin.minutos} - En vivo: ${enVivo}`);
                        } else if (horaInicio) {
                            // Si solo tenemos hora de inicio, asumimos que dura 2 horas por defecto
                            const horaActual = hoy.getHours();
                            const minutosActuales = hoy.getMinutes();
                            
                            const inicioMinutos = horaInicio.hora * 60 + horaInicio.minutos;
                            const finMinutos = inicioMinutos + 120; // 2 horas por defecto
                            const actualMinutos = horaActual * 60 + minutosActuales;
                            
                            enVivo = (actualMinutos >= inicioMinutos && actualMinutos <= finMinutos);
                            console.log(`Actividad: ${data.titulo} - Solo hora inicio - En vivo: ${enVivo}`);
                        } else {
                            // Si no tenemos horario, asumimos que está en vivo todo el día
                            enVivo = true;
                            console.log(`Actividad: ${data.titulo} - Sin horario - En vivo: ${enVivo} (todo el día)`);
                        }
                    }
                    
                    // Una actividad está realizada si tenemos fecha válida y es anterior a hoy
                    // No consideramos realizada si está en vivo
                    const esRealizada = !enVivo && fechaObj && !isNaN(fechaObj.getTime()) && fechaObj < hoyNormalizada;

                    console.log(`Fecha de hoy (normalizada): ${hoyNormalizada.toDateString()}`);
                    console.log(`¿Actividad realizada?: ${esRealizada}, ¿En vivo?: ${enVivo}`);

                    return {
                        ...data,
                        id: doc.id,
                        fechaObjeto: fechaObj, // Para ordenar
                        fecha: fechaFormateada, // Para mostrar
                        realizada: esRealizada, // Para aplicar estilos de realizado
                        enVivo: enVivo, // Para aplicar estilos de en vivo
                        horaInicio: data.horarioInicio || '',
                        horaFin: data.horarioFin || ''
                    };
                });

                // Separar actividades con y sin fechas válidas
                const actividadesConFecha = actividadesData.filter(act => act.fechaObjeto && !isNaN(act.fechaObjeto.getTime()));
                const actividadesSinFecha = actividadesData.filter(act => !act.fechaObjeto || isNaN(act.fechaObjeto.getTime()));

                console.log(`Total actividades: ${actividadesData.length}`);
                console.log(`Con fecha válida: ${actividadesConFecha.length}`);
                console.log(`Sin fecha válida: ${actividadesSinFecha.length}`);

                // Ordenar actividades: primero en vivo, luego próximas, finalmente realizadas
                const actividadesOrdenadas = actividadesConFecha.sort((a, b) => {
                    // En vivo primero
                    if (a.enVivo && !b.enVivo) return -1;
                    if (!a.enVivo && b.enVivo) return 1;
                    
                    // Luego por estado (no realizadas antes que realizadas)
                    if (a.realizada && !b.realizada) return 1;
                    if (!a.realizada && b.realizada) return -1;
                    
                    // Si ambas están en el mismo estado, ordenar por fecha
                    if (!a.realizada && !b.realizada) {
                        return a.fechaObjeto - b.fechaObjeto; // Próximas: más cercanas primero
                    } else {
                        return b.fechaObjeto - a.fechaObjeto; // Pasadas: más recientes primero
                    }
                });

                // Combinar actividades ordenadas con las que no tienen fecha
                const todasOrdenadas = [...actividadesOrdenadas, ...actividadesSinFecha];
                setActividades(todasOrdenadas);
            } catch (error) {
                console.error("Error obteniendo actividades:", error);
                setActividades([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchActividades();
    }, [currentTime]); // Dependencia de currentTime para actualizar el estado "en vivo"

    if (isLoading) return <LoadingScreen />;

    if (!actividades || actividades.length === 0) {
        return (
            <>
                <Navbar />
                <div className={styles["act-page"]}>
                    <div className={styles["header-sticky"]}>
                        <div className={styles["breadcrumb-actividades"]}>
                            <Link to="/">Inicio</Link>
                            <span>/</span>
                            <span>Actividades</span>
                        </div>
                        <h1>Próximas Actividades</h1>
                    </div>
                    <div className={styles["no-actividades"]}>
                        <p>No hay actividades disponibles en este momento.</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className={styles["act-page"]}>
                <div className={styles["header-sticky"]}>
                    <div className={styles["breadcrumb-actividades"]}>
                        <Link to="/">Inicio</Link>
                        <span>/</span>
                        <span>Actividades</span>
                    </div>
                    <h1>Actividades</h1>
                </div>

                {/* Sección de actividades */}
                <div className={styles["act-list"]}>
                    {actividades.map((actividad) => (
                        <div
                            key={actividad.id}
                            className={`${styles["act-item"]} ${actividad.realizada ? styles["act-realizada"] : ""} ${actividad.enVivo ? styles["act-envivo"] : ""}`}
                            onClick={() => navigate(`/actividades/${actividad.id}`)}
                        >
                            <div
                                className={styles["act-imagen"]}
                                style={{
                                    backgroundImage: `url(${(actividad.imagenes && actividad.imagenes.length > 0)
                                            ? actividad.imagenes[0]
                                            : actividad.imagen || ''
                                        })`
                                }}
                            ></div>

                            {/* Badge de actividad "En vivo" */}
                            {actividad.enVivo && (
                                <div className={styles["envivo-badge"]}>
                                    <div className={styles["livestream-bar"]}>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                    EN VIVO
                                </div>
                            )}

                            {/* Badge de actividad realizada */}
                            {!actividad.enVivo && actividad.realizada && (
                                <div className={styles["realizada-badge"]}>
                                    <FaCheckCircle className={styles["check-icon"]} />
                                    <span>Realizado</span>
                                </div>
                            )}

                            <div className={styles["act-info"]}>
                                <h3>{actividad.titulo}</h3>
                                <p className={styles["fecha"]}>
                                    <img
                                        className={styles["actividad-icon"]}
                                        src={calendar}
                                        alt="Calendario"
                                    />
                                    {actividad.fecha}
                                    {actividad.horaInicio && `, ${actividad.horaInicio}`}
                                    {actividad.horaFin && ` - ${actividad.horaFin}`}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Actividades;