import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import './Sponsors.modules.css';
import { Link } from 'react-router-dom';

const Sponsors = () => {
    const [sponsors, setSponsors] = useState([]);

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

    return (
        <div className="sponsors-container">
            <div className="headersponsors">
                <h3>Sponsors</h3>
                <Link to="/sponsors-lista" className="sponsors-button">
                   <button className='sponsors-btn'>Ver todos</button>
                </Link>
            </div>
            <div className="sponsors-track">

                {/* Duplicate logos for seamless loop */}
                {[...sponsors, ...sponsors].map((sponsor, index) => (
                    <div key={index} className="sponsor-item">
                        <img src={sponsor.logo} alt="Sponsor logo" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sponsors;