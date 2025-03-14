import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { FaUserPlus, FaEye, FaCheckCircle } from 'react-icons/fa';
import { auth, firestore } from '../firebase';
import { collection, getDocs, doc, updateDoc, Timestamp, query, orderBy, setDoc } from 'firebase/firestore';
import { init, send } from '@emailjs/browser';
import LoadingScreen from '../components/LoadingScreen';
import LoadingButton from '../components/LoadingButton';
import showToast, { CustomToast } from '../components/Toast';
import Sidebar from '../components/Sidebar';
import styles from '../Styles/AdminSolicitudes.module.css';
import { FaChevronDown } from 'react-icons/fa';

const AdminSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSolicitudId, setActionSolicitudId] = useState(null); // Identificar cuál solicitud está siendo procesada
  const [showComprobanteModal, setShowComprobanteModal] = useState(false);
  const [currentComprobante, setCurrentComprobante] = useState(null);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: ''
  });
  const [expandedRows, setExpandedRows] = useState(new Set());


  const EMAIL_SERVICE_ID = 'service_73kk9jg';
  const EMAIL_TEMPLATE_ID_ACCEPTED = 'template_g8kbzrs';
  const EMAIL_PUBLIC_KEY = 'ROpbgdF-nRAD3zQuR';

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

  const toggleRow = (id, e) => {
    // Evitar que el clic afecte a los botones dentro de la fila
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }

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

  // Fetch solicitudes from Firestore
  const fetchSolicitudes = async () => {
    try {
      setIsLoading(true);
      const solicitudesCollection = collection(firestore, 'inscripciones');
      const q = query(solicitudesCollection, orderBy('fechaRegistro', 'desc'));
      const querySnapshot = await getDocs(q);
      const solicitudesList = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        // Format date fields from Firebase Timestamp
        const fechaRegistro = data.fechaRegistro ?
          new Date(data.fechaRegistro.seconds * 1000).toLocaleDateString() : 'N/A';

        const fechaAceptacion = data.fechaAceptacion ?
          new Date(data.fechaAceptacion.seconds * 1000).toLocaleDateString() : 'N/A';

        solicitudesList.push({
          id: doc.id,
          ...data,
          fechaRegistro,
          fechaAceptacion
        });
      });

      setSolicitudes(solicitudesList);
    } catch (error) {
      console.error("Error fetching inscripciones:", error);
      setToast({
        show: true,
        message: 'Error al cargar las solicitudes: ' + error.message,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // View comprobante
  const handleViewSolicitud = (solicitud) => {
    setCurrentComprobante(solicitud.comprobante);
    setShowComprobanteModal(true);
  };

  // Accept solicitud y transferir a exalumnos
  const handleAcceptSolicitud = async (id) => {
    try {
      setActionLoading(true);
      setActionSolicitudId(id); // Guardar el ID de la solicitud que está siendo procesada

      // Referencia a la solicitud en inscripciones
      const solicitudRef = doc(firestore, 'inscripciones', id);

      // Encontrar la solicitud en el estado para obtener todos los datos
      const solicitud = solicitudes.find(s => s.id === id);

      if (!solicitud) {
        throw new Error('No se encontró la solicitud');
      }

      // Crear timestamp para la fecha de aceptación
      const fechaAceptacion = Timestamp.now();

      // 1. Actualizar el estado de la solicitud en la colección inscripciones
      await updateDoc(solicitudRef, {
        estado: 'aceptado',
        fechaAceptacion: fechaAceptacion
      });

      // Combinar nombre y apellidos en un solo campo y convertir a mayúsculas
      const nombreCompleto = `${solicitud.nombre} ${solicitud.apellidos}`.toUpperCase();

      // 2. Agregar el exalumno a la colección exalumnos
      // Usar el DNI como ID del documento para evitar duplicados
      await setDoc(doc(firestore, 'exalumnos', solicitud.dni), {
        nombre: nombreCompleto, // Nombre completo en mayúsculas
        dni: solicitud.dni,
        email: solicitud.email,
        telefono: solicitud.telefono,
        promocion: solicitud.promocion,
        prof: solicitud.prof ? solicitud.prof.toUpperCase() : '', // También la profesión en mayúsculas
        fechaRegistro: solicitud.fechaRegistro,
        fechaAceptacion: fechaAceptacion,
        estado: 'activo',
        tipoPago: 'INSCRIPCIÓN' // En mayúsculas también
      });

      // Formatear la fecha para el correo
      const fechaFormateada = new Date(fechaAceptacion.seconds * 1000).toLocaleDateString('es-PE');

      // 3. Enviar correo electrónico de confirmación
      init(EMAIL_PUBLIC_KEY);
      await send(
        EMAIL_SERVICE_ID,
        EMAIL_TEMPLATE_ID_ACCEPTED,
        {
          to_name: `${solicitud.nombre} ${solicitud.apellidos}`,
          to_email: solicitud.email,
          message: 'Tu solicitud de membresía ha sido aprobada.',
          dni: solicitud.dni, // Agregar DNI explícitamente
          fecha_aprobacion: fechaFormateada // Usar nombre correcto del campo
        }
      );

      // 4. Actualizar el estado local
      const updatedSolicitudes = solicitudes.map(s => {
        if (s.id === id) {
          return {
            ...s,
            estado: 'aceptado',
            fechaAceptacion: new Date().toLocaleDateString()
          };
        }
        return s;
      });

      setSolicitudes(updatedSolicitudes);

      setToast({
        show: true,
        message: 'Solicitud aceptada y exalumno registrado correctamente',
        type: 'success'
      });
    } catch (error) {
      console.error("Error accepting solicitud:", error);
      setToast({
        show: true,
        message: 'Error al aceptar la solicitud: ' + error.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
      setActionSolicitudId(null);
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

  // Filter solicitudes based on search term and status
  const filteredSolicitudes = solicitudes.filter(solicitud => {
    const searchLower = normalizeText(searchTerm);
    const matchesSearch =
      normalizeText(solicitud.nombre || '').includes(searchLower) ||
      normalizeText(solicitud.apellidos || '').includes(searchLower) ||
      (solicitud.dni?.toString() || '').includes(searchLower) ||
      normalizeText(solicitud.email || '').includes(searchLower) ||
      (solicitud.promocion?.toString() || '').includes(searchLower);

    const matchesStatus = statusFilter === 'all' || solicitud.estado === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Initialize on component mount
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
        fetchSolicitudes();
      } else {
        navigate('/login');
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className={styles.adminSolicitudes}>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        userName={userName}
        handleLogout={handleLogout}
      />

      <main className={styles.content}>
        <header className={styles.sectionHeader}>
          <h1><FaUserPlus className={styles.headerIcon} /> Solicitudes de Membresía</h1>
        </header>

        <div className={styles.searchFilterContainer}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Buscar por nombre, DNI, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search"></i>
          </div>

          <select
            className={styles.statusFilter}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="pendiente">Pendientes</option>
            <option value="aceptado">Aceptados</option>
            <option value="rechazado">Rechazados</option>
          </select>
        </div>

        <div className={styles.counterDisplay}>
          Mostrando {filteredSolicitudes.length} de {solicitudes.length} solicitudes
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
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
              {filteredSolicitudes.map((solicitud) => (
                <tr
                  key={solicitud.id}
                  className={`${solicitud.estado === 'aceptado' ? styles.aceptado :
                      solicitud.estado === 'rechazado' ? styles.rechazado : ''
                    } ${expandedRows.has(solicitud.id) ? styles.expanded : ''}`}
                  onClick={(e) => toggleRow(solicitud.id, e)}
                >
                  <td data-label="ID">
                    {solicitud.id.substring(0, 6)}
                  </td>
                  <td data-label="Nombre">
                    {solicitud.nombre}
                    <div className={styles.expandIcon}>
                      <FaChevronDown />
                    </div>
                  </td>
                  <td data-label="Apellidos">{solicitud.apellidos}</td>
                  <td data-label="DNI">{solicitud.dni}</td>
                  <td data-label="Email">{solicitud.email}</td>
                  <td data-label="Teléfono">{solicitud.telefono}</td>
                  <td data-label="Promoción">{solicitud.promocion}</td>
                  <td data-label="Fecha de Registro">{solicitud.fechaRegistro}</td>
                  <td data-label="Fecha de Aceptación">{solicitud.fechaAceptacion}</td>
                  <td data-label="Estado">
                    <span className={`${styles.statusBadge} ${styles[solicitud.estado]}`}>
                      {solicitud.estado}
                    </span>
                  </td>
                  <td data-label="Acciones">
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.btnView}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewSolicitud(solicitud);
                        }}
                        title="Ver comprobante"
                      >
                        <FaEye /> Ver
                      </button>
                      {solicitud.estado === 'pendiente' && (
                        <button
                          className={styles.btnAccept}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAcceptSolicitud(solicitud.id);
                          }}
                          disabled={actionLoading}
                        >
                          {actionLoading && actionSolicitudId === solicitud.id ? (
                            <span className={styles.loadingButtonContent}>
                              <span className={styles.loadingSpinner}></span>
                              Procesando...
                            </span>
                          ) : (
                            <>
                              <FaCheckCircle /> Aceptar
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Comprobante Modal */}
        {showComprobanteModal && (
          <div className={styles.overlay} onClick={() => setShowComprobanteModal(false)}>
            <div className={styles.comprobanteModal} onClick={e => e.stopPropagation()}>
              <button className={styles.modalClose} onClick={() => setShowComprobanteModal(false)}>
                <i className="fas fa-times"></i>
              </button>
              <h3>Comprobante de Pago</h3>
              <div className={styles.comprobanteContainer}>
                {currentComprobante ? (
                  <>
                    <a href={currentComprobante} target="_blank" rel="noopener noreferrer">
                      <img
                        src={currentComprobante}
                        alt="Comprobante de pago"
                        title="Haz clic para ver en tamaño completo"
                      />
                    </a>
                    <div className={styles.zoomControls}>
                      <a
                        href={currentComprobante}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.zoomButton}
                      >
                        <i className="fas fa-search-plus"></i>
                        Ver en tamaño completo
                      </a>
                      <button
                        className={styles.zoomButton}
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = currentComprobante;
                          link.download = 'comprobante.jpg';
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                      >
                        <i className="fas fa-download"></i>
                        Descargar comprobante
                      </button>
                    </div>
                  </>
                ) : (
                  <p>No se encontró un comprobante para esta solicitud</p>
                )}
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

export default AdminSolicitudes;