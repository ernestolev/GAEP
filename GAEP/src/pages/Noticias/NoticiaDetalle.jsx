import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import './NoticiaDetalle.modules.css';
import Navbar from '../../components/Navbar/Navbar2';
import Footer from '../../components/Footer/Footer';
import { LoadingScreen } from '../../components/LoadingScreen/LoadingScreen';
import ImageGallery from '../../components/ImageGallery/ImageGallery';



const NoticiaDetalle = () => {
    const { id } = useParams();
    const [noticia, setNoticia] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNoticia = async () => {
            try {
                const docRef = doc(db, 'noticias', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setNoticia({
                        id: docSnap.id,
                        ...docSnap.data()
                    });
                }
            } catch (error) {
                console.error("Error fetching noticia:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNoticia();
    }, [id]);

    const getImagesToShow = () => {
        if (!noticia) return [];
        if (noticia.imagenes && noticia.imagenes.length > 0) {
            return noticia.imagenes;
        }
        return noticia.imagen ? [noticia.imagen] : [];
    };

    if (loading) return <LoadingScreen />;
    if (!noticia) return <div>Noticia no encontrada</div>;


    return (
        <>
            <Navbar />
            <div className="noticia-detalle-page">
                <div className="gui-noticias">
                    <Link to="/">Inicio</Link>
                    <span>/</span>
                    <Link to="/noticias">Noticias</Link>
                    <span>/</span>
                    <span>{noticia.titulo}</span>
                </div>
                <div className="noticia-header">
                    <div className="noticia-title-section">
                        <h1>{noticia.titulo}</h1>
                        {noticia.destacado && (
                            <span className="destacado-badge">Destacado</span>
                        )}
                    </div>
                    <div className="noticia-image-section">
                        <ImageGallery images={getImagesToShow()} />
                    </div>
                </div>
                <div className="noticia-descripcion">
                    <div dangerouslySetInnerHTML={{ __html: noticia.descripcion }} />
                </div>
            </div>
            <Footer />
        </>
    );
};

export default NoticiaDetalle;