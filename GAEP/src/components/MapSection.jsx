import React, { useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from '../Styles/MapSection.module.css';
import mapPin from '../assets/icons/icon-fb.png';

const MapSection = ({ ubicaciones }) => {
  const mapRef = useRef();
  
  // Crear icono personalizado
  const jadeGreenIcon = new L.Icon({
    iconUrl: mapPin,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  // Agrupar ubicaciones por coordenadas
  const ubicacionesAgrupadas = ubicaciones.reduce((acc, ubicacion) => {
    const key = `${ubicacion.lat},${ubicacion.lng}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(ubicacion);
    return acc;
  }, {});

  // Obtener ubicaciones principales para la lista
  const ubicacionesPrincipales = Object.keys(ubicacionesAgrupadas).map(key => {
    const [lat, lng] = key.split(',').map(Number);
    const ubicacionesEnPais = ubicacionesAgrupadas[key];
    return {
      pais: ubicacionesEnPais[0].pais,
      lat,
      lng,
      count: ubicacionesEnPais.length
    };
  });

  // Ordenar por cantidad de pardinos
  ubicacionesPrincipales.sort((a, b) => b.count - a.count);

  const handleUbicacionClick = (lat, lng) => {
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 5);
    }
  };

  return (
    <section className={styles.mapapardinos} data-aos="fade-up">
      <h3>Mapa de Exalumnos</h3>
      <div className={styles.mapita}>
        <MapContainer 
          className={styles.mapitaContent} 
          center={[0, 0]} 
          zoom={1} 
          style={{ height: '450px', width: '100%'}}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {Object.keys(ubicacionesAgrupadas).map((key, index) => {
            const [lat, lng] = key.split(',').map(Number);
            const ubicacionesEnPais = ubicacionesAgrupadas[key];
            
            // Group names by promotion
            const promocionesConNombres = ubicacionesEnPais.reduce((acc, ubi) => {
              if (!acc[ubi.promocion]) {
                acc[ubi.promocion] = [];
              }
              acc[ubi.promocion].push(ubi.nombre);
              return acc;
            }, {});

            return (
              <Marker key={index} position={[lat, lng]} icon={jadeGreenIcon}>
                <Popup>
                  <div className={styles.popupContent}>
                    <h4>{ubicacionesEnPais[0].pais}</h4>
                    {Object.entries(promocionesConNombres).map(([promocion, nombres], idx) => (
                      <div key={idx} className={styles.promocionGroup}>
                        <strong>Promoción {promocion}:</strong>
                        <ul>
                          {nombres.map((nombre, i) => (
                            <li key={i}>{nombre}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <div className={styles.totalCount}>
                      <strong>Total: {ubicacionesEnPais.length}</strong>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
        
        <div className={styles.ubicacionesPrincipales}>
          {ubicacionesPrincipales.map((ubicacion, index) => {
            const ubicacionesEnPais = ubicacionesAgrupadas[`${ubicacion.lat},${ubicacion.lng}`];
            const nombresAgrupados = ubicacionesEnPais.reduce((acc, ubi) => {
              if (!acc[ubi.promocion]) {
                acc[ubi.promocion] = [];
              }
              acc[ubi.promocion].push(ubi.nombre);
              return acc;
            }, {});

            return (
              <div
                key={index}
                className={styles.ubicacionPrincipal}
                onClick={() => handleUbicacionClick(ubicacion.lat, ubicacion.lng)}
              >
                <div className={styles.ubicacionPrincipalNombre}>{ubicacion.pais}</div>
                <div className={styles.ubicacionPrincipalInfo}>
                  {Object.entries(nombresAgrupados).map(([promocion, nombres], idx) => (
                    <div key={idx} className={styles.promocionInfo}>
                      <div>Promoción {promocion}:</div>
                      <div className={styles.nombresList}>{nombres.join(', ')}</div>
                    </div>
                  ))}
                </div>
                <div className={styles.ubicacionPrincipalCount}>Total: {ubicacion.count}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MapSection;