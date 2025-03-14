import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, firestore, storage } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import imageCompression from 'browser-image-compression';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import LoadingButton from '../components/LoadingButton';
import showToast, { CustomToast } from '../components/Toast';
import Sidebar from '../components/Sidebar';
import styles from '../Styles/AdminExalumnos.module.css';
import LoadingScreen from '../components/LoadingScreen';
import { FaUserGraduate, FaFilter } from 'react-icons/fa';

const AdminExalumnos = () => {
  // State for exalumnos data
  const [exalumnos, setExalumnos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('nombre');
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedPromocion, setSelectedPromocion] = useState('');
  const [promociones, setPromociones] = useState([]);
  const [expandedRows, setExpandedRows] = useState(new Set());

  // State for adding/editing exalumno
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [editId, setEditId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [promocion, setPromocion] = useState('');
  const [fechaInscripcion, setFechaInscripcion] = useState('');
  const [imagen, setImagen] = useState('');
  const [presidenteProm, setPresidenteProm] = useState(false);
  const [prof, setProf] = useState('');

  // UI state
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [darkTheme, setDarkTheme] = useState(localStorage.getItem('theme') === 'dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: ''
  });
  const [confirmAction, setConfirmAction] = useState({
    show: false,
    id: null,
    title: ''
  });
  const [lastId, setLastId] = useState(0);


  const toggleRow = (id) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const navigate = useNavigate();

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
      showToast.success('Has cerrado sesión correctamente');
    } catch (error) {
      showToast.error('Error al cerrar sesión: ' + error.message);
    }
  };



  // Handle authentication and resize events
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
        fetchExalumnos();
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

  const updateExistingIds = async () => {
    if (!confirm("¿Estás seguro de que deseas actualizar los IDs de todos los exalumnos? Esta operación puede tomar tiempo.")) {
      return;
    }

    try {
      setActionLoading(true);
      const exalumnosRef = collection(firestore, 'exalumnos');
      const snapshot = await getDocs(query(exalumnosRef, orderBy('nombre')));

      let counter = 1;
      for (const doc of snapshot.docs) {
        await updateDoc(doc.ref, {
          customId: counter.toString()
        });
        counter++;
      }

      showToast.success(`Se actualizaron ${counter - 1} registros con IDs secuenciales`);
      fetchExalumnos(); // Recargar datos

    } catch (error) {
      console.error("Error updating IDs:", error);
      showToast.error("Error al actualizar IDs: " + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Fetch exalumnos data
  const fetchExalumnos = async () => {
    try {
      setIsLoading(true);
      let exalumnosRef = collection(firestore, 'exalumnos');
      let q;

      // If a specific promoción is selected
      if (selectedPromocion) {
        q = query(exalumnosRef, where('promocion', '==', selectedPromocion));
      } else {
        q = query(exalumnosRef);
      }

      const snapshot = await getDocs(q);

      const exalumnosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Busca el valor numérico más alto del campo customId
      let maxCustomId = 0;
      exalumnosData.forEach(exalumno => {
        const numericId = parseInt(exalumno.customId || 0);
        if (!isNaN(numericId) && numericId > maxCustomId) {
          maxCustomId = numericId;
        }
      });

      setLastId(maxCustomId);
      console.log("Último ID encontrado:", maxCustomId);

      // Extract unique promociones for filter
      const uniquePromociones = [...new Set(exalumnosData.map(ex => ex.promocion))]
        .filter(Boolean)
        .sort((a, b) => b - a);

      setPromociones(uniquePromociones);
      setExalumnos(exalumnosData);
    } catch (error) {
      console.error('Error fetching exalumnos:', error);
      showToast.error('Error al cargar los exalumnos: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Image compression function
  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 800,
      useWebWorker: true,
      initialQuality: 0.7,
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
      console.error("Error compressing image:", error);
      throw error;
    }
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setActionLoading(true); // Mostrar loading mientras se sube
        const compressedFile = await compressImage(file);
        // Asegúrate de que la ruta coincida con tus reglas de Storage
        const storageRef = ref(storage, `exalumnos/${uuidv4()}_${file.name.replace(/\s+/g, '_')}`);
        await uploadBytes(storageRef, compressedFile);
        const downloadURL = await getDownloadURL(storageRef);
        setImagen(downloadURL);
        showToast.success('Imagen subida correctamente');
      } catch (error) {
        console.error("Error uploading image:", error);
        showToast.error('Error al subir la imagen: ' + error.message);
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Delete exalumno
  const handleDeleteExalumno = async () => {
    try {
      setActionLoading(true);
      await deleteDoc(doc(firestore, 'exalumnos', confirmAction.id));

      setToast({
        show: true,
        message: 'Exalumno eliminado correctamente',
        type: 'success'
      });

      fetchExalumnos();
    } catch (error) {
      console.error('Error deleting exalumno:', error);
      setToast({
        show: true,
        message: 'Error al eliminar el exalumno: ' + error.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
      setConfirmAction({ show: false, id: null, title: '' });
    }
  };

  // Update exalumno status (active/inactive)
  const handleToggleStatus = async (id, isActive) => {
    try {
      setActionLoading(true);
      await updateDoc(doc(firestore, 'exalumnos', id), {
        activo: !isActive
      });

      setToast({
        show: true,
        message: `Exalumno ${!isActive ? 'activado' : 'desactivado'} correctamente`,
        type: 'success'
      });

      fetchExalumnos();
    } catch (error) {
      console.error('Error updating exalumno status:', error);
      setToast({
        show: true,
        message: 'Error al cambiar el estado del exalumno: ' + error.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Normalize text for search
  const normalizeText = (text) => {
    if (!text) return '';
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[áàäâã]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöôõ]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/ñ/g, 'n');
  };

  // Filter exalumnos based on search term and filters
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
        return (b.presidenteprom || false) - (a.presidenteprom || false);
      }
      if (sortBy === 'promocion') {
        return (b.promocion || '') - (a.promocion || '');
      }
      return normalizeText(a.nombre || '').localeCompare(normalizeText(b.nombre || ''));
    });

  const handleConfirmDelete = (id, title) => {
    setConfirmAction({
      show: true,
      id,
      title
    });
  };

  const handleAddExalumnoClick = () => {
    clearExalumnoForm();
    setShowAddPopup(true);
  };

  const handleEditExalumno = (exalumno) => {
    setNombre(exalumno.nombre || '');
    setDni(exalumno.dni || '');
    setEmail(exalumno.email || '');
    setTelefono(exalumno.telefono || '');
    setPromocion(exalumno.promocion || '');
    setPresidenteProm(exalumno.presidenteprom || false);
    setImagen(exalumno.imagen || '');
    setProf(exalumno.prof || '');
    setEditId(exalumno.id);

    // Format date if exists
    if (exalumno.fechaInscripcion && typeof exalumno.fechaInscripcion === 'object' && exalumno.fechaInscripcion.seconds) {
      const date = new Date(exalumno.fechaInscripcion.seconds * 1000);
      setFechaInscripcion(date.toISOString().split('T')[0]);
    } else {
      setFechaInscripcion(exalumno.fechaInscripcion || '');
    }

    setShowAddPopup(true);
  };

  const clearExalumnoForm = () => {
    setNombre('');
    setDni('');
    setEmail('');
    setTelefono('');
    setPromocion('');
    setFechaInscripcion('');
    setImagen('');
    setPresidenteProm(false);
    setProf('');
    setEditId(null);
  };

  const handleAddExalumno = async () => {
    try {
      setActionLoading(true);

      if (!nombre || !dni) {
        showToast.error('Nombre y DNI son campos obligatorios');
        setActionLoading(false);
        return;
      }

      // Si estamos editando, usamos el customId existente
      // Si estamos creando, generamos el siguiente ID
      const nextId = editId ? null : lastId + 1;

      const exalumnoData = {
        nombre,
        dni,
        email,
        telefono,
        promocion,
        fechaInscripcion: fechaInscripcion || new Date().toISOString().split('T')[0],
        imagen,
        presidenteprom: presidenteProm,
        prof,
        activo: true,
        updatedAt: new Date(),
        // Agrega el ID personalizado:
        customId: editId ? undefined : nextId.toString()
      };

      if (editId) {
        await updateDoc(doc(firestore, 'exalumnos', editId), exalumnoData);
        setToast({
          show: true,
          message: 'Exalumno actualizado correctamente',
          type: 'success'
        });
      } else {
        const exalumnosRef = collection(firestore, 'exalumnos');
        await addDoc(exalumnosRef, exalumnoData);

        // Actualiza el último ID
        setLastId(nextId);

        setToast({
          show: true,
          message: 'Exalumno añadido correctamente',
          type: 'success'
        });
      }

      setShowAddPopup(false);
      clearExalumnoForm();
      fetchExalumnos();

    } catch (error) {
      console.error('Error saving exalumno:', error);
      setToast({
        show: true,
        message: 'Error al guardar el exalumno: ' + error.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className={`${styles.adminExalumnos} ${darkTheme ? styles.darkTheme : ''}`}>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        userName={userName}
        handleLogout={handleLogout}
      />

      <main className={`${styles.content} admin-content`}>
        <header className={styles.sectionHeader}>
          <h1><FaUserGraduate className={styles.headerIcon} /> Exalumnos Inscritos</h1>
        </header>

        <div className={styles.searchFilterContainer}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Buscar por nombre, DNI, promoción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search"></i>
          </div>

          <div className={styles.filterControls}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="nombre">Ordenar por Nombre</option>
              <option value="presidente">Ordenar por Presidente</option>
              <option value="promocion">Ordenar por Promoción</option>
            </select>

            <select
              className={styles.promocionSelect}
              value={selectedPromocion}
              onChange={(e) => setSelectedPromocion(e.target.value)}
            >
              <option value="">Todas las promociones</option>
              {promociones.map(promocion => (
                <option key={promocion} value={promocion}>{promocion}</option>
              ))}
            </select>

            <button
              className={styles.filterButton}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter /> Filtros
            </button>
          </div>
        </div>

        <div className={styles.counterDisplay}>
          Mostrando {filteredExalumnos.length} de {exalumnos.length} exalumnos en total
        </div>

        <div className={styles.actionButtonContainer}>
          <button className={styles.btnPrimary} onClick={handleAddExalumnoClick}>
            <i className="fas fa-plus"></i> Añadir Exalumno
          </button>

          {/* Botón de administrador, puedes ocultarlo con CSS si lo prefieres */}
          <button
            className={styles.btnSecondary}
            onClick={updateExistingIds}
            disabled={actionLoading}
            title="Actualiza todos los registros con IDs secuenciales"
          >
            <i className="fas fa-sync-alt"></i> Actualizar IDs
          </button>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
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
                <tr
                  key={exalumno.id}
                  className={`${exalumno.activo ? '' : styles.inactiveRow} ${expandedRows.has(exalumno.id) ? styles.expanded : ''}`}
                  onClick={() => toggleRow(exalumno.id)}
                >
                  <td data-label="ID">{exalumno.customId || exalumno.id.substring(0, 6)}</td>
                  <td data-label="Nombre">
                    {exalumno.nombre}
                    <i className={`fas fa-chevron-down ${styles.expandIcon}`}></i>
                  </td>
                  <td data-label="DNI">{exalumno.dni}</td>
                  <td data-label="Email">{exalumno.email || '-'}</td>
                  <td data-label="Teléfono">{exalumno.telefono || '-'}</td>
                  <td data-label="Profesión">{exalumno.prof || '-'}</td>
                  <td data-label="Promoción">{exalumno.promocion || '-'}</td>
                  <td data-label="Presidente">{exalumno.presidenteprom ? 'Sí' : 'No'}</td>
                  <td data-label="Fecha Inscripción">
                    {exalumno.fechaInscripcion && typeof exalumno.fechaInscripcion === 'object' && exalumno.fechaInscripcion.seconds
                      ? new Date(exalumno.fechaInscripcion.seconds * 1000).toLocaleDateString()
                      : exalumno.fechaInscripcion || '-'}
                  </td>
                  <td data-label="Acciones">
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.btnEdit}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditExalumno(exalumno);
                        }}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className={styles.btnDelete}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConfirmDelete(exalumno.id, exalumno.nombre);
                        }}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Exalumno Modal */}
        {showAddPopup && (
          <div className={styles.overlay} onClick={() => setShowAddPopup(false)}>
            <div className={styles.popup} onClick={e => e.stopPropagation()}>
              <button className={styles.popupClose} onClick={() => setShowAddPopup(false)}>×</button>

              <div className={styles.modalHeader}>
                <h3>{editId ? 'Actualizar Exalumno' : 'Nuevo Exalumno'}</h3>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.formColumns}>
                  <div className={styles.formColumn}>
                    <div className={styles.formGroup}>
                      <label>
                        <i className="fas fa-user"></i> Nombres <span className={styles.required}>*</span>
                      </label>
                      <div className={styles.inputWithIcon}>
                        <i className="fas fa-user"></i>
                        <input
                          type="text"
                          value={nombre}
                          onChange={(e) => setNombre(e.target.value.toUpperCase())}
                          placeholder="Ingrese nombres completos"
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>
                        <i className="fas fa-id-card"></i> DNI <span className={styles.required}>*</span>
                      </label>
                      <div className={styles.inputWithIcon}>
                        <i className="fas fa-id-card"></i>
                        <input
                          type="text"
                          value={dni}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 8) setDni(value);
                          }}
                          maxLength="8"
                          placeholder="Ingrese DNI"
                          required
                        />
                      </div>
                      {dni && dni.length !== 8 && !editId && (
                        <span className={styles.inputError}>El DNI debe tener 8 dígitos</span>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={presidenteProm}
                          onChange={(e) => setPresidenteProm(e.target.checked)}
                        />
                        <span>Presidente de Promoción</span>
                      </label>
                    </div>

                    <div className={styles.formGroup}>
                      <label>
                        <i className="fas fa-envelope"></i> Email
                      </label>
                      <div className={styles.inputWithIcon}>
                        <i className="fas fa-envelope"></i>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Ingrese email"
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.formColumn}>
                    <div className={styles.formGroup}>
                      <label>
                        <i className="fas fa-phone"></i> Teléfono
                      </label>
                      <div className={styles.inputWithIcon}>
                        <i className="fas fa-phone"></i>
                        <input
                          type="text"
                          value={telefono}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 9) setTelefono(value);
                          }}
                          maxLength="9"
                          placeholder="Ingrese teléfono"
                        />
                      </div>
                      {telefono && telefono.length !== 9 && (
                        <span className={styles.inputError}>El teléfono debe tener 9 dígitos</span>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label>
                        <i className="fas fa-briefcase"></i> Profesión u Oficio
                      </label>
                      <div className={styles.inputWithIcon}>
                        <i className="fas fa-briefcase"></i>
                        <input
                          type="text"
                          value={prof}
                          onChange={(e) => setProf(e.target.value)}
                          placeholder="Ingrese profesión u oficio"
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>
                        <i className="fas fa-graduation-cap"></i> Promoción
                      </label>
                      <div className={styles.inputWithIcon}>
                        <i className="fas fa-graduation-cap"></i>
                        <input
                          type="text"
                          value={promocion}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 6) setPromocion(value);
                          }}
                          maxLength="6"
                          placeholder="Ej: 1973-2"
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>
                        <i className="fas fa-calendar-alt"></i> Fecha de Inscripción
                      </label>
                      <div className={styles.inputWithIcon}>
                        <i className="fas fa-calendar-alt"></i>
                        <input
                          type="date"
                          value={fechaInscripcion}
                          onChange={(e) => setFechaInscripcion(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.formGroup} style={{ marginTop: '1.5rem' }}>
                  <label>
                    <i className="fas fa-image"></i> Foto
                  </label>
                  <div className={styles.fileUploadContainer}>
                    {!imagen ? (
                      <div className={styles.fileInputWrapper}>
                        <label className={styles.fileInputLabel}>
                          <i className="fas fa-cloud-upload-alt"></i>
                          <strong>Selecciona una imagen</strong>
                          <span>O arrastra y suelta aquí</span>
                          <input
                            type="file"
                            onChange={handleImageUpload}
                            accept="image/*"
                          />
                        </label>
                      </div>
                    ) : (
                      <div className={styles.imagenPreview}>
                        <img src={imagen} alt="Preview" />
                        <button
                          className={styles.removeImage}
                          onClick={() => setImagen('')}
                          title="Eliminar imagen"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <div className={styles.popupButtons}>
                  <button
                    onClick={() => setShowAddPopup(false)}
                    className={styles.btnSecondary}
                  >
                    Cancelar
                  </button>
                  <LoadingButton
                    onClick={handleAddExalumno}
                    loading={actionLoading}
                    text={editId ? 'Actualizar' : 'Añadir'}
                    className={styles.btnPrimary}
                    disabled={!nombre || !dni}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {confirmAction.show && (
          <div className={styles.overlay} onClick={() => setConfirmAction({ show: false, id: null, title: '' })}>
            <div className={styles.confirmPopup} onClick={e => e.stopPropagation()}>
              <button
                className={styles.popupClose}
                onClick={() => setConfirmAction({ show: false, id: null, title: '' })}
              >×</button>
              <p>¿Estás seguro de que deseas eliminar al exalumno: <strong>{confirmAction.title}</strong>?</p>
              <div className={styles.popupButtons}>
                <LoadingButton
                  onClick={handleDeleteExalumno}
                  loading={actionLoading}
                  text="Sí, eliminar"
                  className={styles.btnDanger}
                />
                <button
                  onClick={() => setConfirmAction({ show: false, id: null, title: '' })}
                  className={styles.btnSecondary}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast notification */}
        {toast.show && (
          <CustomToast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ show: false, message: '', type: '' })}
          />
        )}
      </main>
    </div>
  );
};

export default AdminExalumnos;