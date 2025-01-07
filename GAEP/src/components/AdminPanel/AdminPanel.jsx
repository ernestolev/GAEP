import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc, updateDoc, query, orderBy, limit, setDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import './AdminPanel.css';
import banner from '../../assets/images/img-gaepbanner2.png';

const AdminPanel = () => {
    const [titulo, setTitulo] = useState('');
    const [fecha, setFecha] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [imagen, setImagen] = useState('');
    const [editId, setEditId] = useState(null);
    const [actividades, setActividades] = useState([]);
    const [noticias, setNoticias] = useState([]);
    const [exalumnos, setExalumnos] = useState([]);
    const [activeSection, setActiveSection] = useState('actividades');
    const [showConfirm, setShowConfirm] = useState(false);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [sortConfig, setSortConfig] = useState({ field: 'id', direction: 'asc' });


    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/');
    };

    const sortExalumnos = (field) => {
        const direction = sortConfig.field === field && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ field, direction });

        const sortedData = [...exalumnos].sort((a, b) => {
            if (field === 'id') {
                return direction === 'asc' ?
                    parseInt(a.id) - parseInt(b.id) :
                    parseInt(b.id) - parseInt(a.id);
            }
            // Convert DNI to string for comparison
            if (field === 'DNI') {
                return direction === 'asc' ?
                    String(a[field]).localeCompare(String(b[field])) :
                    String(b[field]).localeCompare(String(a[field]));
            }
            // For NOMBRE field
            return direction === 'asc' ?
                a[field].localeCompare(b[field]) :
                b[field].localeCompare(a[field]);
        });

        setExalumnos(sortedData);
    };

    const filteredExalumnos = exalumnos.filter(exalumno =>
        exalumno.NOMBRE.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(exalumno.DNI).includes(searchTerm) ||
        String(exalumno.id).includes(searchTerm)
    );

    useEffect(() => {
        const fetchActividades = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'actividades'));
                const actividadesData = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        ...data,
                        id: doc.id,
                        fecha: data.fecha.toDate().toLocaleDateString()
                    };
                });
                setActividades(actividadesData);
            } catch (error) {
                console.error("Error al obtener actividades: ", error);
            }
        };

        const fetchNoticias = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'noticias'));
                const noticiasData = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        ...data,
                        id: doc.id,
                        fecha: data.fecha.toDate().toLocaleDateString()
                    };
                });
                setNoticias(noticiasData);
            } catch (error) {
                console.error("Error al obtener noticias: ", error);
            }
        };

        const fetchExalumnos = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'exalumnos'));
                const exalumnosData = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data
                    };
                }).sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
                setExalumnos(exalumnosData);
            } catch (error) {
                console.error("Error al obtener exalumnos: ", error);
            }
        };

        fetchActividades();
        fetchNoticias();
        fetchExalumnos();
    }, []);

    const getNextId = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'exalumnos'));
            const ids = querySnapshot.docs.map(doc => parseInt(doc.id)).filter(id => !isNaN(id));
            const maxId = Math.max(...ids);
            return (maxId + 1).toString();
        } catch (error) {
            console.error("Error getting next ID:", error);
            return "1";
        }
    };

    const handleAdd = async () => {
        const nuevaActividad = { titulo, fecha: new Date(fecha), descripcion, imagen };
        try {
            if (editId) {
                const actividadRef = doc(db, 'actividades', editId);
                await updateDoc(actividadRef, nuevaActividad);
                setEditId(null);
            } else {
                await addDoc(collection(db, 'actividades'), nuevaActividad);
            }
            setTitulo('');
            setFecha('');
            setDescripcion('');
            setImagen('');
            const querySnapshot = await getDocs(collection(db, 'actividades'));
            const actividadesData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    ...data,
                    id: doc.id,
                    fecha: data.fecha.toDate().toLocaleDateString()
                };
            });
            setActividades(actividadesData);
        } catch (error) {
            console.error("Error al agregar actividad:", error);
        }
    };

    const handleAddExalumno = async () => {
        try {
            const nuevoExalumno = { NOMBRE: titulo, DNI: fecha };

            if (editId) {
                // Update existing document
                await updateDoc(doc(db, 'exalumnos', editId), nuevoExalumno);
            } else {
                // Add new document
                const newId = await getNextId();
                await setDoc(doc(db, 'exalumnos', newId), nuevoExalumno);
            }

            setTitulo('');
            setFecha('');
            setEditId(null);
            setShowAddPopup(false);

            // Refresh the list
            const querySnapshot = await getDocs(collection(db, 'exalumnos'));
            const exalumnosData = querySnapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                .sort((a, b) => parseInt(a.id) - parseInt(b.id));

            setExalumnos(exalumnosData);
        } catch (error) {
            console.error("Error al modificar exalumno:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'actividades', id));
            const nuevasActividades = actividades.filter(actividad => actividad.id !== id);
            setActividades(nuevasActividades);
        } catch (error) {
            console.error("Error al eliminar actividad: ", error);
        }
    };

    const handleEdit = (actividad) => {
        setTitulo(actividad.titulo);
        setFecha(actividad.fecha ? new Date(actividad.fecha).toISOString().split('T')[0] : '');
        setDescripcion(actividad.descripcion);
        setImagen(actividad.imagen);
        setEditId(actividad.id);
    };

    const handleEditExalumno = (exalumno) => {
        setTitulo(exalumno.NOMBRE);
        setFecha(exalumno.DNI);
        setEditId(exalumno.id);
        setShowAddPopup(true);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagen(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteExalumno = async (id) => {
        try {
            await deleteDoc(doc(db, 'exalumnos', id));
            const nuevosExalumnos = exalumnos.filter(exalumno => exalumno.id !== id);
            setExalumnos(nuevosExalumnos);
            setShowConfirm(false);
            setDeleteId(null);
        } catch (error) {
            console.error("Error al eliminar exalumno: ", error);
        }
    };

    const renderActividades = () => (
        <div className="section">
            <h2>Actividades</h2>
            <div className='actividades-reg'>
                <div className="form-group">
                    <label>Título</label>
                    <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Fecha</label>
                    <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Descripción</label>
                    <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></textarea>
                </div>
                <div className="form-group">
                    <label>Imagen</label>
                    <input type="file" onChange={handleImageUpload} />
                    {imagen && <img src={imagen} alt="Preview" className="imagen-preview" />}
                </div>
                <button onClick={handleAdd}>{editId ? 'Actualizar Actividad' : 'Agregar Actividad'}</button>
            </div>

            <div className="actividades-list">
                {actividades.map((actividad, index) => (
                    <div key={index} className="actividad-item">
                        <img src={actividad.imagen} alt={actividad.titulo} className="actividad-imagen" />
                        <div className="actividad-info">
                            <h3>{actividad.titulo}</h3>
                            <p>{actividad.fecha}</p>
                            <p>{actividad.descripcion}</p>
                        </div>
                        <div className="actividad-actions">
                            <button onClick={() => handleEdit(actividad)}>Editar</button>
                            <button onClick={() => handleDelete(actividad.id)}>Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderNoticias = () => (
        <div className="section">
            <h2>Noticias</h2>
            {/* Similar form and list for noticias */}
        </div>
    );

    const renderConsejoDirectivo = () => (
        <div className="section">
            <h2>Consejo Directivo</h2>
            {/* Form and list for consejo directivo */}
        </div>
    );

    const renderExalumnos = () => (
        <div className="section">
            <h2>Exalumnos Inscritos</h2>
            <div className="search-filter-container">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Buscar exalumno..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <i className="fas fa-search"></i>
                </div>
                <div className="filter-container">
                    <button
                        className="filter-button"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <i className="fas fa-filter"></i>
                        Filtrar
                    </button>
                    {showFilters && (
                        <div className="filter-dropdown">
                            <div className="filter-option" onClick={() => sortExalumnos('id')}>
                                ID {sortConfig.field === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </div>
                            <div className="filter-option" onClick={() => sortExalumnos('NOMBRE')}>
                                Nombre {sortConfig.field === 'NOMBRE' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </div>
                            <div className="filter-option" onClick={() => sortExalumnos('DNI')}>
                                DNI {sortConfig.field === 'DNI' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="counter-display">
                Mostrando {filteredExalumnos.length} de {exalumnos.length} exalumnos
            </div>
            <div className='ex-table-content'>
                <table className="exalumnos-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombres</th>
                            <th>DNI</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExalumnos.map((exalumno) => (
                            <tr key={exalumno.id}>
                                <td>{exalumno.id}</td>
                                <td>{exalumno.NOMBRE}</td>
                                <td>{exalumno.DNI}</td>
                                <td>
                                    <button onClick={() => handleEditExalumno(exalumno)}>Editar</button>
                                    <button onClick={() => { setShowConfirm(true); setDeleteId(exalumno.id); }}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button className='btn-añadiralumn' onClick={() => setShowAddPopup(true)}>Añadir Exalumno</button>

            {showConfirm && (
                <div className="overlay" onClick={() => setShowConfirm(false)}>
                    <div className="confirm-popup" onClick={e => e.stopPropagation()}>
                        <button className="popup-close" onClick={() => setShowConfirm(false)}>×</button>
                        <p>¿Estás seguro de que deseas eliminar este exalumno?</p>
                        <div className="popup-buttons">
                            <button onClick={() => handleDeleteExalumno(deleteId)}>Sí</button>
                            <button onClick={() => setShowConfirm(false)}>No</button>
                        </div>
                    </div>
                </div>
            )}

            {showAddPopup && (
                <div className="overlay" onClick={() => setShowAddPopup(false)}>
                    <div className="popup" onClick={e => e.stopPropagation()}>
                        <button className="popup-close" onClick={() => setShowAddPopup(false)}>×</button>
                        <div className="popup-content">
                            <h3>{editId ? 'Actualizar Exalumno' : 'Añadir Exalumno'}</h3>
                            <div className="form-group">
                                <label>Nombres</label>
                                <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>DNI</label>
                                <input type="text" value={fecha} onChange={(e) => setFecha(e.target.value)} />
                            </div>
                            <div className="popup-buttons">
                                <button onClick={handleAddExalumno}>
                                    {editId ? 'Actualizar' : 'Añadir'}
                                </button>
                                <button onClick={() => setShowAddPopup(false)}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="admin-panel">
            <div className="sidebar">
                <img src={banner} alt="GAEP Banner" className="sidebar-banner" />
                <button onClick={() => setActiveSection('actividades')}>Actividades</button>
                <button onClick={() => setActiveSection('noticias')}>Noticias</button>
                <button onClick={() => setActiveSection('consejoDirectivo')}>Consejo Directivo</button>
                <button onClick={() => setActiveSection('exalumnosInscritos')}>Exalumnos inscritos</button>
                <button onClick={handleLogout}>Cerrar sesión</button>
            </div>
            <div className="content">
                {activeSection === 'actividades' && renderActividades()}
                {activeSection === 'noticias' && renderNoticias()}
                {activeSection === 'consejoDirectivo' && renderConsejoDirectivo()}
                {activeSection === 'exalumnosInscritos' && renderExalumnos()}
            </div>
        </div>
    );
};

export default AdminPanel;