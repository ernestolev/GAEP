import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../Styles/Actividades.module.css';
import Navbar from '../components/Navbar2';
import Footer from '../components/Footer';
import calendar from '../assets/icons/icon-calendar.png';
import { LoadingScreen } from '../components/LoadingScreen';

const Actividades = () => {
    const [actividades, setActividades] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchActividades = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'actividades'));
                const actividadesData = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    let fechaObj = new Date(); // fecha por defecto
                    let fechaFormateada = '';
                    
                    // Manejar diferentes formatos de fecha
                    if (data.fecha) {
                        if (data.fecha.toDate && typeof data.fecha.toDate === 'function') {
                            // Si es un timestamp de Firestore
                            fechaObj = data.fecha.toDate();
                            fechaFormateada = fechaObj.toLocaleDateString();
                        } else if (data.fecha instanceof Date) {
                            // Si ya es un objeto Date
                            fechaObj = data.fecha;
                            fechaFormateada = fechaObj.toLocaleDateString();
                        } else if (typeof data.fecha === 'string') {
                            // Si es un string, intentar convertirlo a fecha
                            try {
                                fechaObj = new Date(data.fecha);
                                fechaFormateada = fechaObj.toLocaleDateString();
                            } catch (e) {
                                // Si no se puede convertir, usar el string directamente
                                fechaFormateada = data.fecha;
                            }
                        } else {
                            // Para cualquier otro caso, usar la fecha como string
                            fechaFormateada = String(data.fecha);
                        }
                    } else {
                        fechaFormateada = 'Fecha no disponible';
                    }

                    return {
                        ...data,
                        id: doc.id,
                        fecha: fechaObj, // Para ordenar
                        fechaFormateada: fechaFormateada // Para mostrar
                    };
                });

                // Filtrar actividades sin fecha válida
                const validActividades = actividadesData.filter(act => 
                    act.fecha && !isNaN(act.fecha.getTime())
                );

                // Ordenar por fecha (si es posible)
                let sortedActividades;
                if (validActividades.length > 0) {
                    sortedActividades = validActividades.sort((a, b) => a.fecha - b.fecha);
                } else {
                    // Si no hay fechas válidas, usar el array original
                    sortedActividades = actividadesData;
                }

                // Formatear las actividades para usarlas en la UI
                const formattedActividades = sortedActividades.map(act => ({
                    ...act,
                    fecha: act.fechaFormateada
                }));

                setActividades(formattedActividades);
                
            } catch (error) {
                console.error("Error fetching actividades:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchActividades();
    }, []);

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
                    <h1>Próximas Actividades</h1>
                </div>
                <div className={styles["act-list"]}>
                    {actividades.map((actividad) => (
                        <div
                            key={actividad.id}
                            className={styles["act-item"]}
                            onClick={() => navigate(`/actividades/${actividad.id}`)}
                        >
                            <div
                                className={styles["act-imagen"]}
                                style={{
                                    backgroundImage: `url(${
                                        (actividad.imagenes && actividad.imagenes.length > 0)
                                            ? actividad.imagenes[0]
                                            : actividad.imagen || ''
                                    })`
                                }}
                            ></div>
                            <div className={styles["act-info"]}>
                                <h3>{actividad.titulo}</h3>
                                <p className={styles["fecha"]}>
                                    <img 
                                        className={styles["actividad-icon"]} 
                                        src={calendar} 
                                        alt="Calendario" 
                                    /> {actividad.fecha}
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