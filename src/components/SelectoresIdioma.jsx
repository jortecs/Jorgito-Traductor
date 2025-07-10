import React, { useContext } from 'react';
import { ContextoGlobal } from '../contextoGlobal';

export default function SelectoresIdioma() {
  const {
    idiomaOrigen, setIdiomaOrigen,
    idiomaDestino, setIdiomaDestino,
    idiomasDisponibles
  } = useContext(ContextoGlobal);

  const alternarIdiomas = () => {
    const temp = idiomaOrigen;
    setIdiomaOrigen(idiomaDestino);
    setIdiomaDestino(temp);
  };

  return (
    <div className="selectores-idioma">
      <div>
        <label htmlFor="idioma-origen">Idioma de origen:</label>
        <select
          id="idioma-origen"
          value={idiomaOrigen}
          onChange={e => setIdiomaOrigen(e.target.value)}
        >
          {idiomasDisponibles.map(idioma => (
            <option key={idioma.codigo} value={idioma.codigo}>
              {idioma.nombre}
            </option>
          ))}
        </select>
      </div>
      <button
        className="btn-alternar-idiomas"
        onClick={alternarIdiomas}
        title="Intercambiar idiomas"
        aria-label="Intercambiar idiomas"
        style={{
          background: 'linear-gradient(135deg, #5B7B93 60%, #6A7A3D 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(91,123,147,0.13)',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          fontSize: '1.5rem',
          padding: 0
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'rotate(180deg)'}
        onMouseOut={e => e.currentTarget.style.transform = 'rotate(0deg)'}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polyline points="8,6 4,11 8,16" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="14,6 18,11 14,16" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div>
        <label htmlFor="idioma-destino">Idioma de destino:</label>
        <select
          id="idioma-destino"
          value={idiomaDestino}
          onChange={e => setIdiomaDestino(e.target.value)}
        >
          {idiomasDisponibles.map(idioma => (
            <option key={idioma.codigo} value={idioma.codigo}>
              {idioma.nombre}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
} 