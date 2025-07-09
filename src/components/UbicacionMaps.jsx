import React, { useEffect, useState } from 'react';

export default function UbicacionMaps() {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('La geolocalización no está soportada en este navegador.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        setError('No se pudo obtener la ubicación.');
      }
    );
  }, []);

  return (
    <div className="ubicacion-maps">
      <h2>Mi ubicación actual</h2>
      {error && <p className="error-ubicacion">{error}</p>}
      {coords && (
        <iframe
          title="Google Maps"
          width="100%"
          height="280"
          style={{ border: 0, borderRadius: '12px', marginTop: '0.5rem' }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`}
        ></iframe>
      )}
      {!coords && !error && <p>Obteniendo ubicación...</p>}
    </div>
  );
} 