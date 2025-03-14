import React, { useState, useEffect, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes, FaExpand } from 'react-icons/fa';
import styles from '../Styles/ImageGallery.module.css';
import ReactDOM from 'react-dom';

const ImageGallery = ({ images = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [touchStart, setTouchStart] = useState(0);
    
    // Filtrar imágenes inválidas o vacías
    const validImages = images.filter(img => img && typeof img === 'string' && img.trim() !== '');
    
    // Si no hay imágenes válidas, mostrar una imagen por defecto
    const finalImages = validImages.length === 0 ? ['/img-placeholder.jpg'] : validImages;
    
    // Definir los handlers fuera del return para evitar recreaciones innecesarias
    const handleNext = useCallback(() => {
        setCurrentIndex(prevIndex => 
            prevIndex === finalImages.length - 1 ? 0 : prevIndex + 1
        );
    }, [finalImages.length]);
    
    const handlePrev = useCallback(() => {
        setCurrentIndex(prevIndex => 
            prevIndex === 0 ? finalImages.length - 1 : prevIndex - 1
        );
    }, [finalImages.length]);
    
    const toggleFullScreen = useCallback(() => {
        setIsFullScreen(prev => !prev);
        
        // Prevenir scroll cuando se abre pantalla completa
        if (!isFullScreen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isFullScreen]);
    
    const handleClose = useCallback(() => {
        setIsFullScreen(false);
        document.body.style.overflow = '';
    }, []);
    
    // Limpiar efectos CSS en el body cuando se desmonta el componente
    useEffect(() => {
        return () => {
            document.body.style.overflow = '';
        };
    }, []);
    
    const handleTouchStart = useCallback((e) => {
        setTouchStart(e.touches[0].clientX);
    }, []);
    
    const handleTouchMove = useCallback((e) => {
        if (!touchStart) return;
        
        const touchEnd = e.touches[0].clientX;
        const diff = touchStart - touchEnd;
        
        // Umbral de deslizamiento (swipe)
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                // Deslizar a la izquierda (siguiente)
                handleNext();
            } else {
                // Deslizar a la derecha (anterior)
                handlePrev();
            }
            setTouchStart(0);
        }
    }, [touchStart, handleNext, handlePrev]);
    
    const handleThumbnailClick = useCallback((index) => {
        setCurrentIndex(index);
    }, []);
    
    // Efecto para precargar imágenes
    useEffect(() => {
        let isMounted = true;
        
        const preloadImages = async () => {
            if (!isMounted) return;
            
            setIsLoading(true);
            try {
                await Promise.all(
                    finalImages.map(
                        (src) => 
                            new Promise((resolve, reject) => {
                                const img = new Image();
                                img.src = src;
                                img.onload = resolve;
                                img.onerror = reject;
                            })
                    )
                );
            } catch (error) {
                console.error('Error al precargar imágenes:', error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };
        
        preloadImages();
        
        // Cleanup function to prevent state updates after unmount
        return () => {
            isMounted = false;
        };
    }, [finalImages]);
    
    // Asegurarse de que currentIndex esté dentro de los límites cuando cambian las imágenes
    useEffect(() => {
        if (currentIndex >= finalImages.length) {
            setCurrentIndex(0);
        }
    }, [finalImages, currentIndex]);
    
    // Manejar eventos de teclado para la navegación
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isFullScreen) return;
            
            switch (e.key) {
                case 'ArrowLeft':
                    handlePrev();
                    break;
                case 'ArrowRight':
                    handleNext();
                    break;
                case 'Escape':
                    handleClose();
                    break;
                default:
                    break;
            }
        };
        
        if (isFullScreen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isFullScreen, handleNext, handlePrev, handleClose]);
    
    // Componente de vista a pantalla completa (renderizado usando portal)
    const FullScreenView = () => {
        if (!isFullScreen) return null;
        
        return ReactDOM.createPortal(
            <div className={styles.fullScreenOverlay} onClick={handleClose}>
                <div 
                    className={styles.fullScreenContent} 
                    onClick={e => e.stopPropagation()}
                >
                    <button 
                        className={styles.closeButton} 
                        onClick={handleClose}
                        type="button"
                        aria-label="Cerrar vista completa"
                    >
                        <FaTimes />
                    </button>
                    
                    <img 
                        src={finalImages[currentIndex]} 
                        alt="Imagen a pantalla completa" 
                        className={styles.fullScreenImage}
                    />
                    
                    {finalImages.length > 1 && (
                        <>
                            <button 
                                className={`${styles.fullScreenNavButton} ${styles.fullScreenPrevButton}`}
                                onClick={handlePrev}
                                type="button"
                                aria-label="Imagen anterior"
                            >
                                <FaChevronLeft />
                            </button>
                            
                            <button 
                                className={`${styles.fullScreenNavButton} ${styles.fullScreenNextButton}`}
                                onClick={handleNext}
                                type="button"
                                aria-label="Imagen siguiente"
                            >
                                <FaChevronRight />
                            </button>
                            
                            <div className={styles.fullScreenCounter}>
                                {currentIndex + 1} / {finalImages.length}
                            </div>
                        </>
                    )}
                </div>
            </div>,
            document.body  // Renderizar directamente en el body para evitar problemas de z-index
        );
    };
    
    return (
        <div className={styles.galleryContainer}>
            {finalImages.length > 1 && (
                <div className={styles.thumbnailsContainer}>
                    {finalImages.map((img, index) => (
                        <div 
                            key={index} 
                            className={`${styles.thumbnail} ${currentIndex === index ? styles.active : ''}`}
                            onClick={() => handleThumbnailClick(index)}
                        >
                            <img src={img} alt={`Miniatura ${index + 1}`} />
                        </div>
                    ))}
                </div>
            )}
            
            <div 
                className={styles.mainImageContainer}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
            >
                {isLoading && (
                    <div className={styles.loadingOverlay}>
                        <div className={styles.loader}></div>
                    </div>
                )}
                
                <img 
                    src={finalImages[currentIndex]} 
                    alt="Imagen de actividad" 
                    className={styles.mainImage}
                />
                
                {finalImages.length > 1 && (
                    <>
                        <button 
                            className={`${styles.navButton} ${styles.prevButton}`}
                            onClick={handlePrev}
                            aria-label="Imagen anterior"
                            type="button"
                        >
                            <FaChevronLeft />
                        </button>
                        
                        <button 
                            className={`${styles.navButton} ${styles.nextButton}`}
                            onClick={handleNext}
                            aria-label="Imagen siguiente"
                            type="button"
                        >
                            <FaChevronRight />
                        </button>
                    </>
                )}
                
                <button 
                    className={styles.expandButton}
                    onClick={toggleFullScreen}
                    aria-label="Ver a pantalla completa"
                    type="button"
                >
                    <FaExpand />
                </button>
                
                <div className={styles.imageCounter}>
                    {currentIndex + 1} / {finalImages.length}
                </div>
            </div>
            
            <FullScreenView />
        </div>
    );
};

export default ImageGallery;