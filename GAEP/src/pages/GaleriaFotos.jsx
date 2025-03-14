import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import { LoadingScreen } from '../components/LoadingScreen';
import Navbar2 from '../components/Navbar2';
import Footer from '../components/Footer';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import styles from '../Styles/GaleriaFotos.module.css';

const GaleriaFotos = () => {
    const [galeriaFotos, setGaleriaFotos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGrupo, setSelectedGrupo] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGaleriaFotos = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'galeria-fotos-promociones'));
                const galeriaData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Group photos by promoción
                const groupedPhotos = galeriaData.reduce((acc, galeria) => {
                    const promocion = galeria['numero-promocion'];
                    if (!acc[promocion]) {
                        acc[promocion] = {
                            promocion,
                            imagenes: [...galeria.imagenes],
                            ids: [galeria.id]
                        };
                    } else {
                        acc[promocion].imagenes.push(...galeria.imagenes);
                        acc[promocion].ids.push(galeria.id);
                    }
                    return acc;
                }, {});

                // Convert to array and sort
                const sortedGroups = Object.values(groupedPhotos).sort((a, b) => 
                    b.promocion - a.promocion
                );

                setGaleriaFotos(sortedGroups);
            } catch (error) {
                console.error("Error fetching galería:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGaleriaFotos();
    }, []);

    const handleImageClick = (grupo, imageIndex) => {
        setSelectedGrupo(grupo);
        setSelectedImage(grupo.imagenes[imageIndex]);
        setCurrentImageIndex(imageIndex);
    };

    const handlePrevImage = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(prevIndex => {
                const newIndex = prevIndex - 1;
                setSelectedImage(selectedGrupo.imagenes[newIndex]);
                return newIndex;
            });
        }
    };

    const handleNextImage = () => {
        if (currentImageIndex < selectedGrupo.imagenes.length - 1) {
            setCurrentImageIndex(prevIndex => {
                const newIndex = prevIndex + 1;
                setSelectedImage(selectedGrupo.imagenes[newIndex]);
                return newIndex;
            });
        }
    };

    const closeImageViewer = () => {
        setSelectedImage(null);
        setCurrentImageIndex(0);
    };

    const closeGrupoViewer = () => {
        setSelectedGrupo(null);
        setSelectedImage(null);
        setCurrentImageIndex(0);
    };

    if (loading) return <LoadingScreen />;

    return (
        <>
            <Navbar2 />
            <div className={styles.galeriaFotosPage}>
                <div className={styles.breadcrumb}>
                    <Link to="/">Inicio</Link>
                    <span>/</span>
                    <span>Galería de Fotos</span>
                </div>

                <div className={styles.galeriaHeader}>
                    <h1>Galería de Fotos</h1>
                    <div className={styles.searchBar}>
                        <input
                            type="text"
                            placeholder="Buscar por año de promoción..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.galeriaGrid}>
                    {galeriaFotos
                        .filter(grupo => grupo.promocion.toString().includes(searchTerm))
                        .map((grupo) => (
                            <div key={grupo.promocion} className={styles.galeriaCard}>
                                <div className={styles.galeriaCardHeader}>
                                    <h3>Promoción {grupo.promocion}</h3>
                                    <span className={styles.fotoCount}>{grupo.imagenes.length} fotos</span>
                                </div>
                                <div 
                                    className={styles.galeriaPreview}
                                    onClick={() => setSelectedGrupo(grupo)}
                                >
                                    <img src={grupo.imagenes[0]} alt={`Promoción ${grupo.promocion}`} />
                                </div>
                            </div>
                        ))}
                </div>

                {/* Modal para ver grupo de fotos */}
                {selectedGrupo && (
                    <div className={styles.modalOverlay} onClick={closeGrupoViewer}>
                        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                            <button className={styles.closeButton} onClick={closeGrupoViewer}>
                                <FaTimes />
                            </button>
                            <h2>Promoción {selectedGrupo.promocion}</h2>
                            <div className={styles.modalGrid}>
                                {selectedGrupo.imagenes.map((imagen, index) => (
                                    <div 
                                        key={index} 
                                        className={styles.modalImageContainer}
                                        onClick={() => handleImageClick(selectedGrupo, index)}
                                    >
                                        <img src={imagen} alt={`Foto ${index + 1}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal para ver imagen individual */}
                {selectedImage && (
                    <div className={styles.imageViewerOverlay} onClick={closeImageViewer}>
                        <div className={styles.imageViewerContent} onClick={e => e.stopPropagation()}>
                            <button className={styles.closeButton} onClick={closeImageViewer}>
                                <FaTimes />
                            </button>
                            <button 
                                className={`${styles.navButton} ${styles.prev}`} 
                                onClick={handlePrevImage}
                                disabled={currentImageIndex === 0}
                            >
                                <FaChevronLeft />
                            </button>
                            <img src={selectedImage} alt="Foto ampliada" />
                            <button 
                                className={`${styles.navButton} ${styles.next}`} 
                                onClick={handleNextImage}
                                disabled={currentImageIndex === selectedGrupo.imagenes.length - 1}
                            >
                                <FaChevronRight />
                            </button>
                            <div className={styles.imageCounter}>
                                {currentImageIndex + 1} / {selectedGrupo.imagenes.length}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default GaleriaFotos;