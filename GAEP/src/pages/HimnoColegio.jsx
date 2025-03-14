import React from 'react';
import Navbar2 from '../components/Navbar2';
import Footer from '../components/Footer';
import styles from '../Styles/HimnoColegio.module.css';
import himno from '../assets/audio/himno-pardo.mp3';
import { Link } from 'react-router-dom';

const HimnoColegio = () => {
    return (
        <>
            <Navbar2 />
            <div className={styles.himnoContainer}>
                <div className={styles.headerSticky1}>
                    <div className={styles.breadcrumbActividades}>
                        <Link to="/">Inicio</Link>
                        <span>/</span>
                        <span>Himno JPB</span>
                    </div>
                </div>
                <div className={styles.himnoContent}>
                    <h1 className={styles.tituloHimno}>Himno al colegio José Pardo y Barreda</h1>
                    <div className={styles.himnoLetra}>
                        <h2>Letra</h2>
                        <div className={styles.estrofa}>
                            <h3>CORO</h3>
                            <p>Juventud, juventud a la gloria
                            </p>
                            <p>
                                Adelante con paso triunfal
                            </p>
                            <p>
                                Que ha sonado el clarín de la nistoria,
                            </p>
                            <p>Y nos llama a la meta a tomar</p>
                            <h3>ESTROFAS</h3>
                            <h3>I</h3>
                            <p>La justicia la paz invoquemos
                            </p>
                            <p>Como norte y antorcha de Dios</p>
                            <p>Y en américa toda brindemos</p>
                            <p>Ese cáliz fraterno de amor</p>
                            <h3>II</h3>
                            <p>Nuestra patria es la herencia suprema
                            </p>
                            <p>Patrimonio de gloria y honor</p>
                            <p>Y su historia soberbia esta llena</p>
                            <p>De heroismo ejemplar y esplendor</p>
                            <h3>III</h3>
                            <p>
                                Estudiante peruano forjemos
                            </p>
                            <p> Una grande y gloriosa nación</p>
                            <p>Y su nombre muy alto llevemos</p>
                            <p>Con ahinco, valor y tesón.</p>
                        </div>
                    </div>
                    <div className={styles.himnoAudio}>
                        <h2>Escuchar el Himno</h2>
                        <audio controls>
                            <source src={himno} type="audio/mpeg" />
                            Tu navegador no soporta el elemento de audio.
                        </audio>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default HimnoColegio;