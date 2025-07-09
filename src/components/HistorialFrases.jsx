import React, { useContext } from 'react';
import { ContextoGlobal } from '../contextoGlobal';

export default function HistorialFrases() {
  const { historial, idiomasDisponibles } = useContext(ContextoGlobal);

  if (!historial.length) return null;

  const nombreIdioma = codigo => {
    const idioma = idiomasDisponibles.find(i => i.codigo === codigo);
    return idioma ? idioma.nombre : codigo;
  };

  return (
    <div className="historial-frases">
      <h2>Historial de traducciones</h2>
      <ul>
        {historial.map((item, idx) => (
          <li key={idx}>
            <div className="historial-info">
              <span className="idioma">{nombreIdioma(item.origen)} → {nombreIdioma(item.destino)}</span>
              <span className="fecha">{new Date(item.fecha).toLocaleString()}</span>
            </div>
            <div className="frase-original">{item.original}</div>
            <div className="frase-traducida">{item.traduccion}</div>
          </li>
        ))}
      </ul>
    </div>
  );
} 