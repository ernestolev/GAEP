import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import styles from '../Styles/JuntaDirectiva.module.css';
import Navbar2 from '../components/Navbar2';
import Footer from '../components/Footer';
import { LoadingScreen } from '../components/LoadingScreen';
import { FaHome, FaUsers, FaEye, FaGraduationCap, FaEnvelope, FaPhone, FaTimes } from 'react-icons/fa';

const JuntaDirectiva = () => {
    const [miembros, setMiembros] = useState(null);
    const [selectedMiembro, setSelectedMiembro] = useState(null);
    const [showModal, setShowModal] = useState(false);
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

    const handleOpenModal = (miembro) => {
        setSelectedMiembro(miembro);
        setShowModal(true);
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    };

    const handleCloseModal = () => {
        setShowModal(false);
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    };

    if (isLoading) return <LoadingScreen />;

    if (!miembros || miembros.length === 0) {
        return (
            <>
                <Navbar2 />
                <div className={styles["jd-page"]}>
                    <div className={styles["header-sticky"]}>
                        <div className={styles["jdbreadcrumb"]}>
                            <Link to="/"><FaHome className={styles["icon-breadcrumb"]} /> Inicio</Link>
                            <span>/</span>
                            <span><FaUsers className={styles["icon-breadcrumb"]} /> Junta Directiva</span>
                        </div>
                        <h1>Junta Directiva</h1>
                    </div>
                    <div className={styles["no-miembros"]}>
                        <p>No hay información disponible sobre los miembros de la junta directiva en este momento.</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar2 />
            <div className={styles["jd-page"]}>
                <div className={styles["header-sticky"]}>
                    <div className={styles["jdbreadcrumb"]}>
                        <Link to="/">Inicio</Link>
                        <span>/</span>
                        <span>Junta Directiva</span>
                    </div>
                    <h1>Junta Directiva</h1>
                </div>
                <div className={styles["jd-list"]}>
                    {miembros.map((miembro, index) => (
                        <div
                            key={miembro.id}
                            className={styles["jd-item"]}
                            onClick={() => handleOpenModal(miembro)}
                        >
                            <div className={styles["jd-content"]}>
                                <div
                                    className={styles["jd-imagen"]}
                                    style={{ backgroundImage: `url(${miembro.img1})` }}
                                ></div>
                                <div className={styles["jd-info"]}>
                                    <h3>{miembro.nombre} {miembro.apellidos}</h3>
                                    <p className={styles["cargo"]}>{miembro.cargo}</p>
                                </div>
                                <div className={styles["jd-overlay"]}></div>
                                <div className={styles["view-profile"]}>
                                    <FaEye className={styles["view-icon"]} /> Ver perfil
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {showModal && selectedMiembro && (
                    <div className={styles["popjd"]} onClick={handleCloseModal}>
                        <div className={styles["jdmodal"]} onClick={e => e.stopPropagation()}>
                            <button className={styles["closebtn"]} onClick={handleCloseModal}>
                                <FaTimes />
                            </button>
                            <div className={styles["jdmbody"]}>
                                <div className={styles["modal-foto"]}>
                                    <div 
                                        className={styles["foto-container"]} 
                                        style={{ backgroundImage: `url(${selectedMiembro.img1})` }}
                                    ></div>
                                    <div className={styles["modal-cargo-badge"]}>
                                        {selectedMiembro.cargo}
                                    </div>
                                </div>
                                <div className={styles["jdminfo"]}>
                                    <h2>{selectedMiembro.nombre} {selectedMiembro.apellidos}</h2>
                                    <div className={styles["info-details"]}>
                                        {selectedMiembro.prom && (
                                            <div className={styles["detail-item"]}>
                                                <div className={styles["detail-icon"]}>
                                                    <FaGraduationCap />
                                                </div>
                                                <p><strong>Promoción:</strong> {selectedMiembro.prom}</p>
                                            </div>
                                        )}
                                        {selectedMiembro.email && (
                                            <div className={styles["detail-item"]}>
                                                <div className={styles["detail-icon"]}>
                                                    <FaEnvelope />
                                                </div>
                                                <p><strong>Email:</strong> {selectedMiembro.email}</p>
                                            </div>
                                        )}
                                        {selectedMiembro.telf && (
                                            <div className={styles["detail-item"]}>
                                                <div className={styles["detail-icon"]}>
                                                    <FaPhone />
                                                </div>
                                                <p><strong>Teléfono:</strong> {selectedMiembro.telf}</p>
                                            </div>
                                        )}
                                        
                                        <div className={styles["biografia"]}>
                                            <h3>Biografía</h3>
                                            <div
                                                className={styles["bio-content"]}
                                                dangerouslySetInnerHTML={{ __html: selectedMiembro.bio }}
                                            />
                                        </div>
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

export default JuntaDirectiva;