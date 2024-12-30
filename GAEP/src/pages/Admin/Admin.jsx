import React, { useState, useEffect } from 'react';
import AdminPanel from '../../components/AdminPanel/AdminPanel';
import './Admin.modules.css';

const AdminPage = () => {
    const [actividades, setActividades] = useState(() => {
        const savedActividades = localStorage.getItem('actividades');
        return savedActividades ? JSON.parse(savedActividades) : [];
    });

    useEffect(() => {
        localStorage.setItem('actividades', JSON.stringify(actividades));
    }, [actividades]);

    return (
        <div className="admin-page">
            <h1>Panel de Administración</h1>
            <AdminPanel actividades={actividades} setActividades={setActividades} />
        </div>
    );
};

export default AdminPage;