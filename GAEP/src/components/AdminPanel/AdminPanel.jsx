import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    query,
    orderBy,
    limit,
    setDoc
} from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import './AdminPanel.css';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


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
    const [juntaDirectiva, setJuntaDirectiva] = useState([]);
    const [showJuntaPopup, setShowJuntaPopup] = useState(false);
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [cargo, setCargo] = useState('');
    const [dni, setDni] = useState('');
    const [email, setEmail] = useState('');
    const [telf, setTelf] = useState('');
    const [horario, setHorario] = useState('');
    const [lugar, setLugar] = useState('');
    const [horarioInicio, setHorarioInicio] = useState('');
    const [horarioFin, setHorarioFin] = useState('');
    const [organizador, setOrganizador] = useState('');
    const [destacado, setDestacado] = useState(false);
    const [showNoticiaPopup, setShowNoticiaPopup] = useState(false);



    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/');
    };

    const fetchJuntaDirectiva = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'junta-directiva'));
            const juntaData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).sort((a, b) => parseInt(a.id) - parseInt(b.id));
            setJuntaDirectiva(juntaData);
        } catch (error) {
            console.error("Error al obtener junta directiva:", error);
        }
    };

    const handleAddJuntaClick = () => {
        clearJuntaForm();
        setShowJuntaPopup(true);
    };

    const handleAddJuntaDirectiva = async () => {
        try {
            // Validations
            if (!nombre || !apellidos || !cargo || !dni || !email || !telf) {
                alert('Todos los campos son obligatorios');
                return;
            }
            if (dni.length !== 8) {
                alert('El DNI debe tener 8 dígitos');
                return;
            }
            if (telf.length !== 9) {
                alert('El teléfono debe tener 9 dígitos');
                return;
            }
            if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                alert('Email inválido');
                return;
            }

            const nuevoMiembro = {
                nombre: nombre.toUpperCase(),
                apellidos: apellidos.toUpperCase(),
                cargo: cargo.toUpperCase(),
                dni,
                email: email.toLowerCase(),
                telf
            };

            if (editId) {
                await updateDoc(doc(db, 'junta-directiva', editId), nuevoMiembro);
            } else {
                const newId = await getNextJuntaId();
                await setDoc(doc(db, 'junta-directiva', newId), nuevoMiembro);
            }

            clearJuntaForm();
            await fetchJuntaDirectiva();
        } catch (error) {
            console.error("Error al modificar miembro:", error);
        }
    };

    const getNextJuntaId = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'junta-directiva'));
            const ids = querySnapshot.docs.map(doc => parseInt(doc.id)).filter(id => !isNaN(id));
            const maxId = Math.max(...ids, 0);
            return (maxId + 1).toString();
        } catch (error) {
            console.error("Error getting next ID:", error);
            return "1";
        }
    };

    const clearJuntaForm = () => {
        setNombre('');
        setApellidos('');
        setCargo('');
        setDni('');
        setEmail('');
        setTelf('');
        setEditId(null);
        setShowJuntaPopup(false);
    };

    const handleEditJunta = (miembro) => {
        setNombre(miembro.nombre);
        setApellidos(miembro.apellidos);
        setCargo(miembro.cargo);
        setDni(miembro.dni);
        setEmail(miembro.email);
        setTelf(miembro.telf);
        setEditId(miembro.id);
        setShowJuntaPopup(true);
    };

    const renderConsejoDirectivo = () => (
        <div className="section">
            <h2>Consejo Directivo</h2>
            <div className="search-filter-container">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Buscar por apellidos..."
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
                            <div className="filter-option" onClick={() => sortJuntaDirectiva('id')}>
                                ID {sortConfig.field === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </div>
                            <div className="filter-option" onClick={() => sortJuntaDirectiva('apellidos')}>
                                Apellidos {sortConfig.field === 'apellidos' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </div>
                            <div className="filter-option" onClick={() => sortJuntaDirectiva('nombre')}>
                                Nombres {sortConfig.field === 'nombre' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </div>
                            <div className="filter-option" onClick={() => sortJuntaDirectiva('cargo')}>
                                Cargo {sortConfig.field === 'cargo' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </div>
                            <div className="filter-option" onClick={() => sortJuntaDirectiva('dni')}>
                                DNI {sortConfig.field === 'dni' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="counter-display">
                Mostrando {juntaDirectiva.length} miembros
            </div>
            <div className='ex-table-content'>
                <table className="junta-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombres</th>
                            <th>Apellidos</th>
                            <th>Cargo</th>
                            <th>DNI</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredJuntaDirectiva.map((miembro) => (
                            <tr key={miembro.id}>
                                <td>{miembro.id}</td>
                                <td>{miembro.nombre}</td>
                                <td>{miembro.apellidos}</td>
                                <td>{miembro.cargo}</td>
                                <td>{miembro.dni}</td>
                                <td>{miembro.email}</td>
                                <td>{miembro.telf}</td>
                                <td>
                                    <button onClick={() => handleEditJunta(miembro)}>Editar</button>
                                    <button onClick={() => { setShowConfirm(true); setDeleteId(miembro.id); }}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button className='btn-añadir' onClick={handleAddJuntaClick}>
                Añadir Miembro
            </button>

            {showJuntaPopup && (
                <div className="overlay" onClick={() => setShowJuntaPopup(false)}>
                    <div className="popup" onClick={e => e.stopPropagation()}>
                        <button className="popup-close" onClick={() => setShowJuntaPopup(false)}>×</button>
                        <div className="popup-content">
                            <h3>{editId ? 'Actualizar Miembro' : 'Añadir Miembro'}</h3>
                            <div className="form-group">
                                <label>Nombres</label>
                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value.toUpperCase())}
                                />
                            </div>
                            <div className="form-group">
                                <label>Apellidos</label>
                                <input
                                    type="text"
                                    value={apellidos}
                                    onChange={(e) => setApellidos(e.target.value.toUpperCase())}
                                />
                            </div>
                            <div className="form-group">
                                <label>Cargo</label>
                                <input
                                    type="text"
                                    value={cargo}
                                    onChange={(e) => setCargo(e.target.value.toUpperCase())}
                                />
                            </div>
                            <div className="form-group">
                                <label>DNI</label>
                                <input
                                    type="text"
                                    value={dni}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        if (value.length <= 8) setDni(value);
                                    }}
                                    maxLength="8"
                                />
                                {dni && dni.length !== 8 && (
                                    <span className="input-error">El DNI debe tener 8 dígitos</span>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Teléfono</label>
                                <input
                                    type="text"
                                    value={telf}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        if (value.length <= 9) setTelf(value);
                                    }}
                                    maxLength="9"
                                />
                                {telf && telf.length !== 9 && (
                                    <span className="input-error">El teléfono debe tener 9 dígitos</span>
                                )}
                            </div>
                            <div className="popup-buttons">
                                <button onClick={handleAddJuntaDirectiva}>
                                    {editId ? 'Actualizar' : 'Añadir'}
                                </button>
                                <button onClick={() => setShowJuntaPopup(false)}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );


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
            if (field === 'dni') {
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

    const normalizeText = (text) => {
        return text
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
    };

    const filteredExalumnos = exalumnos.filter(exalumno => {
        const searchNormalized = normalizeText(searchTerm);
        const nombreNormalized = exalumno.nombre ? normalizeText(exalumno.nombre) : '';
        const dniNormalized = exalumno.dni ? normalizeText(exalumno.dni.toString()) : '';
        const idNormalized = exalumno.id ? normalizeText(exalumno.id.toString()) : '';

        return nombreNormalized.includes(searchNormalized) ||
            dniNormalized.includes(searchNormalized) ||
            idNormalized.includes(searchNormalized);
    });

    const filteredJuntaDirectiva = juntaDirectiva.filter(miembro => {
        const searchNormalized = normalizeText(searchTerm);
        const apellidosNormalized = miembro.apellidos ? normalizeText(miembro.apellidos) : '';
        const dniNormalized = miembro.dni ? normalizeText(miembro.dni.toString()) : '';
        const idNormalized = miembro.id ? normalizeText(miembro.id.toString()) : '';

        return apellidosNormalized.includes(searchNormalized) ||
            dniNormalized.includes(searchNormalized) ||
            idNormalized.includes(searchNormalized);
    });

    const sortJuntaDirectiva = (field) => {
        const direction = sortConfig.field === field && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ field, direction });

        const sortedData = [...juntaDirectiva].sort((a, b) => {
            if (field === 'id') {
                return direction === 'asc' ?
                    parseInt(a.id) - parseInt(b.id) :
                    parseInt(b.id) - parseInt(a.id);
            }
            return direction === 'asc' ?
                String(a[field]).localeCompare(String(b[field])) :
                String(b[field]).localeCompare(String(a[field]));
        });

        setJuntaDirectiva(sortedData);
    };

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
            const noticiasData = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            setNoticias(noticiasData);
        } catch (error) {
            console.error("Error fetching noticias:", error);
        }
    };  // Add missing closing brace here

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

    useEffect(() => {
        fetchActividades();
        fetchNoticias();
        fetchExalumnos();
        fetchJuntaDirectiva();
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
        const nuevaActividad = {
            titulo,
            fecha: new Date(fecha),
            descripcion,
            horario: `${horarioInicio} - ${horarioFin}`,
            lugar,
            organizador
        };

        if (imagen) {
            nuevaActividad.imagen = imagen;
        }

        try {
            if (editId) {
                const actividadRef = doc(db, 'actividades', editId);
                await updateDoc(actividadRef, nuevaActividad);
            } else {
                const newId = await getNextActividadId();
                await setDoc(doc(db, 'actividades', newId), nuevaActividad);
            }

            // Clear form and refresh list
            setTitulo('');
            setFecha('');
            setDescripcion('');
            setImagen('');
            setHorarioInicio('');
            setHorarioFin('');
            setLugar('');
            setOrganizador('');
            setShowAddPopup(false);

            // Refresh activities
            fetchActividades();
        } catch (error) {
            console.error("Error al agregar actividad:", error);
        }
    };

    const handleAddExalumno = async () => {
        try {

            if (fecha.length !== 8) {
                alert('El DNI debe tener 8 dígitos');
                return;
            }

            const nuevoExalumno = {
                nombre: titulo.toUpperCase(),
                dni: fecha
            };

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

    const handleDeleteJunta = async (id) => {
        try {
            await deleteDoc(doc(db, 'junta-directiva', id));
            const nuevaJunta = juntaDirectiva.filter(miembro => miembro.id !== id);
            setJuntaDirectiva(nuevaJunta);
            setShowConfirm(false);
            setDeleteId(null);
        } catch (error) {
            console.error("Error al eliminar miembro:", error);
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
        try {
            if (typeof actividad.fecha === 'string') {
                const [day, month, year] = actividad.fecha.split('/');
                const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                setFecha(formattedDate);
            } else {
                setFecha(actividad.fecha ? new Date(actividad.fecha).toISOString().split('T')[0] : '');
            }
        } catch (error) {
            console.error("Error parsing date:", error);
            setFecha('');
        }

        setDescripcion(actividad.descripcion || '');
        // Preserve existing image
        if (actividad.imagen) {
            setImagen(actividad.imagen);
        }
        setEditId(actividad.id);

        if (actividad.horario) {
            const [inicio, fin] = actividad.horario.split(' - ');
            setHorarioInicio(inicio || '');
            setHorarioFin(fin || '');
        } else {
            setHorarioInicio('');
            setHorarioFin('');
        }

        setLugar(actividad.lugar || '');
        setOrganizador(actividad.organizador || '');
        setShowAddPopup(true);
    };

    const handleEditExalumno = (exalumno) => {
        setTitulo(exalumno.nombre);
        setFecha(exalumno.dni);
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

    const getNextActividadId = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'actividades'));
            const ids = querySnapshot.docs.map(doc => parseInt(doc.id)).filter(id => !isNaN(id));
            const maxId = Math.max(...ids, 0);
            return (maxId + 1).toString();
        } catch (error) {
            console.error("Error getting next ID:", error);
            return "1";
        }
    };

    const getNextNoticiaId = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'noticias'));
            const ids = querySnapshot.docs.map(doc => parseInt(doc.id)).filter(id => !isNaN(id));
            const maxId = Math.max(...ids, 0);
            return (maxId + 1).toString();
        } catch (error) {
            console.error("Error getting next ID:", error);
            return "1";
        }
    };

    const renderActividades = () => (
        <div className="section">
            <h2>Actividades</h2>
            <button className='btn-añadir' onClick={() => setShowAddPopup(true)}>
                Añadir Actividad
            </button>

            <div className="admin-actividades-grid">
                {actividades.map((actividad, index) => (
                    <div key={index} className="admin-actividad-card">
                        <div
                            className="admin-actividad-imagen"
                            style={{ backgroundImage: `url(${actividad.imagen})` }}
                        ></div>
                        <div className="admin-actividad-content">
                            <h3>{actividad.titulo}</h3>
                            <span className="admin-actividad-fecha">{actividad.fecha}</span>
                        </div>
                        <div className="admin-actividad-actions">
                            <button onClick={() => handleEdit(actividad)}>Editar</button>
                            <button onClick={() => handleDelete(actividad.id)}>Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>

            {showAddPopup && (
                <div className="overlay" onClick={() => setShowAddPopup(false)}>
                    <div className="popup popup-lg" onClick={e => e.stopPropagation()}>
                        <button className="popup-close" onClick={() => setShowAddPopup(false)}>×</button>
                        <div className="popup-content">
                            <h3>{editId ? 'Actualizar Actividad' : 'Añadir Actividad'}</h3>
                            <div className='form-container'>
                                <div className="form-group">
                                    <label>Título</label>
                                    <input
                                        type="text"
                                        value={titulo}
                                        onChange={(e) => setTitulo(e.target.value)}
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Fecha</label>
                                        <input
                                            type="date"
                                            value={fecha}
                                            onChange={(e) => setFecha(e.target.value)}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Horario</label>
                                        <div className="time-range">
                                            <input
                                                type="time"
                                                value={horarioInicio}
                                                onChange={(e) => setHorarioInicio(e.target.value)}
                                                className="form-control"
                                            />
                                            <span>a</span>
                                            <input
                                                type="time"
                                                value={horarioFin}
                                                onChange={(e) => setHorarioFin(e.target.value)}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Organizador</label>
                                    <input
                                        type="text"
                                        value={organizador}
                                        onChange={(e) => setOrganizador(e.target.value)}
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Lugar</label>
                                    <input
                                        type="text"
                                        value={lugar}
                                        onChange={(e) => setLugar(e.target.value)}
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Descripción</label>
                                    <ReactQuill
                                        theme="snow"
                                        value={descripcion}
                                        onChange={setDescripcion}
                                        modules={{
                                            toolbar: [
                                                [{ 'header': [1, 2, 3, false] }],
                                                ['bold', 'italic', 'underline', 'strike'],
                                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                [{ 'color': [] }, { 'background': [] }],
                                                ['link'],
                                                ['clean']
                                            ]
                                        }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Imagen</label>
                                    <input
                                        type="file"
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                        className="form-control"
                                    />
                                    {imagen && <img src={imagen} alt="Preview" className="imagen-preview" />}
                                </div>
                                <div className="popup-buttons">
                                    <button onClick={handleAdd} className="btn-submit">
                                        {editId ? 'Actualizar Actividad' : 'Agregar Actividad'}
                                    </button>
                                    <button onClick={() => setShowAddPopup(false)}>Cancelar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );



    const handleAddClick = () => {
        setTitulo('');
        setFecha('');
        setEditId(null);
        setShowAddPopup(true);
    };

    const renderNoticias = () => (
        <div className="section">
            <h2>Noticias</h2>
            <button className='btn-añadir' onClick={() => setShowNoticiaPopup(true)}>
                Añadir Noticia
            </button>

            <div className="admin-noticias-grid">
                {noticias.map((noticia, index) => (
                    <div key={index} className="admin-noticia-card">
                        <div
                            className="admin-noticia-imagen"
                            style={{ backgroundImage: `url(${noticia.imagen})` }}
                        ></div>
                        <div className="admin-noticia-content">
                            <h3>{noticia.titulo}</h3>
                            {noticia.destacado && (
                                <span className="admin-noticia-destacado">Destacado</span>
                            )}
                        </div>
                        <div className="admin-noticia-actions">
                            <button onClick={() => handleEditNoticia(noticia)}>Editar</button>
                            <button onClick={() => handleDeleteNoticia(noticia.id)}>Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>

            {showNoticiaPopup && (
                <div className="overlay" onClick={() => setShowNoticiaPopup(false)}>
                    <div className="popup popup-lg" onClick={e => e.stopPropagation()}>
                        <button className="popup-close" onClick={() => setShowNoticiaPopup(false)}>×</button>
                        <div className="popup-content">
                            <h3>{editId ? 'Actualizar Noticia' : 'Añadir Noticia'}</h3>
                            <div className='form-container'>
                                <div className="form-group">
                                    <label>Título</label>
                                    <input
                                        type="text"
                                        value={titulo}
                                        onChange={(e) => setTitulo(e.target.value)}
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Descripción</label>
                                    <ReactQuill
                                        theme="snow"
                                        value={descripcion}
                                        onChange={setDescripcion}
                                        modules={{
                                            toolbar: [
                                                [{ 'header': [1, 2, 3, false] }],
                                                ['bold', 'italic', 'underline', 'strike'],
                                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                [{ 'color': [] }, { 'background': [] }],
                                                ['link'],
                                                ['clean']
                                            ]
                                        }}
                                    />
                                </div>
                                <div className="form-group checkbox-group">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={destacado}
                                            onChange={(e) => setDestacado(e.target.checked)}
                                        />
                                        Destacado
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label>Imagen</label>
                                    <input
                                        type="file"
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                        className="form-control"
                                    />
                                    {imagen && <img src={imagen} alt="Preview" className="imagen-preview" />}
                                </div>
                                <div className="popup-buttons">
                                    <button onClick={handleAddNoticia} className="btn-submit">
                                        {editId ? 'Actualizar Noticia' : 'Agregar Noticia'}
                                    </button>
                                    <button onClick={() => setShowNoticiaPopup(false)}>Cancelar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const clearNoticiaForm = () => {
        setTitulo('');
        setDescripcion('');
        setDestacado(false);
        setImagen('');
        setEditId(null);
        setShowNoticiaPopup(false);
    };

    const handleAddNoticia = async () => {
        const nuevaNoticia = {
            titulo,
            descripcion,
            destacado,
            imagen
        };

        try {
            if (editId) {
                const noticiaRef = doc(db, 'noticias', editId);
                await updateDoc(noticiaRef, nuevaNoticia);
            } else {
                const newId = await getNextNoticiaId();
                await setDoc(doc(db, 'noticias', newId), nuevaNoticia);
            }

            clearNoticiaForm();
            fetchNoticias();
        } catch (error) {
            console.error("Error al agregar noticia:", error);
        }
    };

    const handleEditNoticia = (noticia) => {
        setTitulo(noticia.titulo || '');
        setDescripcion(noticia.descripcion || '');
        setDestacado(noticia.destacado || false);
        if (noticia.imagen) {
            setImagen(noticia.imagen);
        }
        setEditId(noticia.id);
        setShowNoticiaPopup(true);
    };

    const handleDeleteNoticia = async (id) => {
        try {
            await deleteDoc(doc(db, 'noticias', id));
            const nuevasNoticias = noticias.filter(noticia => noticia.id !== id);
            setNoticias(nuevasNoticias);
        } catch (error) {
            console.error("Error al eliminar noticia:", error);
        }
    };

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
                            <div className="filter-option" onClick={() => sortExalumnos('nombre')}>
                                Nombre {sortConfig.field === 'nombre' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </div>
                            <div className="filter-option" onClick={() => sortExalumnos('dni')}>
                                DNI {sortConfig.field === 'dni' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
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
                                <td>{exalumno.nombre}</td>
                                <td>{exalumno.dni}</td>
                                <td>
                                    <button onClick={() => handleEditExalumno(exalumno)}>Editar</button>
                                    <button onClick={() => { setShowConfirm(true); setDeleteId(exalumno.id); }}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button className='btn-añadiralumn' onClick={handleAddClick}>Añadir Exalumno</button>

            {showConfirm && (
                <div className="overlay" onClick={() => setShowConfirm(false)}>
                    <div className="confirm-popup" onClick={e => e.stopPropagation()}>
                        <button className="popup-close" onClick={() => setShowConfirm(false)}>×</button>
                        <p>¿Estás seguro de que deseas eliminar este miembro?</p>
                        <div className="popup-buttons">
                            <button onClick={() => handleDeleteJunta(deleteId)}>Sí</button>
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
                                <input
                                    type="text"
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value.toUpperCase())}
                                />
                            </div>
                            <div className="form-group">
                                <label>DNI</label>
                                <input
                                    type="text"
                                    value={fecha}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, ''); // Only numbers
                                        if (value.length <= 8) {
                                            setFecha(value);
                                        }
                                    }}
                                    pattern="[0-9]{8}"
                                    maxLength="8"
                                    minLength="8"
                                    title="DNI debe tener 8 dígitos"
                                />
                                {fecha && fecha.length !== 8 && (
                                    <span className="input-error">El DNI debe tener 8 dígitos</span>
                                )}
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