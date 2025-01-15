import React, { useState, useEffect, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './ImageGallery.modules.css';

const ImageGallery = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const SLIDE_DELAY = 2500; // 3 seconds

    const nextImage = useCallback(() => {
        setCurrentIndex((prevIndex) => 
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    }, [images.length]);

    const prevImage = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    useEffect(() => {
        if (!isPaused && images.length > 1) {
            const interval = setInterval(nextImage, SLIDE_DELAY);
            return () => clearInterval(interval);
        }
    }, [nextImage, isPaused, images.length]);

    if (!images || images.length === 0) return null;

    return (
        <div 
            className="gallery-container"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="gallery-image-container">
                {images.map((image, index) => (
                    <img 
                        key={index}
                        src={image} 
                        alt={`Image ${index + 1}`} 
                        className={`gallery-image ${index === currentIndex ? 'active' : ''}`}
                        style={{ zIndex: index === currentIndex ? 1 : 0 }}
                    />
                ))}
                {images.length > 1 && (
                    <>
                        <button className="gallery-button prev" onClick={prevImage}>
                            <FaChevronLeft />
                        </button>
                        <button className="gallery-button next" onClick={nextImage}>
                            <FaChevronRight />
                        </button>
                        <div className="gallery-dots">
                            {images.map((_, index) => (
                                <span 
                                    key={index}
                                    className={`dot ${index === currentIndex ? 'active' : ''}`}
                                    onClick={() => setCurrentIndex(index)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ImageGallery;