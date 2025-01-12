import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link, useNavigate } from 'react-router-dom';

import { LoadingScreen } from '../../components/LoadingScreen/LoadingScreen';

import '../Noticias/noticias.modules.css';
import Navbar from '../../components/Navbar/Navbar2';
import Footer from '../../components/Footer/Footer';

const Noticias = () => {
    const [noticias, setNoticias] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {

        const fetchNoticias = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'noticias'));
                const noticiasData = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                }));
                setNoticias(noticiasData);
            } catch (error) {
                console.error("Error fetching noticias:", error);
            }
        };

        fetchNoticias();
    }, []);

    if (!noticias) return <LoadingScreen />;

    return (
        <>
            <Navbar />
            <div className="noticias-page">
                <div className="noticiasheader-sticky">
                    <div className="gui-noticias">
                        <Link to="/">Inicio</Link>
                        <span>/</span>
                        <span>Noticias</span>
                    </div>
                    <h1>Últimas Noticias</h1>
                </div>
                <div className="noticias-list">
                    {noticias.map((noticia) => (
                        <div
                            key={noticia.id}
                            className="noticia-item"
                            onClick={() => navigate(`/noticias/${noticia.id}`)}
                        >                            <div
                            className="noticia-imagen"
                            style={{ backgroundImage: `url(${noticia.imagen})` }}
                        ></div>
                            <div className="noticia-info">
                                <h3>{noticia.titulo}</h3>
                                {noticia.destacado && (
                                    <span className="destacado-badge">Destacado</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Noticias;