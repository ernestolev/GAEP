import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';
import Navbar2 from '../../components/Navbar/Navbar2';
import Footer from '../../components/Footer/Footer';
import { LoadingScreen } from '../../components/LoadingScreen/LoadingScreen';
import './PresidentesPromociones.modules.css';

const PresidentesPromociones = () => {
    const [presidentes, setPresidentes] = useState(null);
    const [selectedPresidente, setSelectedPresidente] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPresidentes = async () => {
            try {
                const q = query(
                    collection(db, 'exalumnos'), 
                    where('presidenteprom', '==', true)
                );
                const querySnapshot = await getDocs(q);
                const presidentesData = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                }));
                // Ordenar por promoción
                presidentesData.sort((a, b) => b.promocion - a.promocion);
                setPresidentes(presidentesData);
            } catch (error) {
                console.error("Error fetching presidentes:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPresidentes();
    }, []);

    if (!presidentes) return <LoadingScreen />;

    return (
        <>
            <Navbar2 />
            <div className="jd-page">
                <div className="header-sticky">
                    <div className="jdbreadcrumb">
                        <Link to="/">Inicio</Link>
                        <span>/</span>
                        <span>Presidentes de Promociones</span>
                    </div>
                    <h1>Presidentes de Promociones</h1>
                </div>
                <div className="jd-list">
                    {presidentes.map((presidente) => (
                        <div
                            key={presidente.id}
                            className="jd-item"
                            onClick={() => {
                                setSelectedPresidente(presidente);
                                setShowModal(true);
                            }}
                        >
                            <div
                                className="jd-imagen"
                                style={{ backgroundImage: `url(${presidente.imagen || '/path/to/default/image.jpg'})` }}
                            ></div>
                            <div className="jd-info">
                                <h3>{presidente.nombre}</h3>
                                <p className="cargo">Promoción {presidente.promocion}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {showModal && selectedPresidente && (
                    <div className="popjd" onClick={() => setShowModal(false)}>
                        <div className="jdmodal" onClick={e => e.stopPropagation()}>
                            <button className="closebtn" onClick={() => setShowModal(false)}>×</button>
                            <div className="jdmbody">
                                <div className="modal-foto">
                                    <div 
                                        className="foto-container" 
                                        style={{ backgroundImage: `url(${selectedPresidente.imagen || '/path/to/default/image.jpg'})` }}
                                    ></div>
                                </div>
                                <div className="jdminfo">
                                    <h2>{selectedPresidente.nombre}</h2>
                                    <p className="cargo">Promoción {selectedPresidente.promocion}</p>
                                    <div className="info-details">
                                        <p><strong>Email:</strong> {selectedPresidente.email}</p>
                                        <p><strong>Teléfono:</strong> {selectedPresidente.telefono}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default PresidentesPromociones;