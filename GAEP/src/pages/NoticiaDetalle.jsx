import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import styles from '../Styles/NoticiaDetalle.module.css';
import Navbar from '../components/Navbar2';
import Footer from '../components/Footer';
import { LoadingScreen } from '../components/LoadingScreen';
import ImageGallery from '../components/ImageGallery';
import { 
    FaCalendarAlt, 
    FaTag, 
    FaUserAlt, 
    FaClock, 
    FaShareAlt,
    FaExternalLinkAlt,
    FaNewspaper,
    FaRegBookmark
} from 'react-icons/fa';

const NoticiaDetalle = () => {
    const { id } = useParams();
    const [noticia, setNoticia] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchNoticia = async () => {
            try {
                const docRef = doc(db, 'noticias', id);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    
                    // Formatear fecha si existe
                    let fechaFormateada = "Fecha no disponible";
                    
                    if (data.fecha) {
                        // Verificar si es un Timestamp de Firestore
                        if (data.fecha instanceof Timestamp || 
                            (data.fecha.seconds !== undefined && data.fecha.nanoseconds !== undefined)) {
                            fechaFormateada = data.fecha.toDate().toLocaleDateString('es-ES', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            });
                        } 
                        // Si es una fecha como cadena ISO
                        else if (typeof data.fecha === 'string') {
                            try {
                                fechaFormateada = new Date(data.fecha).toLocaleDateString('es-ES', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                });
                            } catch (e) {
                                console.warn("No se pudo convertir la fecha de string:", e);
                                fechaFormateada = data.fecha;
                            }
                        } 
                        // Si es un número (timestamp en milisegundos)
                        else if (typeof data.fecha === 'number') {
                            fechaFormateada = new Date(data.fecha).toLocaleDateString('es-ES', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            });
                        } 
                        // Para cualquier otro caso
                        else {
                            fechaFormateada = String(data.fecha);
                        }
                    }
                    
                    // Preparar imágenes
                    let imagenes = [];
                    
                    if (data.imagenes && Array.isArray(data.imagenes)) {
                        imagenes = data.imagenes;
                    } else if (data.imagen) {
                        imagenes = [data.imagen];
                    }
                    
                    setNoticia({
                        id: docSnap.id,
                        ...data,
                        fechaFormateada,
                        imagenes
                    });
                } else {
                    setError("No se encontró la noticia");
                }
            } catch (error) {
                console.error("Error fetching noticia:", error);
                setError("Error al cargar la noticia: " + error.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchNoticia();
    }, [id]);
    
    // Formatear la descripción con elementos destacados
    const formatDescription = (html) => {
        if (!html) return '';
        
        // Detectar patrones para convertirlos en cajas de información destacadas
        const withFormattedContent = html
            .replace(
                /<p>🔍 (.*?)<\/p>/g,
                `<div class="${styles.infoBox}" style="border-color: #64B5F6;">
                    <div class="${styles.infoBoxHeader}"><span class="${styles.infoBoxIcon}">🔍</span> Dato relevante</div>
                    <p>$1</p>
                </div>`
            )
            .replace(
                /<p>📢 (.*?)<\/p>/g,
                `<div class="${styles.infoBox}" style="border-color: #FFA726;">
                    <div class="${styles.infoBoxHeader}"><span class="${styles.infoBoxIcon}">📢</span> Anuncio</div>
                    <p>$1</p>
                </div>`
            )
            .replace(
                /<p>🎯 (.*?)<\/p>/g,
                `<div class="${styles.infoBox}">
                    <div class="${styles.infoBoxHeader}"><span class="${styles.infoBoxIcon}">🎯</span> Objetivo</div>
                    <p>$1</p>
                </div>`
            );
        
        return withFormattedContent;
    };
    
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: noticia.titulo,
                text: 'Mira esta noticia del GAEP',
                url: window.location.href
            })
            .catch((error) => console.log('Error compartiendo:', error));
        } else {
            // Fallback para navegadores que no soportan Web Share API
            navigator.clipboard.writeText(window.location.href)
                .then(() => alert('Enlace copiado al portapapeles'))
                .catch(() => alert('No se pudo copiar el enlace'));
        }
    };
    
    if (loading) return <LoadingScreen />;
    
    if (error) return (
        <>
            <Navbar />
            <div className={styles.errorContainer}>
                <h2>Error</h2>
                <p>{error}</p>
                <Link to="/noticias" className={styles.backButton}>
                    Volver a Noticias
                </Link>
            </div>
            <Footer />
        </>
    );
    
    if (!noticia) return (
        <>
            <Navbar />
            <div className={styles.errorContainer}>
                <h2>Noticia no encontrada</h2>
                <Link to="/noticias" className={styles.backButton}>
                    Volver a Noticias
                </Link>
            </div>
            <Footer />
        </>
    );

    return (
        <>
            <Navbar />
            <div className={styles.noticiaDetallePage}>
                <div className={styles.detalleGuion}>
                    <Link to="/">Inicio</Link>
                    <span>/</span>
                    <Link to="/noticias">Noticias</Link>
                    <span>/</span>
                    <span>{noticia.titulo}</span>
                </div>
                
                <div className={styles.noticiaHeader}>
                    <div className={styles.noticiaTitleSection}>
                        <div className={styles.metaInfo}>
                            <div className={styles.fechaNoticia}>
                                <FaCalendarAlt className={styles.noticiaIcon} />
                                {noticia.fechaFormateada}
                            </div>
                            
                            {noticia.autor && (
                                <div className={styles.autorNoticia}>
                                    <FaUserAlt className={styles.noticiaIcon} />
                                    {noticia.autor}
                                </div>
                            )}
                        </div>
                        
                        <h1>{noticia.titulo}</h1>
                        
                        <div className={styles.noticiaBadges}>
                            {noticia.destacado && (
                                <span className={styles.destacadoBadge}>
                                    <FaRegBookmark /> Destacado
                                </span>
                            )}
                            
                            {noticia.categoria && (
                                <span className={styles.categoriaBadge}>
                                    <FaTag /> {noticia.categoria}
                                </span>
                            )}
                        </div>
                    </div>
                    
                    <div className={styles.noticiaImageSection}>
                        <ImageGallery images={noticia.imagenes} />
                    </div>
                </div>
                
                <div className={styles.noticiaContent}>
                    <div className={styles.noticiaDescripcion}>
                        <div dangerouslySetInnerHTML={{ __html: formatDescription(noticia.descripcion) }} />
                        
                        <div className={styles.noticiaFooter}>
                            <div className={styles.noticiaAcciones}>
                                <button 
                                    className={styles.shareButton}
                                    onClick={handleShare}
                                    aria-label="Compartir noticia"
                                >
                                    <FaShareAlt /> Compartir
                                </button>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
            <Footer />
        </>
    );
};

export default NoticiaDetalle;