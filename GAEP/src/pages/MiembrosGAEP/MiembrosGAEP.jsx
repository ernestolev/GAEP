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
    const [filterProf, setFilterProf] = useState('');
    const [filterPromocion, setFilterPromocion] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');

    const professions = [...new Set(exalumnos.map(e => e.prof).filter(Boolean))];
    const promotions = [...new Set(exalumnos.map(e => e.promocion).filter(Boolean))].sort((a, b) => b - a);


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
        const normalizedSearch = normalizeText(searchTerm);
        const normalizedName = normalizeText(exalumno.nombre);
        const normalizedProf = normalizeText(exalumno.prof || '');
        const normalizedPromocion = exalumno.promocion?.toString() || '';

        const matchesSearch = normalizedName.includes(normalizedSearch) ||
            normalizedProf.includes(normalizedSearch) ||
            normalizedPromocion.includes(normalizedSearch);

        const matchesProf = !filterProf || normalizeText(exalumno.prof || '').includes(normalizeText(filterProf));
        const matchesPromocion = !filterPromocion || exalumno.promocion?.toString() === filterPromocion;

        return matchesSearch && matchesProf && matchesPromocion;
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
                        placeholder="Buscar por nombre, profesión o promoción..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <select
                        value={filterProf}
                        onChange={(e) => setFilterProf(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">Todas las profesiones</option>
                        {professions.map(prof => (
                            <option key={prof} value={prof}>{prof}</option>
                        ))}
                    </select>
                    <select
                        value={filterPromocion}
                        onChange={(e) => setFilterPromocion(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">Todas las promociones</option>
                        {promotions.map(prom => (
                            <option key={prom} value={prom}>Promoción {prom}</option>
                        ))}
                    </select>
                    <button onClick={handleSort} className="sort-button">
                        Ordenar {sortDirection === 'asc' ? '↑' : '↓'}
                    </button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table className="miembros-table">
                        <thead>
                            <tr>
                                <th>N°</th>
                                <th>Nombres</th>
                                <th>Profesión</th>
                                <th>Promoción</th>
                                <th>Telefono</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExalumnos.map((exalumno, index) => (
                                <tr key={exalumno.id}>
                                    <td>{index + 1}</td>
                                    <td>{exalumno.nombre}</td>
                                    <td>{exalumno.prof || '-'}</td>
                                    <td>{exalumno.promocion || '-'}</td>
                                    <td>{exalumno.telefono || '-'}</td>
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