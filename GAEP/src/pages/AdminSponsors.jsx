import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, firestore, storage } from '../firebase';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import imageCompression from 'browser-image-compression';
import { FaHandshake } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import LoadingScreen from '../components/LoadingScreen';
import LoadingButton from '../components/LoadingButton';
import styles from '../Styles/AdminSponsors.module.css';

const AdminSponsors = () => {
  const [sponsors, setSponsors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [showSponsorPopup, setShowSponsorPopup] = useState(false);
  const [razonSocial, setRazonSocial] = useState('');
  const [logo, setLogo] = useState('');
  const [sponsorTelefono, setSponsorTelefono] = useState('');
  const [sponsorEmail, setSponsorEmail] = useState('');
  const [sponsorEnlace, setSponsorEnlace] = useState('');
  const [sponsorDescripcion, setSponsorDescripcion] = useState('');
  const [sponsorUbicacion, setSponsorUbicacion] = useState('');
  const [editId, setEditId] = useState(null);
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

  const [sponsorRuc, setSponsorRuc] = useState('');


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
        fetchSponsors();
      } else {
        navigate('/login');
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      unsubscribe();
    };
  }, [navigate]);

  const fetchSponsors = async () => {
    try {
      setIsLoading(true);
      // Cambiado de 'sponsors' a 'sponsor' para coincidir con la colección en Firestore
      const sponsorsCollection = collection(firestore, 'sponsor');
      const querySnapshot = await getDocs(sponsorsCollection);
      const sponsorsList = [];

      querySnapshot.forEach((doc) => {
        sponsorsList.push({
          id: doc.id,
          ...doc.data()
        });
      });

      setSponsors(sponsorsList);
    } catch (error) {
      console.error("Error fetching sponsors:", error);
      setToast({
        show: true,
        message: 'Error al cargar los sponsors: ' + error.message,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const compressLogo = async (file) => {
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
      console.error("Error compressing logo:", error);
      throw error;
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setActionLoading(true); // Muestra el indicador de carga

        const compressedFile = await compressLogo(file);
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const safeFileName = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
        const storageRef = ref(storage, `sponsors/${Date.now()}_${safeFileName}`);

        await uploadBytes(storageRef, compressedFile);
        const downloadURL = await getDownloadURL(storageRef);
        setLogo(downloadURL);

        setToast({
          show: true,
          message: 'Logo subido correctamente',
          type: 'success'
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        setToast({
          show: true,
          message: 'Error al subir la imagen: ' + error.message,
          type: 'error'
        });
      } finally {
        setActionLoading(false); // Oculta el indicador de carga
      }
    }
  };

  const handleAddSponsorClick = () => {
    clearSponsorForm();
    setShowSponsorPopup(true);
  };

  const handleEditSponsor = (sponsor) => {
    // Changed from 'razon-social' to 'razon_social'
    setRazonSocial(sponsor.razon_social || '');
    setLogo(sponsor.logo || '');
    setSponsorTelefono(sponsor.telefono || '');
    setSponsorEnlace(sponsor.enlace || '');
    setSponsorDescripcion(sponsor.descripcion || '');
    setSponsorUbicacion(sponsor.ubicacion || '');
    setSponsorEmail(sponsor.email || '');
    setSponsorRuc(sponsor.ruc || '');
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
    setSponsorEmail('');
    setSponsorRuc(''); // Añadir esta línea
    setEditId(null);
    setShowSponsorPopup(false);
  };

  const handleAddSponsor = async () => {
    try {
      setActionLoading(true);

      if (!razonSocial || !logo) {
        setToast({
          show: true,
          message: 'La razón social y el logo son obligatorios',
          type: 'error'
        });
        setActionLoading(false);
        return;
      }

      const sponsorData = {
        // Changed from 'razon-social' to 'razon_social'
        razon_social: razonSocial,
        logo: logo,
        telefono: sponsorTelefono,
        email: sponsorEmail,
        enlace: sponsorEnlace,
        ubicacion: sponsorUbicacion,
        descripcion: sponsorDescripcion,
        ruc: sponsorRuc,
        updatedAt: new Date()
      };

      if (editId) {
        const sponsorRef = doc(firestore, 'sponsor', editId);
        await updateDoc(sponsorRef, sponsorData);

        setToast({
          show: true,
          message: 'Sponsor actualizado correctamente',
          type: 'success'
        });
      } else {
        await addDoc(collection(firestore, 'sponsor'), sponsorData);

        setToast({
          show: true,
          message: 'Sponsor añadido correctamente',
          type: 'success'
        });
      }

      clearSponsorForm();
      fetchSponsors();
    } catch (error) {
      console.error("Error adding/updating sponsor:", error);
      setToast({
        show: true,
        message: `Error al ${editId ? 'actualizar' : 'añadir'} el sponsor: ${error.message}`,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = (id, title) => {
    setConfirmAction({
      show: true,
      id,
      title
    });
  };

  const handleDeleteSponsor = async () => {
    try {
      setActionLoading(true);

      // Find the sponsor to get the logo URL
      const sponsor = sponsors.find(s => s.id === confirmAction.id);

      if (sponsor && sponsor.logo) {
        // Extract the path from the URL
        try {
          const logoUrl = sponsor.logo;
          const logoPath = logoUrl.split('?')[0].split('/').slice(3).join('/');
          const storageRef = ref(storage, decodeURIComponent(logoPath));

          // Delete the logo from storage
          await deleteObject(storageRef);
        } catch (storageError) {
          console.error("Error deleting logo from storage:", storageError);
          // Continue with deletion even if storage deletion fails
        }
      }

      // Delete the sponsor document
      // Cambiado de 'sponsors' a 'sponsor'
      await deleteDoc(doc(firestore, 'sponsor', confirmAction.id));

      setToast({
        show: true,
        message: 'Sponsor eliminado correctamente',
        type: 'success'
      });

      fetchSponsors();
    } catch (error) {
      console.error("Error deleting sponsor:", error);
      setToast({
        show: true,
        message: 'Error al eliminar el sponsor: ' + error.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
      setConfirmAction({ show: false, id: null, title: '' });
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className={styles.adminSponsors}>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        userName={userName}
        handleLogout={handleLogout}
      />

      <main className={styles.content}>
        <header className={styles.sectionHeader}>
          <h1><FaHandshake className={styles.headerIcon} /> Sponsors</h1>
        </header>

        <div className={styles.actionButtonContainer}>
          <button className={styles.addButton} onClick={handleAddSponsorClick}>
            <i className="fas fa-plus"></i> Añadir Sponsor
          </button>
        </div>

        <div className={styles.sponsorsGrid}>
          {sponsors.length === 0 ? (
            <div className={styles.noSponsors}>
              <p>No hay sponsors registrados</p>
            </div>
          ) : (
            sponsors.map((sponsor) => (
              <div key={sponsor.id} className={styles.sponsorCard}>
                <div className={styles.sponsorLogo}>
                  <img src={sponsor.logo} alt={sponsor.razon_social} />
                </div>
                <div className={styles.sponsorContent}>
                  {/* Changed from 'razon-social' to 'razon_social' */}
                  <h3>{sponsor.razon_social}</h3>
                  {sponsor.telefono && <p><i className="fas fa-phone"></i> {sponsor.telefono}</p>}
                  {sponsor.email && <p><i className="fas fa-envelope"></i> {sponsor.email}</p>}
                  {sponsor.ubicacion && <p><i className="fas fa-map-marker-alt"></i> {sponsor.ubicacion}</p>}
                  {sponsor.enlace && <p><i className="fas fa-link"></i> <a href={sponsor.enlace} target="_blank" rel="noopener noreferrer">Sitio web</a></p>}
                </div>
                <div className={styles.sponsorActions}>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEditSponsor(sponsor)}
                  >
                    <i className="fas fa-edit"></i> Editar
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleConfirmDelete(sponsor.id, sponsor['razon-social'])}
                  >
                    <i className="fas fa-trash"></i> Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add/Edit Sponsor Modal */}
        {showSponsorPopup && (
          <div className={styles.overlay} onClick={() => setShowSponsorPopup(false)}>
            <div className={styles.popup} onClick={e => e.stopPropagation()}>
              <div className={styles.popupHeader}>
                <h3>
                  {editId ? 'Actualizar Sponsor' : 'Añadir Nuevo Sponsor'}
                </h3>
                <button className={styles.popupClose} onClick={() => setShowSponsorPopup(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className={styles.popupContent}>
                <div className={styles.formInner}>
                  <div className={styles.formGrid}>
                    <div className={styles.formColumn}>
                      <div className={styles.formGroup}>
                        <label>
                          Razón Social <span className={styles.required}>*</span>
                        </label>
                        <div className={styles.inputWithIcon}>
                          <input
                            type="text"
                            value={razonSocial}
                            onChange={(e) => setRazonSocial(e.target.value)}
                            placeholder="Nombre de la empresa"
                            required
                          />
                          <i className="fas fa-building"></i>
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label>
                          RUC <span className={styles.optional}>(Opcional)</span>
                        </label>
                        <div className={styles.inputWithIcon}>
                          <input
                            type="text"
                            value={sponsorRuc || ''}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              if (value.length <= 11) setSponsorRuc(value);
                            }}
                            maxLength="11"
                            placeholder="Número RUC"
                          />
                          <i className="fas fa-id-card"></i>
                        </div>
                        {sponsorRuc && sponsorRuc.length !== 11 && sponsorRuc.length > 0 && (
                          <span className={styles.inputError}>El RUC debe tener 11 dígitos</span>
                        )}
                      </div>

                      <div className={styles.formGroup}>
                        <label>
                          Teléfono de Contacto
                        </label>
                        <div className={styles.inputWithIcon}>
                          <input
                            type="text"
                            value={sponsorTelefono}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              if (value.length <= 9) setSponsorTelefono(value);
                            }}
                            maxLength="9"
                            placeholder="Teléfono de contacto"
                          />
                          <i className="fas fa-phone"></i>
                        </div>
                        {sponsorTelefono && sponsorTelefono.length !== 9 && sponsorTelefono.length > 0 && (
                          <span className={styles.inputError}>El teléfono debe tener 9 dígitos</span>
                        )}
                      </div>

                      <div className={styles.formGroup}>
                        <label>
                          Email
                        </label>
                        <div className={styles.inputWithIcon}>
                          <input
                            type="email"
                            value={sponsorEmail}
                            onChange={(e) => setSponsorEmail(e.target.value)}
                            placeholder="ejemplo@correo.com"
                          />
                          <i className="fas fa-envelope"></i>
                        </div>
                      </div>
                    </div>

                    <div className={styles.formColumn}>
                      <div className={styles.formGroup}>
                        <label>
                          Sitio Web
                        </label>
                        <div className={styles.inputWithIcon}>
                          <input
                            type="url"
                            value={sponsorEnlace}
                            onChange={(e) => setSponsorEnlace(e.target.value)}
                            placeholder="https://www.ejemplo.com"
                          />
                          <i className="fas fa-link"></i>
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label>
                          Ubicación
                        </label>
                        <div className={styles.inputWithIcon}>
                          <input
                            type="text"
                            value={sponsorUbicacion}
                            onChange={(e) => setSponsorUbicacion(e.target.value)}
                            placeholder="Dirección del sponsor"
                          />
                          <i className="fas fa-map-marker-alt"></i>
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label>
                          Logo <span className={styles.required}>*</span>
                          <div className={styles.tooltip}>
                            <i className="fas fa-info-circle"></i>
                            <span className={styles.tooltipText}>Recomendado: Imagen en formato PNG o SVG con fondo transparente. Tamaño máximo: 2MB</span>
                          </div>
                        </label>
                        <div className={styles.logoUploadContainer}>
                          {logo ? (
                            <div className={styles.logoPreview}>
                              <label htmlFor="logoUpload" title="Haz clic para cambiar el logo">
                                <img src={logo} alt="Logo preview" />
                              </label>
                              <input
                                id="logoUpload"
                                type="file"
                                onChange={handleImageUpload}
                                accept="image/*"
                                className={styles.hiddenFileInput}
                              />
                              <button
                                className={styles.removeLogoButton}
                                onClick={() => setLogo('')}
                                title="Eliminar logo"
                                type="button"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          ) : (
                            <label className={styles.logoUploadArea}>
                              <input
                                type="file"
                                onChange={handleImageUpload}
                                accept="image/*"
                                className={styles.hiddenFileInput}
                              />
                              <i className="fas fa-cloud-upload-alt className={styles.logoUploadIcon}"></i>
                              <div className={styles.logoUploadText}>Selecciona un logo</div>
                              <div className={styles.logoUploadSubtext}>o arrastra y suelta la imagen aquí</div>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>
                      Descripción
                    </label>
                    <div className={styles.editorContainer}>
                      <ReactQuill
                        theme="snow"
                        value={sponsorDescripcion}
                        onChange={setSponsorDescripcion}
                        modules={{
                          toolbar: [
                            [{ 'header': [1, 2, 3, false] }],
                            ['bold', 'italic', 'underline'],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            ['link'],
                            ['clean']
                          ]
                        }}
                        placeholder="Describe brevemente al sponsor..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.popupFooter}>
                <div className={styles.requiredNote}>
                  <span>*</span> Campos obligatorios
                </div>
                <div className={styles.popupButtons}>
                  <button
                    onClick={() => setShowSponsorPopup(false)}
                    className={styles.cancelButton}
                  >
                    Cancelar
                  </button>
                  <LoadingButton
                    onClick={handleAddSponsor}
                    loading={actionLoading}
                    text={editId ? 'Actualizar Sponsor' : 'Guardar Sponsor'}
                    className={styles.saveButton}
                    disabled={!razonSocial || !logo}
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
              <p>¿Estás seguro de que deseas eliminar al sponsor: <strong>{confirmAction.title}</strong>?</p>
              <div className={styles.popupButtons}>
                <LoadingButton
                  onClick={handleDeleteSponsor}
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

export default AdminSponsors;