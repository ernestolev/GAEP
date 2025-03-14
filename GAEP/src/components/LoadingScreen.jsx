import React, { useState, useEffect } from 'react';
import styles from '../Styles/LoadingScreen.module.css';
import imgescudo from '../assets/images/img-escudoGAEP.png';

const LoadingScreen = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Simular progreso de carga
        const interval = setInterval(() => {
            setProgress(prevProgress => {
                const newProgress = prevProgress + Math.random() * 15;
                return newProgress > 100 ? 100 : newProgress;
            });
        }, 200);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.loadingScreen}>
            <div className={styles.loadingContent}>
                <div className={styles.logoContainer}>
                    <img src={imgescudo} alt="Escudo GAEP" className={styles.escudoLogo} />
                    <div className={styles.pulseEffect}></div>
                </div>

                <div className={styles.progressContainer}>
                    <div
                        className={styles.progressBar}
                        style={{ width: `${progress}%` }}
                    ></div>
                    <div className={styles.progressLabel}>{Math.floor(progress)}%</div>
                </div>

                <p className={styles.loadingText}>
                    Cargando
                    <span className={styles.dot}>.</span>
                    <span className={styles.dot}>.</span>
                    <span className={styles.dot}>.</span>
                </p>
            </div>
        </div>
    );
};

// Versiones más pequeñas para uso en botones o elementos internos
export const LoadingSpinner = () => (
    <div className={styles.loadingSpinner}></div>
);

export const LoadingDots = () => (
    <div className={styles.loadingDots}>
        <div></div>
        <div></div>
        <div></div>
    </div>
);

// Pequeña barra de progreso para componentes más pequeños
export const MiniProgressBar = ({ progress = 50 }) => (
    <div className={styles.miniProgressContainer}>
        <div
            className={styles.miniProgressBar}
            style={{ width: `${progress}%` }}
        ></div>
    </div>
);

export { LoadingScreen };
export default LoadingScreen;