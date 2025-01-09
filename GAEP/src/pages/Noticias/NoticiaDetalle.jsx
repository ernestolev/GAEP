import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import './NoticiaDetalle.modules.css';
import Navbar from '../../components/Navbar/Navbar2';
import Footer from '../../components/Footer/Footer';

const NoticiaDetalle = () => {
    const { id } = useParams();
    const [noticia, setNoticia] = useState(null);

    useEffect(() => {
        const fetchNoticia = async () => {
            try {
                const docRef = doc(db, 'noticias', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setNoticia(docSnap.data());
                }
            } catch (error) {
                console.error("Error fetching noticia:", error);
            }
        };

        fetchNoticia();
    }, [id]);

    if (!noticia) return <div>Cargando...</div>;

    return (
        <>
            <Navbar />
            <div className="noticia-detalle-page">
                <div className="guion">
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
                        <img src={noticia.imagen} alt={noticia.titulo} className="noticia-detalle-imagen" />
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