import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { collection, getDocs, doc, addDoc, deleteDoc, query, orderBy, where, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth, firestore, storage } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import imageCompression from 'browser-image-compression';
import { FaFutbol } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import LoadingScreen from '../components/LoadingScreen';
import LoadingButton from '../components/LoadingButton';
import styles from '../Styles/AdminSeleccionFotos.module.css';

const AdminSeleccionFotos = () => {
  const [seleccionFotos, setSeleccionFotos] = useState([]);
  const [searchSeleccion, setSearchSeleccion] = useState('');
  const [showSeleccionPopup, setShowSeleccionPopup] = useState(false);
  const [seleccionImagenes, setSeleccionImagenes] = useState([]);
  const [yearSeleccion, setYearSeleccion] = useState('');
  const [selectedSeleccion, setSelectedSeleccion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
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

  const navigate = useNavigate();

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

  // Toast component
  const Toast = ({ message, type, onClose }) => (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.toastContent}>
        {type === 'success' && <i className="fas fa-check-circle"></i>}
        {type === 'error' && <i className="fas fa-times-circle"></i>}
        <span>{message}</span>
        <button onClick={onClose}>×</button>
      </div>
    </div>
  );

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
        fetchSeleccionFotos();
      } else {
        navigate('/login');
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      unsubscribe();
    };
  }, [navigate]);

  // Fetch seleccionFotos from Firestore
  const fetchSeleccionFotos = async () => {
    try {
      setIsLoading(true);
      // Cambiado de 'seleccionFotos' a 'fotos-seleccionesfutbol'
      const seleccionRef = collection(firestore, 'fotos-seleccionesfutbol');
      // Ordenar por year-seleccion en lugar de year
      const q = query(seleccionRef, orderBy('year-seleccion', 'desc'));
      const snapshot = await getDocs(q);

      const seleccionData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setSeleccionFotos(seleccionData);
    } catch (error) {
      console.error('Error fetching selección fotos:', error);
      setToast({
        show: true,
        message: 'Error al cargar las fotos de la selección: ' + error.message,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Image compression function
  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      initialQuality: 0.8,
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

  // Handle image upload for seleccion
  const handleSeleccionImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const remainingSlots = 8 - seleccionImagenes.length;
    if (remainingSlots <= 0) {
      setToast({
        show: true,
        message: 'Has alcanzado el límite máximo de 8 imágenes',
        type: 'error'
      });
      return;
    }

    const filesToProcess = files.slice(0, remainingSlots);

    try {
      setActionLoading(true);

      const uploadPromises = filesToProcess.map(async (file) => {
        const compressedFile = await compressImage(file);
        const storageRef = ref(storage, `seleccionFotos/${Date.now()}_${uuidv4()}`);
        await uploadBytes(storageRef, compressedFile);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      });

      const newImages = await Promise.all(uploadPromises);
      setSeleccionImagenes([...seleccionImagenes, ...newImages]);
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
  };

  // Add seleccion photos
  const handleAddSeleccion = async () => {
    try {
      setActionLoading(true);

      if (!yearSeleccion || yearSeleccion.length !== 4 || seleccionImagenes.length === 0) {
        setToast({
          show: true,
          message: 'Por favor, completa correctamente todos los campos',
          type: 'error'
        });
        setActionLoading(false);
        return;
      }

      // Crear un documento único para este año con todas las imágenes
      // Cambiado de 'seleccionFotos' a 'fotos-seleccionesfutbol'
      await addDoc(collection(firestore, 'fotos-seleccionesfutbol'), {
        'year-seleccion': yearSeleccion, // Cambiado a 'year-seleccion'
        imagenes: seleccionImagenes, // Campo 'imagenes' como array
        fecha: new Date()
      });

      setToast({
        show: true,
        message: 'Fotos añadidas correctamente',
        type: 'success'
      });

      setYearSeleccion('');
      setSeleccionImagenes([]);
      setShowSeleccionPopup(false);
      fetchSeleccionFotos();
    } catch (error) {
      console.error("Error adding seleccion photos:", error);
      setToast({
        show: true,
        message: 'Error al añadir las fotos: ' + error.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // View group of images
  const handleViewSeleccion = (grupo) => {
    setSelectedSeleccion(grupo);
  };

  // Delete image from a group
  const handleDeleteSeleccionImage = async (seleccionId, imageUrl, imageIndex) => {
    try {
      setActionLoading(true);

      // Get the document reference
      // Cambiado de 'seleccionFotos' a 'fotos-seleccionesfutbol'
      const seleccionRef = doc(firestore, 'fotos-seleccionesfutbol', seleccionId);

      // Get current data
      const seleccionDoc = seleccionFotos.find(s => s.id === seleccionId);

      if (seleccionDoc) {
        // Filter out the image to delete
        const updatedImages = seleccionDoc.imagenes.filter((_, idx) => idx !== imageIndex);

        if (updatedImages.length === 0) {
          // If no images left, delete the whole document
          // Cambiado de 'seleccionFotos' a 'fotos-seleccionesfutbol'
          await deleteDoc(doc(firestore, 'fotos-seleccionesfutbol', seleccionId));
        } else {
          // Otherwise update the document with the remaining images
          await updateDoc(seleccionRef, {
            imagenes: updatedImages
          });
        }

        // Try to delete the image from storage
        try {
          const imagePath = imageUrl.split('?')[0].split('/').slice(3).join('/');
          const imageRef = ref(storage, decodeURIComponent(imagePath));
          await deleteObject(imageRef);
        } catch (storageError) {
          console.error("Error deleting image from storage:", storageError);
          // Continue even if storage delete fails
        }

        setToast({
          show: true,
          message: 'Imagen eliminada correctamente',
          type: 'success'
        });

        // Update local state
        if (selectedSeleccion && selectedSeleccion.id === seleccionId) {
          if (updatedImages.length === 0) {
            setSelectedSeleccion(null);
          } else {
            setSelectedSeleccion({
              ...selectedSeleccion,
              imagenes: updatedImages
            });
          }
        }

        fetchSeleccionFotos();
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      setToast({
        show: true,
        message: 'Error al eliminar la imagen: ' + error.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Delete a whole year group
  const handleDeleteSeleccionYear = async () => {
    try {
      setActionLoading(true);

      if (!confirmAction.id) {
        setToast({
          show: true,
          message: 'No hay año para eliminar',
          type: 'error'
        });
        setActionLoading(false);
        return;
      }

      // Get the document to delete
      const seleccionDoc = seleccionFotos.find(s => s.id === confirmAction.id);

      if (seleccionDoc && seleccionDoc.imagenes) {
        // Try to delete each image from storage
        for (const imageUrl of seleccionDoc.imagenes) {
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
      // Cambiado de 'seleccionFotos' a 'fotos-seleccionesfutbol'
      await deleteDoc(doc(firestore, 'fotos-seleccionesfutbol', confirmAction.id));

      setToast({
        show: true,
        message: 'Año eliminado correctamente',
        type: 'success'
      });

      fetchSeleccionFotos();
    } catch (error) {
      console.error("Error deleting year:", error);
      setToast({
        show: true,
        message: 'Error al eliminar el año: ' + error.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
      setConfirmAction({ show: false, id: null, title: '' });
    }
  };

  // Handle confirm delete for year or image
  const handleConfirmDelete = (id, title) => {
    setConfirmAction({
      show: true,
      id,
      title
    });
  };

  // Filter groups by search term
  const filteredGroups = seleccionFotos.filter(grupo =>
    grupo['year-seleccion']?.toString().includes(searchSeleccion)
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className={styles.adminSeleccionFotos}>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        userName={userName}
        handleLogout={handleLogout}
      />

      <main className={styles.content}>
        <header className={styles.sectionHeader}>
          <h1><FaFutbol className={styles.headerIcon} /> Fotos Selección de Fútbol</h1>
        </header>

        <div className={styles.sectionControls}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Buscar por año..."
              value={searchSeleccion}
              onChange={(e) => setSearchSeleccion(e.target.value)}
            />
            <i className="fas fa-search"></i>
          </div>

          <button
            className={styles.addButton}
            onClick={() => {
              setSeleccionImagenes([]);
              setYearSeleccion('');
              setShowSeleccionPopup(true);
            }}
          >
            <i className="fas fa-plus"></i> Añadir Fotos
          </button>
        </div>

        <div className={styles.seleccionGrid}>
          {filteredGroups.length === 0 ? (
            <div className={styles.noResults}>
              <i className="fas fa-futbol"></i>
              <p>No se encontraron fotos de la selección</p>
            </div>
          ) : (
            filteredGroups.map((grupo) => (
              <div key={grupo.id} className={styles.seleccionCard}>
                <h3>Selección Año {grupo['year-seleccion']}</h3>
                <div className={styles.seleccionPreview}>
                  <img
                    src={grupo.imagenes && grupo.imagenes.length > 0 ? grupo.imagenes[0] : ''}
                    alt={`Selección ${grupo['year-seleccion']}`}
                  />
                  <span className={styles.imagenCount}>
                    {grupo.imagenes ? grupo.imagenes.length : 0} fotos
                  </span>
                </div>
                <div className={styles.seleccionActions}>
                  <button
                    className={styles.viewButton}
                    onClick={() => handleViewSeleccion(grupo)}
                  >
                    <i className="fas fa-eye"></i> Ver fotos
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleConfirmDelete(grupo.id, grupo['year-seleccion'])}
                  >
                    <i className="fas fa-trash"></i> Eliminar Año
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* View Group Modal */}
        {selectedSeleccion && (
          <div className={styles.overlay} onClick={() => setSelectedSeleccion(null)}>
            <div className={styles.seleccionModal} onClick={e => e.stopPropagation()}>
              <button className={styles.modalClose} onClick={() => setSelectedSeleccion(null)}>×</button>
              <h3>Fotos Selección Año {selectedSeleccion['year-seleccion']}</h3>
              <div className={styles.seleccionGridPopup}>
                {selectedSeleccion.imagenes && selectedSeleccion.imagenes.map((imagen, index) => (
                  <div key={index} className={styles.seleccionItem}>
                    <img src={imagen} alt={`Foto ${index + 1}`} />
                    <button
                      className={styles.removeImage}
                      onClick={() => handleDeleteSeleccionImage(selectedSeleccion.id, imagen, index)}
                      title="Eliminar imagen"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add Photos Modal */}
        {showSeleccionPopup && (
          <div className={styles.overlay} onClick={() => setShowSeleccionPopup(false)}>
            <div className={styles.popup} onClick={e => e.stopPropagation()}>
              <div className={styles.popupHeader}>
                <h3><i className={`fas fa-images ${styles.headerIcon}`}></i> Añadir Fotos de la Selección</h3>
                <button className={styles.popupClose} onClick={() => setShowSeleccionPopup(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className={styles.popupContent}>
                <div className={styles.formContainer}>
                  <div className={styles.formGroup}>
                    <label><i className="fas fa-calendar-alt"></i> Año<span className={styles.required}>*</span></label>
                    <div className={styles.inputWithIcon}>
                      <input
                        type="text"
                        value={yearSeleccion}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 4) setYearSeleccion(value);
                        }}
                        maxLength="4"
                        required
                        placeholder="Ingresa el año (Ej: 2023)"
                      />
                      <i className="fas fa-calendar"></i>
                    </div>
                    {yearSeleccion && yearSeleccion.length !== 4 && (
                      <span className={styles.inputError}><i className="fas fa-exclamation-circle"></i> El año debe tener 4 dígitos</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label><i className="fas fa-images"></i> Selecciona las imágenes<span className={styles.required}>*</span></label>
                    <div className={styles.fileUploadContainer}>
                      <div
                        className={styles.modernUploader}
                        onClick={() => document.getElementById('seleccionFileInput').click()}
                      >
                        <i className={`fas fa-cloud-upload-alt ${styles.uploaderIcon}`}></i>
                        <p className={styles.uploaderText}>Arrastra las fotos aquí o haz clic para seleccionar</p>
                        <p className={styles.uploaderSubtext}>{seleccionImagenes.length} / 8 imágenes seleccionadas</p>
                      </div>
                      <input
                        id="seleccionFileInput"
                        type="file"
                        onChange={handleSeleccionImageUpload}
                        accept="image/*"
                        multiple
                        disabled={seleccionImagenes.length >= 8}
                        className={styles.hiddenInput}
                      />
                    </div>

                    {seleccionImagenes.length > 0 && (
                      <div className={styles.imagesGrid}>
                        {seleccionImagenes.map((img, index) => (
                          <div key={index} className={styles.imageCard}>
                            <img src={img} alt={`Preview ${index + 1}`} />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const newImages = seleccionImagenes.filter((_, i) => i !== index);
                                setSeleccionImagenes(newImages);
                              }}
                              className={styles.removeBtn}
                              title="Eliminar imagen"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {seleccionImagenes.length >= 8 && (
                      <span className={styles.inputError}><i className="fas fa-exclamation-circle"></i> Máximo 8 imágenes permitidas</span>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.popupFooter}>
                <div className={styles.requiredNote}>
                  <span>*</span> Campos obligatorios
                </div>
                <div className={styles.popupButtons}>
                  <button
                    onClick={() => setShowSeleccionPopup(false)}
                    className={styles.btnSecondary}
                  >
                    <i className="fas fa-times"></i> Cancelar
                  </button>
                  <button
                    onClick={handleAddSeleccion}
                    disabled={!yearSeleccion || yearSeleccion.length !== 4 || seleccionImagenes.length === 0 || actionLoading}
                    className={styles.btnPrimary}
                  >
                    {actionLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Procesando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-plus"></i> Añadir Fotos
                      </>
                    )}
                  </button>
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
              <p>¿Estás seguro de que deseas eliminar todas las fotos de la selección del año <strong>{confirmAction.title}</strong>?</p>
              <div className={styles.popupButtons}>
                <LoadingButton
                  onClick={handleDeleteSeleccionYear}
                  loading={actionLoading}
                  text="Sí, eliminar"
                  className={styles.dangerButton}
                />
                <button
                  onClick={() => setConfirmAction({ show: false, id: null, title: '' })}
                  className={styles.cancelButton}
                >
                  Cancelar
                </button>
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
      </main>
    </div>
  );
};

export default AdminSeleccionFotos;