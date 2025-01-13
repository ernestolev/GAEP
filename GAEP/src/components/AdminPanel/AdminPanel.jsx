import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    collection,
    addDoc,
    getDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    query,
    orderBy,
    limit,
    setDoc
} from 'firebase/firestore';
import emailjs from '@emailjs/browser';
import { db, auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import './AdminPanel.css';
import { LoadingScreen, LoadingDots } from '../../components/LoadingScreen/LoadingScreen';
import { FaCalendarAlt, FaNewspaper, FaUsers, FaUserGraduate, FaUserPlus } from 'react-icons/fa';


import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


import banner from '../../assets/images/img-gaepbanner.png';

const AdminPanel = () => {
    const [showComprobanteModal, setShowComprobanteModal] = useState(false);
    const [currentComprobante, setCurrentComprobante] = useState(null);

    const EMAIL_SERVICE_ID = 'service_73kk9jg';
    const EMAIL_TEMPLATE_ID_ACCEPTED = 'template_g8kbzrs'; // Create this template in EmailJS
    const EMAIL_PUBLIC_KEY = 'ROpbgdF-nRAD3zQuR';

    const [img1, setImg1] = useState('');
    const [img2, setImg2] = useState('');
    const [showImageModal, setShowImageModal] = useState(false);
    const [currentImages, setCurrentImages] = useState({ img1: '', img2: '' });
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState('');
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);



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
    const [solicitudes, setSolicitudes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState({
        show: false,
        type: '',
        id: null,
        title: ''
    });
    const handleConfirmDelete = (type, id, title) => {
        setConfirmAction({
            show: true,
            type,
            id,
            title
        });
    };

    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/');
    };


    const fetchSolicitudes = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'inscripciones'));
            const solicitudesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                fechaRegistro: doc.data().fechaRegistro?.toDate().toLocaleDateString() || '',
                fechaAceptacion: doc.data().fechaAceptacion?.toDate().toLocaleDateString() || '-'
            }));
            setSolicitudes(solicitudesData);
        } catch (error) {
            console.error("Error fetching solicitudes:", error);
        }
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

    const handleViewImages = (miembro) => {
        setCurrentImages({
            img1: miembro.img1,
            img2: miembro.img2
        });
        setShowImageModal(true);
    };


    const handleAddJuntaDirectiva = async () => {
        try {
            if (!nombre || !apellidos || !cargo || !dni || !email || !telf) {
                alert('Todos los campos son obligatorios');
                return;
            }

            const nuevoMiembro = {
                nombre: nombre.toUpperCase(),
                apellidos: apellidos.toUpperCase(),
                cargo: cargo.toUpperCase(),
                dni,
                email: email.toLowerCase(),
                telf,
                img1,
                img2
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
        setImg1('');
        setImg2('');
        setEditId(null);
        setShowJuntaPopup(false);
    };
    const executeDelete = async () => {
        try {
            const { type, id } = confirmAction;

            switch (type) {
                case 'actividad':
                    await deleteDoc(doc(db, 'actividades', id));
                    setActividades(actividades.filter(item => item.id !== id));
                    break;

                case 'noticia':
                    await deleteDoc(doc(db, 'noticias', id));
                    setNoticias(noticias.filter(item => item.id !== id));
                    break;

                case 'exalumno':
                    await deleteDoc(doc(db, 'exalumnos', id));
                    setExalumnos(exalumnos.filter(item => item.id !== id));
                    break;

                case 'juntaDirectiva':
                    await deleteDoc(doc(db, 'junta-directiva', id));
                    setJuntaDirectiva(juntaDirectiva.filter(item => item.id !== id));
                    break;
            }

            // Refresh data after deletion
            switch (type) {
                case 'actividad':
                    await fetchActividades();
                    break;
                case 'noticia':
                    await fetchNoticias();
                    break;
                case 'exalumno':
                    await fetchExalumnos();
                    break;
                case 'juntaDirectiva':
                    await fetchJuntaDirectiva();
                    break;
            }
        } catch (error) {
            console.error(`Error deleting ${confirmAction.type}:`, error);
        } finally {
            setConfirmAction({ show: false, type: '', id: null, title: '' });
        }
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
            <div className='tablabarra'>
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
                                        <button onClick={() => handleViewImages(miembro)}>
                                            <i className="fas fa-eye"></i>
                                        </button>
                                        <button onClick={() => handleEditJunta(miembro)}>Editar</button>
                                        <button onClick={() => handleConfirmDelete('juntaDirectiva', miembro.id, miembro.nombre)}>Eliminar</button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <button className='btn-añadir' onClick={handleAddJuntaClick}>
                Añadir Miembro
            </button>

            {confirmAction.show && (
                <div className="overlay" onClick={() => setConfirmAction({ show: false, type: '', id: null, title: '' })}>
                    <div className="confirm-popup" onClick={e => e.stopPropagation()}>
                        <button
                            className="popup-close"
                            onClick={() => setConfirmAction({ show: false, type: '', id: null, title: '' })}
                        >×</button>
                        <p>¿Estás seguro de que deseas eliminar {confirmAction.type === 'actividad' ? 'la actividad' :
                            confirmAction.type === 'noticia' ? 'la noticia' :
                                confirmAction.type === 'exalumno' ? 'al exalumno' :
                                    'al miembro'}: <strong>{confirmAction.title}</strong>?</p>
                        <div className="popup-buttons">
                            <button onClick={executeDelete}>Sí, eliminar</button>
                            <button onClick={() => setConfirmAction({ show: false, type: '', id: null, title: '' })}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                            <div className="form-group">
                                <label>Imagen 1</label>
                                <input
                                    type="file"
                                    onChange={(e) => handleImageUpload(e, setImg1)}
                                    accept="image/*"
                                />
                                {img1 && <img src={img1} alt="Preview 1" className="imagen-preview" />}
                            </div>
                            <div className="form-group">
                                <label>Imagen 2</label>
                                <input
                                    type="file"
                                    onChange={(e) => handleImageUpload(e, setImg2)}
                                    accept="image/*"
                                />
                                {img2 && <img src={img2} alt="Preview 2" className="imagen-preview" />}
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

            {showImageModal && (
                <div className="overlay" onClick={() => setShowImageModal(false)}>
                    <div className="image-preview-modal" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowImageModal(false)}>×</button>
                        <div className="images-container">
                            <div className="image-preview-item">
                                <h4>Imagen 1</h4>
                                <img src={currentImages.img1} alt="Imagen 1" />
                            </div>
                            <div className="image-preview-item">
                                <h4>Imagen 2</h4>
                                <img src={currentImages.img2} alt="Imagen 2" />
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
            if (field === 'fechaInscripcion') {
                const dateA = a.fechaInscripcion?.toDate() || new Date(0);
                const dateB = b.fechaInscripcion?.toDate() || new Date(0);
                return direction === 'asc' ? dateA - dateB : dateB - dateA;
            }

            if (field === 'id') {
                return direction === 'asc' ?
                    parseInt(a.id) - parseInt(b.id) :
                    parseInt(b.id) - parseInt(a.id);
            }

            return direction === 'asc' ?
                String(a[field]).localeCompare(String(b[field])) :
                String(b[field]).localeCompare(String(a[field]));
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
                return {
                    id: doc.id,
                    ...doc.data()
                };
            });
            // Sort by ID numerically
            const sortedExalumnos = exalumnosData.sort((a, b) =>
                parseInt(a.id) - parseInt(b.id)
            );
            setExalumnos(sortedExalumnos);
        } catch (error) {
            console.error("Error al obtener exalumnos: ", error);
        }
    };

    useEffect(() => {

        const init = async () => {
            try {
                await fetchExalumnos();
                await fetchActividades();
                await fetchNoticias();
                await fetchJuntaDirectiva();
                await fetchSolicitudes();
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 800);
            }
        };
        const fetchUser = async () => {
            const user = auth.currentUser;
            setUser(user);

            if (user) {
                try {
                    const querySnapshot = await getDocs(collection(db, 'junta-directiva'));
                    const miembro = querySnapshot.docs.find(doc => doc.data().email === user.email);
                    if (miembro) {
                        // Extract first name from nombre field
                        const nombreCompleto = miembro.data().nombre;
                        const apellidoCompleto = miembro.data().apellidos;
                        const primerApellido = apellidoCompleto.split(' ')[0];
                        const primerNombre = nombreCompleto.split(' ')[0];
                        setUserName(primerNombre + ' ' + primerApellido);
                    } else {
                        setUserName(user.email);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setUserName(user.email);
                }
            }
        };
        fetchUser();
        init();
    }, []);

    const handleViewSolicitud = (solicitud) => {
        setCurrentComprobante(solicitud.comprobante);
        setShowComprobanteModal(true);
    };

    const handleAcceptSolicitud = async (id) => {
        try {
            const solicitudRef = doc(db, 'inscripciones', id);
            const solicitudDoc = await getDoc(solicitudRef);
            const solicitudData = solicitudDoc.data();
            const fechaAceptacion = new Date();

            // Update inscripcion status
            await updateDoc(solicitudRef, {
                estado: 'aceptado',
                fechaAceptacion: fechaAceptacion
            });

            // Add to exalumnos collection
            const nextExalumnoId = await getNextId();
            await setDoc(doc(db, 'exalumnos', nextExalumnoId), {
                nombre: `${solicitudData.nombre} ${solicitudData.apellidos}`.toUpperCase(),
                dni: solicitudData.dni,
                email: solicitudData.email,
                telefono: solicitudData.telefono,
                promocion: solicitudData.promocion,
                fechaInscripcion: fechaAceptacion
            });

            // Send acceptance email
            const emailParams = {
                to_email: solicitudData.email,
                to_name: `${solicitudData.nombre} ${solicitudData.apellidos}`,
                dni: solicitudData.dni,
                fecha_aprobacion: fechaAceptacion.toLocaleDateString()
            };

            await emailjs.send(
                EMAIL_SERVICE_ID,
                EMAIL_TEMPLATE_ID_ACCEPTED,
                emailParams,
                EMAIL_PUBLIC_KEY
            );

            // Refresh both collections
            await fetchSolicitudes();
            await fetchExalumnos();

        } catch (error) {
            console.error("Error updating solicitud:", error);
        }
    };

    const renderSolicitudesMiembros = () => (
        <div className="section">
            <h2>Solicitudes de Miembros</h2>
            <div className="ex-table-content">
                <table className="solicitudes-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombres</th>
                            <th>Apellidos</th>
                            <th>DNI</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Promoción</th>
                            <th>Fecha Registro</th>
                            <th>Fecha Aceptación</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {solicitudes.map((solicitud) => (
                            <tr key={solicitud.id}>
                                <td>{solicitud.id}</td>
                                <td>{solicitud.nombre}</td>
                                <td>{solicitud.apellidos}</td>
                                <td>{solicitud.dni}</td>
                                <td>{solicitud.email}</td>
                                <td>{solicitud.telefono}</td>
                                <td>{solicitud.promocion}</td>
                                <td>{solicitud.fechaRegistro}</td>
                                <td>{solicitud.fechaAceptacion}</td>
                                <td>
                                    <span className={`status-badge ${solicitud.estado}`}>
                                        {solicitud.estado}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="btn-view"
                                            onClick={() => handleViewSolicitud(solicitud)}
                                        >
                                            <i className="fas fa-eye"></i>
                                        </button>
                                        {solicitud.estado === 'pendiente' && (
                                            <button
                                                className="btn-accept"
                                                onClick={() => handleAcceptSolicitud(solicitud.id)}
                                            >
                                                <i className="fas fa-check"></i>
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showComprobanteModal && (
                <div className="overlay" onClick={() => setShowComprobanteModal(false)}>
                    <div className="comprobante-modal" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowComprobanteModal(false)}>×</button>
                        <h3>Comprobante de Pago</h3>
                        <div className="comprobante-container">
                            <img src={currentComprobante} alt="Comprobante de pago" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

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

    const clearForm = () => {
        setTitulo('');
        setFecha('');
        setDescripcion('');
        setImagen('');
        setHorarioInicio('');
        setHorarioFin('');
        setLugar('');
        setOrganizador('');
        setEditId(null);
    };

    const handleAdd = async () => {
        try {
            setActionLoading(true);
            let nuevaActividad = {
                titulo,
                descripcion,
                horario: `${horarioInicio} - ${horarioFin}`,
                lugar,
                organizador
            };

            // Fix date timezone issue
            if (fecha) {
                const fechaObj = new Date(fecha);
                fechaObj.setMinutes(fechaObj.getMinutes() + fechaObj.getTimezoneOffset());
                nuevaActividad.fecha = fechaObj;
            }

            // Handle image update
            if (imagen && (!editId || imagen !== actividades.find(a => a.id === editId)?.imagen)) {
                nuevaActividad.imagen = imagen;
            }

            if (editId) {
                const actividadRef = doc(db, 'actividades', editId);
                await updateDoc(actividadRef, nuevaActividad);
            } else {
                const newId = await getNextActividadId();
                await setDoc(doc(db, 'actividades', newId), nuevaActividad);
            }

            clearForm();
            setShowAddPopup(false);
            await fetchActividades();
        } catch (error) {
            console.error("Error al agregar/actualizar actividad:", error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleAddExalumno = async () => {
        try {
            if (!titulo || !fecha || !email || !telf || !promocion) {
                alert('Todos los campos son obligatorios');
                return;
            }

            if (fecha.length !== 8) {
                alert('El DNI debe tener 8 dígitos');
                return;
            }

            if (telf.length !== 9) {
                alert('El teléfono debe tener 9 dígitos');
                return;
            }

            const nuevoExalumno = {
                nombre: titulo.toUpperCase(),
                dni: fecha,
                email: email.toLowerCase(),
                telefono: telf,
                promocion: promocion,
                fechaInscripcion: new Date()
            };

            if (editId) {
                await updateDoc(doc(db, 'exalumnos', editId), nuevoExalumno);
            } else {
                const newId = await getNextId();
                await setDoc(doc(db, 'exalumnos', newId), nuevoExalumno);
            }

            clearForm();
            setShowAddPopup(false);
            await fetchExalumnos();
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
        setEmail(exalumno.email || '');
        setTelf(exalumno.telefono || '');
        setPromocion(exalumno.promocion || '');
        setEditId(exalumno.id);
        setShowAddPopup(true);
    };

    const handleImageUpload = (e, setImageFunc = setImagen) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageFunc(reader.result);
            };
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
            console.error("Error al eliminar exalumno:", error);
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
            <button className='btn-añadir' onClick={handleAddClick}>
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
                            <button onClick={() => handleConfirmDelete('actividad', actividad.id, actividad.titulo)}>Eliminar</button>
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
        clearForm();
    };

    const renderNoticias = () => (
        <div className="section">
            <h2>Noticias</h2>
            <button className='btn-añadir' onClick={handleAddNoticiaClick}>
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
                            <button onClick={() => handleConfirmDelete('noticia', noticia.id, noticia.titulo)}>Eliminar</button>
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

    const handleAddNoticiaClick = () => {
        clearNoticiaForm();
        setShowNoticiaPopup(true);
    };


    const handleAddNoticia = async () => {
        try {
            setActionLoading(true);
            let nuevaNoticia = {
                titulo,
                descripcion,
                destacado
            };

            // Handle image update
            if (imagen && (!editId || imagen !== noticias.find(n => n.id === editId)?.imagen)) {
                nuevaNoticia.imagen = imagen;
            }

            if (editId) {
                const noticiaRef = doc(db, 'noticias', editId);
                await updateDoc(noticiaRef, nuevaNoticia);
            } else {
                const newId = await getNextNoticiaId();
                await setDoc(doc(db, 'noticias', newId), nuevaNoticia);
            }

            clearNoticiaForm();
            await fetchNoticias();
        } catch (error) {
            console.error("Error al agregar/actualizar noticia:", error);
        } finally {
            setActionLoading(false);
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
                            <div className="filter-option" onClick={() => sortExalumnos('fechaInscripcion')}>
                                Fecha Inscripción {sortConfig.field === 'fechaInscripcion' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
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
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Promoción</th>
                            <th>Fecha Inscripción</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExalumnos.map((exalumno) => (
                            <tr key={exalumno.id}>
                                <td>{exalumno.id}</td>
                                <td>{exalumno.nombre}</td>
                                <td>{exalumno.dni}</td>
                                <td>{exalumno.email}</td>
                                <td>{exalumno.telefono}</td>
                                <td>{exalumno.promocion}</td>
                                <td>{exalumno.fechaInscripcion?.toDate().toLocaleDateString() || '-'}</td>
                                <td>
                                    <button onClick={() => handleEditExalumno(exalumno)}>Editar</button>
                                    <button onClick={() => handleConfirmDelete('exalumno', exalumno.id, exalumno.nombre)}>
                                        Eliminar
                                    </button>                                </td>
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
        <>
            {isLoading ? (
                <LoadingScreen />
            ) : (
                <div className="admin-panel">
                    {confirmAction.show && (
                        <div className="overlay" onClick={() => setConfirmAction({ show: false, type: '', id: null, title: '' })}>
                            <div className="confirm-popup" onClick={e => e.stopPropagation()}>
                                <button
                                    className="popup-close"
                                    onClick={() => setConfirmAction({ show: false, type: '', id: null, title: '' })}
                                >×</button>
                                <p>¿Estás seguro de que deseas eliminar {
                                    confirmAction.type === 'actividad' ? 'la actividad' :
                                        confirmAction.type === 'noticia' ? 'la noticia' :
                                            confirmAction.type === 'exalumno' ? 'al exalumno' :
                                                'al miembro'
                                }: <strong>{confirmAction.title}</strong>?</p>
                                <div className="popup-buttons">
                                    <button onClick={executeDelete}>Sí, eliminar</button>
                                    <button onClick={() => setConfirmAction({ show: false, type: '', id: null, title: '' })}>
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="mobile-nav">
                        <button
                            className="sidebar-toggle"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
                        </button>
                        <span className="user-info" onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}>
                            {userName || user?.email}
                        </span>
                        {isUserDropdownOpen && (
                            <div className="user-dropdown">
                                <button onClick={handleLogout}>Cerrar sesión</button>
                            </div>
                        )}
                    </div>

                    <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                        <img src={banner} alt="GAEP Banner" className="sidebar-banner" />
                        <button onClick={() => {
                            setActiveSection('actividades');
                            setIsSidebarOpen(false);
                        }}>
                            <FaCalendarAlt className="sidebar-icon" /> Actividades
                        </button>
                        <button onClick={() => {
                            setActiveSection('noticias');
                            setIsSidebarOpen(false);
                        }}>
                            <FaNewspaper className="sidebar-icon" /> Noticias
                        </button>
                        <button onClick={() => {
                            setActiveSection('consejoDirectivo');
                            setIsSidebarOpen(false);
                        }}>
                            <FaUsers className="sidebar-icon" /> Consejo Directivo
                        </button>
                        <button onClick={() => {
                            setActiveSection('exalumnosInscritos');
                            setIsSidebarOpen(false);
                        }}>
                            <FaUserGraduate className="sidebar-icon" /> Exalumnos inscritos
                        </button>
                        <button onClick={() => {
                            setActiveSection('solicitudesMiembros');
                            setIsSidebarOpen(false);
                        }}>
                            <FaUserPlus className="sidebar-icon" /> Solicitudes Miembros
                        </button>
                    </div>
                    <div className='generalcontent'>
                        <div className="user-info-section">
                            <span className="user-name" onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}>
                                {userName || user?.email}
                            </span>
                            <img src="/images/default-user.png" alt="User" className="user-image" />

                            {isUserDropdownOpen && (
                                <div className="user-dropdown">
                                    <button onClick={handleLogout}>Cerrar sesión</button>
                                </div>
                            )}
                        </div>
                        <div className="content">
                            {activeSection === 'actividades' && renderActividades()}
                            {activeSection === 'noticias' && renderNoticias()}
                            {activeSection === 'consejoDirectivo' && renderConsejoDirectivo()}
                            {activeSection === 'exalumnosInscritos' && renderExalumnos()}
                            {activeSection === 'solicitudesMiembros' && renderSolicitudesMiembros()}
                        </div>
                    </div>

                </div>
            )}
        </>
    );
};


export default AdminPanel;