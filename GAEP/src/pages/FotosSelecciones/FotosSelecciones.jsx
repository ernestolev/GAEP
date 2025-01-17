import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';
import { LoadingScreen } from '../../components/LoadingScreen/LoadingScreen';
import Navbar2 from '../../components/Navbar/Navbar2';
import Footer from '../../components/Footer/Footer';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import './FotosSelecciones.modules.css';

const FotosSelecciones = () => {
    const [seleccionFotos, setSeleccionFotos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGrupo, setSelectedGrupo] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSeleccionFotos = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'fotos-seleccionesfutbol'));
                const fotosData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Group photos by year
                const groupedPhotos = fotosData.reduce((acc, foto) => {
                    const year = foto['year-seleccion'];
                    if (!acc[year]) {
                        acc[year] = {
                            year,
                            imagenes: [...foto.imagenes],
                            ids: [foto.id]
                        };
                    } else {
                        acc[year].imagenes.push(...foto.imagenes);
                        acc[year].ids.push(foto.id);
                    }
                    return acc;
                }, {});

                // Convert to array and sort
                const sortedGroups = Object.values(groupedPhotos).sort((a, b) => 
                    b.year - a.year
                );

                setSeleccionFotos(sortedGroups);
            } catch (error) {
                console.error("Error fetching selección fotos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSeleccionFotos();
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

    if (loading) return <LoadingScreen />;

    return (
        <>
            <Navbar2 />
            <div className="galeria-fotos-page">
                <div className="breadcrumb">
                    <Link to="/">Inicio</Link>
                    <span>/</span>
                    <span>Fotos de Selecciones</span>
                </div>

                <div className="galeria-header">
                    <h1>Galería de Fotos - Selecciones de Fútbol</h1>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Buscar por año de selección..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="galeria-grid">
                    {seleccionFotos
                        .filter(grupo => grupo.year.toString().includes(searchTerm))
                        .map((grupo) => (
                            <div key={grupo.year} className="galeria-card">
                                <div className="galeria-card-header">
                                    <h3>Selección {grupo.year}</h3>
                                    <span className="foto-count">{grupo.imagenes.length} fotos</span>
                                </div>
                                <div 
                                    className="galeria-preview"
                                    onClick={() => setSelectedGrupo(grupo)}
                                >
                                    <img src={grupo.imagenes[0]} alt={`Selección ${grupo.year}`} />
                                </div>
                            </div>
                        ))}
                </div>

                {/* Modal para ver grupo de fotos */}
                {selectedGrupo && (
                    <div className="modal-overlay" onClick={closeGrupoViewer}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <button className="close-button" onClick={closeGrupoViewer}>
                                <FaTimes />
                            </button>
                            <h2>Selección {selectedGrupo.year}</h2>
                            <div className="modal-grid">
                                {selectedGrupo.imagenes.map((imagen, index) => (
                                    <div 
                                        key={index} 
                                        className="modal-image-container"
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
                    <div className="image-viewer-overlay" onClick={closeImageViewer}>
                        <div className="image-viewer-content" onClick={e => e.stopPropagation()}>
                            <button className="close-button" onClick={closeImageViewer}>
                                <FaTimes />
                            </button>
                            <button 
                                className="nav-button prev" 
                                onClick={handlePrevImage}
                                disabled={currentImageIndex === 0}
                            >
                                <FaChevronLeft />
                            </button>
                            <img src={selectedImage} alt="Foto ampliada" />
                            <button 
                                className="nav-button next" 
                                onClick={handleNextImage}
                                disabled={currentImageIndex === selectedGrupo.imagenes.length - 1}
                            >
                                <FaChevronRight />
                            </button>
                            <div className="image-counter">
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

export default FotosSelecciones;