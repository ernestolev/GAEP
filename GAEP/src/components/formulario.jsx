import React, { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import styles from '../Styles/Modal.module.css';
import mapaImg from '../assets/images/img-formmap.png';

const FormularioUbicaciones = ({ agregarUbicacion, onClose }) => {
    const [nombre, setNombre] = useState('');
    const [ubicacion, setUbicacion] = useState('extranjero');
    const [pais, setPais] = useState('');
    const [region, setRegion] = useState('');
    const [distrito, setDistrito] = useState('');
    const [promocion, setPromocion] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [animate, setAnimate] = useState(false); // Añadida esta línea

    const paises = [
        { nombre: "Afganistán", lat: 33.93911, lng: 67.709953 },
        { nombre: "Albania", lat: 41.153332, lng: 20.168331 },
        { nombre: "Argelia", lat: 28.033886, lng: 1.659626 },
        { nombre: "Andorra", lat: 42.546245, lng: 1.601554 },
        { nombre: "Angola", lat: -11.202692, lng: 17.873887 },
        { nombre: "Antigua y Barbuda", lat: 17.060816, lng: -61.796428 },
        { nombre: "Arabia Saudita", lat: 23.885942, lng: 45.079162 },
        { nombre: "Argelia", lat: 28.033886, lng: 1.659626 },
        { nombre: "Argentina", lat: -38.4161, lng: -63.616672 },
        { nombre: "Armenia", lat: 40.069099, lng: 45.038189 },
        { nombre: "Australia", lat: -25.274398, lng: 133.775136 },
        { nombre: "Austria", lat: 47.516231, lng: 14.550072 },
        { nombre: "Azerbaiyán", lat: 40.143105, lng: 47.576927 },
        { nombre: "Bahamas", lat: 25.03428, lng: -77.39628 },
        { nombre: "Bangladés", lat: 23.685, lng: 90.3563 },
        { nombre: "Barbados", lat: 13.193887, lng: -59.543198 },
        { nombre: "Bielorrusia", lat: 53.709807, lng: 27.953389 },
        { nombre: "Bélgica", lat: 50.850346, lng: 4.351721 },
        { nombre: "Belice", lat: 17.189877, lng: -88.49765 },
        { nombre: "Benín", lat: 9.30769, lng: 2.315834 },
        { nombre: "Bhután", lat: 27.514162, lng: 90.433601 },
        { nombre: "Bolivia", lat: -16.290154, lng: -63.588653 },
        { nombre: "Bosnia y Herzegovina", lat: 43.915886, lng: 17.679076 },
        { nombre: "Botswana", lat: -22.328474, lng: 24.684866 },
        { nombre: "Brasil", lat: -14.235004, lng: -51.92528 },
        { nombre: "Brunei", lat: 4.535277, lng: 114.727669 },
        { nombre: "Bulgaria", lat: 42.733883, lng: 25.48583 },
        { nombre: "Burkina Faso", lat: 12.238333, lng: -1.561593 },
        { nombre: "Burundi", lat: -3.373056, lng: 29.918886 },
        { nombre: "Cabo Verde", lat: 16.54198, lng: -24.93981 },
        { nombre: "Camboya", lat: 12.565679, lng: 104.990963 },
        { nombre: "Camerún", lat: 7.369722, lng: 12.354722 },
        { nombre: "Canadá", lat: 56.130366, lng: -106.346771 },
        { nombre: "Catar", lat: 25.276987, lng: 51.520008 },
        { nombre: "Chile", lat: -35.675147, lng: -71.542969 },
        { nombre: "China", lat: 35.86166, lng: 104.195397 },
        { nombre: "Chipre", lat: 35.126413, lng: 33.429859 },
        { nombre: "Colombia", lat: 4.570868, lng: -74.297333 },
        { nombre: "Comoras", lat: -11.6455, lng: 43.3333 },
        { nombre: "Congo", lat: -0.228021, lng: 15.827659 },
        { nombre: "Corea del Norte", lat: 40.339852, lng: 127.510093 },
        { nombre: "Corea del Sur", lat: 35.907757, lng: 127.766922 },
        { nombre: "Costa Rica", lat: 9.748917, lng: -83.753428 },
        { nombre: "Croacia", lat: 45.1, lng: 15.2 },
        { nombre: "Cuba", lat: 21.521757, lng: -77.781167 },
        { nombre: "Dinamarca", lat: 56.26392, lng: 9.501785 },
        { nombre: "Dominica", lat: 15.414999, lng: -61.370976 },
        { nombre: "Ecuador", lat: -1.831239, lng: -78.183406 },
        { nombre: "Egipto", lat: 26.820553, lng: 30.802498 },
        { nombre: "El Salvador", lat: 13.794185, lng: -88.89653 },
        { nombre: "Emiratos Árabes Unidos", lat: 23.424076, lng: 53.847818 },
        { nombre: "Eritrea", lat: 15.179384, lng: 39.782334 },
        { nombre: "Eslovaquia", lat: 48.669026, lng: 19.699024 },
        { nombre: "Eslovenia", lat: 46.151241, lng: 14.995463 },
        { nombre: "España", lat: 40.463667, lng: -3.74922 },
        { nombre: "Estados Unidos", lat: 37.09024, lng: -95.712891 },
        { nombre: "Estonia", lat: 58.595272, lng: 25.013607 },
        { nombre: "Esuatini", lat: -26.522503, lng: 31.465866 },
        { nombre: "Etiopía", lat: 9.145, lng: 40.489673 },
        { nombre: "Fiyi", lat: -17.7134, lng: 178.0650 },
        { nombre: "Filipinas", lat: 12.879721, lng: 121.774017 },
        { nombre: "Finlandia", lat: 61.92411, lng: 25.748151 },
        { nombre: "Francia", lat: 46.603354, lng: 1.888334 },
        { nombre: "Gabón", lat: -0.803689, lng: 11.609444 },
        { nombre: "Gambia", lat: 13.443182, lng: -15.310139 },
        { nombre: "Georgia", lat: 42.315407, lng: 43.356892 },
        { nombre: "Ghana", lat: 7.946527, lng: -1.023194 },
        { nombre: "Granada", lat: 12.262776, lng: -61.604171 },
        { nombre: "Grecia", lat: 39.074208, lng: 21.824312 },
        { nombre: "Guatemala", lat: 15.783471, lng: -90.230759 },
        { nombre: "Guinea", lat: 9.945587, lng: -9.696645 },
        { nombre: "Guinea-Bisáu", lat: 11.803749, lng: -15.180413 },
        { nombre: "Guyana", lat: 4.860416, lng: -58.93018 },
        { nombre: "Haití", lat: 18.971187, lng: -72.285215 },
        { nombre: "Honduras", lat: 15.199999, lng: -86.241905 },
        { nombre: "Hungría", lat: 47.162494, lng: 19.503304 },
        { nombre: "India", lat: 20.593684, lng: 78.96288 },
        { nombre: "Indonesia", lat: -0.789275, lng: 113.921327 },
        { nombre: "Irak", lat: 33.223191, lng: 43.679291 },
        { nombre: "Irán", lat: 32.427908, lng: 53.688046 },
        { nombre: "Irlanda", lat: 53.142367, lng: -7.692053 },
        { nombre: "Islandia", lat: 64.963051, lng: -19.020835 },
        { nombre: "Israel", lat: 31.046051, lng: 34.851612 },
        { nombre: "Italia", lat: 41.87194, lng: 12.56738 },
        { nombre: "Jamaica", lat: 18.109581, lng: -77.297508 },
        { nombre: "Japón", lat: 36.204824, lng: 138.252924 },
        { nombre: "Jordania", lat: 30.585164, lng: 36.238414 },
        { nombre: "Kazajistán", lat: 48.019573, lng: 66.923684 },
        { nombre: "Kenia", lat: -0.023559, lng: 37.906193 },
        { nombre: "Kirguistán", lat: 41.20438, lng: 74.766098 },
        { nombre: "Kuwait", lat: 29.31166, lng: 47.481766 },
        { nombre: "Laos", lat: 19.85627, lng: 102.495496 },
        { nombre: "Lesoto", lat: -29.609988, lng: 28.233608 },
        { nombre: "Letonia", lat: 56.879635, lng: 24.603189 },
        { nombre: "Líbano", lat: 33.854721, lng: 35.862285 },
        { nombre: "Liberia", lat: 6.428055, lng: -9.429499 },
        { nombre: "Libia", lat: 26.3351, lng: 17.228331 },
        { nombre: "Liechtenstein", lat: 47.1415, lng: 9.5215 },
        { nombre: "Lituania", lat: 55.169438, lng: 23.881275 },
        { nombre: "Luxemburgo", lat: 49.611722, lng: 6.131944 },
        { nombre: "Malasia", lat: 4.210484, lng: 101.975766 },
        { nombre: "Malaui", lat: -13.254308, lng: 34.301525 },
        { nombre: "Maldivas", lat: 3.202778, lng: 73.22068 },
        { nombre: "Mali", lat: 17.570692, lng: -3.996166 },
        { nombre: "Malta", lat: 35.937496, lng: 14.375416 },
        { nombre: "Mauricio", lat: -20.348404, lng: 57.552152 },
        { nombre: "Mauritania", lat: 21.00789, lng: -10.940835 },
        { nombre: "México", lat: 23.634501, lng: -102.552784 },
        { nombre: "Moldavia", lat: 47.0105, lng: 28.8638 },
        { nombre: "Mónaco", lat: 43.738418, lng: 7.424616 },
        { nombre: "Mongolia", lat: 46.862496, lng: 103.846656 },
        { nombre: "Mozambique", lat: -18.665695, lng: 35.529562 },
        { nombre: "Myanmar", lat: 21.913965, lng: 95.956223 },
        { nombre: "Namibia", lat: -22.95764, lng: 18.49041 },
        { nombre: "Nauru", lat: -0.522778, lng: 166.931503 },
        { nombre: "Nepal", lat: 28.394857, lng: 84.124007 },
        { nombre: "Nicaragua", lat: 12.865416, lng: -85.207229 },
        { nombre: "Níger", lat: 17.607789, lng: 8.081666 },
        { nombre: "Nigeria", lat: 9.081999, lng: 8.675277 },
        { nombre: "Noruega", lat: 60.472024, lng: 8.468946 },
        { nombre: "Nueva Zelanda", lat: -40.900557, lng: 174.885971 },
        { nombre: "Omán", lat: 21.512583, lng: 55.923255 },
        { nombre: "Países Bajos", lat: 52.132633, lng: 5.291266 },
        { nombre: "Pakistán", lat: 30.375321, lng: 69.345116 },
        { nombre: "Palaos", lat: 7.51498, lng: 134.58252 },
        { nombre: "Palestina", lat: 31.952162, lng: 35.233154 },
        { nombre: "Panamá", lat: 8.537981, lng: -80.782127 },
        { nombre: "Papúa Nueva Guinea", lat: -6.314993, lng: 143.95555 },
        { nombre: "Paraguay", lat: -23.442503, lng: -58.443832 },
        { nombre: "Perú", lat: -9.19, lng: -75.015152 },
        { nombre: "Polonia", lat: 51.919438, lng: 19.145136 },
        { nombre: "Portugal", lat: 39.399872, lng: -8.224454 },
        { nombre: "Qatar", lat: 25.276987, lng: 51.520008 },
        { nombre: "República Centroafricana", lat: 6.611111, lng: 20.939444 },
        { nombre: "República Checa", lat: 49.817492, lng: 15.472962 },
        { nombre: "República del Congo", lat: -0.228021, lng: 15.827659 },
        { nombre: "República Dominicana", lat: 18.735693, lng: -70.162651 },
        { nombre: "Ruanda", lat: -1.940278, lng: 29.873888 },
        { nombre: "Rumania", lat: 45.943161, lng: 24.96676 },
        { nombre: "Rusia", lat: 61.52401, lng: 105.318756 },
        { nombre: "Samoa", lat: -13.75903, lng: -172.104629 },
        { nombre: "San Cristóbal y Nieves", lat: 17.357822, lng: -62.782998 },
        { nombre: "San Marino", lat: 43.93326, lng: 12.450001 },
        { nombre: "Santa Lucía", lat: 13.909444, lng: -60.978893 },
        { nombre: "San Vicente y las Granadinas", lat: 12.984305, lng: -61.287228 },
        { nombre: "Santo Tomé y Príncipe", lat: 0.18636, lng: 6.613081 },
        { nombre: "Seychelles", lat: -4.679574, lng: 55.491977 },
        { nombre: "Sierra Leona", lat: 8.460555, lng: -11.779889 },
        { nombre: "Singapur", lat: 1.352083, lng: 103.819836 },
        { nombre: "Siria", lat: 34.802075, lng: 38.996815 },
        { nombre: "Somalia", lat: 5.152149, lng: 46.199616 },
        { nombre: "Sri Lanka", lat: 7.873054, lng: 80.771797 },
        { nombre: "Sudáfrica", lat: -30.559482, lng: 22.937506 },
        { nombre: "Sudán", lat: 12.862807, lng: 30.217636 },
        { nombre: "Sudán del Sur", lat: 6.876991, lng: 31.30724 },
        { nombre: "Suecia", lat: 60.128161, lng: 18.643501 },
        { nombre: "Suiza", lat: 46.818188, lng: 8.227512 },
        { nombre: "Surinam", lat: 3.919305, lng: -56.027783 },
        { nombre: "Tailandia", lat: 15.870032, lng: 100.992541 },
        { nombre: "Tanzania", lat: -6.369028, lng: 34.888822 },
        { nombre: "Tayikistán", lat: 38.861034, lng: 71.276093 },
        { nombre: "Timor Oriental", lat: -8.874217, lng: 125.727539 },
        { nombre: "Togo", lat: 8.619543, lng: 0.824782 },
        { nombre: "Tonga", lat: -21.178986, lng: -175.198242 },
        { nombre: "Trinidad y Tobago", lat: 10.691803, lng: -61.222503 },
        { nombre: "Túnez", lat: 33.886917, lng: 9.537499 },
        { nombre: "Turkmenistán", lat: 38.969719, lng: 59.556278 },
        { nombre: "Turquía", lat: 38.963745, lng: 35.243322 },
        { nombre: "Tuvalu", lat: -7.109535, lng: 177.64933 },
        { nombre: "Uganda", lat: 1.373333, lng: 32.290275 },
        { nombre: "Ucrania", lat: 48.379433, lng: 31.16558 },
        { nombre: "Uganda", lat: 1.373333, lng: 32.290275 },
        { nombre: "Uruguay", lat: -32.522779, lng: -55.765835 },
        { nombre: "Uzbekistán", lat: 41.377491, lng: 64.585262 },
        { nombre: "Vanuatu", lat: -15.376706, lng: 166.959158 },
        { nombre: "Vaticano", lat: 41.902916, lng: 12.453389 },
        { nombre: "Venezuela", lat: 6.42375, lng: -66.58973 },
        { nombre: "Vietnam", lat: 14.0583, lng: 108.277199 },
        { nombre: "Yemen", lat: 15.552727, lng: 48.516388 },
        { nombre: "Zambia", lat: -13.133897, lng: 27.849332 },
        { nombre: "Zimbabue", lat: -19.015438, lng: 29.154857 }
    ];

    const regionesPeru = [
        { nombre: "Amazonas", lat: -6.231, lng: -77.869 },
        { nombre: "Áncash", lat: -9.529, lng: -77.528 },
        { nombre: "Apurímac", lat: -14.027, lng: -72.677 },
        { nombre: "Arequipa", lat: -16.409, lng: -71.537 },
        { nombre: "Ayacucho", lat: -13.158, lng: -74.223 },
        { nombre: "Cajamarca", lat: -7.163, lng: -78.500 },
        { nombre: "Callao", lat: -12.061, lng: -77.133 },
        { nombre: "Cusco", lat: -13.532, lng: -71.967 },
        { nombre: "Huancavelica", lat: -12.787, lng: -74.973 },
        { nombre: "Huánuco", lat: -9.930, lng: -76.242 },
        { nombre: "Ica", lat: -14.067, lng: -75.728 },
        { nombre: "Junín", lat: -11.541, lng: -74.876 },
        { nombre: "La Libertad", lat: -8.109, lng: -79.021 },
        { nombre: "Lambayeque", lat: -6.701, lng: -79.906 },
        { nombre: "Lima", lat: -12.046, lng: -77.042 },
        { nombre: "Loreto", lat: -3.749, lng: -73.253 },
        { nombre: "Madre de Dios", lat: -12.593, lng: -69.189 },
        { nombre: "Moquegua", lat: -17.194, lng: -70.935 },
        { nombre: "Pasco", lat: -10.682, lng: -76.256 },
        { nombre: "Piura", lat: -5.194, lng: -80.632 },
        { nombre: "Puno", lat: -15.840, lng: -70.021 },
        { nombre: "San Martín", lat: -6.485, lng: -76.365 },
        { nombre: "Tacna", lat: -18.013, lng: -70.251 },
        { nombre: "Tumbes", lat: -3.566, lng: -80.451 },
        { nombre: "Ucayali", lat: -8.379, lng: -74.553 }
    ];

    const distritosPeru = {
        "Amazonas": [
            { nombre: "Chachapoyas", lat: -6.231, lng: -77.869 },
            { nombre: "Bagua", lat: -5.642, lng: -78.528 },
            { nombre: "Utcubamba", lat: -5.742, lng: -78.528 },
            { nombre: "Bongará", lat: -5.912, lng: -77.990 },
            { nombre: "Rodríguez de Mendoza", lat: -6.400, lng: -77.646 }
        ],
        "Áncash": [
            { nombre: "Huaraz", lat: -9.529, lng: -77.528 },
            { nombre: "Chimbote", lat: -9.085, lng: -78.578 },
            { nombre: "Casma", lat: -9.462, lng: -78.295 },
            { nombre: "Caraz", lat: -9.147, lng: -77.721 },
            { nombre: "Huarmey", lat: -9.394, lng: -78.296 },
            { nombre: "Pallasca", lat: -8.406, lng: -77.387 }
        ],
        "Apurímac": [
            { nombre: "Abancay", lat: -13.641, lng: -72.927 },
            { nombre: "Andahuaylas", lat: -13.644, lng: -73.001 },
            { nombre: "Chalhuanca", lat: -13.376, lng: -73.116 },
            { nombre: "Aymaraes", lat: -13.724, lng: -73.336 }
        ],
        "Arequipa": [
            { nombre: "Arequipa", lat: -16.409, lng: -71.537 },
            { nombre: "Camaná", lat: -16.491, lng: -73.081 },
            { nombre: "Caravelí", lat: -16.303, lng: -73.741 },
            { nombre: "Condesuyos", lat: -16.264, lng: -72.978 },
            { nombre: "Islay", lat: -17.129, lng: -72.377 }
        ],
        "Ayacucho": [
            { nombre: "Ayacucho", lat: -13.158, lng: -74.222 },
            { nombre: "Huamanga", lat: -13.158, lng: -74.225 },
            { nombre: "Vilcas Huamán", lat: -13.151, lng: -74.168 },
            { nombre: "Fajardo", lat: -13.136, lng: -74.273 }
        ],
        "Cajamarca": [
            { nombre: "Cajamarca", lat: -7.148, lng: -78.508 },
            { nombre: "Celendín", lat: -6.697, lng: -78.743 },
            { nombre: "Chota", lat: -6.608, lng: -78.661 },
            { nombre: "Cutervo", lat: -6.338, lng: -78.901 },
            { nombre: "San Marcos", lat: -6.513, lng: -78.582 }
        ],
        "Callao": [
            { nombre: "Callao", lat: -12.057, lng: -77.125 }
        ],
        "Cusco": [
            { nombre: "Cusco", lat: -13.532, lng: -71.978 },
            { nombre: "Quillabamba", lat: -12.834, lng: -72.734 },
            { nombre: "Urubamba", lat: -13.253, lng: -72.075 },
            { nombre: "Anta", lat: -13.389, lng: -71.839 }
        ],
        "Huancavelica": [
            { nombre: "Huancavelica", lat: -12.809, lng: -74.963 },
            { nombre: "Tayacaja", lat: -13.014, lng: -75.152 },
            { nombre: "Angaraes", lat: -12.976, lng: -75.265 }
        ],
        "Huánuco": [
            { nombre: "Huánuco", lat: -9.933, lng: -76.240 },
            { nombre: "Tingo María", lat: -9.670, lng: -75.924 },
            { nombre: "Ambo", lat: -9.870, lng: -76.314 },
            { nombre: "Pachitea", lat: -10.092, lng: -75.993 }
        ],
        "Ica": [
            { nombre: "Ica", lat: -14.046, lng: -75.720 },
            { nombre: "Nazca", lat: -14.845, lng: -74.951 },
            { nombre: "Palpa", lat: -14.866, lng: -75.210 },
            { nombre: "Chincha", lat: -13.40, lng: -76.13 },
            { nombre: "Pisco", lat: -13.726, lng: -76.216 }
        ],
        "Junín": [
            { nombre: "Huancayo", lat: -12.069, lng: -75.204 },
            { nombre: "Chanchamayo", lat: -11.889, lng: -75.329 },
            { nombre: "Satipo", lat: -12.892, lng: -74.914 },
            { nombre: "Jauja", lat: -11.870, lng: -75.328 }
        ],
        "La Libertad": [
            { nombre: "Trujillo", lat: -8.115, lng: -79.037 },
            { nombre: "Pacasmayo", lat: -6.837, lng: -79.287 },
            { nombre: "Gran Chimú", lat: -8.450, lng: -78.946 },
            { nombre: "Ascope", lat: -8.107, lng: -79.395 }
        ],
        "Lambayeque": [
            { nombre: "Chiclayo", lat: -6.768, lng: -79.876 },
            { nombre: "Ferreñafe", lat: -6.985, lng: -79.764 },
            { nombre: "Lambayeque", lat: -6.908, lng: -79.661 }
        ],
        "Lima": [
            { nombre: "Lima", lat: -12.046, lng: -77.042 },
            { nombre: "Callao", lat: -12.057, lng: -77.125 }
        ],
        "Loreto": [
            { nombre: "Iquitos", lat: -3.751, lng: -73.253 },
            { nombre: "Nauta", lat: -3.953, lng: -73.548 },
            { nombre: "Mazán", lat: -3.987, lng: -73.683 }
        ],
        "Madre de Dios": [
            { nombre: "Puerto Maldonado", lat: -12.586, lng: -69.191 },
            { nombre: "Manu", lat: -11.586, lng: -71.261 }
        ],
        "Moquegua": [
            { nombre: "Moquegua", lat: -17.168, lng: -70.946 },
            { nombre: "Ilo", lat: -17.080, lng: -70.922 },
            { nombre: "Mariscal Nieto", lat: -17.054, lng: -70.963 }
        ],
        "Pasco": [
            { nombre: "Daniel Alcides Carrión", lat: -10.731, lng: -76.270 },
            { nombre: "Oxapampa", lat: -10.847, lng: -75.891 },
            { nombre: "Palcazú", lat: -10.841, lng: -75.930 }
        ],
        "Piura": [
            { nombre: "Piura", lat: -5.201, lng: -80.631 },
            { nombre: "Talara", lat: -4.584, lng: -81.274 },
            { nombre: "Ayabaca", lat: -4.732, lng: -80.768 },
            { nombre: "Sullana", lat: -4.870, lng: -80.943 }
        ],
        "Puno": [
            { nombre: "Puno", lat: -15.840, lng: -70.025 },
            { nombre: "Juliaca", lat: -15.507, lng: -70.133 },
            { nombre: "Yunguyo", lat: -15.637, lng: -69.920 },
            { nombre: "El Collao", lat: -14.903, lng: -69.585 }
        ],
        "San Martín": [
            { nombre: "Tarapoto", lat: -6.493, lng: -76.376 },
            { nombre: "Moyobamba", lat: -6.087, lng: -76.091 },
            { nombre: "Lamas", lat: -6.362, lng: -76.307 }
        ],
        "Tacna": [
            { nombre: "Tacna", lat: -18.014, lng: -70.250 },
            { nombre: "Candarave", lat: -17.778, lng: -70.483 },
            { nombre: "Jorge Basadre", lat: -18.003, lng: -70.065 }
        ],
        "Tumbes": [
            { nombre: "Tumbes", lat: -3.562, lng: -80.443 },
            { nombre: "Zarumilla", lat: -3.432, lng: -80.532 },
            { nombre: "Contralmirante Villar", lat: -3.569, lng: -80.460 }
        ],
        "Ucayali": [
            { nombre: "Pucallpa", lat: -8.388, lng: -74.548 },
            { nombre: "Coronel Portillo", lat: -8.366, lng: -74.557 },
            { nombre: "Padre Abad", lat: -9.117, lng: -74.308 }
        ]
    };

    // Efecto para manejar la animación del toggle
    useEffect(() => {
        setAnimate(true);
        const timer = setTimeout(() => {
            setAnimate(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [ubicacion]);

    const handleRegionChange = (e) => {
        setRegion(e.target.value);
        setDistrito(''); // Restablecer el distrito cuando se cambia la región
    };

    const currentYear = new Date().getFullYear();
    const promociones = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => 1950 + i);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        let nuevaUbicacion;

        if (ubicacion === 'peru') {
            const distritoSeleccionado = distritosPeru[region]?.find(d => d.nombre === distrito);
            if (distritoSeleccionado) {
                nuevaUbicacion = {
                    nombre,
                    pais: 'Perú',
                    region,
                    distrito: distritoSeleccionado.nombre,
                    lat: distritoSeleccionado.lat,
                    lng: distritoSeleccionado.lng,
                    promocion
                };
            }
        } else {
            const paisSeleccionado = paises.find(p => p.nombre === pais);
            if (paisSeleccionado) {
                nuevaUbicacion = {
                    nombre,
                    pais: paisSeleccionado.nombre,
                    lat: paisSeleccionado.lat,
                    lng: paisSeleccionado.lng,
                    promocion
                };
            }
        }

        if (nuevaUbicacion) {
            try {
                await addDoc(collection(db, 'ubicaciones'), nuevaUbicacion);
                agregarUbicacion(nuevaUbicacion);
                setNombre('');
                setUbicacion('extranjero');
                setPais('');
                setRegion('');
                setDistrito('');
                setPromocion('');
                onClose(); // Cerrar el modal después de enviar el formulario
            } catch (error) {
                console.error("Error al agregar ubicación:", error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };



    return (
        <>
            <h3>Regístrate en nuestro mapa</h3>

            <div className={styles['modal-body']}>
                <img src={mapaImg} alt="Mapa mundial" />

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.mapaform}>
                        <div className={styles['location-toggle']}>
                            <button
                                type="button"
                                className={`${ubicacion === 'extranjero' ? styles.active : ''} ${animate ? styles.animate : ''}`}
                                onClick={() => setUbicacion('extranjero')}
                                style={{
                                    color: ubicacion === 'extranjero' ? 'white' : '#026010'
                                }}
                            >
                                Extranjero
                            </button>
                            <button
                                type="button"
                                className={`${ubicacion === 'peru' ? styles.active : ''} ${animate ? styles.animate : ''}`}
                                onClick={() => setUbicacion('peru')}
                                style={{
                                    color: ubicacion === 'peru' ? 'white' : '#026010'
                                }}
                            >
                                Perú
                            </button>
                            <div
                                className={styles['toggle-slider']}
                                style={{
                                    transform: ubicacion === 'peru' ? 'translateX(100%)' : 'translateX(0)'
                                }}
                            ></div>
                        </div>

                        <div>
                            <label>Nombre completo</label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Ingresa tu nombre"
                                required
                            />
                        </div>

                        {ubicacion === 'peru' ? (
                            <>
                                <div>
                                    <label>Región</label>
                                    <select value={region} onChange={handleRegionChange} required>
                                        <option value="" disabled>Selecciona tu región</option>
                                        {regionesPeru.map((regionOpcion, index) => (
                                            <option key={index} value={regionOpcion.nombre}>
                                                {regionOpcion.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label>Distrito</label>
                                    <select value={distrito} onChange={(e) => setDistrito(e.target.value)} required>
                                        <option value="" disabled>Selecciona tu distrito</option>
                                        {region && distritosPeru[region]?.map((distritoOpcion, index) => (
                                            <option key={index} value={distritoOpcion.nombre}>
                                                {distritoOpcion.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        ) : (
                            <div>
                                <label>País</label>
                                <select value={pais} onChange={(e) => setPais(e.target.value)} required>
                                    <option value="" disabled>Selecciona tu país</option>
                                    {paises.map((paisOpcion, index) => (
                                        <option key={index} value={paisOpcion.nombre}>
                                            {paisOpcion.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div>
                            <label>Promoción</label>
                            <select value={promocion} onChange={(e) => setPromocion(e.target.value)} required>
                                <option value="" disabled>Selecciona tu promoción</option>
                                {promociones.map((year, index) => (
                                    <option key={index} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className={`${styles['submit-button']} ${isSubmitting ? styles.loading : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Guardando...' : 'Guardar Ubicación'}
                        {isSubmitting && <span className={styles['loading-spinner']}></span>}
                    </button>
                </form>
            </div>
        </>
    );
};

export default FormularioUbicaciones;