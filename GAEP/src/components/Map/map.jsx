import React, { useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../pages/Home/Home.modules.css';

// Crear un icono personalizado para los marcadores
const jadeGreenIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [31, 41],
    className: 'jade-green-marker'
});

const Mapa = ({ ubicaciones }) => {
    const mapRef = useRef();

    // Agrupar ubicaciones por país
    const ubicacionesAgrupadas = ubicaciones.reduce((acc, ubicacion) => {
        const key = `${ubicacion.lat},${ubicacion.lng}`;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(ubicacion);
        return acc;
    }, {});

    // Ordenar ubicaciones por cantidad de personas
    const ubicacionesPrincipales = Object.keys(ubicacionesAgrupadas)
        .map(key => ({
            key,
            lat: parseFloat(key.split(',')[0]),
            lng: parseFloat(key.split(',')[1]),
            count: ubicacionesAgrupadas[key].length,
            pais: ubicacionesAgrupadas[key][0].pais,
            promociones: [...new Set(ubicacionesAgrupadas[key].map(u => u.promocion))]
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Mostrar las 5 principales ubicaciones

    const handleUbicacionClick = (lat, lng) => {
        const map = mapRef.current;
        if (map) {
            map.setView([lat, lng], 10); // Centrar el mapa en la ubicación seleccionada
        }
    };

    return (
        <div className='mapita'>
            <MapContainer className='mapita-content' center={[0, 0]} zoom={1} style={{ height: '450px', width: '100%'}} ref={mapRef}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                {Object.keys(ubicacionesAgrupadas).map((key, index) => {
                    const [lat, lng] = key.split(',').map(Number);
                    const ubicacionesEnPais = ubicacionesAgrupadas[key];
                    const promociones = [...new Set(ubicacionesEnPais.map(u => u.promocion))];
                    return (
                        <Marker key={index} position={[lat, lng]} icon={jadeGreenIcon}>
                            <Popup>
                                {promociones.map((promocion, idx) => (
                                    <div key={idx}>{promocion}</div>
                                ))}
                                <div>Total: {ubicacionesEnPais.length}</div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
            <div className="ubicaciones-principales">
                {ubicacionesPrincipales.map((ubicacion, index) => (
                    <div
                        key={index}
                        className="ubicacion-principal"
                        onClick={() => handleUbicacionClick(ubicacion.lat, ubicacion.lng)}
                    >
                        <div className="ubicacion-principal-nombre">{ubicacion.pais}</div>
                        <div className="ubicacion-principal-promociones">{ubicacion.promociones.join(', ')}</div>
                        <div className="ubicacion-principal-count">Total: {ubicacion.count}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Mapa;