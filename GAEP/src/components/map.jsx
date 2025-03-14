import React, { useRef, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from '../Styles/Map.module.css';

// Componente marcador personalizado
const CustomMarker = ({ position, icon, children }) => {
  const map = useMap();
  
  useEffect(() => {
    // Crear marcador personalizado con div en lugar del icono por defecto
    const marker = L.marker(position, { icon }).addTo(map);
    
    // Añadir popup al marcador si hay children
    if (children) {
      marker.bindPopup(L.popup({
        className: styles['custom-popup'],
        closeButton: true,
        autoClose: false,
        closeOnClick: false
      }).setContent(() => {
        const div = document.createElement('div');
        div.innerHTML = children;
        return div;
      }));
    }
    
    return () => {
      map.removeLayer(marker);
    };
  }, [position, children, map, icon]);
  
  return null;
};

// Crear icono personalizado para los marcadores
const createCustomIcon = () => {
  return L.divIcon({
    className: styles['map-marker-container'],
    html: `
      <div class="${styles['map-marker-pulse']}"></div>
      <div class="${styles['map-marker']}"></div>
    `,
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [1, -35]
  });
};

const Mapa = ({ ubicaciones }) => {
  const mapRef = useRef();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapZoom, setMapZoom] = useState(2);
  
  // Agrupar ubicaciones por coordenadas
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
  
  // Manejar click en ubicación principal
  const handleUbicacionClick = (lat, lng) => {
    const map = mapRef.current;
    if (map) {
      map.flyTo([lat, lng], 5, {
        animate: true,
        duration: 1.5
      });
      setMapZoom(5);
      
      // Mostrar la ubicación seleccionada
      setSelectedLocation(`${lat},${lng}`);
      
      // Cerrar después de un tiempo
      setTimeout(() => {
        const markers = document.querySelectorAll('.leaflet-popup');
        if (markers.length) {
          markers.forEach(marker => {
            marker.classList.add('active');
          });
        }
      }, 100);
    }
  };
  
  // Resetear la vista del mapa
  const resetMapView = () => {
    const map = mapRef.current;
    if (map) {
      map.flyTo([20, 0], 2, {
        animate: true,
        duration: 1.5
      });
      setMapZoom(2);
    }
  };
  
  // Generar el contenido HTML para el popup
  const createPopupContent = (key) => {
    const ubicacionesEnPais = ubicacionesAgrupadas[key];
    const pais = ubicacionesEnPais[0].pais;
    const ciudad = ubicacionesEnPais[0].ciudad || '';
    
    // Agrupar por promoción
    const promocionesConNombres = ubicacionesEnPais.reduce((acc, ubi) => {
      if (!acc[ubi.promocion]) {
        acc[ubi.promocion] = [];
      }
      acc[ubi.promocion].push(ubi.nombre);
      return acc;
    }, {});
    
    // Contar promociones únicas
    const promocionesCount = Object.keys(promocionesConNombres).length;
    
    return `
      <div>
        <div class="${styles['popup-header']}">
          ${pais}${ciudad ? ` - ${ciudad}` : ''}
        </div>
        <div class="${styles['popup-content']}">
          <div class="${styles['popup-stats']}">
            <div class="${styles['popup-stat']}">
              <div class="${styles['popup-stat-number']}">${ubicacionesEnPais.length}</div>
              <div class="${styles['popup-stat-label']}">Pardinos</div>
            </div>
            <div class="${styles['popup-stat']}">
              <div class="${styles['popup-stat-number']}">${promocionesCount}</div>
              <div class="${styles['popup-stat-label']}">Promociones</div>
            </div>
          </div>
          
          ${Object.entries(promocionesConNombres).map(([promocion, nombres], idx) => `
            <div class="${styles['promocion-group']}">
              <div class="${styles['promocion-title']}">Promoción ${promocion}</div>
              <ul class="${styles['promocion-list']}">
                ${nombres.map(nombre => `<li>${nombre}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
          
          <div class="${styles['total-count']}">
            Total: ${ubicacionesEnPais.length} ${ubicacionesEnPais.length === 1 ? 'Pardino' : 'Pardinos'}
          </div>
        </div>
      </div>
    `;
  };

  return (
    <div className={styles.mapita}>
      <MapContainer 
        className={styles['mapita-content']} 
        center={[20, 0]} 
        zoom={2} 
        minZoom={2}
        maxBounds={[[-90, -180], [90, 180]]}
        ref={mapRef} 
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap contributors &copy; CARTO"
          subdomains="abcd"
        />
        
        {Object.keys(ubicacionesAgrupadas).map((key) => {
          const [lat, lng] = key.split(',').map(Number);
          return (
            <CustomMarker 
              key={key} 
              position={[lat, lng]} 
              icon={createCustomIcon()}
            >
              {createPopupContent(key)}
            </CustomMarker>
          );
        })}
        
        <div className={styles['map-controls']}>
          <button 
            className={styles['map-control-button']} 
            onClick={resetMapView}
            title="Centrar mapa"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button 
            className={styles['map-control-button']} 
            onClick={() => {
              const map = mapRef.current;
              if (map) map.zoomIn();
            }}
            title="Acercar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button 
            className={styles['map-control-button']} 
            onClick={() => {
              const map = mapRef.current;
              if (map) map.zoomOut();
            }}
            title="Alejar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </MapContainer>
      
      <div className={styles['map-overlay']}></div>
      
      <div className={styles['ubicaciones-principales']}>
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
              className={styles['ubicacion-principal']}
              onClick={() => handleUbicacionClick(ubicacion.lat, ubicacion.lng)}
            >
              <span className={styles['ubicacion-principal-badge']}>
                Top {index + 1}
              </span>
              <div className={styles['ubicacion-principal-nombre']}>
                {ubicacion.pais}
              </div>
              <div className={styles['ubicacion-principal-info']}>
                {Object.entries(nombresAgrupados).slice(0, 2).map(([promocion, nombres], idx) => (
                  <div key={idx} className={styles['promocion-info']}>
                    <div className={styles['promocion-info-tag']}>Promo {promocion}:</div>
                    <div className={styles['nombres-list']}>
                      {nombres.slice(0, 2).join(', ')}
                      {nombres.length > 2 ? ` y +${nombres.length - 2} más` : ''}
                    </div>
                  </div>
                ))}
                {Object.keys(nombresAgrupados).length > 2 && (
                  <div className={styles['promocion-info']}>
                    <div className={styles['promocion-info-tag']}>
                      +{Object.keys(nombresAgrupados).length - 2} promociones más
                    </div>
                  </div>
                )}
              </div>
              <div className={styles['ubicacion-principal-count']}>
                <span>Total:</span>
                <span className={styles['count-number']}>
                  {ubicacion.count}
                </span>
                <button 
                  className={styles['ubicacion-principal-button']}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUbicacionClick(ubicacion.lat, ubicacion.lng);
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 12L9 16.5V7.5L15 12Z" fill="currentColor" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Mapa;