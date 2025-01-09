import React from 'react';
import './LoadingScreen.modules.css';

export const LoadingScreen = () => (
    <div className="loading-screen">
        <div className="loading-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
        <p>Cargando...</p>
    </div>
);

export const LoadingSpinner = () => (
    <div className="loading-spinner"></div>
);

export const LoadingDots = () => (
    <div className="loading-dots">
        <div></div>
        <div></div>
        <div></div>
    </div>
);