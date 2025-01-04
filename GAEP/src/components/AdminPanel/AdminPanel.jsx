import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import './AdminPanel.css';

const AdminPanel = ({ actividades, setActividades }) => {
    const [titulo, setTitulo] = useState('');
    const [fecha, setFecha] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [imagen, setImagen] = useState('');
    const [editId, setEditId] = useState(null);

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

        fetchActividades();
    }, [setActividades]);

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

    return (
        <div className="admin-panel">
            <h2>Panel de Administración</h2>
            <div>
                <h1>Admin Page</h1>
                <button onClick={handleLogout}>Cerrar sesión</button>
            </div>
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
};

export default AdminPanel;