// Create new MiembrosGaep.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import Navbar2 from '../../components/Navbar/Navbar2';
import Footer from '../../components/Footer/Footer';
import { Link } from 'react-router-dom';
import './MiembrosGaep.modules.css';

const MiembrosGaep = () => {
    const [exalumnos, setExalumnos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');

    useEffect(() => {
        const fetchExalumnos = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'exalumnos'));
                const exalumnosData = querySnapshot.docs
                    .map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }))
                    .sort((a, b) => parseInt(a.id) - parseInt(b.id));
                setExalumnos(exalumnosData);
            } catch (error) {
                console.error("Error fetching exalumnos:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchExalumnos();
    }, []);

    const normalizeText = (text) => {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    };

    const handleSort = () => {
        const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        setSortDirection(newDirection);
        const sortedExalumnos = [...exalumnos].sort((a, b) => {
            return newDirection === 'asc' 
                ? a.nombre.localeCompare(b.nombre)
                : b.nombre.localeCompare(a.nombre);
        });
        setExalumnos(sortedExalumnos);
    };

    const filteredExalumnos = exalumnos.filter(exalumno => {
        const normalizedName = normalizeText(exalumno.nombre);
        const normalizedSearch = normalizeText(searchTerm);
        return normalizedName.includes(normalizedSearch);
    });

    return (
        <>
            <Navbar2 />
            <div className="miembros-page">
                <div className="header-sticky">
                    <div className="miembros-guion">
                        <Link to="/">Inicio</Link>
                        <span>/</span>
                        <span>Miembros GAEP</span>
                    </div>
                    <h1>Miembros GAEP</h1>
                </div>

                <div className="search-section">
                    <input
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <button onClick={handleSort} className="sort-button">
                        Ordenar {sortDirection === 'asc' ? '↑' : '↓'}
                    </button>
                </div>

                <div className="miembros-table-container">
                    <table className="miembros-table">
                        <thead>
                            <tr>
                                <th>N°</th>
                                <th>Nombres</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExalumnos.map((exalumno, index) => (
                                <tr key={exalumno.id}>
                                    <td>{index + 1}</td>
                                    <td>{exalumno.nombre}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MiembrosGaep;