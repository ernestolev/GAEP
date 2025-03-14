import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { collection, getDocs, doc, addDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth, firestore, storage } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import imageCompression from 'browser-image-compression';
import { FaImages } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import LoadingScreen from '../components/LoadingScreen';
import LoadingButton from '../components/LoadingButton';
import styles from '../Styles/AdminGaleriaFotos.module.css';

const AdminGaleriaFotos = () => {
  const [galeriaFotos, setGaleriaFotos] = useState([]);
  const [searchGaleria, setSearchGaleria] = useState('');
  const [selectedGrupo, setSelectedGrupo] = useState(null);
  const [showGaleriaPopup, setShowGaleriaPopup] = useState(false);
  const [galeriaImagenes, setGaleriaImagenes] = useState([]);
  const [numeroPromocion, setNumeroPromocion] = useState('');
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
    ids: [],
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
        fetchGaleriaFotos();
      } else {
        navigate('/login');
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      unsubscribe();
    };
  }, [navigate]);

  // Fetch galeriaFotos from Firestore
  const fetchGaleriaFotos = async () => {
    try {
      setIsLoading(true);
      // Usar la colección galeria-fotos-promociones
      const galeriaRef = collection(firestore, 'galeria-fotos-promociones');
      // Ordenar por numero-promocion en lugar de promocion
      const q = query(galeriaRef, orderBy('numero-promocion', 'desc'));
      const snapshot = await getDocs(q);

      const galeriaData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setGaleriaFotos(galeriaData);
    } catch (error) {
      console.error('Error fetching galería fotos:', error);
      setToast({
        show: true,
        message: 'Error al cargar la galería de fotos: ' + error.message,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image compression
  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
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

  // Handle image upload for gallery
  const handleGaleriaImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setActionLoading(true);

      const uploadPromises = files.map(async (file) => {
        const compressedFile = await compressImage(file);
        const storageRef = ref(storage, `galeriaFotos/${Date.now()}_${uuidv4()}`);
        await uploadBytes(storageRef, compressedFile);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      });

      const newImages = await Promise.all(uploadPromises);
      setGaleriaImagenes([...galeriaImagenes, ...newImages]);
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

  // Add gallery images
  const handleAddGaleria = async () => {
    try {
      setActionLoading(true);

      if (!numeroPromocion || galeriaImagenes.length === 0) {
        setToast({
          show: true,
          message: 'Por favor, ingrese el número de promoción y al menos una imagen',
          type: 'error'
        });
        setActionLoading(false);
        return;
      }

      const galeriaRef = collection(firestore, 'galeria-fotos-promociones');

      // Crear un documento único para esta promoción con todas las imágenes
      await addDoc(galeriaRef, {
        'numero-promocion': numeroPromocion, // Cambiado a 'numero-promocion'
        imagenes: galeriaImagenes, // Cambiado a 'imagenes' como array
        fecha: new Date()
      });

      setToast({
        show: true,
        message: 'Imágenes añadidas correctamente',
        type: 'success'
      });

      setGaleriaImagenes([]);
      setNumeroPromocion('');
      setShowGaleriaPopup(false);
      fetchGaleriaFotos();
    } catch (error) {
      console.error("Error adding gallery photos:", error);
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
  const handleViewGrupo = (grupo) => {
    setSelectedGrupo(grupo);
  };

  // Delete image from a group
  const handleDeleteImage = async (promocionId, imageUrl, imageIndex) => {
    try {
      setActionLoading(true);

      // Get the document reference
      const promocionRef = doc(firestore, 'galeria-fotos-promociones', promocionId);

      // Get current data
      const promocionDoc = galeriaFotos.find(p => p.id === promocionId);

      if (promocionDoc) {
        // Filter out the image to delete
        const updatedImages = promocionDoc.imagenes.filter((_, idx) => idx !== imageIndex);

        if (updatedImages.length === 0) {
          // If no images left, delete the whole document
          await deleteDoc(promocionRef);
        } else {
          // Otherwise update the document with the remaining images
          await updateDoc(promocionRef, {
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
        if (selectedGrupo && selectedGrupo.id === promocionId) {
          if (updatedImages.length === 0) {
            setSelectedGrupo(null);
          } else {
            setSelectedGrupo({
              ...selectedGrupo,
              imagenes: updatedImages
            });
          }
        }

        fetchGaleriaFotos();
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

  // Delete a whole promotion group
  const handleDeletePromocion = async () => {
    try {
      setActionLoading(true);

      if (!confirmAction.id) {
        setToast({
          show: true,
          message: 'No hay promoción para eliminar',
          type: 'error'
        });
        setActionLoading(false);
        return;
      }

      // Get the document to delete
      const promocionDoc = galeriaFotos.find(p => p.id === confirmAction.id);

      if (promocionDoc && promocionDoc.imagenes) {
        // Try to delete each image from storage
        for (const imageUrl of promocionDoc.imagenes) {
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
      await deleteDoc(doc(firestore, 'galeria-fotos-promociones', confirmAction.id));

      setToast({
        show: true,
        message: 'Promoción eliminada correctamente',
        type: 'success'
      });

      fetchGaleriaFotos();
    } catch (error) {
      console.error("Error deleting promotion:", error);
      setToast({
        show: true,
        message: 'Error al eliminar la promoción: ' + error.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
      setConfirmAction({ show: false, id: null, title: '' });
    }
  };

  // Handle confirm delete for promotion or image
  const handleConfirmDelete = (id, title) => {
    setConfirmAction({
      show: true,
      id,
      title
    });
  };

  // Group photos by promoción
  const groupPhotos = () => {
    return galeriaFotos.sort((a, b) => {
      return b['numero-promocion'] - a['numero-promocion'];
    });
  };

  // Filter groups by search term
  const filteredGroups = groupPhotos().filter(grupo =>
    grupo['numero-promocion']?.toString().includes(searchGaleria)
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className={styles.adminGaleriaFotos}>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        userName={userName}
        handleLogout={handleLogout}
      />

      <main className={styles.content}>
        <header className={styles.sectionHeader}>
          <h1><FaImages className={styles.headerIcon} /> Galería de Fotos por Promoción</h1>
        </header>

        <div className={styles.sectionControls}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Buscar promoción..."
              value={searchGaleria}
              onChange={(e) => setSearchGaleria(e.target.value)}
            />
            <i className="fas fa-search"></i>
          </div>

          <button
            className={styles.addButton}
            onClick={() => {
              setGaleriaImagenes([]);
              setNumeroPromocion('');
              setShowGaleriaPopup(true);
            }}
          >
            <i className="fas fa-plus"></i> Añadir Fotos
          </button>
        </div>

        <div className={styles.galeriaGrid}>
          {filteredGroups.length === 0 ? (
            <div className={styles.noResults}>
              <i className="fas fa-images"></i>
              <p>No se encontraron fotos para esta promoción</p>
            </div>
          ) : (
            filteredGroups.map((grupo) => (
              <div key={grupo.id} className={styles.galeriaCard}>
                <h3>Promoción {grupo['numero-promocion']}</h3>
                <div className={styles.galeriaPreview}>
                  <img
                    src={grupo.imagenes && grupo.imagenes.length > 0 ? grupo.imagenes[0] : ''}
                    alt={`Promoción ${grupo['numero-promocion']}`}
                  />
                  <span className={styles.imagenCount}>
                    {grupo.imagenes ? grupo.imagenes.length : 0} fotos
                  </span>
                </div>
                <div className={styles.galeriaActions}>
                  <button
                    className={styles.viewButton}
                    onClick={() => handleViewGrupo(grupo)}
                  >
                    <i className="fas fa-eye"></i> Ver fotos
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleConfirmDelete(grupo.id, grupo['numero-promocion'])}
                  >
                    <i className="fas fa-trash"></i> Eliminar Promoción
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* View Group Modal */}
        {selectedGrupo && (
          <div className={styles.overlay} onClick={() => setSelectedGrupo(null)}>
            <div className={styles.groupModal} onClick={e => e.stopPropagation()}>
              <button className={styles.modalClose} onClick={() => setSelectedGrupo(null)}>×</button>
              <h3>Fotos Promoción {selectedGrupo['numero-promocion']}</h3>
              <div className={styles.galeriaGridPopup}>
                {selectedGrupo.imagenes && selectedGrupo.imagenes.map((imagen, index) => (
                  <div key={index} className={styles.galeriaItem}>
                    <img src={imagen} alt={`Foto ${index + 1}`} />
                    <button
                      className={styles.removeImage}
                      onClick={() => handleDeleteImage(selectedGrupo.id, imagen, index)}
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
        {showGaleriaPopup && (
          <div className={styles.overlay} onClick={() => setShowGaleriaPopup(false)}>
            <div className={styles.popup} onClick={e => e.stopPropagation()}>
              <button className={styles.popupClose} onClick={() => setShowGaleriaPopup(false)}>×</button>
              <div className={styles.popupContent}>
                <h3>Añadir Fotos de Promoción</h3>
                <div className={styles.formGroup}>
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
                    placeholder="Ej: 1985"
                  />
                  {numeroPromocion && numeroPromocion.length !== 4 && (
                    <span className={styles.inputError}>El año de promoción debe tener 4 dígitos</span>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label>Imágenes (1-8 fotos)</label>
                  <input
                    type="file"
                    onChange={handleGaleriaImageUpload}
                    accept="image/*"
                    multiple
                    disabled={galeriaImagenes.length >= 8}
                  />
                  {galeriaImagenes.length >= 8 && (
                    <span className={styles.inputError}>Máximo 8 imágenes permitidas</span>
                  )}
                  <div className={styles.imagesPreview}>
                    {galeriaImagenes.map((img, index) => (
                      <div key={index} className={styles.imagePreviewContainer}>
                        <img src={img} alt={`Preview ${index + 1}`} />
                        <button
                          onClick={() => {
                            const newImages = galeriaImagenes.filter((_, i) => i !== index);
                            setGaleriaImagenes(newImages);
                          }}
                          className={styles.removeImage}
                        >×</button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.popupButtons}>
                  <LoadingButton
                    onClick={handleAddGaleria}
                    loading={actionLoading}
                    text="Añadir"
                    disabled={!numeroPromocion || numeroPromocion.length !== 4 || galeriaImagenes.length === 0}
                  />
                  <button
                    className={styles.cancelButton}
                    onClick={() => setShowGaleriaPopup(false)}
                  >
                    Cancelar
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
              <p>¿Estás seguro de que deseas eliminar todas las fotos de la promoción: <strong>{confirmAction.title}</strong>?</p>
              <div className={styles.popupButtons}>
                <LoadingButton
                  onClick={handleDeletePromocion}
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

export default AdminGaleriaFotos;