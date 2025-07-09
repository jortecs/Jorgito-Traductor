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
      <button className="btn-alternar-idiomas" onClick={alternarIdiomas} title="Intercambiar idiomas" aria-label="Intercambiar idiomas">
        ⇄
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