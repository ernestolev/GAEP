import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import './AdminPanel.css';
import banner from '../../assets/images/img-gaepbanner2.png';

const AdminPanel = () => {
    const [titulo, setTitulo] = useState('');
    const [fecha, setFecha] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [imagen, setImagen] = useState('');
    const [editId, setEditId] = useState(null);
    const [actividades, setActividades] = useState([]);
    const [noticias, setNoticias] = useState([]);
    const [activeSection, setActiveSection] = useState('actividades');

    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/');
    };

    useEffect(() => {
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
                const noticiasData = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        ...data,
                        id: doc.id,
                        fecha: data.fecha.toDate().toLocaleDateString()
                    };
                });
                setNoticias(noticiasData);
            } catch (error) {
                console.error("Error al obtener noticias: ", error);
            }
        };

        fetchActividades();
        fetchNoticias();
    }, []);

    const handleAdd = async () => {
        const nuevaActividad = { titulo, fecha: new Date(fecha), descripcion, imagen };
        try {
            if (editId) {
                const actividadRef = doc(db, 'actividades', editId);
                await updateDoc(actividadRef, nuevaActividad);
                setEditId(null);
            } else {
                await addDoc(collection(db, 'actividades'), nuevaActividad);
            }
            setTitulo('');
            setFecha('');
            setDescripcion('');
            setImagen('');
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
            console.error("Error al agregar actividad:", error);
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
        setFecha(new Date(actividad.fecha).toISOString().split('T')[0]);
        setDescripcion(actividad.descripcion);
        setImagen(actividad.imagen);
        setEditId(actividad.id);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagen(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const renderActividades = () => (
        <div className="section">
            <h2>Actividades</h2>
            <div className='actividades-reg'>
                <div className="form-group">
                    <label>Título</label>
                    <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Fecha</label>
                    <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Descripción</label>
                    <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></textarea>
                </div>
                <div className="form-group">
                    <label>Imagen</label>
                    <input type="file" onChange={handleImageUpload} />
                    {imagen && <img src={imagen} alt="Preview" className="imagen-preview" />}
                </div>
                <button onClick={handleAdd}>{editId ? 'Actualizar Actividad' : 'Agregar Actividad'}</button>
            </div>

            <div className="actividades-list">
                {actividades.map((actividad, index) => (
                    <div key={index} className="actividad-item">
                        <img src={actividad.imagen} alt={actividad.titulo} className="actividad-imagen" />
                        <div className="actividad-info">
                            <h3>{actividad.titulo}</h3>
                            <p>{actividad.fecha}</p>
                            <p>{actividad.descripcion}</p>
                        </div>
                        <div className="actividad-actions">
                            <button onClick={() => handleEdit(actividad)}>Editar</button>
                            <button onClick={() => handleDelete(actividad.id)}>Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderNoticias = () => (
        <div className="section">
            <h2>Noticias</h2>
            {/* Similar form and list for noticias */}
        </div>
    );

    const renderConsejoDirectivo = () => (
        <div className="section">
            <h2>Consejo Directivo</h2>
            {/* Form and list for consejo directivo */}
        </div>
    );

    return (
        <div className="admin-panel">
            <div className="sidebar">
                <img src={banner} alt="GAEP Banner" className="sidebar-banner" />
                <button onClick={() => setActiveSection('actividades')}>Actividades</button>
                <button onClick={() => setActiveSection('noticias')}>Noticias</button>
                <button onClick={() => setActiveSection('consejoDirectivo')}>Consejo Directivo</button>
                <button onClick={() => setActiveSection('exalumnosInscritos')}>Exalumnos inscritos</button>
                <button onClick={handleLogout}>Cerrar sesión</button>
            </div>
            <div className="content">
                {activeSection === 'actividades' && renderActividades()}
                {activeSection === 'noticias' && renderNoticias()}
                {activeSection === 'consejoDirectivo' && renderConsejoDirectivo()}
            </div>
        </div>
    );
};

export default AdminPanel;