// src/components/Home/StatsCounter.jsx
import React, { useState, useEffect, useRef } from 'react';

const StatsCounter = () => {
    const [counters, setCounters] = useState({
        members: 0,
        founded: 1950,
        activities: 0,
        projects: 0
    });
    
    const statsRef = useRef(null);
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        startCounterAnimation();
                    }
                });
            },
            { threshold: 0.5 }
        );
        
        if (statsRef.current) {
            observer.observe(statsRef.current);
        }
        
        return () => {
            if (observer && statsRef.current) {
                observer.unobserve(statsRef.current);
            }
        };
    }, []);
    
    const startCounterAnimation = () => {
        const duration = 2000;
        const steps = 60;
        const interval = duration / steps;
        let currentStep = 0;
        
        const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            
            setCounters(prev => ({
                members: Math.min(Math.round(200 * progress), 200),
                founded: 1950,
                activities: Math.min(Math.round(20 * progress), 20),
                projects: Math.min(Math.round(5 * progress), 5)
            }));
            
            if (currentStep >= steps) {
                clearInterval(timer);
            }
        }, interval);
    };
    
    return (
        <div className="intro-stats" ref={statsRef} data-aos="fade-up">
            <div className='stat'>
                <h3>{counters.members}+</h3>
                <p>Miembros</p>
            </div>
            <div className='stat'>
                <h3>{counters.founded}</h3>
                <p>Año de Fundación</p>
            </div>
            <div className='stat'>
                <h3>{counters.activities}+</h3>
                <p>Actividades anuales</p>
            </div>
            <div className='stat'>
                <h3>{counters.projects}+</h3>
                <p>Proyectos propuestos</p>
            </div>
        </div>
    );
};

export default StatsCounter;