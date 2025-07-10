import React, { useContext, useState, useEffect } from 'react';
import { ContextoGlobal } from '../contextoGlobal';

export default function FrasesRapidas() {
  const { frasesRapidas, idiomasDisponibles } = useContext(ContextoGlobal);
  const [idiomaVisual, setIdiomaVisual] = useState('es');
  const [idiomaDestino, setIdiomaDestino] = useState('en');
  const [frasesTraducidas, setFrasesTraducidas] = useState([]); // [{original, visual}]
  const [fraseSeleccionada, setFraseSeleccionada] = useState(null);
  const [traduccion, setTraduccion] = useState('');
  const [cargandoFrases, setCargandoFrases] = useState(false);
  const [cargandoTraduccion, setCargandoTraduccion] = useState(false);
  const [errorFrases, setErrorFrases] = useState(null);
  const [errorTraduccion, setErrorTraduccion] = useState(null);

  // Traducir todas las frases rápidas al idioma de visualización
  useEffect(() => {
    let cancelado = false;
    async function traducirTodas() {
      setCargandoFrases(true);
      setErrorFrases(null);
      try {
        const nuevas = await Promise.all(frasesRapidas.map(async (frase) => {
          if (idiomaVisual === 'es') return { original: frase, visual: frase };
          const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(frase)}&langpair=es|${idiomaVisual}`;
          const res = await fetch(url);
          const data = await res.json();
          let visual = frase;
          if (data && data.responseData && data.responseData.translatedText) {
            visual = data.responseData.translatedText;
          }
          return { original: frase, visual };
        }));
        if (!cancelado) setFrasesTraducidas(nuevas);
      } catch (e) {
        if (!cancelado) setErrorFrases('Error de red al traducir las frases.');
      }
      if (!cancelado) setCargandoFrases(false);
    }
    traducirTodas();
    return () => { cancelado = true; };
  }, [idiomaVisual, frasesRapidas]);

  // Traducir la frase seleccionada al idioma de destino
  const traducirFraseDestino = async (frase) => {
    setFraseSeleccionada(frase);
    setTraduccion('');
    setErrorTraduccion(null);
    setCargandoTraduccion(true);
    try {
      if (idiomaVisual === idiomaDestino) {
        setTraduccion(frase.visual);
      } else {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(frase.visual)}&langpair=${idiomaVisual}|${idiomaDestino}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data && data.responseData && data.responseData.translatedText) {
          setTraduccion(data.responseData.translatedText);
        } else {
          setErrorTraduccion('No se pudo traducir la frase.');
        }
      }
    } catch (e) {
      setErrorTraduccion('Error de red al traducir.');
    }
    setCargandoTraduccion(false);
  };

  const alternarIdiomas = () => {
    if (idiomaVisual !== idiomaDestino) {
      const temp = idiomaVisual;
      setIdiomaVisual(idiomaDestino);
      setIdiomaDestino(temp);
      setFraseSeleccionada(null);
      setTraduccion('');
    }
  };

  if (!frasesRapidas.length) return null;

  return (
    <div className="frases-rapidas">
      <h2>Frases rápidas</h2>
      <div style={{display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8}}>
        <label style={{fontWeight: 'bold'}}>Ver en:</label>
        <select
          value={idiomaVisual}
          onChange={e => setIdiomaVisual(e.target.value)}
          style={{padding: '0.4rem', borderRadius: 8, border: '1.5px solid #5B7B93', fontSize: '1rem', background: '#F7F4EC', color: '#2D2D2D'}}
          title="Idioma de visualización"
        >
          {idiomasDisponibles.map(idioma => (
            <option key={idioma.codigo} value={idioma.codigo}>{idioma.nombre}</option>
          ))}
        </select>
        <button
          type="button"
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
        <label style={{fontWeight: 'bold'}}>Traducir a:</label>
        <select
          value={idiomaDestino}
          onChange={e => setIdiomaDestino(e.target.value)}
          style={{padding: '0.4rem', borderRadius: 8, border: '1.5px solid #5B7B93', fontSize: '1rem', background: '#F7F4EC', color: '#2D2D2D'}}
          title="Idioma de destino"
        >
          {idiomasDisponibles.map(idioma => (
            <option key={idioma.codigo} value={idioma.codigo}>{idioma.nombre}</option>
          ))}
        </select>
      </div>
      <div className="lista-frases">
        {cargandoFrases ? (
          <span style={{color: '#5B7B93'}}>Traduciendo frases...</span>
        ) : errorFrases ? (
          <span style={{color: '#A5462A'}}>{errorFrases}</span>
        ) : (
          frasesTraducidas.map((frase, idx) => (
            <button key={idx} onClick={() => traducirFraseDestino(frase)}>
              {frase.visual}
            </button>
          ))
        )}
      </div>
      {fraseSeleccionada && (
        <div style={{marginTop: 12, background: '#EAF1F4', borderRadius: 8, padding: '0.7rem 1rem'}}>
          <strong>Traducción:</strong>
          {cargandoTraduccion ? (
            <span style={{marginLeft: 8}}>Traduciendo...</span>
          ) : errorTraduccion ? (
            <span style={{marginLeft: 8, color: '#A5462A'}}>{errorTraduccion}</span>
          ) : (
            <span style={{marginLeft: 8}}>{traduccion}</span>
          )}
        </div>
      )}
    </div>
  );
} 