import React, { useContext, useRef, useState, useEffect } from 'react';
import { ContextoGlobal } from '../contextoGlobal';

export default function GrabadorVoz({ modo }) {
  const { idiomasDisponibles } = useContext(ContextoGlobal);
  // Estado independiente para cada bloque
  const [idiomaOrigen, setIdiomaOrigen] = useState('es');
  const [idiomaDestino, setIdiomaDestino] = useState('en');
  const [frase, setFrase] = useState('');
  const [traduccion, setTraduccion] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [grabando, setGrabando] = useState(false);
  const recognitionRef = useRef(null);
  const [inputTexto, setInputTexto] = useState('');

  // Traducir automáticamente cuando cambia la frase
  useEffect(() => {
    if (!frase || idiomaOrigen === idiomaDestino) {
      setTraduccion('');
      return;
    }
    setCargando(true);
    setError(null);
    
    const traducir = async () => {
      try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(frase)}&langpair=${idiomaOrigen}|${idiomaDestino}`;
        const res = await fetch(url);
        const data = await res.json();
        
        if (data && data.responseData && data.responseData.translatedText) {
          setTraduccion(data.responseData.translatedText);
        } else {
          setError('No se pudo traducir el texto.');
        }
      } catch (e) {
        setError('Error de red al traducir.');
      }
      setCargando(false);
    };
    
    traducir();
  }, [frase, idiomaOrigen, idiomaDestino]);

  // Alternar idiomas solo afecta a este bloque
  const alternarIdiomas = () => {
    if (idiomaOrigen !== idiomaDestino) {
      setIdiomaOrigen(idiomaDestino);
      setIdiomaDestino(idiomaOrigen);
      setFrase('');
      setInputTexto('');
      setTraduccion('');
    }
  };

  // --- BLOQUE TEXTO MANUAL ---
  if (modo === 'texto') {
    const traducirTextoManual = (e) => {
      e.preventDefault();
      if (inputTexto.trim().length === 0) return;
      setFrase(inputTexto);
    };
    return (
      <div className="grabador-voz">
        <form onSubmit={traducirTextoManual} style={{width: '100%', maxWidth: 520, marginBottom: '1rem'}}>
          <label htmlFor="input-manual" style={{fontWeight: 'bold', color: '#4B3B2A', display: 'block', marginBottom: 4}}>Escribe el texto a traducir:</label>
          <div style={{display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8}}>
            <select
              value={idiomaOrigen}
              onChange={e => setIdiomaOrigen(e.target.value)}
              style={{flex: 1, padding: '0.5rem', borderRadius: 8, border: '1.5px solid #5B7B93', fontSize: '1rem', background: '#F7F4EC', color: '#2D2D2D'}}
              title="Idioma de origen"
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
            <select
              value={idiomaDestino}
              onChange={e => setIdiomaDestino(e.target.value)}
              style={{flex: 1, padding: '0.5rem', borderRadius: 8, border: '1.5px solid #5B7B93', fontSize: '1rem', background: '#F7F4EC', color: '#2D2D2D'}}
              title="Idioma de destino"
            >
              {idiomasDisponibles.map(idioma => (
                <option key={idioma.codigo} value={idioma.codigo}>{idioma.nombre}</option>
              ))}
            </select>
          </div>
          <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
            <input
              id="input-manual"
              type="text"
              value={inputTexto}
              onChange={e => setInputTexto(e.target.value)}
              placeholder="Escribe aquí..."
              style={{flex: 2, padding: '0.5rem', borderRadius: 8, border: '1.5px solid #6A7A3D', fontSize: '1rem'}}
              autoComplete="off"
            />
            <button type="submit" style={{background: '#5B7B93', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer'}}>Traducir</button>
          </div>
        </form>
        {frase && (
          <div className="texto-transcrito">
            <strong>Transcripción:</strong>
            <p>{frase}</p>
          </div>
        )}
        {frase && (
          <div className="traduccion-automatica">
            <strong>Traducción:</strong>
            {cargando ? (
              <p>Traduciendo...</p>
            ) : error ? (
              <p className="error-traduccion">{error}</p>
            ) : (
              <p>{traduccion}</p>
            )}
          </div>
        )}
      </div>
    );
  }

  // --- BLOQUE VOZ ---
  const iniciarGrabacion = () => {
    setError(null);
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Tu navegador no soporta reconocimiento de voz. Prueba con Chrome o Edge.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = idiomaOrigen;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setGrabando(true);
    recognition.onerror = (e) => {
      setError('Error al grabar: ' + e.error);
      setGrabando(false);
    };
    recognition.onend = () => setGrabando(false);
    recognition.onresult = (event) => {
      const texto = event.results[0][0].transcript;
      setFrase(texto);
    };
    recognition.start();
  };

  const detenerGrabacion = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return (
    <div className="grabador-voz">
      <form style={{width: '100%', maxWidth: 520, marginBottom: '1rem'}}>
        <label style={{fontWeight: 'bold', color: '#4B3B2A', display: 'block', marginBottom: 4}}>Selecciona los idiomas:</label>
        <div style={{display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8}}>
          <select
            value={idiomaOrigen}
            onChange={e => setIdiomaOrigen(e.target.value)}
            style={{flex: 1, padding: '0.5rem', borderRadius: 8, border: '1.5px solid #5B7B93', fontSize: '1rem', background: '#F7F4EC', color: '#2D2D2D'}}
            title="Idioma de origen"
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
          <select
            value={idiomaDestino}
            onChange={e => setIdiomaDestino(e.target.value)}
            style={{flex: 1, padding: '0.5rem', borderRadius: 8, border: '1.5px solid #5B7B93', fontSize: '1rem', background: '#F7F4EC', color: '#2D2D2D'}}
            title="Idioma de destino"
          >
            {idiomasDisponibles.map(idioma => (
              <option key={idioma.codigo} value={idioma.codigo}>{idioma.nombre}</option>
            ))}
          </select>
        </div>
      </form>
      <button
        onClick={grabando ? detenerGrabacion : iniciarGrabacion}
        className={grabando ? 'grabando' : ''}
      >
        {grabando ? 'Detener' : 'Grabar voz'}
      </button>
      {error && <p className="error-voz">{error}</p>}
      {frase && (
        <div className="texto-transcrito">
          <strong>Transcripción:</strong>
          <p>{frase}</p>
        </div>
      )}
      {frase && (
        <div className="traduccion-automatica">
          <strong>Traducción:</strong>
          {cargando ? (
            <p>Traduciendo...</p>
          ) : error ? (
            <p className="error-traduccion">{error}</p>
          ) : (
            <p>{traduccion}</p>
          )}
        </div>
      )}
    </div>
  );
} 