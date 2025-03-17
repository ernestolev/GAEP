import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import Navbar2 from '../components/Navbar2';
import Footer from '../components/Footer';
import { LoadingScreen } from '../components/LoadingScreen';
import styles from '../Styles/PresidentesPromociones.module.css';
import defimg from '../assets/icons/icon-userdefault.png';

const PresidentesPromociones = () => {
    const [presidentes, setPresidentes] = useState(null);
    const [selectedPresidente, setSelectedPresidente] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

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

    const filteredPresidentes = presidentes?.filter(presidente =>
        presidente.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        presidente.promocion?.toString().includes(searchTerm)
    );

    if (isLoading) return <LoadingScreen />;

    return (
        <>
            <Navbar2 />
            <div className={styles.jdPage}>
                <div className={styles.headerSticky}>
                    <div className={styles.jdbreadcrumb}>
                        <Link to="/">Inicio</Link>
                        <span>/</span>
                        <span>Presidentes de Promociones</span>
                    </div>
                    <h1>Presidentes de Promociones</h1>

                </div>

                <p className={styles.subheading}>Conoce a los líderes que representaron a cada generación</p>

                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Buscar por nombre o promoción..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
                {filteredPresidentes?.length === 0 ? (
                    <div className={styles.noResults}>
                        <p>No se encontraron resultados para "{searchTerm}"</p>
                    </div>
                ) : (
                    <div className={styles.jdList}>
                        {filteredPresidentes?.map((presidente) => (
                            <div
                                key={presidente.id}
                                className={styles.jdItem}
                            >
                                <div
                                    className={styles.jdImagen}
                                    style={{ backgroundImage: `url(${presidente.imagen || defimg})` }}
                                >
                                    <div className={styles.promocionBadge}>
                                        {presidente.promocion}
                                    </div>
                                </div>
                                <div className={styles.jdInfo}>
                                    <h3>{presidente.nombre}</h3>
                                    <p className={styles.cargo}>Promoción {presidente.promocion}</p>
                                </div>
                                <button
                                    className={styles.verDetalles}
                                    onClick={() => {
                                        setSelectedPresidente(presidente);
                                        setShowModal(true);
                                    }}
                                >
                                    Ver detalles
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {showModal && selectedPresidente && (
                    <div className={styles.poppdp} onClick={() => setShowModal(false)}>
                        <div className={styles.jdmodal} onClick={e => e.stopPropagation()}>
                            <button className={styles.closebtn} onClick={() => setShowModal(false)}>×</button>
                            <div className={styles.jdmsbody}>
                                <div className={styles.modalFoto}>
                                    <div
                                        className={styles.fotoContainer}
                                        style={{ backgroundImage: `url(${selectedPresidente.imagen || defimg})` }}
                                    ></div>
                                    <div className={styles.promocionTag}>Promoción {selectedPresidente.promocion}</div>
                                </div>
                                <div className={styles.jdminfo}>
                                    <h2>{selectedPresidente.nombre}</h2>
                                    <div className={styles.infoDetails}>
                                        {selectedPresidente.email && (
                                            <div className={styles.contactItem}>
                                                <span className={styles.contactIcon}>✉️</span>
                                                <p>{selectedPresidente.email}</p>
                                            </div>
                                        )}
                                        {selectedPresidente.telefono && (
                                            <div className={styles.contactItem}>
                                                <span className={styles.contactIcon}>📱</span>
                                                <p>{selectedPresidente.telefono}</p>
                                            </div>
                                        )}
                                    </div>
                                    {selectedPresidente.bio && (
                                        <div className={styles.bioSection}>
                                            <h4>Biografía</h4>
                                            <p>{selectedPresidente.bio}</p>
                                        </div>
                                    )}
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