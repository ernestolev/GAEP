import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link, useNavigate } from 'react-router-dom';
import './JuntaDirectiva.modules.css';
import Navbar2 from '../../components/Navbar/Navbar2';
import Footer from '../../components/Footer/Footer';

const JuntaDirectiva = () => {
    const [miembros, setMiembros] = useState([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMiembros = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'junta-directiva'));
                const miembrosData = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                }));
                setMiembros(miembrosData);
            } catch (error) {
                console.error("Error fetching miembros:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMiembros();
    }, []);

    return (
        <>
            <Navbar2 />
            <div className="actividades-page">
                <div className="header-sticky">
                    <div className="breadcrumb-actividades">
                        <Link to="/">Inicio</Link>
                        <span>/</span>
                        <span>Junta Directiva</span>
                    </div>
                    <h1>Junta Directiva</h1>
                </div>
                <div className="actividades-list">
                    {miembros.map((miembro) => (
                        <div
                            key={miembro.id}
                            className="actividad-item"
                            onClick={() => navigate(`/junta-directiva/${miembro.id}`)}
                        >
                            <div
                                className="actividad-imagen"
                                style={{ backgroundImage: `url(${miembro.img1})` }}
                            ></div>
                            <div className="actividad-info">
                                <h3>{miembro.nombre} {miembro.apellidos}</h3>
                                <p className="cargo">{miembro.cargo}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default JuntaDirectiva;