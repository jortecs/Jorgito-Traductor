import React, { useContext, useRef, useState, useEffect } from 'react';
import { ContextoGlobal } from '../contextoGlobal';

export default function GrabadorVoz() {
  const { idiomaOrigen, idiomaDestino, setIdiomaDestino, setFraseOriginal, fraseOriginal, idiomasDisponibles } = useContext(ContextoGlobal);
  const [grabando, setGrabando] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  const [inputTexto, setInputTexto] = useState(fraseOriginal || "");

  // Sincronizar inputTexto con fraseOriginal global
  useEffect(() => {
    setInputTexto(fraseOriginal || "");
  }, [fraseOriginal]);

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
      setFraseOriginal(texto);
    };
    recognition.start();
  };

  const detenerGrabacion = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // Nueva función para traducir texto escrito
  const traducirTextoManual = (e) => {
    e.preventDefault();
    if (inputTexto.trim().length === 0) return;
    setFraseOriginal(inputTexto);
  };

  const alternarIdiomas = () => {
    if (idiomaOrigen !== idiomaDestino) {
      const temp = idiomaOrigen;
      if (window.setIdiomaOrigenGlobal) window.setIdiomaOrigenGlobal(idiomaDestino);
      setIdiomaDestino(temp);
      setFraseOriginal("");
    }
  };

  return (
    <div className="grabador-voz">
      <form onSubmit={traducirTextoManual} style={{width: '100%', maxWidth: 520, marginBottom: '1rem'}}>
        <label htmlFor="input-manual" style={{fontWeight: 'bold', color: '#4B3B2A', display: 'block', marginBottom: 4}}>Escribe el texto a traducir:</label>
        <div style={{display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8}}>
          <select
            value={idiomaOrigen}
            onChange={e => window.setIdiomaOrigenGlobal ? window.setIdiomaOrigenGlobal(e.target.value) : null || setFraseOriginal('') || setIdiomaDestino(idiomaDestino)}
            style={{flex: 1, padding: '0.5rem', borderRadius: 8, border: '1.5px solid #5B7B93', fontSize: '1rem', background: '#F7F4EC', color: '#2D2D2D'}}
            title="Idioma de origen"
          >
            {idiomasDisponibles.map(idioma => (
              <option key={idioma.codigo} value={idioma.codigo}>{idioma.nombre}</option>
            ))}
          </select>
          <button type="button" onClick={alternarIdiomas} title="Intercambiar idiomas" aria-label="Intercambiar idiomas" style={{background: '#5B7B93', color: '#fff', border: 'none', borderRadius: '50%', width: 36, height: 36, fontSize: '1.3rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}>
            ⇄
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
      <button
        onClick={grabando ? detenerGrabacion : iniciarGrabacion}
        className={grabando ? 'grabando' : ''}
      >
        {grabando ? 'Detener' : 'Grabar voz'}
      </button>
      {error && <p className="error-voz">{error}</p>}
      {fraseOriginal && (
        <div className="texto-transcrito">
          <strong>Transcripción:</strong>
          <p>{fraseOriginal}</p>
        </div>
      )}
    </div>
  );
} 