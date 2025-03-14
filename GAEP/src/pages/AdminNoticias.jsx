import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy, Timestamp, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth, firestore, storage } from '../firebase';
import { signOut } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import LoadingButton from '../components/LoadingButton';
import imageCompression from 'browser-image-compression';
import Sidebar from '../components/Sidebar';
import LoadingScreen from '../components/LoadingScreen';
import styles from '../Styles/AdminNoticias.module.css';

const AdminNoticias = () => {
  const [noticias, setNoticias] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNoticiaPopup, setShowNoticiaPopup] = useState(false);
  const [noticiasImagenes, setNoticiasImagenes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({ field: 'fecha', direction: 'desc' });
  const [selectedFilter, setSelectedFilter] = useState('todas');
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  // Form states
  const [editId, setEditId] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [destacado, setDestacado] = useState(false);
  const [imagen, setImagen] = useState('');
  const [activeTab, setActiveTab] = useState('info'); // 'info' o 'media'

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

  // Toast component
  const Toast = ({ message, type, onClose }) => (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.toastContent}>
        {type === 'success' && <i className="fas fa-check-circle"></i>}
        {type === 'error' && <i className="fas fa-times-circle"></i>}
        <span>{message}</span>
      </div>
      <button onClick={onClose}>×</button>
    </div>
  );

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
      setToast({
        show: true,
        message: 'Has cerrado sesión correctamente',
        type: 'success'
      });
    } catch (error) {
      setToast({
        show: true,
        message: 'Error al cerrar sesión: ' + error.message,
        type: 'error'
      });
    }
  };

  // Handle authentication and resize events
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);

    // Check authentication and load data
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setUserName(currentUser.displayName || currentUser.email);
        console.log("Usuario autenticado, cargando noticias...");
        fetchNoticias();
      } else {
        console.log("No hay usuario autenticado, redirigiendo a login");
        navigate('/login');
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      unsubscribe();
    };
  }, [navigate]);

  // Fetch noticias data
  const fetchNoticias = async () => {
    try {
      setIsLoading(true);
      const noticiasCollection = collection(firestore, 'noticias');
      const querySnapshot = await getDocs(noticiasCollection);

      if (querySnapshot.empty) {
        console.log('No se encontraron noticias');
        setNoticias([]);
        return;
      }

      const noticiasData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        // Log para depuración
        console.log('Noticia raw data:', data);

        return {
          id: doc.id,
          titulo: data.titulo || '',
          descripcion: data.descripcion || '',
          destacado: data.destacado || false,
          imagenes: data.imagenes || []
        };
      });

      console.log('Noticias procesadas:', noticiasData);
      setNoticias(noticiasData);

    } catch (error) {
      console.error('Error al cargar noticias:', error);
      setToast({
        show: true,
        message: 'Error al cargar las noticias: ' + error.message,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Image compression function
  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1200,
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

  // Handle image upload for noticias
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const maxImages = 4 - noticiasImagenes.length;
    const filesToProcess = files.slice(0, maxImages);

    if (filesToProcess.length > 0) {
      try {
        setActionLoading(true);

        const uploadPromises = filesToProcess.map(async (file) => {
          const compressedFile = await compressImage(file);
          const fileName = `noticias/${Date.now()}_${uuidv4()}_${file.name.replace(/\s+/g, '_')}`;
          const storageRef = ref(storage, fileName);
          await uploadBytes(storageRef, compressedFile);
          const downloadURL = await getDownloadURL(storageRef);
          return downloadURL;
        });

        const uploadedUrls = await Promise.all(uploadPromises);
        setNoticiasImagenes([...noticiasImagenes, ...uploadedUrls]);
        setToast({
          show: true,
          message: 'Imágenes subidas correctamente',
          type: 'success'
        });
      } catch (error) {
        console.error("Error uploading images:", error);
        setToast({
          show: true,
          message: 'Error al subir las imágenes: ' + error.message,
          type: 'error'
        });
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Remove an image from the list
  const handleRemoveImage = (index) => {
    const newImages = [...noticiasImagenes];
    newImages.splice(index, 1);
    setNoticiasImagenes(newImages);
  };

  // Add/Edit noticia
  const handleAddNoticia = async () => {
    if (!titulo || !descripcion) {
      setToast({
        show: true,
        message: 'Por favor completa título y descripción',
        type: 'error'
      });
      return;
    }

    try {
      setActionLoading(true);

      const noticiaData = {
        titulo: titulo,
        descripcion: descripcion,
        destacado: destacado,
        imagenes: noticiasImagenes
      };

      console.log('Guardando noticia:', noticiaData);

      if (editId) {
        await setDoc(doc(firestore, 'noticias', editId), noticiaData);
      } else {
        await addDoc(collection(firestore, 'noticias'), noticiaData);
      }

      setToast({
        show: true,
        message: editId ? 'Noticia actualizada correctamente' : 'Noticia añadida correctamente',
        type: 'success'
      });

      clearNoticiaForm();
      fetchNoticias();

    } catch (error) {
      console.error('Error:', error);
      setToast({
        show: true,
        message: 'Error al guardar la noticia: ' + error.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };


  // Delete noticia
  const handleDeleteNoticia = async () => {
    if (!confirmAction.id) return;

    try {
      setActionLoading(true);

      // Find the noticia to get image URLs
      const noticia = noticias.find(n => n.id === confirmAction.id);

      // Delete images from storage if they exist
      if (noticia && noticia.imagenes && noticia.imagenes.length > 0) {
        for (const imageUrl of noticia.imagenes) {
          try {
            const imagePath = imageUrl.split('?')[0].split('/').slice(3).join('/');
            const imageRef = ref(storage, decodeURIComponent(imagePath));
            await deleteObject(imageRef);
          } catch (storageError) {
            console.error("Error deleting image from storage:", storageError);
            // Continue with next image
          }
        }
      }

      // Delete the document from Firestore
      const noticiaRef = doc(firestore, 'noticias', confirmAction.id);
      await deleteDoc(noticiaRef);

      setToast({
        show: true,
        message: 'Noticia eliminada correctamente',
        type: 'success'
      });

      fetchNoticias();
    } catch (error) {
      console.error('Error deleting noticia:', error);
      setToast({
        show: true,
        message: 'Error al eliminar la noticia: ' + error.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
      setConfirmAction({ show: false, id: null, title: '' });
    }
  };

  // Edit noticia
  const handleEditNoticia = (noticia) => {
    setTitulo(noticia.titulo || '');
    setDescripcion(noticia.descripcion || '');
    setDestacado(noticia.destacado || false);
    setImagen(noticia.imagen || '');
    // Handle both old and new image structure
    setNoticiasImagenes(noticia.imagenes || (noticia.imagen ? [noticia.imagen] : []));
    setEditId(noticia.id);
    setShowNoticiaPopup(true);
    setActiveTab('info');
  };

  // Clear form
  const clearNoticiaForm = () => {
    setTitulo('');
    setDescripcion('');
    setDestacado(false);
    setImagen('');
    setNoticiasImagenes([]);
    setEditId(null);
    setShowNoticiaPopup(false);
  };

  // Sort function
  const sortNoticias = (field) => {
    const direction = sortConfig.field === field && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ field, direction });

    const sortedData = [...noticias].sort((a, b) => {
      if (field === 'fecha') {
        const dateA = new Date(a.fecha);
        const dateB = new Date(b.fecha);
        return direction === 'asc' ? dateA - dateB : dateB - dateA;
      }

      if (field === 'titulo') {
        return direction === 'asc'
          ? a.titulo.localeCompare(b.titulo)
          : b.titulo.localeCompare(a.titulo);
      }

      return 0;
    });

    setNoticias(sortedData);
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

  // Filter noticias based on search term and filters
  const filteredNoticias = noticias.filter(noticia => {
    const searchNormalized = normalizeText(searchTerm);
    const tituloNormalized = noticia.titulo ? normalizeText(noticia.titulo) : '';
    const descripcionText = noticia.descripcion ?
      (typeof noticia.descripcion === 'string' ?
        noticia.descripcion.replace(/<[^>]+>/g, '') :
        '') :
      '';
    const descripcionNormalized = normalizeText(descripcionText);

    const matchesSearch = searchTerm === '' ||
      tituloNormalized.includes(searchNormalized) ||
      descripcionNormalized.includes(searchNormalized);

    if (selectedFilter === 'todas') return matchesSearch;
    if (selectedFilter === 'destacadas') return matchesSearch && noticia.destacado;
    if (selectedFilter === 'regulares') return matchesSearch && !noticia.destacado;

    return matchesSearch;
  });

  const handleAddNoticiaClick = () => {
    clearNoticiaForm();
    setShowNoticiaPopup(true);
    setActiveTab('info');
  };

  const handleConfirmDelete = (id, title) => {
    setConfirmAction({
      show: true,
      id,
      title
    });
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className={styles.adminNoticias}>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        userName={userName}
        handleLogout={handleLogout}
      />

      <div className={styles.contentContainer}>
        <div className={styles.sectionHeader}>
          <h1>Administración de Noticias</h1>
        </div>

        <div className={styles.controlsContainer}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Buscar noticia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search"></i>
          </div>

          <div className={styles.filters}>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="todas">Todas las noticias</option>
              <option value="destacadas">Solo destacadas</option>
              <option value="regulares">No destacadas</option>
            </select>

            <button
              className={styles.filterButton}
              onClick={() => setShowFilters(!showFilters)}
            >
              <i className="fas fa-filter"></i>
              Ordenar
            </button>

            {showFilters && (
              <div className={styles.filterDropdown}>
                <div
                  className={styles.filterOption}
                  onClick={() => sortNoticias('fecha')}
                >
                  Fecha {sortConfig.field === 'fecha' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </div>
                <div
                  className={styles.filterOption}
                  onClick={() => sortNoticias('titulo')}
                >
                  Título {sortConfig.field === 'titulo' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.counterDisplay}>
          Mostrando {filteredNoticias.length} de {noticias.length} noticias
        </div>

        <div className={styles.actionButtonContainer}>
          <button className={styles.addButton} onClick={handleAddNoticiaClick}>
            <i className="fas fa-plus"></i> Añadir Noticia
          </button>
        </div>

        <div className={styles.noticiasGrid}>
          {filteredNoticias.length === 0 ? (
            <div className={styles.noResults}>
              <i className="fas fa-newspaper"></i>
              <p>No se encontraron noticias</p>
            </div>
          ) : (
            filteredNoticias.map((noticia) => (
              <div key={noticia.id} className={styles.noticiaCard}>
                <div
                  className={styles.noticiaImagen}
                  style={{
                    backgroundImage: `url(${noticia.imagenes && noticia.imagenes.length > 0
                      ? noticia.imagenes[0]
                      : noticia.imagen || ''
                      })`
                  }}
                >
                  {noticia.destacado && (
                    <span className={styles.badgeDestacado}>
                      <i className="fas fa-star"></i> Destacada
                    </span>
                  )}
                </div>
                <div className={styles.noticiaContent}>
                  <h3>{noticia.titulo}</h3>
                  <p className={styles.noticiaFecha}>{formatDate(noticia.fecha)}</p>
                </div>
                <div className={styles.noticiaActions}>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEditNoticia(noticia)}
                  >
                    <i className="fas fa-edit"></i> Editar
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleConfirmDelete(noticia.id, noticia.titulo)}
                  >
                    <i className="fas fa-trash"></i> Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Noticia Modal - Rediseñado */}
      {showNoticiaPopup && (
        <div className={styles.overlay} onClick={() => setShowNoticiaPopup(false)}>
          <div className={styles.modalContainer} onClick={e => e.stopPropagation()}>
            <div className={styles.modal}>
              <button className={styles.modalClose} onClick={() => setShowNoticiaPopup(false)}>
                <i className="fas fa-times"></i>
              </button>

              <div className={styles.modalHeader}>
                <h2>{editId ? 'Editar Noticia' : 'Crear Nueva Noticia'}</h2>
                <div className={styles.modalTabs}>
                  <button
                    className={`${styles.tabButton} ${activeTab === 'info' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('info')}
                  >
                    <i className="fas fa-info-circle"></i> Información
                  </button>
                  <button
                    className={`${styles.tabButton} ${activeTab === 'media' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('media')}
                  >
                    <i className="fas fa-images"></i> Imágenes
                    <span className={styles.badgeCount}>{noticiasImagenes.length}</span>
                  </button>
                </div>
              </div>

              <div className={styles.modalBody}>
                {activeTab === 'info' && (
                  <>
                    <div className={styles.formGroup}>
                      <label htmlFor="titulo">
                        <i className="fas fa-heading"></i> Título
                        <span className={styles.required}>*</span>
                      </label>
                      <input
                        id="titulo"
                        type="text"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        placeholder="Ingrese título de la noticia"
                        required
                        className={styles.formControl}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="descripcion">
                        <i className="fas fa-align-left"></i> Contenido
                        <span className={styles.required}>*</span>
                      </label>
                      <div className={styles.quillWrapper}>
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
                    </div>

                    <div className={styles.formGroup}>
                      <div className={styles.toggleContainer}>
                        <label htmlFor="destacado" className={styles.toggleLabel}>
                          <i className="fas fa-star"></i> Destacar esta noticia
                        </label>
                        <div className={styles.toggle}>
                          <input
                            type="checkbox"
                            id="destacado"
                            checked={destacado}
                            onChange={(e) => setDestacado(e.target.checked)}
                          />
                          <label htmlFor="destacado" className={styles.toggleSwitch}>
                            <span className={styles.toggleSlider}></span>
                          </label>
                        </div>
                      </div>
                      <p className={styles.helpText}>
                        Las noticias destacadas aparecen en posiciones preferentes en la web
                      </p>
                    </div>
                  </>
                )}

                {activeTab === 'media' && (
                  <div className={styles.mediaTab}>
                    <div className={styles.uploadContainer}>
                      <input
                        type="file"
                        id="imagenes"
                        onChange={handleImageUpload}
                        accept="image/*"
                        multiple
                        className={styles.fileInput}
                        disabled={noticiasImagenes.length >= 4}
                      />
                      <label htmlFor="imagenes" className={styles.uploadArea}>
                        <div className={styles.uploadIcon}>
                          <i className="fas fa-cloud-upload-alt"></i>
                        </div>
                        <div className={styles.uploadText}>
                          <strong>Arrastra aquí tus imágenes</strong>
                          <span>o haz clic para seleccionar (máximo 4)</span>
                        </div>
                      </label>
                    </div>

                    {noticiasImagenes.length > 0 && (
                      <div className={styles.imageGrid}>
                        {noticiasImagenes.map((img, index) => (
                          <div key={index} className={styles.imageItem}>
                            <img src={img} alt={`Imagen ${index + 1}`} />
                            <div className={styles.imageOverlay}>
                              <button
                                type="button"
                                className={styles.imageRemoveBtn}
                                onClick={() => handleRemoveImage(index)}
                                title="Eliminar imagen"
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className={styles.imageCounter}>
                      <span className={noticiasImagenes.length >= 4 ? styles.counterFull : ''}>
                        {noticiasImagenes.length}/4 imágenes
                      </span>
                      {noticiasImagenes.length >= 4 && (
                        <span className={styles.limitMessage}>
                          Has alcanzado el límite máximo de imágenes
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.modalFooter}>
                {activeTab === 'info' ? (
                  <button
                    type="button"
                    className={styles.nextButton}
                    onClick={() => setActiveTab('media')}
                  >
                    Siguiente: Imágenes <i className="fas fa-arrow-right"></i>
                  </button>
                ) : (
                  <button
                    type="button"
                    className={styles.backButton}
                    onClick={() => setActiveTab('info')}
                  >
                    <i className="fas fa-arrow-left"></i> Volver a Información
                  </button>
                )}

                <div className={styles.actionButtons}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => setShowNoticiaPopup(false)}
                  >
                    Cancelar
                  </button>
                  <LoadingButton
                    onClick={handleAddNoticia}
                    loading={actionLoading}
                    text={editId ? 'Guardar Cambios' : 'Publicar Noticia'}
                    className={styles.saveButton}
                    disabled={!titulo || !descripcion}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmAction.show && (
        <div className={styles.overlay} onClick={() => setConfirmAction({ show: false, id: null, title: '' })}>
          <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
            <div className={styles.confirmIcon}>
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h3>¿Eliminar esta noticia?</h3>
            <p>Estás a punto de eliminar: <strong>{confirmAction.title}</strong></p>
            <p className={styles.warningText}>Esta acción no se puede deshacer.</p>

            <div className={styles.confirmActions}>
              <button
                onClick={() => setConfirmAction({ show: false, id: null, title: '' })}
                className={styles.cancelDeleteButton}
              >
                Cancelar
              </button>
              <LoadingButton
                onClick={handleDeleteNoticia}
                loading={actionLoading}
                text="Sí, eliminar"
                className={styles.confirmDeleteButton}
              />
            </div>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}
    </div>
  );
};

export default AdminNoticias;