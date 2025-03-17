import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';
import { auth, firestore, storage } from '../firebase';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import LoadingButton from '../components/LoadingButton';
import showToast, { CustomToast } from '../components/Toast';
import Sidebar from '../components/Sidebar';
import styles from '../Styles/AdminActividades.module.css';
import LoadingScreen from '../components/LoadingScreen';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const AdminActividades = () => {
    const [actividades, setActividades] = useState([]);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [editId, setEditId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [confirmAction, setConfirmAction] = useState({
        show: false,
        id: null,
        title: ''
    });
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState('');
    const [darkTheme, setDarkTheme] = useState(localStorage.getItem('theme') === 'dark');
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

    // Form fields
    const [titulo, setTitulo] = useState('');
    const [fecha, setFecha] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [imagen, setImagen] = useState('');
    const [horario, setHorario] = useState('');
    const [horarioInicio, setHorarioInicio] = useState('');
    const [horarioFin, setHorarioFin] = useState('');
    const [lugar, setLugar] = useState('');
    const [organizador, setOrganizador] = useState('');
    const [destacado, setDestacado] = useState(false);
    const [imagenes, setImagenes] = useState([]);

    const navigate = useNavigate();

    // Helper function to format Firebase timestamps or handle date strings
    const formatDate = (dateValue) => {
        if (!dateValue) return '';

        // Check if it's a Firebase Timestamp
        if (dateValue && typeof dateValue === 'object' && dateValue.seconds !== undefined) {
            const date = new Date(dateValue.seconds * 1000);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        }

        // Si es un string en formato ISO (YYYY-MM-DD), lo devolvemos tal cual
        if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
            return dateValue;
        }

        // Si es otro formato de string, intentamos convertirlo a fecha y formatear
        try {
            const date = new Date(dateValue);
            if (!isNaN(date.getTime())) {
                return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            }
        } catch (e) {
            console.error("Error al formatear fecha:", e);
        }

        // Si todo lo demás falla, devolvemos el valor original
        return dateValue;
    };


    const handleRemoveImage = (indexToRemove) => {
        setImagenes(imagenes.filter((_, index) => index !== indexToRemove));
    };

    useEffect(() => {
        const handleResize = () => {
            setIsSidebarOpen(window.innerWidth > 768);
        };

        window.addEventListener('resize', handleResize);

        // Check authentication
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setUserName(currentUser.displayName || currentUser.email);
                fetchActividades();
            } else {
                navigate('/login');
            }
        });

        // Apply theme
        document.body.classList.toggle('dark-theme', darkTheme);

        return () => {
            window.removeEventListener('resize', handleResize);
            unsubscribe();
        };
    }, [navigate, darkTheme]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
            showToast.success('Has cerrado sesión correctamente');
        } catch (error) {
            showToast.error('Error al cerrar sesión: ' + error.message);
        }
    };

    const toggleTheme = () => {
        const newTheme = !darkTheme;
        setDarkTheme(newTheme);
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
        document.body.classList.toggle('dark-theme', newTheme);
    };

    const fetchActividades = async () => {
        setIsLoading(true);
        try {
            const actividadesCollection = collection(firestore, 'actividades');
            const querySnapshot = await getDocs(actividadesCollection);
            const actividadesData = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();

                // Preferir fechaTexto si existe, de lo contrario formatear fecha
                const formattedDate = data.fechaTexto || formatDate(data.fecha);

                console.log(`Actividad ${doc.id}: fecha guardada = ${data.fecha}, fecha mostrada = ${formattedDate}`);

                actividadesData.push({
                    id: doc.id,
                    ...data,
                    fecha: formattedDate,
                    horarioInicio: data.horarioInicio || '',
                    horarioFin: data.horarioFin || '',
                    // Asegurarnos de que imagenes siempre sea un array
                    imagenes: data.imagenes || [],
                    // Mantener compatibilidad con el campo imagen anterior
                    imagen: data.imagen || '',
                    createdAt: data.createdAt ? new Date(data.createdAt.seconds * 1000) : new Date()
                });
            });

            // Sort by date, newest first
            actividadesData.sort((a, b) => {
                return new Date(b.fecha) - new Date(a.fecha);
            });

            setActividades(actividadesData);
        } catch (error) {
            console.error("Error fetching actividades:", error);
            displayToast("Error al cargar las actividades: " + error.message, "error");
        } finally {
            setIsLoading(false);
        }
    };

    const displayToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    const handleConfirmDelete = (id, title) => {
        setConfirmAction({ show: true, id, title });
    };

    const handleDelete = async () => {
        if (!confirmAction.id) return;

        setActionLoading(true);
        try {
            const actividadRef = doc(firestore, 'actividades', confirmAction.id);
            await deleteDoc(actividadRef);

            displayToast("Actividad eliminada con éxito", "success");
            fetchActividades();
        } catch (error) {
            console.error("Error deleting actividad:", error);
            displayToast("Error al eliminar la actividad: " + error.message, "error");
        } finally {
            setActionLoading(false);
            setConfirmAction({ show: false, id: null, title: '' });
        }
    };

    const handleEdit = (actividad) => {
        setEditId(actividad.id);
        setTitulo(actividad.titulo || '');
        setFecha(actividad.fecha || '');
        setDescripcion(actividad.descripcion || '');
        setImagenes(actividad.imagenes || []);
        setHorarioInicio(actividad.horarioInicio || '');
        setHorarioFin(actividad.horarioFin || '');
        setLugar(actividad.lugar || '');
        setOrganizador(actividad.organizador || '');
        setDestacado(actividad.destacado || false);
        setShowAddPopup(true);
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const remainingSlots = 5 - imagenes.length;
        if (remainingSlots <= 0) {
            displayToast("Has alcanzado el límite máximo de 5 imágenes", "error");
            return;
        }

        const filesToProcess = files.slice(0, remainingSlots);

        setActionLoading(true);

        try {
            const uploadPromises = filesToProcess.map(async (file) => {
                const fileName = `actividades/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
                const storageRef = ref(storage, fileName);
                await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(storageRef);
                return downloadURL;
            });

            const newImages = await Promise.all(uploadPromises);
            setImagenes([...imagenes, ...newImages]);
            displayToast("Imágenes subidas correctamente", "success");
        } catch (error) {
            console.error("Error uploading images:", error);
            displayToast("Error al cargar las imágenes: " + error.message, "error");
        } finally {
            setActionLoading(false);
        }
    };

    const clearForm = () => {
        setTitulo('');
        setFecha('');
        setDescripcion('');
        setImagenes([]);
        setHorario('');
        setHorarioInicio('');
        setHorarioFin('');
        setLugar('');
        setOrganizador('');
        setDestacado(false);
        setEditId(null);
    };

    const handleAdd = async () => {
        if (!titulo || !fecha || !descripcion) {
            displayToast("Por favor complete todos los campos requeridos", "error");
            return;
        }

        setActionLoading(true);
        try {
            // Guardar la fecha como string explícitamente
            const fechaString = fecha;

            console.log("Fecha seleccionada para guardar:", fechaString);

            const actividadData = {
                titulo,
                fecha: fechaString, // Guardar la fecha como string YYYY-MM-DD
                fechaTexto: fechaString, // Campo adicional para asegurar que se muestra correctamente
                descripcion,
                imagenes,
                horarioInicio,
                horarioFin,
                lugar,
                organizador,
                destacado,
                createdAt: Timestamp.now()
            };

            if (editId) {
                const actividadRef = doc(firestore, 'actividades', editId);
                await updateDoc(actividadRef, actividadData);
                displayToast("Actividad actualizada con éxito", "success");
            } else {
                const actividadesCollection = collection(firestore, 'actividades');
                await addDoc(actividadesCollection, actividadData);
                displayToast("Actividad añadida con éxito", "success");
            }

            clearForm();
            setShowAddPopup(false);
            fetchActividades();
        } catch (error) {
            console.error("Error saving actividad:", error);
            displayToast("Error al guardar la actividad: " + error.message, "error");
        } finally {
            setActionLoading(false);
        }
    };
    const filteredActividades = actividades.filter(actividad =>
        actividad.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        actividad.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return <LoadingScreen />;
    }

    const parseTimeString = (timeString) => {
        if (!timeString) return null;
        const today = new Date();
        const [hours, minutes] = timeString.split(':').map(Number);
        today.setHours(hours, minutes, 0, 0);
        return today;
    };

    const formatTimeString = (date) => {
        return date.toTimeString().slice(0, 5);
    };

    return (
        <div className={`${styles.adminActividades} ${darkTheme ? styles.darkTheme : ''}`}>
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                darkTheme={darkTheme}
                toggleTheme={toggleTheme}
                userName={userName}
                handleLogout={handleLogout}
            />

            <main className={`${styles.content} admin-content`}>
                <header className={styles.sectionHeader}>
                    <h1><FaCalendarAlt className={styles.headerIcon} /> Administración de Actividades</h1>
                </header>

                <div className={styles.sectionControls}>
                    <div className={styles.searchBox}>
                        <input
                            type="text"
                            placeholder="Buscar actividades..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <i className="fas fa-search"></i>
                    </div>
                    <button className={styles.addButton} onClick={() => {
                        clearForm();
                        setShowAddPopup(true);
                    }}>
                        <i className="fas fa-plus"></i> Añadir Actividad
                    </button>
                </div>

                <div className={styles.counterDisplay}>
                    Mostrando {filteredActividades.length} actividades
                </div>

                <div className={styles.activitiesGrid}>
                    {filteredActividades.length === 0 ? (
                        <div className={styles.noResults}>
                            <i className="fas fa-calendar-times"></i>
                            <p>No se encontraron actividades</p>
                        </div>
                    ) : (
                        filteredActividades.map(actividad => (
                            <div key={actividad.id} className={`${styles.activityCard} ${actividad.destacado ? styles.destacado : ''}`}>
                                {actividad.destacado && <span className={styles.destacadoBadge}>Destacado</span>}
                                <div className={styles.activityImage}>
                                    {actividad.imagenes && actividad.imagenes.length > 0 ? (
                                        <img src={actividad.imagenes[0]} alt={actividad.titulo} />
                                    ) : actividad.imagen ? (
                                        // Para compatibilidad con actividades antiguas que usaban 'imagen'
                                        <img src={actividad.imagen} alt={actividad.titulo} />
                                    ) : (
                                        <div className={styles.noImage}>
                                            <i className="fas fa-calendar"></i>
                                        </div>
                                    )}
                                </div>
                                <div className={styles.activityContent}>
                                    <h3>{actividad.titulo}</h3>
                                    <p className={styles.fecha}>
                                        <i className="fas fa-calendar-day"></i> {actividad.fecha}
                                    </p>
                                    {actividad.lugar && (
                                        <p className={styles.lugar}><i className="fas fa-map-marker-alt"></i> {actividad.lugar}</p>
                                    )}
                                    <div className={styles.activityActions}>
                                        <button onClick={() => handleEdit(actividad)} className={styles.editButton}>
                                            <i className="fas fa-edit"></i> Editar
                                        </button>
                                        <button onClick={() => handleConfirmDelete(actividad.id, actividad.titulo)} className={styles.deleteButton}>
                                            <i className="fas fa-trash-alt"></i> Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {showAddPopup && (
                    <div className={styles.overlay} onClick={() => setShowAddPopup(false)}>
                        <div className={styles.popup} onClick={e => e.stopPropagation()}>
                            <button className={styles.popupClose} onClick={() => setShowAddPopup(false)}>×</button>
                            <div className={styles.popupContent}>
                                <h3>{editId ? 'Editar Actividad' : 'Nueva Actividad'}</h3>

                                <div className={styles.formTabs}>
                                    <div className={styles.formContainer}>
                                        <div className={styles.formColumn}>
                                            <div className={styles.formGroup}>
                                                <label>Título<span className={styles.requiredField}>*</span></label>
                                                <input
                                                    type="text"
                                                    value={titulo}
                                                    onChange={(e) => setTitulo(e.target.value)}
                                                    placeholder="Nombre de la actividad"
                                                    required
                                                    className={styles.formInput}
                                                />
                                            </div>

                                            <div className={styles.formRow}>
                                                <div className={styles.formGroup}>
                                                    <label>Fecha<span className={styles.requiredField}>*</span></label>
                                                    <DatePicker
                                                        selected={fecha ? (() => {
                                                            // Crear fecha sin problemas de zona horaria
                                                            const [year, month, day] = fecha.split('-').map(Number);
                                                            return new Date(year, month - 1, day);
                                                        })() : null}
                                                        onChange={(date) => {
                                                            if (!date) {
                                                                setFecha('');
                                                                return;
                                                            }
                                                            // Formatear fecha sin ajustes de zona horaria
                                                            const year = date.getFullYear();
                                                            const month = String(date.getMonth() + 1).padStart(2, '0');
                                                            const day = String(date.getDate()).padStart(2, '0');
                                                            const formattedDate = `${year}-${month}-${day}`;
                                                            console.log("Fecha seleccionada:", formattedDate);
                                                            setFecha(formattedDate);
                                                        }}
                                                        dateFormat="dd/MM/yyyy"
                                                        placeholderText="Selecciona una fecha"
                                                        className={styles.dateTimeInput}
                                                        calendarClassName={styles.calendar}
                                                        popperClassName={styles.datepickerPopper}
                                                        wrapperClassName={styles.datePickerWrapper}
                                                        showPopperArrow={false}
                                                        customInput={
                                                            <div className={styles.customDateInput}>
                                                                <i className="fas fa-calendar-alt"></i>
                                                                <input
                                                                    readOnly
                                                                    placeholder="Selecciona una fecha"
                                                                    value={fecha ? (() => {
                                                                        // Mostrar fecha formateada para el usuario
                                                                        const [year, month, day] = fecha.split('-').map(Number);
                                                                        return new Date(year, month - 1, day).toLocaleDateString();
                                                                    })() : ''}
                                                                />
                                                            </div>
                                                        }
                                                    />
                                                </div>

                                                <div className={styles.formGroup}>
                                                    <label>Destacar</label>
                                                    <div className={styles.toggleSwitch}>
                                                        <input
                                                            type="checkbox"
                                                            id="destacado-toggle"
                                                            checked={destacado}
                                                            onChange={(e) => setDestacado(e.target.checked)}
                                                        />
                                                        <label htmlFor="destacado-toggle">
                                                            <span className={styles.toggleTrack}></span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={styles.formRow}>
                                                <div className={styles.formGroup}>
                                                    <label>Hora de inicio</label>
                                                    <DatePicker
                                                        selected={horarioInicio ? parseTimeString(horarioInicio) : null}
                                                        onChange={(time) => setHorarioInicio(time ? formatTimeString(time) : '')}
                                                        showTimeSelect
                                                        showTimeSelectOnly
                                                        timeIntervals={15}
                                                        timeCaption="Hora"
                                                        dateFormat="HH:mm"
                                                        placeholderText="Selecciona hora"
                                                        className={styles.dateTimeInput}
                                                        popperClassName={styles.timePickerPopper}
                                                        wrapperClassName={styles.datePickerWrapper}
                                                        customInput={
                                                            <div className={styles.customTimeInput}>
                                                                <i className="fas fa-clock"></i>
                                                                <input
                                                                    readOnly
                                                                    placeholder="Selecciona hora"
                                                                    value={horarioInicio || ''}
                                                                />
                                                            </div>
                                                        }
                                                    />
                                                </div>

                                                <div className={styles.formGroup}>
                                                    <label>Hora de fin</label>
                                                    <DatePicker
                                                        selected={horarioFin ? parseTimeString(horarioFin) : null}
                                                        onChange={(time) => setHorarioFin(time ? formatTimeString(time) : '')}
                                                        showTimeSelect
                                                        showTimeSelectOnly
                                                        timeIntervals={15}
                                                        timeCaption="Hora"
                                                        dateFormat="HH:mm"
                                                        placeholderText="Selecciona hora"
                                                        className={styles.dateTimeInput}
                                                        popperClassName={styles.timePickerPopper}
                                                        wrapperClassName={styles.datePickerWrapper}
                                                        customInput={
                                                            <div className={styles.customTimeInput}>
                                                                <i className="fas fa-clock"></i>
                                                                <input
                                                                    readOnly
                                                                    placeholder="Selecciona hora"
                                                                    value={horarioFin || ''}
                                                                />
                                                            </div>
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div className={styles.formRow}>
                                                <div className={styles.formGroup}>
                                                    <label>Lugar</label>
                                                    <div className={styles.inputWithIcon}>
                                                        <i className="fas fa-map-marker-alt"></i>
                                                        <input
                                                            type="text"
                                                            value={lugar}
                                                            onChange={(e) => setLugar(e.target.value)}
                                                            placeholder="Ej: Auditorio Principal"
                                                        />
                                                    </div>
                                                </div>

                                                <div className={styles.formGroup}>
                                                    <label>Organizador</label>
                                                    <div className={styles.inputWithIcon}>
                                                        <i className="fas fa-users"></i>
                                                        <input
                                                            type="text"
                                                            value={organizador}
                                                            onChange={(e) => setOrganizador(e.target.value)}
                                                            placeholder="Ej: Junta Directiva GAEP"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles.formColumn}>
                                            <div className={styles.formGroup}>
                                                <label>Descripción<span className={styles.requiredField}>*</span></label>
                                                <ReactQuill
                                                    theme="snow"
                                                    value={descripcion}
                                                    onChange={setDescripcion}
                                                    modules={{
                                                        toolbar: [
                                                            [{ 'header': [1, 2, 3, false] }],
                                                            ['bold', 'italic', 'underline'],
                                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                            ['link'],
                                                            ['clean']
                                                        ]
                                                    }}
                                                    className={styles.formQuill}
                                                />
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label>Imágenes (máximo 5)</label>
                                                <div className={styles.imageUploadContainer}>
                                                    <div className={styles.imageUploader}>
                                                        <input
                                                            type="file"
                                                            id="actividad-imagenes"
                                                            className={styles.hiddenInput}
                                                            onChange={handleImageUpload}
                                                            accept="image/*"
                                                            multiple
                                                            disabled={imagenes.length >= 5}
                                                        />
                                                        <label htmlFor="actividad-imagenes" className={styles.uploadLabel}>
                                                            <i className="fas fa-cloud-upload-alt"></i>
                                                            <span>Seleccionar imágenes</span>
                                                        </label>
                                                    </div>

                                                    {imagenes.length > 0 && (
                                                        <div className={styles.imagePreviewGrid}>
                                                            {imagenes.map((img, index) => (
                                                                <div key={index} className={styles.imagePreviewCard}>
                                                                    <img src={img} alt={`Vista previa ${index + 1}`} />
                                                                    <button
                                                                        className={styles.removeImageBtn}
                                                                        onClick={() => handleRemoveImage(index)}
                                                                        type="button"
                                                                    >
                                                                        <i className="fas fa-times"></i>
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.formActions}>
                                        <div className={styles.requiredNote}><span className={styles.requiredField}>*</span> Campos obligatorios</div>
                                        <div className={styles.formButtons}>
                                            <button
                                                className={styles.cancelButton}
                                                onClick={() => setShowAddPopup(false)}
                                            >
                                                Cancelar
                                            </button>
                                            <LoadingButton
                                                onClick={handleAdd}
                                                loading={actionLoading}
                                                text={editId ? "Actualizar Actividad" : "Añadir Actividad"}
                                                disabled={!titulo || !fecha || !descripcion}
                                                className={styles.submitButton}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {confirmAction.show && (
                    <div className={styles.overlay} onClick={() => setConfirmAction({ show: false, id: null, title: '' })}>
                        <div className={styles.confirmPopup} onClick={e => e.stopPropagation()}>
                            <button
                                className={styles.popupClose}
                                onClick={() => setConfirmAction({ show: false, id: null, title: '' })}
                            >×</button>
                            <p>¿Estás seguro de que deseas eliminar la actividad: <strong>{confirmAction.title}</strong>?</p>
                            <div className={styles.popupButtons}>
                                <LoadingButton
                                    onClick={handleDelete}
                                    loading={actionLoading}
                                    text="Sí, eliminar"
                                />
                                <button onClick={() => setConfirmAction({ show: false, id: null, title: '' })}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {toast.show && (
                    <div className={`${styles.toastNotification} ${styles[toast.type]}`}>
                        <div className={styles.toastContent}>
                            {toast.type === 'success' && <i className="fas fa-check-circle"></i>}
                            {toast.type === 'error' && <i className="fas fa-times-circle"></i>}
                            <span>{toast.message}</span>
                        </div>
                        <button onClick={() => setToast({ show: false, message: '', type: '' })}>×</button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminActividades;