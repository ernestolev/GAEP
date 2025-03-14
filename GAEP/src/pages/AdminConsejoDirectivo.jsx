import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage, auth } from '../firebase';
import { signOut } from 'firebase/auth';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { v4 as uuidv4 } from 'uuid';
import LoadingButton from '../components/LoadingButton';
import Sidebar from '../components/Sidebar';
import styles from '../Styles/AdminConsejoDirectivo.module.css';
import LoadingScreen from '../components/LoadingScreen';
import imageCompression from 'browser-image-compression';

// Toast component
const CustomToast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.toastContent}>
        <span>{message}</span>
        <button onClick={onClose}>×</button>
      </div>
    </div>
  );
};

const AdminConsejoDirectivo = () => {
  const [juntaDirectiva, setJuntaDirectiva] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({ field: 'id', direction: 'asc' });
  const [showJuntaPopup, setShowJuntaPopup] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImages, setCurrentImages] = useState({ img1: '', img2: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [darkTheme, setDarkTheme] = useState(localStorage.getItem('theme') === 'dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  // Form states
  const [editId, setEditId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [cargo, setCargo] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [telf, setTelf] = useState('');
  const [bio, setBio] = useState('');
  const [prom, setProm] = useState('');
  const [img1, setImg1] = useState('');
  const [img2, setImg2] = useState('');

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

  const navigate = useNavigate();

  // Show toast helper
  const showToast = {
    success: (message) => {
      setToast({
        show: true,
        message,
        type: 'success'
      });
    },
    error: (message) => {
      setToast({
        show: true,
        message,
        type: 'error'
      });
    }
  };

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
        fetchJuntaDirectiva();
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

  // Fetch junta directiva data
  const fetchJuntaDirectiva = async () => {
    try {
      setIsLoading(true);
      const juntaRef = collection(firestore, 'junta-directiva');
      const snapshot = await getDocs(juntaRef);
      const juntaData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setJuntaDirectiva(juntaData);
    } catch (error) {
      console.error('Error fetching junta directiva:', error);
      showToast.error('Error al cargar los datos: ' + error.message);
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
  const handleImageUpload = async (e, setImageFunc) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setActionLoading(true);
        const compressedFile = await compressImage(file);
        const storageRef = ref(storage, `juntaDirectiva/${uuidv4()}_${file.name.replace(/\s+/g, '_')}`);
        await uploadBytes(storageRef, compressedFile);
        const downloadURL = await getDownloadURL(storageRef);
        setImageFunc(downloadURL);
        showToast.success('Imagen subida correctamente');
      } catch (error) {
        console.error("Error uploading image:", error);
        showToast.error('Error al subir la imagen: ' + error.message);
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Unified function for adding/editing member
  const handleSubmit = async () => {
    try {
      setActionLoading(true);

      if (!cargo || !dni || !email || !telf) {
        showToast.error('Por favor complete todos los campos obligatorios');
        setActionLoading(false);
        return;
      }

      const memberData = {
        // Solo incluye los campos que pueden actualizarse
        cargo,
        dni,
        email,
        telf,
        bio,
        prom,
        img1,
        img2,
        updatedAt: new Date()
      };

      if (editId) {
        // Update existing member
        const memberRef = doc(firestore, 'junta-directiva', editId);
        await updateDoc(memberRef, memberData);
        showToast.success('Miembro actualizado correctamente');
        clearJuntaForm();
        fetchJuntaDirectiva();
      }
    } catch (error) {
      console.error('Error updating member:', error);
      showToast.error('Error al guardar el miembro: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete member
  const handleDeleteMember = async () => {
    try {
      setActionLoading(true);
      await deleteDoc(doc(firestore, 'junta-directiva', confirmAction.id));

      showToast.success('Miembro eliminado correctamente');
      fetchJuntaDirectiva();
    } catch (error) {
      console.error('Error deleting member:', error);
      showToast.error('Error al eliminar el miembro: ' + error.message);
    } finally {
      setActionLoading(false);
      setConfirmAction({ show: false, id: null, title: '' });
    }
  };

  // Edit member
  const handleEditJunta = (miembro) => {
    setNombre(miembro.nombre || '');
    setApellidos(miembro.apellidos || '');
    setCargo(miembro.cargo || '');
    setDni(miembro.dni || '');
    setEmail(miembro.email || '');
    setTelf(miembro.telf || '');
    setBio(miembro.bio || '');
    setProm(miembro.prom || '');
    setImg1(miembro.img1 || '');
    setImg2(miembro.img2 || '');
    setEditId(miembro.id);
    setShowJuntaPopup(true);
  };

  // View member images
  const handleViewImages = (miembro) => {
    setCurrentImages({
      img1: miembro.img1 || '',
      img2: miembro.img2 || ''
    });
    setShowImageModal(true);
  };

  // Clear form
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
    setProm('');
    setEditId(null);
    setShowJuntaPopup(false);
  };

  // Sort function
  const sortJuntaDirectiva = (field) => {
    const direction = sortConfig.field === field && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ field, direction });

    const sortedData = [...juntaDirectiva].sort((a, b) => {
      if (a[field] < b[field]) return direction === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setJuntaDirectiva(sortedData);
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

  // Filter junta directiva based on search term
  const filteredJuntaDirectiva = juntaDirectiva.filter(miembro => {
    const searchNormalized = normalizeText(searchTerm);
    const apellidosNormalized = normalizeText(miembro.apellidos || '');
    const nombreNormalized = normalizeText(miembro.nombre || '');
    const dniNormalized = normalizeText(String(miembro.dni || ''));
    const idNormalized = normalizeText(String(miembro.id || ''));
    const cargoNormalized = normalizeText(miembro.cargo || '');

    return apellidosNormalized.includes(searchNormalized) ||
      nombreNormalized.includes(searchNormalized) ||
      dniNormalized.includes(searchNormalized) ||
      idNormalized.includes(searchNormalized) ||
      cargoNormalized.includes(searchNormalized);
  });

  const handleAddJuntaClick = () => {
    clearJuntaForm();
    setShowJuntaPopup(true);
  };

  const handleConfirmDelete = (id, title) => {
    setConfirmAction({
      show: true,
      id,
      title
    });
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className={`${styles.adminConsejoDirectivo} ${darkTheme ? styles.darkTheme : ''}`}>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        // Elimina estas props:
        // darkTheme={darkTheme}
        // toggleTheme={toggleTheme}
        userName={userName}
        handleLogout={handleLogout}
      />

      <main className={`${styles.content} admin-content`}>
        <header className={styles.sectionHeader}>
          <h1>Consejo Directivo</h1>
        </header>

        <div className={styles.searchFilterContainer}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Buscar por nombre, apellidos, cargo o DNI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search"></i>
          </div>
          <div className={styles.filterContainer}>
            <button
              className={styles.filterButton}
              onClick={() => setShowFilters(!showFilters)}
            >
              <i className="fas fa-filter"></i>
              Filtrar
            </button>
            {showFilters && (
              <div className={styles.filterDropdown}>
                <div className={styles.filterOption} onClick={() => sortJuntaDirectiva('id')}>
                  ID {sortConfig.field === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </div>
                <div className={styles.filterOption} onClick={() => sortJuntaDirectiva('apellidos')}>
                  Apellidos {sortConfig.field === 'apellidos' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </div>
                <div className={styles.filterOption} onClick={() => sortJuntaDirectiva('nombre')}>
                  Nombres {sortConfig.field === 'nombre' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </div>
                <div className={styles.filterOption} onClick={() => sortJuntaDirectiva('cargo')}>
                  Cargo {sortConfig.field === 'cargo' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </div>
                <div className={styles.filterOption} onClick={() => sortJuntaDirectiva('dni')}>
                  DNI {sortConfig.field === 'dni' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.counterDisplay}>
          Mostrando {filteredJuntaDirectiva.length} miembros
        </div>


        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Cargo</th>
                <th>DNI</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Promoción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredJuntaDirectiva.map((miembro) => (
                <tr key={miembro.id}>
                  <td data-label="Id">{miembro.id}</td>
                  <td data-label="Nombre">{miembro.nombre}</td>
                  <td data-label="Apellidos">{miembro.apellidos}</td>
                  <td data-label="Cargo">{miembro.cargo}</td>
                  <td data-label="Dni">{miembro.dni}</td>
                  <td data-label="Email">{miembro.email}</td>
                  <td data-label="Nombre">{miembro.telf}</td>
                  <td data-label="Promocion">{miembro.prom || '-'}</td>
                  <td data-label="Acciones">
                    
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.btnView}
                        onClick={() => handleViewImages(miembro)}
                        disabled={!miembro.img1 && !miembro.img2}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className={styles.btnEdit}
                        onClick={() => handleEditJunta(miembro)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className={styles.btnDelete}
                        onClick={() => handleConfirmDelete(miembro.id, `${miembro.nombre} ${miembro.apellidos}`)}
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

        {/* Add/Edit Member Modal */}
        {showJuntaPopup && (
          <div className={styles.overlay} onClick={() => setShowJuntaPopup(false)}>
            <div className={styles.modernModal} onClick={e => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>Actualizar Información del Miembro</h2>
                <button className={styles.popupClose} onClick={() => setShowJuntaPopup(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.modalForm}>
                  <div className={styles.formColumns}>
                    <div className={styles.formColumn}>
                      <div className={styles.formGroup}>
                        <label htmlFor="cargo">Cargo <span className={styles.required}>*</span></label>
                        <div className={styles.inputWithIcon}>
                          <i className="fas fa-briefcase"></i>
                          <input
                            id="cargo"
                            type="text"
                            value={cargo}
                            onChange={(e) => setCargo(e.target.value.toUpperCase())}
                            placeholder="Cargo en la directiva"
                            required
                          />
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="dni">DNI <span className={styles.required}>*</span></label>
                        <div className={styles.inputWithIcon}>
                          <i className="fas fa-id-card"></i>
                          <input
                            id="dni"
                            type="text"
                            value={dni}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              if (value.length <= 8) {
                                setDni(value);
                              }
                            }}
                            maxLength="8"
                            placeholder="Documento de identidad"
                            required
                          />
                        </div>
                        {dni && dni.length !== 8 && (
                          <span className={styles.inputError}>El DNI debe tener 8 dígitos</span>
                        )}
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="email">Email <span className={styles.required}>*</span></label>
                        <div className={styles.inputWithIcon}>
                          <i className="fas fa-envelope"></i>
                          <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Correo electrónico"
                            required
                          />
                        </div>
                      </div>

                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label htmlFor="telf">Teléfono <span className={styles.required}>*</span></label>
                          <div className={styles.inputWithIcon}>
                            <i className="fas fa-phone"></i>
                            <input
                              id="telf"
                              type="text"
                              value={telf}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                if (value.length <= 9) {
                                  setTelf(value);
                                }
                              }}
                              maxLength="9"
                              placeholder="Número de contacto"
                              required
                            />
                          </div>
                          {telf && telf.length !== 9 && (
                            <span className={styles.inputError}>El teléfono debe tener 9 dígitos</span>
                          )}
                        </div>

                        <div className={styles.formGroup}>
                          <label htmlFor="prom">Promoción</label>
                          <div className={styles.inputWithIcon}>
                            <i className="fas fa-graduation-cap"></i>
                            <input
                              id="prom"
                              type="text"
                              value={prom}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                if (value.length <= 4) {
                                  setProm(value);
                                }
                              }}
                              maxLength="4"
                              placeholder="Año de promoción"
                            />
                          </div>
                          {prom && prom.length !== 4 && prom.length > 0 && (
                            <span className={styles.inputError}>La promoción debe tener 4 dígitos</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className={styles.formColumn}>
                      <div className={styles.formGroup}>
                        <label htmlFor="bio">Biografía</label>
                        <ReactQuill
                          theme="snow"
                          value={bio}
                          onChange={setBio}
                          modules={{
                            toolbar: [
                              [{ 'header': [1, 2, 3, false] }],
                              ['bold', 'italic', 'underline'],
                              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                              ['link'],
                              ['clean']
                            ]
                          }}
                          className={styles.bioEditor}
                          placeholder="Añade información biográfica del miembro..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.imageSection}>
                    <h3>Fotografías</h3>
                    <div className={styles.imageUploadGrid}>
                      <div className={styles.imageUploadCard}>
                        <div className={styles.imageUploadContainer}>
                          {img1 ? (
                            <div className={styles.imagePreview}>
                              <img src={img1} alt="Foto 1" />
                              <button
                                className={styles.removeImageBtn}
                                onClick={() => setImg1('')}
                                type="button"
                                title="Eliminar imagen"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          ) : (
                            <label className={styles.imageUploadLabel}>
                              <input
                                type="file"
                                onChange={(e) => handleImageUpload(e, setImg1)}
                                accept="image/*"
                                className={styles.hiddenInput}
                              />
                              <div className={styles.uploadPlaceholder}>
                                <i className="fas fa-cloud-upload-alt"></i>
                                <span>Foto Principal</span>
                                <small>Haz clic para seleccionar</small>
                              </div>
                            </label>
                          )}
                        </div>
                      </div>

                      <div className={styles.imageUploadCard}>
                        <div className={styles.imageUploadContainer}>
                          {img2 ? (
                            <div className={styles.imagePreview}>
                              <img src={img2} alt="Foto 2" />
                              <button
                                className={styles.removeImageBtn}
                                onClick={() => setImg2('')}
                                type="button"
                                title="Eliminar imagen"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          ) : (
                            <label className={styles.imageUploadLabel}>
                              <input
                                type="file"
                                onChange={(e) => handleImageUpload(e, setImg2)}
                                accept="image/*"
                                className={styles.hiddenInput}
                              />
                              <div className={styles.uploadPlaceholder}>
                                <i className="fas fa-cloud-upload-alt"></i>
                                <span>Foto Secundaria</span>
                                <small>Haz clic para seleccionar</small>
                              </div>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <span className={styles.requiredNote}>
                  <span className={styles.required}>*</span> Campos obligatorios
                </span>
                
                <div className={styles.actionButtons}>
                  <button className={styles.cancelButton} onClick={() => setShowJuntaPopup(false)}>
                    Cancelar
                  </button>
                  <LoadingButton
                    onClick={handleSubmit}
                    loading={actionLoading}
                    text="Guardar Cambios"
                    className={styles.saveButton}
                    disabled={!cargo || !dni || (dni && dni.length !== 8) || !email || !telf || (telf && telf.length !== 9)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Images Modal */}
        {showImageModal && (
          <div className={styles.overlay} onClick={() => setShowImageModal(false)}>
            <div className={styles.imagePreviewModal} onClick={e => e.stopPropagation()}>
              <button className={styles.modalClose} onClick={() => setShowImageModal(false)}>×</button>
              <div className={styles.imagesContainer}>
                {currentImages.img1 && (
                  <div className={styles.imagePreviewItem}>
                    <h4>Imagen 1</h4>
                    <img src={currentImages.img1} alt="Imagen 1" />
                  </div>
                )}
                {currentImages.img2 && (
                  <div className={styles.imagePreviewItem}>
                    <h4>Imagen 2</h4>
                    <img src={currentImages.img2} alt="Imagen 2" />
                  </div>
                )}
                {!currentImages.img1 && !currentImages.img2 && (
                  <p className={styles.noImages}>No hay imágenes disponibles</p>
                )}
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
              <p>¿Estás seguro de que deseas eliminar al miembro: <strong>{confirmAction.title}</strong>?</p>
              <div className={styles.popupButtons}>
                <LoadingButton
                  onClick={handleDeleteMember}
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

export default AdminConsejoDirectivo;