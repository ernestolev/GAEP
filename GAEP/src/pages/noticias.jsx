import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { LoadingScreen } from '../components/LoadingScreen';
import styles from '../Styles/noticias.module.css';
import Navbar from '../components/Navbar2';
import Footer from '../components/Footer';

const Noticias = () => {
    const [noticias, setNoticias] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNoticias = async () => {
            try {
                const noticiasRef = collection(db, 'noticias');
                const q = query(noticiasRef, orderBy('destacado', 'desc'));
                const querySnapshot = await getDocs(q);
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
            <div className={styles["noticias-page"]}>
                <div className={styles["noticiasheader-sticky"]}>
                    <div className={styles["guion"]}>
                        <Link to="/">Inicio</Link>
                        <span>/</span>
                        <span>Noticias</span>
                    </div>
                    <h1>Últimas Noticias</h1>
                </div>
                <div className={styles["noticias-list"]}>
                    {noticias.map((noticia) => (
                        <div
                            key={noticia.id}
                            className={styles["noticia-item"]}
                            onClick={() => navigate(`/noticias/${noticia.id}`)}
                        >
                            <div
                                className={styles["noticia-imagen"]}
                                style={{
                                    backgroundImage: `url(${noticia.imagenes && noticia.imagenes.length > 0
                                        ? noticia.imagenes[0]
                                        : noticia.imagen || ''
                                        })`
                                }}
                            ></div>
                            <div className={styles["noticia-info"]}>
                                <h3>{noticia.titulo}</h3>
                                {noticia.destacado && (
                                    <span className={styles["destacado-badge"]}>Destacado</span>
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