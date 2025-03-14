import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../Styles/SponsorsLista.module.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SponsorsLista = () => {
    const [sponsors, setSponsors] = useState([]);
    const [hoveredId, setHoveredId] = useState(null);
    const [selectedSponsor, setSelectedSponsor] = useState(null);

    useEffect(() => {
        const fetchSponsors = async () => {
            try {
                const sponsorsSnapshot = await getDocs(collection(db, 'sponsor'));
                const sponsorsData = sponsorsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setSponsors(sponsorsData);
            } catch (error) {
                console.error("Error fetching sponsors:", error);
            }
        };

        fetchSponsors();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };
    const closeModal = () => setSelectedSponsor(null);

    const Modal = ({ sponsor }) => {
        // Función para limpiar el HTML de la descripción
        const cleanHTML = (html) => {
            const doc = new DOMParser().parseFromString(html, 'text/html');
            return doc.body.textContent || "";
        };

        return (
            <motion.div
                className={styles.modalOverlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeModal}
            >
                <motion.div
                    className={styles.modalContent}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    onClick={e => e.stopPropagation()}
                >
                    <button className={styles.closeButton} onClick={closeModal}>×</button>
                    <div className={styles.modalHeader}>
                        <img
                            src={sponsor.logo}
                            alt={sponsor.razon_social}
                            className={styles.modalLogo}
                        />
                        <h2>{sponsor.razon_social}</h2>
                    </div>
                    <div className={styles.modalBody}>
                        {sponsor.descripcion && (
                            <div className={styles.modalSection}>
                                <h3>
                                    <i className="fas fa-info-circle"></i>
                                    Acerca de
                                </h3>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: sponsor.descripcion
                                    }}
                                />
                            </div>
                        )}
                        {sponsor.ubicacion && (
                            <div className={styles.modalSection}>
                                <h3>
                                    <i className="fas fa-map-marker-alt"></i>
                                    Ubicación
                                </h3>
                                <p>{sponsor.ubicacion}</p>
                            </div>
                        )}
                        {sponsor.telefono && (
                            <div className={styles.modalSection}>
                                <h3>
                                    <i className="fas fa-phone"></i>
                                    Teléfono
                                </h3>
                                <p>{sponsor.telefono}</p>
                            </div>
                        )}
                        {sponsor.email && (
                            <div className={styles.modalSection}>
                                <h3>
                                    <i className="fas fa-envelope"></i>
                                    Correo Electrónico
                                </h3>
                                <p>{sponsor.email}</p>
                            </div>
                        )}
                    </div>
                    {sponsor.enlace && (
                        <div className={styles.modalFooter}>
                            <a
                                href={sponsor.enlace}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.websiteButton}
                            >
                                Visitar Sitio Web
                            </a>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        );
    };

    return (
        <>
            <Navbar />
            <div className={styles.sponsorsPage}>
                <div className={styles.heroSection}>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Nuestros Patrocinadores
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Empresas que confían y apoyan nuestra misión
                    </motion.p>
                </div>

                <motion.div
                    className={styles.sponsorsGrid}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {sponsors.map((sponsor) => (
                        <motion.div
                            key={sponsor.id}
                            className={styles.sponsorCard}
                            variants={itemVariants}
                            whileHover={{
                                scale: 1.05,
                                transition: { duration: 0.2 }
                            }}
                            onHoverStart={() => setHoveredId(sponsor.id)}
                            onHoverEnd={() => setHoveredId(null)}
                            onClick={() => setSelectedSponsor(sponsor)}
                        >
                            <div className={styles.sponsorImageContainer}>
                                <img
                                    src={sponsor.logo}
                                    alt={sponsor.razon_social}
                                    className={styles.sponsorImage}
                                />
                            </div>
                            {hoveredId === sponsor.id && (
                                <motion.div
                                    className={styles.sponsorInfo}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <h3>{sponsor.razon_social}</h3>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            
            <AnimatePresence>
                {selectedSponsor && <Modal sponsor={selectedSponsor} />}
            </AnimatePresence>
            <Footer />
        </>
    );
};

export default SponsorsLista;