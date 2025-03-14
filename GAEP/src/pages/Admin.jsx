import React, { useState, useEffect } from 'react';
import AdminPanel from '../components/AdminPanel';

const AdminPage = () => {
    const [actividades, setActividades] = useState(() => {
        const savedActividades = localStorage.getItem('actividades');
        return savedActividades ? JSON.parse(savedActividades) : [];
    });

    useEffect(() => {
        localStorage.setItem('actividades', JSON.stringify(actividades));
    }, [actividades]);

    return (
        <div className={styles.adminPage}> {/* Changed from "admin-page" to styles.adminPage */}
            <AdminPanel actividades={actividades} setActividades={setActividades} />
        </div>
    );
};

export default AdminPage;