import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { LoadingScreen } from '../../components/LoadingScreen/LoadingScreen';
import Navbar2 from '../../components/Navbar/Navbar2';
import Footer from '../../components/Footer/Footer';
import './SponsorsLista.modules.css';
import { Link } from 'react-router-dom';

const SponsorsLista = () => {
    const [sponsors, setSponsors] = useState([]);
    const [loading, setLoading] = useState(true);

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
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 800);
            }
        };

        fetchSponsors();
    }, []);

    return (
        <>
            {loading ? (
                <LoadingScreen />
            ) : (
                <>
                    <Navbar2 />
                    <div className="sponsors-lista-container">
                        <div className='header-sticky'>
                            <div className="gui-sponsors">
                                <Link to="/">Inicio</Link>
                                <span>/</span>
                                <Link to="/">Sponsors</Link>
                                <h1>Nuestros Sponsors</h1>
                            </div>
                        </div>
                        <div className="sponsors-header">
                            
                            <p>Conoce a las empresas que apoyan la GAEP</p>
                        </div>
                        <div className="sponsors-grid">
                            {sponsors.map((sponsor) => (
                                <div key={sponsor.id} className="sponsor-card">
                                    <div className="sponsor-logo">
                                        <img src={sponsor.logo} alt={sponsor['razon-social']} />
                                    </div>
                                    <div className="sponsor-info">
                                        <h3>{sponsor['razon-social']}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Footer />
                </>
            )}
        </>
    );
};

export default SponsorsLista;