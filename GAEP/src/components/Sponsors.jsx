import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import styles from '../Styles/Sponsors.module.css';

const Sponsors = () => {
    const [sponsors, setSponsors] = useState([]);
    const [isVisible, setIsVisible] = useState(true);
    const trackRef = useRef(null);

    useEffect(() => {
        const fetchSponsors = async () => {
            try {
                const sponsorsSnapshot = await getDocs(collection(db, 'sponsor'));
                const sponsorsData = sponsorsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    logo: doc.data().logo
                }));
                setSponsors(sponsorsData);
            } catch (error) {
                console.error("Error fetching sponsors:", error);
            }
        };

        fetchSponsors();
    }, []);

    useEffect(() => {
        const checkVisibility = () => {
            if (trackRef.current) {
                const rect = trackRef.current.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
                setIsVisible(isVisible);
            }
        };

        window.addEventListener('scroll', checkVisibility);
        checkVisibility();

        return () => window.removeEventListener('scroll', checkVisibility);
    }, []);

    return (
        <div className={styles["sponsors-container"]}>
            <div className={styles.headersponsors}>
                <h3>Sponsors</h3>
                <Link to="/sponsors-lista">
                    <button className={styles["sponsors-btn"]}>Ver todos</button>
                </Link>
            </div>
            <div className={styles["sponsors-track"]} ref={trackRef}>
                {isVisible && (
                    <>
                        {sponsors.length > 0 && [...sponsors, ...sponsors].map((sponsor, index) => (
                            <div key={index} className={styles["sponsor-item"]}>
                                <img
                                    src={sponsor.logo}
                                    alt="Sponsor logo"
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default Sponsors;