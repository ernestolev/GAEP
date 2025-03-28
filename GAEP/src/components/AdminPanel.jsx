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
import { db, auth } from '../firebase';
import { signOut } from 'firebase/auth';
import '../Styles/AdminPanel.module.css';
import { LoadingScreen, LoadingDots } from '../components/LoadingScreen';
import {
    FaCalendarAlt,
    FaNewspaper,
    FaUsers,
    FaUserGraduate,
    FaUserPlus,
    FaHandshake,
    FaFutbol // Add this import
} from 'react-icons/fa';
import { FaImages } from 'react-icons/fa';
import imageCompression from 'browser-image-compression';



import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


import banner from '../assets/images/img-gaepbanner.png';
import banner2 from '../assets/images/img-gaepbanner2.png';
import userfoto from '../assets/icons/icon-userdefault.png';

const compressLogo = async (file) => {
    const options = {
        maxSizeMB: 0.5, // Reduce max size to 500KB
        maxWidthOrHeight: 800, // Reduce maximum dimensions
        useWebWorker: true,
        initialQuality: 0.7, // Lower initial quality
    };

    try {
        let compressedFile = await imageCompression(file, options);

        // If still too large, compress again with lower quality
        if (compressedFile.size > 1000000) {
            options.initialQuality = 0.5;
            compressedFile = await imageCompression(file, options);
        }

        return compressedFile;
    } catch (error) {
        console.error("Error compressing logo:", error);
        throw error;
    }
};

const AdminPanel = () => {
    const [prof, setProf] = useState('');

    const [showComprobanteModal, setShowComprobanteModal] = useState(false);
    const [currentComprobante, setCurrentComprobante] = useState(null);
    const [selectedGrupo, setSelectedGrupo] = useState(null);

    const [fechaInscripcion, setFechaInscripcion] = useState('');
    const [galeriaFotos, setGaleriaFotos] = useState([]);
    const [showGaleriaPopup, setShowGaleriaPopup] = useState(false);
    const [galeriaImagenes, setGaleriaImagenes] = useState([]);
    const [numeroPromocion, setNumeroPromocion] = useState('');
    const [searchGaleria, setSearchGaleria] = useState('');
    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: '' // 'success' or 'error'
    });

    const [sponsorEmail, setSponsorEmail] = useState('');

    const [sponsorTelefono, setSponsorTelefono] = useState('');
    const [sponsorEnlace, setSponsorEnlace] = useState('');
    const [sponsorDescripcion, setSponsorDescripcion] = useState('');
    const [sponsorUbicacion, setSponsorUbicacion] = useState('');
    const [sponsors, setSponsors] = useState([]);


    const [showSeleccionPopup, setShowSeleccionPopup] = useState(false);
    const [seleccionImagenes, setSeleccionImagenes] = useState([]);
    const [yearSeleccion, setYearSeleccion] = useState('');
    const [searchSeleccion, setSearchSeleccion] = useState('');
    const [seleccionFotos, setSeleccionFotos] = useState([]);
    const [selectedSeleccion, setSelectedSeleccion] = useState(null);


    const [showSponsorPopup, setShowSponsorPopup] = useState(false);
    const [razonSocial, setRazonSocial] = useState('');
    const [logo, setLogo] = useState('');

    const EMAIL_SERVICE_ID = 'service_73kk9jg';
    const EMAIL_TEMPLATE_ID_ACCEPTED = 'template_g8kbzrs'; // Create this template in EmailJS
    const EMAIL_PUBLIC_KEY = 'ROpbgdF-nRAD3zQuR';
    const [bio, setBio] = useState('');
    const [promocion, setPromocion] = useState('');
    const [prom, setProm] = useState('');
    const [imagenes, setImagenes] = useState([]);



    const [img1, setImg1] = useState('');
    const [img2, setImg2] = useState('');
    const [showImageModal, setShowImageModal] = useState(false);
    const [currentImages, setCurrentImages] = useState({ img1: '', img2: '' });
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState('');
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [darkTheme, setDarkTheme] = useState(localStorage.getItem('theme') === 'dark');

    const [config, setConfig] = useState({
        theme: localStorage.getItem('theme') || 'light'
    });
    const [sortBy, setSortBy] = useState('nombre');
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

    const [presidenteProm, setPresidenteProm] = useState(false);

    const fetchSeleccionFotos = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'fotos-seleccionesfutbol'));
            const fotosData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setSeleccionFotos(fotosData);
        } catch (error) {
            console.error("Error fetching selección fotos:", error);
        }
    };

    const Toast = ({ message, type, onClose }) => (
        <div className={`toast-notification ${type}`}>
            <div className="toast-content">
                {type === 'success' && <i className="fas fa-check-circle"></i>}
                {type === 'error' && <i className="fas fa-times-circle"></i>}
                <span>{message}</span>
            </div>
            <button onClick={onClose}>×</button>
        </div>
    );
    const handleConfirmDelete = (type, id, ids, title) => {
        setConfirmAction({
            show: true,
            type,
            id,
            ids,
            title
        });
    };
    const [noticiasImagenes, setNoticiasImagenes] = useState([]);
    const compressImage = async (file) => {
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            initialQuality: 0.8,
        };

        try {
            const compressedFile = await imageCompression(file, options);
            return compressedFile;
        } catch (error) {
            console.error("Error compressing image:", error);
            throw error;
        }
    };


    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/');
    };

    const toggleTheme = async () => {
        const newTheme = !darkTheme;
        setDarkTheme(newTheme);

        try {
            const userDoc = await getDocs(collection(db, 'junta-directiva'));
            const userData = userDoc.docs.find(doc => doc.data().email === user?.email);

            if (userData) {
                await updateDoc(doc(db, 'junta-directiva', userData.id), {
                    config: {
                        theme: newTheme ? 'dark' : 'light'
                    }
                });
            }

            localStorage.setItem('theme', newTheme ? 'light' : 'dark');
            document.body.classList.toggle('dark-theme');
        } catch (error) {
            console.error("Error updating theme:", error);
        }
    };

    const fetchSponsors = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'sponsor'));
            const sponsorsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setSponsors(sponsorsData);
        } catch (error) {
            console.error("Error fetching sponsors:", error);
        }
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

    const fetchGaleriaFotos = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'galeria-fotos-promociones'));
            const galeriaData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            console.log("Fetched gallery data:", galeriaData); // Debug log
            setGaleriaFotos(galeriaData);
        } catch (error) {
            console.error("Error fetching galería:", error);
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
            if (!nombre || !apellidos || !cargo || !dni || !email || !telf || !prom) {
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
                bio,
                prom, // Add promotion field
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
        setBio('');
        setProm(''); // Add this line
        setEditId(null);
        setShowJuntaPopup(false);
    };
    const executeDelete = async () => {
        try {
            setActionLoading(true);
            const { type, id, ids, title } = confirmAction;

            switch (type) {
                case 'actividad':
                    await deleteDoc(doc(db, 'actividades', id));
                    setToast({
                        show: true,
                        message: 'Actividad eliminada correctamente',
                        type: 'success'
                    });
                    await fetchActividades();
                    break;

                case 'noticia':
                    await deleteDoc(doc(db, 'noticias', id));
                    setToast({
                        show: true,
                        message: 'Noticia eliminada correctamente',
                        type: 'success'
                    });
                    await fetchNoticias();
                    break;

                case 'exalumno':
                    await deleteDoc(doc(db, 'exalumnos', id));
                    setToast({
                        show: true,
                        message: 'Exalumno eliminado correctamente',
                        type: 'success'
                    });
                    await fetchExalumnos();
                    break;

                case 'juntaDirectiva':
                    await deleteDoc(doc(db, 'junta-directiva', id));
                    setToast({
                        show: true,
                        message: 'Miembro eliminado correctamente',
                        type: 'success'
                    });
                    await fetchJuntaDirectiva();
                    break;

                case 'sponsor':
                    await deleteDoc(doc(db, 'sponsor', id));
                    setToast({
                        show: true,
                        message: 'Sponsor eliminado correctamente',
                        type: 'success'
                    });
                    await fetchSponsors();
                    break;

                case 'galeria':
                    if (Array.isArray(ids)) {
                        for (let docId of ids) {
                            await deleteDoc(doc(db, 'galeria-fotos-promociones', docId));
                        }
                        setToast({
                            show: true,
                            message: 'Galería eliminada correctamente',
                            type: 'success'
                        });
                        await fetchGaleriaFotos();
                    }
                    break;
                case 'seleccion':
                    if (Array.isArray(ids)) {
                        for (let docId of ids) {
                            await deleteDoc(doc(db, 'fotos-seleccionesfutbol', docId));
                        }
                        setToast({
                            show: true,
                            message: 'Fotos eliminadas correctamente',
                            type: 'success'
                        });
                        await fetchSeleccionFotos();
                    }
                    break;
            }
        } catch (error) {
            console.error(`Error deleting ${confirmAction.type}:`, error);
            setToast({
                show: true,
                message: `Error al eliminar ${confirmAction.type}`,
                type: 'error'
            });
        } finally {
            setActionLoading(false);
            setConfirmAction({ show: false, type: '', id: null, ids: null, title: '' });

            // Auto hide toast after 3 seconds
            setTimeout(() => {
                setToast({ show: false, message: '', type: '' });
            }, 3000);
        }
    };



    const handleEditJunta = (miembro) => {
        setNombre(miembro.nombre);
        setApellidos(miembro.apellidos);
        setCargo(miembro.cargo);
        setDni(miembro.dni);
        setEmail(miembro.email);
        setTelf(miembro.telf);
        setBio(miembro.bio || '');
        setProm(miembro.prom || ''); // Add this line
        setImg1(miembro.img1 || '');
        setImg2(miembro.img2 || '');
        setEditId(miembro.id);
        setShowJuntaPopup(true);
    };

    const handleViewGrupo = (grupo) => {
        setSelectedGrupo(grupo);
    };


    const handleDeleteImage = async (promocion, imagen) => {
        try {
            // Find all documents for this promocion
            const docs = galeriaFotos.filter(g => g['numero-promocion'] === promocion);

            // Find which document contains this image
            for (const docData of docs) {
                if (docData.imagenes.includes(imagen)) {
                    const updatedImagenes = docData.imagenes.filter(img => img !== imagen);
                    const docRef = doc(db, 'galeria-fotos-promociones', docData.id);

                    if (updatedImagenes.length === 0) {
                        // If no images left, delete the document
                        await deleteDoc(docRef);
                    } else {
                        // Update document with remaining images
                        await updateDoc(docRef, {
                            imagenes: updatedImagenes
                        });
                    }

                    // Update selectedGrupo before fetching new data
                    if (selectedGrupo) {
                        const updatedGrupo = {
                            ...selectedGrupo,
                            imagenes: selectedGrupo.imagenes.filter(img => img !== imagen)
                        };
                        setSelectedGrupo(updatedGrupo);
                    }

                    // Fetch updated data
                    const querySnapshot = await getDocs(collection(db, 'galeria-fotos-promociones'));
                    const galeriaData = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setGaleriaFotos(galeriaData);

                    break;
                }
            }
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    };
    // Update renderGaleriaFotos
    const renderGaleriaFotos = () => {
        // Group photos by promoción
        const groupedPhotos = galeriaFotos.reduce((acc, galeria) => {
            const promocion = galeria['numero-promocion'];
            if (!acc[promocion]) {
                acc[promocion] = {
                    promocion,
                    imagenes: [...galeria.imagenes],
                    ids: [galeria.id]
                };
            } else {
                acc[promocion].imagenes.push(...galeria.imagenes);
                acc[promocion].ids.push(galeria.id);
            }
            return acc;
        }, {});

        // Convert to array and sort
        const sortedGroups = Object.values(groupedPhotos).sort((a, b) =>
            b.promocion - a.promocion
        );

        return (
            <div className="section">
                <h2>Galería de Fotos por Promoción</h2>
                <div className="search-filter-container">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Buscar promoción..."
                            value={searchGaleria}
                            onChange={(e) => setSearchGaleria(e.target.value)}
                        />
                        <i className="fas fa-search"></i>
                    </div>
                </div>

                <button className='btn-añadir' onClick={() => {
                    setGaleriaImagenes([]);
                    setNumeroPromocion('');
                    setShowGaleriaPopup(true);
                }}>
                    Añadir Fotos
                </button>
                <div className='galeriaoverf'>
                    <div className="galeria-grid">
                        {sortedGroups
                            .filter(grupo => grupo.promocion.toString().includes(searchGaleria))
                            .map((grupo) => (
                                <div key={grupo.promocion} className="galeria-card">
                                    <h3>Promoción {grupo.promocion}</h3>
                                    <div className="galeria-preview">
                                        <img src={grupo.imagenes[0]} alt={`Promoción ${grupo.promocion}`} />
                                        <span className="imagen-count">{grupo.imagenes.length} fotos</span>
                                    </div>
                                    <div className="galeria-actions">
                                        <button onClick={() => handleViewGrupo(grupo)}>Ver fotos</button>
                                        <button onClick={() => handleConfirmDelete('galeria', null, grupo.ids, grupo.promocion)}>
                                            Eliminar Promoción
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>



                {/* Popup para ver fotos del grupo */}
                {selectedGrupo && (
                    <div className="overlay" onClick={() => setSelectedGrupo(null)}>
                        <div className="popup popup-lg" onClick={e => e.stopPropagation()}>
                            <button className="popup-close" onClick={() => setSelectedGrupo(null)}>×</button>
                            <div className="popup-content">
                                <h3>Fotos Promoción {selectedGrupo.promocion}</h3>
                                <div className="galeria-grid-popup">
                                    {selectedGrupo.imagenes.map((imagen, index) => (
                                        <div key={index} className="galeria-item">
                                            <img src={imagen} alt={`Foto ${index + 1}`} />
                                            <button
                                                className="remove-image"
                                                onClick={() => handleDeleteImage(selectedGrupo.promocion, imagen)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showGaleriaPopup && (
                    <div className="overlay" onClick={() => setShowGaleriaPopup(false)}>
                        <div className="popup" onClick={e => e.stopPropagation()}>
                            <button className="popup-close" onClick={() => setShowGaleriaPopup(false)}>×</button>
                            <div className="popup-content">
                                <h3>Añadir Fotos de Promoción</h3>
                                <div className="form-group">
                                    <label>Número de Promoción</label>
                                    <input
                                        type="text"
                                        value={numeroPromocion}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            if (value.length <= 4) setNumeroPromocion(value);
                                        }}
                                        maxLength="4"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Imágenes (1-8 fotos)</label>
                                    <input
                                        type="file"
                                        onChange={(e) => {
                                            if (galeriaImagenes.length < 8) {
                                                handleImageUpload(e, (newImage) => {
                                                    setGaleriaImagenes([...galeriaImagenes, newImage]);
                                                });
                                            }
                                        }}
                                        accept="image/*"
                                        className="form-control"
                                        disabled={galeriaImagenes.length >= 8}
                                    />
                                    <div className="images-preview">
                                        {galeriaImagenes.map((img, index) => (
                                            <div key={index} className="image-preview-container">
                                                <img src={img} alt={`Preview ${index + 1}`} />
                                                <button
                                                    onClick={() => {
                                                        const newImages = galeriaImagenes.filter((_, i) => i !== index);
                                                        setGaleriaImagenes(newImages);
                                                    }}
                                                    className="remove-image"
                                                >×</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="popup-buttons">
                                    <LoadingButton
                                        onClick={handleAddGaleria}
                                        loading={actionLoading}
                                        text={editId ? 'Actualizar' : 'Añadir'}
                                        disabled={!numeroPromocion || galeriaImagenes.length === 0}
                                    />
                                    <button onClick={() => setShowGaleriaPopup(false)}>Cancelar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        );
    };

    const handleAddGaleria = async () => {
        try {
            setActionLoading(true);
            if (!numeroPromocion || galeriaImagenes.length === 0) {
                alert('Por favor complete todos los campos y añada al menos una imagen');
                return;
            }

            const nuevaGaleria = {
                'numero-promocion': numeroPromocion,
                imagenes: galeriaImagenes
            };

            await addDoc(collection(db, 'galeria-fotos-promociones'), nuevaGaleria);

            setShowGaleriaPopup(false);
            setGaleriaImagenes([]);
            setNumeroPromocion('');
            await fetchGaleriaFotos();
        } catch (error) {
            console.error("Error adding galería:", error);
        } finally {
            setActionLoading(false);
        }
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
                                        if (value.length <= 8) setFecha(value);
                                    }}
                                    maxLength="8"
                                    placeholder="Ingrese DNI"
                                    required
                                />
                                {fecha && fecha.length !== 8 && !editId && (
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
                                <label>Promoción</label>
                                <input
                                    type="text"
                                    value={prom}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        if (value.length <= 4) setProm(value);
                                    }}
                                    maxLength="4"
                                />
                                {prom && prom.length !== 4 && (
                                    <span className="input-error">La promoción debe tener 4 dígitos</span>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Biografía</label>
                                <ReactQuill
                                    theme="snow"
                                    value={bio}
                                    onChange={setBio}
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
                                <LoadingButton
                                    onClick={handleAddJuntaDirectiva}
                                    loading={actionLoading}
                                    text={editId ? 'Actualizar' : 'Añadir'}
                                    disabled={!nombre || !apellidos || !cargo || !dni || !email || !telf}
                                />
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
        if (!text) return '';
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/[áàäâã]/g, 'a')
            .replace(/[éèëê]/g, 'e')
            .replace(/[íìïî]/g, 'i')
            .replace(/[óòöôõ]/g, 'o')
            .replace(/[úùüû]/g, 'u')
            .replace(/ñ/g, 'n');
    };

    const filteredExalumnos = exalumnos
        .filter(exalumno => {
            const searchLower = normalizeText(searchTerm);
            return (
                normalizeText(exalumno.nombre || '').includes(searchLower) ||
                (exalumno.dni?.toString() || '').includes(searchLower) ||
                (exalumno.id?.toString() || '').includes(searchLower) ||
                (searchLower === 'presidente' && exalumno.presidenteprom) ||
                (searchLower === 'no presidente' && !exalumno.presidenteprom) ||
                normalizeText(exalumno.email || '').includes(searchLower) ||
                normalizeText(exalumno.promocion?.toString() || '').includes(searchLower)
            );
        })
        .sort((a, b) => {
            if (sortBy === 'presidente') {
                return (b.presidenteprom ? 1 : 0) - (a.presidenteprom ? 1 : 0);
            }
            if (sortBy === 'promocion') {
                return (b.promocion || '') - (a.promocion || '');
            }
            return normalizeText(a.nombre || '').localeCompare(normalizeText(b.nombre || ''));
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
                await fetchGaleriaFotos();
                await fetchSponsors();
                await fetchSeleccionFotos();
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

        const fetchUserConfig = async () => {
            if (user) {
                try {
                    const querySnapshot = await getDocs(collection(db, 'junta-directiva'));
                    const userData = querySnapshot.docs.find(doc => doc.data().email === user.email);

                    if (userData) {
                        const userConfig = userData.data().config;
                        if (userConfig?.theme) {
                            setDarkTheme(userConfig.theme === 'dark');
                            localStorage.setItem('theme', userConfig.theme);
                            if (userConfig.theme === 'dark') {
                                document.body.classList.add('dark-theme');
                            }
                        }
                    }
                } catch (error) {
                    console.error("Error fetching user config:", error);
                }
            }
        };
        fetchUserConfig();
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
                                            <LoadingButton
                                                onClick={() => handleAcceptSolicitud(solicitud.id)}
                                                loading={actionLoading}
                                                text="Aceptar"
                                                className="btn-accept"
                                            />
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
        setImagenes([]); // Add this line
        setEditId(null);
    };

    const handleAddSponsorClick = () => {
        setRazonSocial('');
        setLogo('');
        setEditId(null);
        setShowSponsorPopup(true);
    };

    const handleEditSponsor = (sponsor) => {
        setRazonSocial(sponsor['razon-social']);
        setLogo(sponsor.logo);
        setSponsorTelefono(sponsor.telefono || '');
        setSponsorEnlace(sponsor.enlace || '');
        setSponsorDescripcion(sponsor.descripcion || '');
        setSponsorUbicacion(sponsor.ubicacion || '');
        setSponsorEmail(sponsor.email || ''); // Add this line
        setEditId(sponsor.id);
        setShowSponsorPopup(true);
    };
    const clearSponsorForm = () => {
        setRazonSocial('');
        setLogo('');
        setSponsorTelefono('');
        setSponsorEnlace('');
        setSponsorDescripcion('');
        setSponsorUbicacion('');
        setSponsorEmail(''); // Add this line
        setEditId(null);
    };

    const handleAddSponsor = async () => {
        try {
            setActionLoading(true);
            if (!razonSocial || !logo) {
                alert('La razón social y el logo son obligatorios');
                return;
            }

            const nuevoSponsor = {
                'razon-social': razonSocial,
                logo: logo,
                telefono: sponsorTelefono,
                enlace: sponsorEnlace,
                descripcion: sponsorDescripcion,
                ubicacion: sponsorUbicacion,
                email: sponsorEmail // Add this line
            };

            if (editId) {
                await updateDoc(doc(db, 'sponsor', editId), nuevoSponsor);
            } else {
                await addDoc(collection(db, 'sponsor'), nuevoSponsor);
            }

            setShowSponsorPopup(false);
            clearSponsorForm();
            await fetchSponsors();
        } catch (error) {
            console.error("Error al modificar sponsor:", error);
        } finally {
            setActionLoading(false);
        }
    };

    const renderSponsors = () => (
        <div className="section">
            <h2>Sponsors</h2>
            <button className='btn-añadir' onClick={handleAddSponsorClick}>
                Añadir Sponsor
            </button>
            <div className='sponsoroverf'>
                <div className="sponsors-grid">
                    {sponsors.map((sponsor) => (
                        <div key={sponsor.id} className="sponsor-card">
                            <div className="sponsor-logo">
                                <img src={sponsor.logo} alt={sponsor['razon-social']} />
                            </div>
                            <div className="sponsor-content">
                                <h3>{sponsor['razon-social']}</h3>
                            </div>
                            <div className="sponsor-actions">
                                <button onClick={() => handleEditSponsor(sponsor)}>
                                    Editar
                                </button>
                                <button onClick={() => handleConfirmDelete('sponsor', sponsor.id, sponsor['razon-social'])}>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showSponsorPopup && (
                <div className="overlay" onClick={() => setShowSponsorPopup(false)}>
                    <div className="popup" onClick={e => e.stopPropagation()}>
                        <button className="popup-close" onClick={() => setShowSponsorPopup(false)}>×</button>
                        <div className="popup-content">
                            <h3>{editId ? 'Actualizar Sponsor' : 'Añadir Sponsor'}</h3>
                            <div className="form-group">
                                <label>Razón Social</label>
                                <input
                                    type="text"
                                    value={razonSocial}
                                    onChange={(e) => setRazonSocial(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Logo</label>
                                <input
                                    type="file"
                                    onChange={(e) => handleImageUpload(e, setLogo)}
                                    accept="image/*"
                                />
                                {logo && (
                                    <div className="logo-preview">
                                        <img src={logo} alt="Logo preview" />
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Teléfono de Contacto</label>
                                <input
                                    type="text"
                                    value={sponsorTelefono}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        if (value.length <= 9) setSponsorTelefono(value);
                                    }}
                                    maxLength="9"
                                    placeholder="Ingrese teléfono"
                                />
                                {sponsorTelefono && sponsorTelefono.length !== 9 && (
                                    <span className="input-error">El teléfono debe tener 9 dígitos</span>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={sponsorEmail}
                                    onChange={(e) => setSponsorEmail(e.target.value)}
                                    placeholder="ejemplo@correo.com"
                                />
                            </div>
                            <div className="form-group">
                                <label>Enlace (URL)</label>
                                <input
                                    type="url"
                                    value={sponsorEnlace}
                                    onChange={(e) => setSponsorEnlace(e.target.value)}
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="form-group">
                                <label>Ubicación</label>
                                <input
                                    type="text"
                                    value={sponsorUbicacion}
                                    onChange={(e) => setSponsorUbicacion(e.target.value)}
                                    placeholder="Dirección del sponsor"
                                />
                            </div>
                            <div className="form-group">
                                <label>Descripción</label>
                                <ReactQuill
                                    theme="snow"
                                    value={sponsorDescripcion}
                                    onChange={setSponsorDescripcion}
                                    modules={{
                                        toolbar: [
                                            [{ 'header': [1, 2, 3, false] }],
                                            ['bold', 'italic', 'underline'],
                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                            ['clean']
                                        ]
                                    }}
                                />
                            </div>
                            <div className="popup-buttons">
                                <LoadingButton
                                    onClick={handleAddSponsor}
                                    loading={actionLoading}
                                    text={editId ? 'Actualizar Sponsor' : 'Añadir Sponsor'}
                                    disabled={!razonSocial || !logo}
                                />
                                <button onClick={() => setShowSponsorPopup(false)}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const handleAdd = async () => {
        try {
            setActionLoading(true);
            let nuevaActividad = {
                titulo,
                descripcion,
                horario: `${horarioInicio} - ${horarioFin}`,
                lugar,
                organizador,
                imagenes: [], // Array for multiple images
            };

            // Handle multiple images
            if (imagenes.length > 0) {
                nuevaActividad.imagenes = imagenes;
            }

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
            setActionLoading(true);
            if (!titulo || !fecha) {
                alert('El nombre y DNI son obligatorios');
                return;
            }

            const nuevoExalumno = {
                nombre: titulo.toUpperCase(),
                dni: fecha,
                email: email,
                telefono: telf,
                promocion: promocion,
                presidenteprom: presidenteProm,
                imagen: imagen,
                prof: prof
            };

            if (editId) {
                if (fechaInscripcion) {
                    const [year, month, day] = fechaInscripcion.split('-');
                    const fechaAjustada = new Date(year, month - 1, parseInt(day));
                    fechaAjustada.setUTCHours(12);
                    nuevoExalumno.fechaInscripcion = fechaAjustada;
                }
                await updateDoc(doc(db, 'exalumnos', editId), nuevoExalumno);
            } else {
                const now = new Date();
                now.setUTCHours(12);
                nuevoExalumno.fechaInscripcion = now;
                const newId = await getNextId();
                await setDoc(doc(db, 'exalumnos', newId), nuevoExalumno);
            }

            clearForm();
            setShowAddPopup(false);
            await fetchExalumnos();
        } catch (error) {
            console.error("Error al modificar exalumno:", error);
        } finally {
            setActionLoading(false);
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
        setImagen(actividad.imagen || '');
        setImagenes(actividad.imagenes || []); // Add this line
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
        setTitulo(exalumno.nombre || '');
        setFecha(exalumno.dni || '');
        setEmail(exalumno.email || '');
        setTelf(exalumno.telefono || '');
        setPromocion(exalumno.promocion || '');
        setPresidenteProm(exalumno.presidenteprom || false);
        setImagen(exalumno.imagen || '');
        setProf(exalumno.prof || ''); // Add this line
        setEditId(exalumno.id);
        setShowAddPopup(true);
    };

    const handleImageUpload = async (e, setImageFunc = setImagen) => {
        const file = e.target.files[0];
        if (file) {
            try {
                setActionLoading(true);
                const loadingMessage = document.createElement('div');
                loadingMessage.className = 'loading-message';
                loadingMessage.textContent = 'Procesando imagen...';
                e.target.parentNode.appendChild(loadingMessage);

                // Use specific compression for logos
                const compressedFile = setImageFunc === setLogo ?
                    await compressLogo(file) :
                    await compressImage(file);

                const reader = new FileReader();

                reader.onloadend = () => {
                    setImageFunc(reader.result);
                    loadingMessage.remove();
                    setActionLoading(false);
                };

                reader.readAsDataURL(compressedFile);
            } catch (error) {
                console.error("Error processing image:", error);
                setActionLoading(false);
                alert('Error al procesar la imagen. Por favor, intente con otra imagen o reduzca su tamaño.');
            }
        }
    };

    const LoadingButton = ({ onClick, loading, text, disabled, className = '' }) => (
        <button
            onClick={onClick}
            disabled={loading || disabled}
            className={`submit-button ${loading ? 'loading' : ''} ${className}`}
        >
            {text}
            {loading && <span className="loading-spinner"></span>}
        </button>
    );

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
                            style={{
                                backgroundImage: `url(${actividad.imagenes && actividad.imagenes.length > 0
                                    ? actividad.imagenes[0]
                                    : actividad.imagen || ''
                                    })`
                            }}
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
                                    <label>Imágenes (máximo 4)</label>
                                    <input
                                        type="file"
                                        onChange={(e) => {
                                            if (imagenes.length < 4) {
                                                handleImageUpload(e, (newImage) => {
                                                    setImagenes([...imagenes, newImage]);
                                                });
                                            }
                                        }}
                                        accept="image/*"
                                        className="form-control"
                                        disabled={imagenes.length >= 4}
                                    />
                                    <div className="images-preview">
                                        {imagenes.map((img, index) => (
                                            <div key={index} className="image-preview-container">
                                                <img src={img} alt={`Preview ${index + 1}`} />
                                                <button
                                                    onClick={() => {
                                                        const newImages = imagenes.filter((_, i) => i !== index);
                                                        setImagenes(newImages);
                                                    }}
                                                    className="remove-image"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="popup-buttons">
                                    <LoadingButton
                                        onClick={handleAdd}
                                        loading={actionLoading}
                                        text={editId ? 'Actualizar Actividad' : 'Agregar Actividad'}
                                        disabled={!titulo || !fecha}
                                    />
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
        clearForm();
        setShowAddPopup(true);
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
                            style={{
                                backgroundImage: `url(${noticia.imagenes && noticia.imagenes.length > 0
                                    ? noticia.imagenes[0]
                                    : noticia.imagen || ''
                                    })`
                            }}
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
                                    <label>Imágenes (máximo 4)</label>
                                    <input
                                        type="file"
                                        onChange={(e) => {
                                            if (noticiasImagenes.length < 4) {
                                                handleImageUpload(e, (newImage) => {
                                                    setNoticiasImagenes([...noticiasImagenes, newImage]);
                                                });
                                            }
                                        }}
                                        accept="image/*"
                                        className="form-control"
                                        disabled={noticiasImagenes.length >= 4}
                                    />
                                    <div className="images-preview">
                                        {noticiasImagenes.map((img, index) => (
                                            <div key={index} className="image-preview-container">
                                                <img src={img} alt={`Preview ${index + 1}`} />
                                                <button
                                                    onClick={() => {
                                                        const newImages = noticiasImagenes.filter((_, i) => i !== index);
                                                        setNoticiasImagenes(newImages);
                                                    }}
                                                    className="remove-image"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="popup-buttons">
                                    <LoadingButton
                                        onClick={handleAddNoticia}
                                        loading={actionLoading}
                                        text={editId ? 'Actualizar Noticia' : 'Agregar Noticia'}
                                        disabled={!titulo || !descripcion}
                                    />
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
        setNoticiasImagenes([]); // Add this line
        setEditId(null);
        setShowNoticiaPopup(false);
    };

    const handleAddNoticiaClick = () => {
        clearNoticiaForm();
        setShowNoticiaPopup(true);
    };

    const handleAddExalumnoClick = () => {
        setTitulo('');
        setFecha('');
        setEmail('');
        setTelf('');
        setPromocion('');
        setEditId(null);
        setShowAddPopup(true);
    };


    const handleAddNoticia = async () => {
        try {
            setActionLoading(true);
            let nuevaNoticia = {
                titulo,
                descripcion,
                destacado,
                imagenes: noticiasImagenes // Add this line
            };

            if (imagen) {
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
        setImagen(noticia.imagen || '');
        setNoticiasImagenes(noticia.imagenes || []); // Add this line
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

    const renderSeleccionFutbol = () => {
        // Group photos by year
        const groupedPhotos = seleccionFotos.reduce((acc, foto) => {
            const year = foto['year-seleccion'];
            if (!acc[year]) {
                acc[year] = {
                    year,
                    imagenes: [...foto.imagenes],
                    ids: [foto.id]
                };
            } else {
                acc[year].imagenes.push(...foto.imagenes);
                acc[year].ids.push(foto.id);
            }
            return acc;
        }, {});

        const sortedGroups = Object.values(groupedPhotos).sort((a, b) =>
            b.year - a.year
        );

        return (
            <div className="section">
                <h2>Galería de Fotos - Selecciones de Fútbol</h2>
                <div className="search-filter-container">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Buscar por año..."
                            value={searchSeleccion}
                            onChange={(e) => setSearchSeleccion(e.target.value)}
                        />
                        <i className="fas fa-search"></i>
                    </div>
                </div>

                <button className='btn-añadir' onClick={() => {
                    setSeleccionImagenes([]);
                    setYearSeleccion('');
                    setShowSeleccionPopup(true);
                }}>
                    Añadir Fotos
                </button>

                <div className='galeriaoverf'>
                    <div className="galeria-grid">
                        {sortedGroups
                            .filter(grupo => grupo.year.toString().includes(searchSeleccion))
                            .map((grupo) => (
                                <div key={grupo.year} className="galeria-card">
                                    <h3>Selección {grupo.year}</h3>
                                    <div className="galeria-preview">
                                        <img src={grupo.imagenes[0]} alt={`Selección ${grupo.year}`} />
                                        <span className="imagen-count">{grupo.imagenes.length} fotos</span>
                                    </div>
                                    <div className="galeria-actions">
                                        <button onClick={() => setSelectedSeleccion(grupo)}>Ver fotos</button>
                                        <button onClick={() => handleConfirmDelete('seleccion', null, grupo.ids, grupo.year)}>
                                            Eliminar Año
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                {selectedSeleccion && (
                    <div className="overlay" onClick={() => setSelectedSeleccion(null)}>
                        <div className="popup popup-lg" onClick={e => e.stopPropagation()}>
                            <button className="popup-close" onClick={() => setSelectedSeleccion(null)}>×</button>
                            <div className="popup-content">
                                <h3>Fotos Selección {selectedSeleccion.year}</h3>
                                <div className="galeria-grid-popup">
                                    {selectedSeleccion.imagenes.map((imagen, index) => (
                                        <div key={index} className="galeria-item">
                                            <img src={imagen} alt={`Foto ${index + 1}`} />
                                            <button
                                                className="remove-image"
                                                onClick={() => handleDeleteSeleccionImage(selectedSeleccion.year, imagen)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showSeleccionPopup && (
                    <div className="overlay" onClick={() => setShowSeleccionPopup(false)}>
                        <div className="popup" onClick={e => e.stopPropagation()}>
                            <button className="popup-close" onClick={() => setShowSeleccionPopup(false)}>×</button>
                            <div className="popup-content">
                                <h3>Añadir Fotos de Selección</h3>
                                <div className="form-group">
                                    <label>Año de Selección</label>
                                    <input
                                        type="text"
                                        value={yearSeleccion}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            if (value.length <= 4) setYearSeleccion(value);
                                        }}
                                        maxLength="4"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Imágenes (1-8 fotos)</label>
                                    <input
                                        type="file"
                                        onChange={(e) => {
                                            if (seleccionImagenes.length < 8) {
                                                handleImageUpload(e, (newImage) => {
                                                    setSeleccionImagenes([...seleccionImagenes, newImage]);
                                                });
                                            }
                                        }}
                                        accept="image/*"
                                        className="form-control"
                                        disabled={seleccionImagenes.length >= 8}
                                    />
                                    <div className="images-preview">
                                        {seleccionImagenes.map((img, index) => (
                                            <div key={index} className="image-preview-container">
                                                <img src={img} alt={`Preview ${index + 1}`} />
                                                <button
                                                    onClick={() => {
                                                        const newImages = seleccionImagenes.filter((_, i) => i !== index);
                                                        setSeleccionImagenes(newImages);
                                                    }}
                                                    className="remove-image"
                                                >×</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="popup-buttons">
                                    <LoadingButton
                                        onClick={handleAddSeleccion}
                                        loading={actionLoading}
                                        text="Añadir"
                                        disabled={!yearSeleccion || seleccionImagenes.length === 0}
                                    />
                                    <button onClick={() => setShowSeleccionPopup(false)}>Cancelar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const handleAddSeleccion = async () => {
        try {
            setActionLoading(true);
            if (!yearSeleccion || seleccionImagenes.length === 0) {
                alert('Por favor complete todos los campos y añada al menos una imagen');
                return;
            }

            const nuevaSeleccion = {
                'year-seleccion': yearSeleccion,
                imagenes: seleccionImagenes
            };

            await addDoc(collection(db, 'fotos-seleccionesfutbol'), nuevaSeleccion);

            setShowSeleccionPopup(false);
            setSeleccionImagenes([]);
            setYearSeleccion('');
            await fetchSeleccionFotos();

            setToast({
                show: true,
                message: 'Fotos añadidas correctamente',
                type: 'success'
            });
        } catch (error) {
            console.error("Error adding selección:", error);
            setToast({
                show: true,
                message: 'Error al añadir fotos',
                type: 'error'
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteSeleccionImage = async (year, imagen) => {
        try {
            const docs = seleccionFotos.filter(g => g['year-seleccion'] === year);

            for (const docData of docs) {
                if (docData.imagenes.includes(imagen)) {
                    const updatedImagenes = docData.imagenes.filter(img => img !== imagen);
                    const docRef = doc(db, 'fotos-seleccionesfutbol', docData.id);

                    if (updatedImagenes.length === 0) {
                        await deleteDoc(docRef);
                    } else {
                        await updateDoc(docRef, {
                            imagenes: updatedImagenes
                        });
                    }

                    if (selectedSeleccion) {
                        setSelectedSeleccion(prev => ({
                            ...prev,
                            imagenes: prev.imagenes.filter(img => img !== imagen)
                        }));
                    }

                    await fetchSeleccionFotos();
                    break;
                }
            }
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    };

    const renderExalumnos = () => (
        <div className="section">
            <h2>Exalumnos Inscritos</h2>
            <div className="search-filter-container">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Buscar por nombre, DNI o ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <i className="fas fa-search"></i>
                </div>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                >
                    <option value="nombre">Ordenar por Nombre</option>
                    <option value="presidente">Ordenar por Presidente</option>
                    <option value="promocion">Ordenar por Promoción</option>
                </select>
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
                            <th>Profesión</th>
                            <th>Promoción</th>
                            <th>Presidente</th>
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
                                <td>{exalumno.email || '-'}</td>
                                <td>{exalumno.telefono || '-'}</td>
                                <td>{exalumno.prof || '-'}</td>
                                <td>{exalumno.promocion || '-'}</td>
                                <td>{exalumno.presidenteprom ? 'Sí' : 'No'}</td>
                                <td>{exalumno.fechaInscripcion?.toDate().toLocaleDateString() || '-'}</td>
                                <td>
                                    <button onClick={() => handleEditExalumno(exalumno)}>Editar</button>
                                    <button onClick={() => handleConfirmDelete('exalumno', exalumno.id, exalumno.nombre)}>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button className='btn-añadiralumn' onClick={handleAddExalumnoClick}>
                Añadir Exalumno
            </button>


            {showConfirm && (
                <div className="overlay" onClick={() => setShowConfirm(false)}>
                    <div className="confirm-popup" onClick={e => e.stopPropagation()}>
                        <button className="popup-close" onClick={() => setShowConfirm(false)}>×</button>
                        <p>¿Estás seguro de que deseas eliminar este exalumno?</p>
                        <div className="popup-buttons">
                            <LoadingButton
                                onClick={handleAddExalumno}
                                loading={actionLoading}
                                text={editId ? 'Actualizar Exalumno' : 'Añadir Exalumno'}
                                disabled={!titulo || !fecha || !email || !telf || !promocion}
                            />
                            <button onClick={() => setShowAddPopup(false)}>Cancelar</button>
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
                                    placeholder="Ingrese nombres completos"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>DNI</label>
                                <input
                                    type="text"
                                    value={fecha}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        if (value.length <= 8) setFecha(value);
                                    }}
                                    maxLength="8"
                                    placeholder="Ingrese DNI"
                                    required
                                />
                                {fecha && fecha.length !== 8 && !editId && (
                                    <span className="input-error">El DNI debe tener 8 dígitos</span>
                                )}
                            </div>
                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={presidenteProm}
                                        onChange={(e) => setPresidenteProm(e.target.checked)}
                                    />
                                    Presidente de Promoción
                                </label>
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Ingrese email"
                                    required
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
                                    placeholder="Ingrese teléfono"
                                    required
                                />
                                {telf && telf.length !== 9 && (
                                    <span className="input-error">El teléfono debe tener 9 dígitos</span>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Profesión u Oficio</label>
                                <input
                                    type="text"
                                    value={prof}
                                    onChange={(e) => setProf(e.target.value)}
                                    placeholder="Ingrese profesión u oficio"
                                />
                            </div>

                            <div className="form-group">
                                <label>Promoción</label>
                                <input
                                    type="text"
                                    value={promocion}
                                    onChange={(e) => {
                                        // Allow numbers and hyphen
                                        const value = e.target.value.replace(/[^0-9-]/g, '');
                                        if (value.length <= 6) setPromocion(value);
                                    }}
                                    maxLength="6"
                                    placeholder="Ej: 1973-2"
                                    required
                                />
                                {promocion && promocion.length > 6 && (
                                    <span className="input-error">La promoción debe tener máximo 6 caracteres</span>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Fecha de Inscripción</label>
                                <input
                                    type="date"
                                    value={fechaInscripcion}
                                    onChange={(e) => setFechaInscripcion(e.target.value)}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Foto</label>
                                <input
                                    type="file"
                                    onChange={(e) => handleImageUpload(e, setImagen)}
                                    accept="image/*"
                                />
                                {imagen && (
                                    <div className="imagealumn-preview">
                                        <img src={imagen} alt="Preview" className="imagealumn-preview" />
                                        <button
                                            className="remove-image"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setImagen('');
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="popup-buttons">
                                <LoadingButton
                                    onClick={handleAddExalumno}
                                    loading={actionLoading}
                                    text={editId ? 'Actualizar Exalumno' : 'Añadir Exalumno'}
                                    disabled={!titulo || !fecha} // Only name and DNI are required
                                />
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
                        <img
                            src={darkTheme ? banner : banner2}
                            alt="GAEP Banner"
                            className="sidebar-banner"
                        />
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

                        <button onClick={() => {
                            setActiveSection('sponsors');
                            setIsSidebarOpen(false);
                        }}>
                            <FaHandshake className="sidebar-icon" /> Sponsors
                        </button>
                        <button onClick={() => {
                            setActiveSection('galeriaFotos');
                            setIsSidebarOpen(false);
                        }}>
                            <FaImages className="sidebar-icon" /> Galería de Fotos
                        </button>
                        <button onClick={() => {
                            setActiveSection('seleccionFutbol');
                            setIsSidebarOpen(false);
                        }}>
                            <FaFutbol className="sidebar-icon" /> Fotos Selección Fútbol
                        </button>
                        {/* 
                        <button className="theme-toggle" onClick={toggleTheme}>
                            {darkTheme ? (
                                <i className="fas fa-sun"></i>
                            ) : (
                                <i className="fas fa-moon"></i>
                            )}
                            <p className='modotext'>Modo</p>
                        </button>
                        */}
                    </div>
                    <div className='generalcontent'>
                        <div className="user-info-section">
                            <div className="user-controls">
                                <span className="user-name" onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}>
                                    {userName || user?.email}
                                </span>

                            </div>
                            <img src={userfoto} alt="User" className="user-image" />
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
                            {activeSection === 'galeriaFotos' && renderGaleriaFotos()}
                            {activeSection === 'sponsors' && renderSponsors()}
                            {activeSection === 'seleccionFutbol' && renderSeleccionFutbol()}

                        </div>
                    </div>

                </div>

            )}
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ show: false, message: '', type: '' })}
                />
            )}
        </>
    );
};


export default AdminPanel;