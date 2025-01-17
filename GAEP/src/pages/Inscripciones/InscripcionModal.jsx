import React, { useState } from 'react';
import './InscripcionModal.modules.css';
import emailjs from '@emailjs/browser';
import { db } from '../../firebase';
import { collection, getDocs, doc, setDoc, query, where } from 'firebase/firestore';
import imageCompression from 'browser-image-compression';

import yapelogo from '../../assets/icons/icon-yape.png';

const InscripcionModal = ({ isOpen, onClose }) => {

    const EMAIL_SERVICE_ID = 'service_73kk9jg';
    const EMAIL_TEMPLATE_ID = 'template_oiy8zdg';
    const EMAIL_PUBLIC_KEY = 'ROpbgdF-nRAD3zQuR';

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const compressImage = async (file) => {
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            initialQuality: 0.8,
        };

        try {
            return await imageCompression(file, options);
        } catch (error) {
            console.error("Error compressing image:", error);
            throw error;
        }
    };

    const [comprobantePreview, setComprobantePreview] = useState(null);

    const handleComprobanteChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setLoading(true);
            if (file.type.startsWith('image/')) {
                const compressedFile = await compressImage(file);
                setFormData({ ...formData, comprobante: compressedFile });

                // Generate preview
                const reader = new FileReader();
                reader.onloadend = () => {
                    setComprobantePreview(reader.result);
                };
                reader.readAsDataURL(compressedFile);
            } else {
                // If PDF, store directly
                setFormData({ ...formData, comprobante: file });
                setComprobantePreview(null);
            }
        } catch (error) {
            console.error("Error processing file:", error);
            setErrors({ ...errors, comprobante: 'Error al procesar el archivo' });
        } finally {
            setLoading(false);
        }
    };


    const checkExistingDNI = async (dni) => {
        try {
            const dniString = dni.toString().trim();

            const exalumnosRef = collection(db, 'exalumnos');
            const allExalumnos = await getDocs(exalumnosRef);

            // Debug logging
            allExalumnos.forEach(doc => {
                const data = doc.data();
                console.log('DB DNI:', data.dni, 'Type:', typeof data.dni);
                console.log('Input DNI:', dniString, 'Type:', typeof dniString);
                console.log('Direct comparison:', data.dni === dniString);
                console.log('Numbers comparison:', parseInt(data.dni) === parseInt(dniString));
            });

            // Try both string and number comparison
            const found = allExalumnos.docs.some(doc => {
                const dbDni = doc.data().dni.toString().trim();
                return dbDni === dniString || parseInt(dbDni) === parseInt(dniString);
            });

            if (found) {
                return 'Este DNI ya está registrado como miembro de la GAEP';
            }

            return null;
        } catch (error) {
            console.error('Error completo:', error);
            throw error;
        }
    };
    const validateForm = async (step) => {
        const newErrors = {};




        switch (step) {
            case 1:
                // Check DNI format first
                if (!formData.dni) {
                    newErrors.dni = 'DNI es requerido';
                } else if (!/^\d{8}$/.test(formData.dni)) {
                    newErrors.dni = 'DNI debe tener 8 dígitos';
                } else {
                    const errorMessage = await checkExistingDNI(formData.dni);
                    if (errorMessage) {
                        newErrors.dni = errorMessage;
                    }
                }

                // Rest of the validations remain the same
                if (!formData.telefono) {
                    newErrors.telefono = 'Teléfono es requerido';
                } else if (!/^\d{9}$/.test(formData.telefono)) {
                    newErrors.telefono = 'Teléfono debe tener 9 dígitos';
                }

                if (!formData.promocion) {
                    newErrors.promocion = 'Año de promoción es requerido';
                } else if (!/^\d{4}$/.test(formData.promocion)) {
                    newErrors.promocion = 'Año debe tener formato YYYY';
                } else {
                    const year = parseInt(formData.promocion);
                    const currentYear = new Date().getFullYear();
                    if (year < 1950 || year > currentYear) {
                        newErrors.promocion = 'Año de promoción no válido';
                    }
                }
                break;

            case 2:
                if (!formData.comprobante) {
                    newErrors.comprobante = 'Comprobante es requerido';
                } else {
                    const fileSize = formData.comprobante.size / 1024 / 1024; // in MB
                    if (fileSize > 5) {
                        newErrors.comprobante = 'El archivo debe ser menor a 5MB';
                    }

                    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
                    if (!validTypes.includes(formData.comprobante.type)) {
                        newErrors.comprobante = 'Formato debe ser JPG, PNG o PDF';
                    }
                }
                break;

            case 3:
                if (!formData.nombre) {
                    newErrors.nombre = 'Nombre es requerido';
                } else if (formData.nombre.length < 2) {
                    newErrors.nombre = 'Nombre debe tener al menos 2 caracteres';
                }

                if (!formData.apellidos) {
                    newErrors.apellidos = 'Apellidos son requeridos';
                } else if (formData.apellidos.length < 2) {
                    newErrors.apellidos = 'Apellidos deben tener al menos 2 caracteres';
                }

                if (!formData.email) {
                    newErrors.email = 'Email es requerido';
                } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
                    newErrors.email = 'Email no válido';
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const getNextId = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'inscripciones'));
            const ids = querySnapshot.docs.map(doc => parseInt(doc.id)).filter(id => !isNaN(id));
            const maxId = Math.max(...ids, 0);
            return (maxId + 1).toString();
        } catch (error) {
            console.error("Error getting next ID:", error);
            return "1";
        }
    };

    const handleSubmit = async () => {
        if (!validateForm(3)) return;

        setLoading(true);
        try {
            let base64Image = '';

            if (formData.comprobante) {
                const reader = new FileReader();
                base64Image = await new Promise((resolve) => {
                    reader.onload = (e) => resolve(e.target.result);
                    reader.readAsDataURL(formData.comprobante);
                });
            }

            const nextId = await getNextId();

            // Save to Firestore
            await setDoc(doc(db, 'inscripciones', nextId), {
                dni: formData.dni,
                telefono: formData.telefono,
                promocion: formData.promocion,
                nombre: formData.nombre,
                apellidos: formData.apellidos,
                prof: formData.prof,
                email: formData.email,
                comprobante: base64Image,
                estado: 'pendiente',
                fechaRegistro: new Date()
            });

            // Send confirmation email
            const emailParams = {
                to_email: formData.email,
                to_name: `${formData.nombre} ${formData.apellidos}`,
                solicitud_id: nextId,
                dni: formData.dni,
                telefono: formData.telefono,
                promocion: formData.promocion,
                fecha: new Date().toLocaleDateString()
            };

            await emailjs.send(
                EMAIL_SERVICE_ID,
                EMAIL_TEMPLATE_ID,
                emailParams,
                EMAIL_PUBLIC_KEY
            );

            setStep(4);
        } catch (error) {
            console.error("Error submitting form:", error);
            setErrors({ submit: 'Error al enviar el formulario. Por favor, intente nuevamente.' });
        } finally {
            setLoading(false);
        }
    };

    // Update button click handler
    const handleNext = async () => {
        try {
            if (step === 3) {
                await handleSubmit();
            } else {
                const isValid = await validateForm(step);
                console.log("Validation result:", isValid);
                if (isValid) {
                    setStep(step + 1);
                }
            }
        } catch (error) {
            console.error("Error in handleNext:", error);
        }
    };

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        dni: '',
        promocion: '',
        comprobante: null,
        nombre: '',
        apellidos: '',
        email: '',
        telefono: ''
    });

    if (!isOpen) return null;

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="modal-step">
                        <h2>Paso 1: Registro inicial</h2>
                        <div className="form-group">
                            <label>DNI</label>
                            <input
                                type="text"
                                value={formData.dni}
                                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                                placeholder="Ingrese su DNI"
                                className={errors.dni ? 'error' : ''}
                            />
                            {errors.dni && <span className="error-message">{errors.dni}</span>}
                        </div>
                        <div className="form-group">
                            <label>Teléfono</label>
                            <input
                                type="tel"
                                maxLength="9"
                                value={formData.telefono}
                                onChange={(e) => setFormData({ ...formData, telefono: e.target.value.replace(/\D/g, '') })}
                                placeholder="Ingrese su número de celular (9 dígitos)"
                                className={errors.telefono ? 'error' : ''}
                            />
                            {errors.telefono && <span className="error-message">{errors.telefono}</span>}
                        </div>
                        <div className="form-group">
                            <label>Año de promoción</label>
                            <input
                                type="text"
                                maxLength="4"
                                value={formData.promocion}
                                onChange={(e) => setFormData({ ...formData, promocion: e.target.value.replace(/\D/g, '') })}
                                placeholder="Ej: 2010"
                                className={errors.promocion ? 'error' : ''}
                            />
                            {errors.promocion && <span className="error-message">{errors.promocion}</span>}
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="modal-step">
                        <h2>Paso 2: Pago de cuota</h2>
                        <div className="payment-info">
                            <img src={yapelogo} alt="" />
                            <p>Numero: <strong>9503368848</strong> </p>
                            <p>Titular: <strong>EDGAR H. AVALOS M.</strong> </p>
                            <p>Cargo: <strong>Tesorero</strong> </p>
                        </div>
                        <div className="form-group">
                            <label>Adjunta tu comprobante de pago o captura de pantalla</label>
                            <input
                                type="file"
                                onChange={handleComprobanteChange}
                                accept="image/*,.pdf"
                                disabled={loading}
                            />
                            {loading && <span className="loading-message">Procesando archivo...</span>}
                            {errors.comprobante && (
                                <span className="error-message">{errors.comprobante}</span>
                            )}
                            {comprobantePreview && (
                                <div className="comprobante-preview">
                                    <img src={comprobantePreview} alt="Preview del comprobante" />
                                    <button
                                        className="remove-preview"
                                        onClick={() => {
                                            setComprobantePreview(null);
                                            setFormData({ ...formData, comprobante: null });
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            )}
                            {formData.comprobante?.type === 'application/pdf' && (
                                <div className="pdf-indicator">
                                    PDF seleccionado: {formData.comprobante.name}
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="modal-step">
                        <h2>Paso 3: Datos personales</h2>
                        <div className="form-group">
                            <label>Nombres</label>
                            <input
                                type="text"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Apellidos</label>
                            <input
                                type="text"
                                value={formData.apellidos}
                                onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Profesión u Oficio</label>
                            <input
                                type="text"
                                value={formData.prof}
                                onChange={(e) => setFormData({ ...formData, prof: e.target.value })}
                                placeholder="Ingrese su profesión u oficio"
                            />
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="modal-step success">
                        <h2>¡Solicitud enviada!</h2>
                        <p>Tu solicitud ha sido enviada con éxito. El comité evaluará tu información y te contactaremos pronto por correo electrónico o teléfono.</p>
                        <div className="confirmation-details">
                            <p>Por favor, ten en cuenta:</p>
                            <ul>
                                <li>El proceso de evaluación puede tomar hasta 48 horas hábiles</li>
                                <li>Recibirás una notificación con el resultado de tu solicitud</li>
                                <li>En caso de aprobación, se te enviará información adicional sobre tu membresía</li>
                            </ul>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="modal-overlay">
            <div className="contentmodal">
                <button className="modal-close" onClick={onClose}>×</button>
                <div className="modal-progress">
                    {[1, 2, 3, 4].map(num => (
                        <div key={num} className={`progress-step ${step >= num ? 'active' : ''}`}>
                            {num}
                        </div>
                    ))}
                </div>
                {renderStep()}
                <div className="modal-buttons">
                    {step > 1 && step < 4 && (
                        <button
                            className="btn-secondary"
                            onClick={() => setStep(step - 1)}
                            disabled={loading}
                        >
                            Anterior
                        </button>
                    )}
                    {step < 4 && (
                        <button
                            className="btn-primary"
                            onClick={handleNext}
                            disabled={loading}
                        >
                            {loading ? 'Enviando...' : step === 3 ? 'Enviar' : 'Siguiente'}
                        </button>
                    )}
                    {step === 4 && (
                        <button className="btn-primary" onClick={onClose}>
                            Cerrar
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default InscripcionModal;