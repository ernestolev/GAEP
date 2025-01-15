import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import ImageGallery from '../../components/ImageGallery/ImageGallery';

import { LoadingScreen } from '../../components/LoadingScreen/LoadingScreen';

import './ActividadDetalle.modules.css';
import Navbar from '../../components/Navbar/Navbar2';
import Footer from '../../components/Footer/Footer';
import calendar from '../../assets/icons/icon-calendar.png';

const ActividadDetalle = () => {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [actividad, setActividad] = useState(null);

    useEffect(() => {
        const fetchActividad = async () => {
            try {
                const docRef = doc(db, 'actividades', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setActividad({
                        ...data,
                        fecha: data.fecha.toDate().toLocaleDateString()
                    });
                }
            } catch (error) {
                console.error("Error fetching actividad:", error);
            }
        };

        fetchActividad();
    }, [id]);

    if (!actividad) return <LoadingScreen />;

    return (
        <>
            <Navbar />
            <div className="actividad-detalle-page">
                <div className="detalleguion">
                    <Link to="/">Inicio</Link>
                    <span>/</span>
                    <Link to="/actividades">Actividades</Link>
                    <span>/</span>
                    <span>{actividad.titulo}</span>
                </div>
                <div className="actividad-header">
                    <div className="actividad-title-section">
                        <p className="fecha">
                            <img src={calendar} alt="" className="actividad-icon" />
                            {actividad.fecha}
                        </p>
                        <h1>{actividad.titulo}</h1>
                    </div>
                    <div className="actividad-image-section">
                        <ImageGallery images={actividad.imagenes || [actividad.imagen]} />
                    </div>
                </div>
                <div className="actividad-content">
                    <div className="actividad-descripcion">
                        <div dangerouslySetInnerHTML={{ __html: actividad.descripcion }} />
                    </div>
                    <div className="actividad-detalles">
                        <div className='detalles-container'>
                            <div className="detalle-seccion">
                                <h3>¿Cuándo?</h3>
                                <p>{actividad.fecha}</p>
                                <p>{actividad.horario}</p>
                            </div>
                            <div className="detalle-seccion">
                                <h3>¿Dónde?</h3>
                                <p>{actividad.lugar}</p>
                            </div>
                            <div className="detalle-seccion">
                                <h3>Organizador</h3>
                                <p>{actividad.organizador}</p>
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