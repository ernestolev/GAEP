import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link, useNavigate } from 'react-router-dom';
import './JuntaDirectiva.modules.css';
import Navbar2 from '../../components/Navbar/Navbar2';
import Footer from '../../components/Footer/Footer';
import { LoadingScreen } from '../../components/LoadingScreen/LoadingScreen';


const JuntaDirectiva = () => {
    const [miembros, setMiembros] = useState(null);
    const [selectedMiembro, setSelectedMiembro] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMiembros = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'junta-directiva'));
                const miembrosData = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                }));
                setMiembros(miembrosData);
            } catch (error) {
                console.error("Error fetching miembros:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMiembros();
    }, []);

    if (!miembros) return <LoadingScreen />;

    return (
        <>
            <Navbar2 />
            <div className="jd-page">
                <div className="header-sticky">
                    <div className="jdbreadcrumb">
                        <Link to="/">Inicio</Link>
                        <span>/</span>
                        <span>Junta Directiva</span>
                    </div>
                    <h1>Junta Directiva</h1>
                </div>
                <div className="jd-list">
                    {miembros.map((miembro) => (
                        <div
                            key={miembro.id}
                            className="jd-item"
                            onClick={() => {
                                setSelectedMiembro(miembro);
                                setShowModal(true);
                            }}
                        >
                            <div
                                className="jd-imagen"
                                style={{ backgroundImage: `url(${miembro.img1})` }}
                            ></div>
                            <div className="jd-info">
                                <h3>{miembro.nombre} {miembro.apellidos}</h3>
                                <p className="cargo">{miembro.cargo}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {showModal && selectedMiembro && (
                    <div className="popjd" onClick={() => setShowModal(false)}>
                        <div className="jdmodal" onClick={e => e.stopPropagation()}>
                            <button className="closebtn" onClick={() => setShowModal(false)}>×</button>
                            <div className="jdmbody">
                                <div className="modal-foto">
                                    <div className="foto-container" style={{ backgroundImage: `url(${selectedMiembro.img1})` }}></div>
                                </div>
                                <div className="jdminfo">
                                    <h2>{selectedMiembro.nombre} {selectedMiembro.apellidos}</h2>
                                    <p className="cargo">{selectedMiembro.cargo}</p>
                                    <div className="info-details">
                                        <p><strong>Promoción:</strong> {selectedMiembro.prom}</p>
                                        <p><strong>Email:</strong> {selectedMiembro.email}</p>
                                        <p><strong>Teléfono:</strong> {selectedMiembro.telf}</p>
                                        <div className="biografia">
                                            <h3>Biografía</h3>
                                            <div
                                                className="bio-content"
                                                dangerouslySetInnerHTML={{ __html: selectedMiembro.bio }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default JuntaDirectiva;