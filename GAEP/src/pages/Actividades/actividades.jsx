import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link, useNavigate } from 'react-router-dom';
import '../Actividades/actividades.modules.css';
import Navbar from '../../components/Navbar/Navbar2';
import Footer from '../../components/Footer/Footer';
import calendar from '../../assets/icons/icon-calendar.png';

const Actividades = () => {
    const [actividades, setActividades] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchActividades = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'actividades'));
                const actividadesData = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                    fecha: doc.data().fecha.toDate(),
                    fechaFormateada: doc.data().fecha.toDate().toLocaleDateString()
                }));

                // Sort by date
                const sortedActividades = actividadesData.sort((a, b) => a.fecha - b.fecha);

                // Update fecha to display format after sorting
                const formattedActividades = sortedActividades.map(act => ({
                    ...act,
                    fecha: act.fechaFormateada
                }));

                setActividades(formattedActividades);
            } catch (error) {
                console.error("Error fetching actividades:", error);
            }
        };

        fetchActividades();
    }, []);

    return (
        <>
            <Navbar />
            <div className="actividades-page">
                <div className="header-sticky">
                    <div className="breadcrumb-actividades">
                        <Link to="/">Inicio</Link>
                        <span>/</span>
                        <span>Actividades</span>
                    </div>
                    <h1>Próximas Actividades</h1>
                </div>
                <div className="actividades-list">
                    {actividades.map((actividad) => (
                        <div
                            key={actividad.id}
                            className="actividad-item"
                            onClick={() => navigate(`/actividades/${actividad.id}`)}
                        >                            <div
                            className="actividad-imagen"
                            style={{ backgroundImage: `url(${actividad.imagen})` }}
                        ></div>
                            <div className="actividad-info">
                                <h3>{actividad.titulo}</h3>
                                <p className="fecha"><img className='actividad-icon' src={calendar} alt="" /> {actividad.fecha}</p>
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