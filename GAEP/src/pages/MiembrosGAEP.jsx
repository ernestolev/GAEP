import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Navbar2 from '../components/Navbar2';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import styles from '../Styles/MiembrosGAEP.module.css';
import { FaSearch, FaSort, FaFilter, FaChevronDown, FaUserGraduate } from 'react-icons/fa';

const MiembrosGaep = () => {
    const [exalumnos, setExalumnos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterProf, setFilterProf] = useState('');
    const [filterPromocion, setFilterPromocion] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    
    const itemsPerPage = 10;

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

    const professions = [...new Set(exalumnos.map(e => e.prof).filter(Boolean))];
    const promotions = [...new Set(exalumnos.map(e => e.promocion).filter(Boolean))].sort((a, b) => b - a);

    const normalizeText = (text) => {
        if (!text) return '';
        return text
            .toString()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    };

    const handleSort = () => {
        const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        setSortDirection(newDirection);
    };

    const filteredExalumnos = exalumnos.filter(exalumno => {
        const normalizedSearch = normalizeText(searchTerm);
        const normalizedName = normalizeText(exalumno.nombre || '');
        const normalizedProf = normalizeText(exalumno.prof || '');
        const normalizedPromocion = normalizeText(exalumno.promocion?.toString() || '');

        const matchesSearch = normalizedName.includes(normalizedSearch) ||
            normalizedProf.includes(normalizedSearch) ||
            normalizedPromocion.includes(normalizedSearch);

        const matchesProf = !filterProf || normalizeText(exalumno.prof || '').includes(normalizeText(filterProf));
        const matchesPromocion = !filterPromocion || exalumno.promocion?.toString() === filterPromocion;

        return matchesSearch && matchesProf && matchesPromocion;
    }).sort((a, b) => {
        if (!a.nombre || !b.nombre) return 0;
        return sortDirection === 'asc'
            ? a.nombre.localeCompare(b.nombre)
            : b.nombre.localeCompare(a.nombre);
    });

    // Paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredExalumnos.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredExalumnos.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const clearFilters = () => {
        setFilterProf('');
        setFilterPromocion('');
        setSearchTerm('');
        setSortDirection('asc');
    };

    return (
        <>
            <Navbar2 />
            <div className={styles.miembrosPage}>
                <div className={styles.headerSticky}>
                    <div className={styles.miembrosGuion}>
                        <Link to="/">Inicio</Link>
                        <span>/</span>
                        <span>Miembros GAEP</span>
                    </div>
                    <h1>Miembros GAEP</h1>
                </div>

                <div className={styles.dashboardContainer}>
                    <div className={styles.dashboardHeader}>
                        <div className={styles.searchWrapper}>
                            <div className={styles.searchContainer}>
                                <FaSearch className={styles.searchIcon} />
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre, profesión o promoción..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className={styles.searchInput}
                                />
                            </div>
                        </div>
                        
                        <div className={styles.filtersContainer}>
                            <button 
                                className={styles.filterToggleBtn} 
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <FaFilter /> Filtros <FaChevronDown className={`${styles.chevron} ${showFilters ? styles.chevronUp : ''}`} />
                            </button>
                            
                            <button 
                                className={`${styles.sortButton} ${sortDirection === 'desc' ? styles.sortActive : ''}`} 
                                onClick={handleSort}
                            >
                                <FaSort /> {sortDirection === 'asc' ? 'A-Z' : 'Z-A'}
                            </button>
                        </div>
                    </div>
                    
                    {showFilters && (
                        <div className={styles.advancedFilters}>
                            <div className={styles.filterGroup}>
                                <label>Profesión:</label>
                                <select
                                    value={filterProf}
                                    onChange={(e) => {
                                        setFilterProf(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className={styles.filterSelect}
                                >
                                    <option value="">Todas las profesiones</option>
                                    {professions.map(prof => (
                                        <option key={prof} value={prof}>{prof}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className={styles.filterGroup}>
                                <label>Promoción:</label>
                                <select
                                    value={filterPromocion}
                                    onChange={(e) => {
                                        setFilterPromocion(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className={styles.filterSelect}
                                >
                                    <option value="">Todas las promociones</option>
                                    {promotions.map(prom => (
                                        <option key={prom} value={prom}>{prom}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <button 
                                onClick={clearFilters} 
                                className={styles.clearFiltersBtn}
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    )}

                    <div className={styles.tableStats}>
                        <p>
                            Mostrando <span>{currentItems.length}</span> de <span>{filteredExalumnos.length}</span> miembros
                            {filterProf && <span className={styles.activeFilter}>• Profesión: {filterProf}</span>}
                            {filterPromocion && <span className={styles.activeFilter}>• Promoción: {filterPromocion}</span>}
                        </p>
                    </div>

                    {isLoading ? (
                        <div className={styles.loadingContainer}>
                            <div className={styles.loader}></div>
                            <p>Cargando miembros...</p>
                        </div>
                    ) : filteredExalumnos.length === 0 ? (
                        <div className={styles.emptyState}>
                            <FaUserGraduate size={48} />
                            <h3>No se encontraron miembros</h3>
                            <p>Intenta con otros filtros o términos de búsqueda</p>
                            <button onClick={clearFilters} className={styles.resetButton}>
                                Reiniciar filtros
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className={styles.tableContainer}>
                                <table className={styles.miembrosTable}>
                                    <thead>
                                        <tr>
                                            <th>N°</th>
                                            <th className={styles.colNombre}>
                                                <div className={styles.thContent}>
                                                    Nombres
                                                    <button 
                                                        className={styles.tableHeaderSort} 
                                                        onClick={handleSort}
                                                    >
                                                        <FaSort />
                                                    </button>
                                                </div>
                                            </th>
                                            <th>Profesión</th>
                                            <th>Promoción</th>
                                            <th>Teléfono</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems.map((exalumno, index) => (
                                            <tr key={exalumno.id} className={styles.tableRow}>
                                                <td>{indexOfFirstItem + index + 1}</td>
                                                <td>{exalumno.nombre || '-'}</td>
                                                <td>
                                                    {exalumno.prof ? (
                                                        <span className={styles.professionTag}>{exalumno.prof}</span>
                                                    ) : '-'}
                                                </td>
                                                <td>
                                                    {exalumno.promocion ? (
                                                        <span className={styles.promotionTag}>{exalumno.promocion}</span>
                                                    ) : '-'}
                                                </td>
                                                <td>{exalumno.telefono || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {totalPages > 1 && (
                                <div className={styles.pagination}>
                                    <button 
                                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className={styles.paginationButton}
                                    >
                                        Anterior
                                    </button>
                                    
                                    <div className={styles.paginationNumbers}>
                                        {[...Array(totalPages)].map((_, i) => {
                                            // Display first page, current page, last page and pages around current page
                                            if (
                                                i === 0 ||
                                                i === totalPages - 1 ||
                                                (i >= currentPage - 2 && i <= currentPage + 2)
                                            ) {
                                                return (
                                                    <button
                                                        key={i}
                                                        onClick={() => paginate(i + 1)}
                                                        className={`${styles.pageNumber} ${currentPage === i + 1 ? styles.activePage : ''}`}
                                                    >
                                                        {i + 1}
                                                    </button>
                                                );
                                            } else if (
                                                i === currentPage - 3 ||
                                                i === currentPage + 3
                                            ) {
                                                return <span key={i} className={styles.pageEllipsis}>...</span>;
                                            }
                                            return null;
                                        })}
                                    </div>
                                    
                                    <button 
                                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className={styles.paginationButton}
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MiembrosGaep;