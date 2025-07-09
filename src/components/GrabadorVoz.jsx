import React, { useContext, useRef, useState } from 'react';
import { ContextoGlobal } from '../contextoGlobal';

export default function GrabadorVoz() {
  const { idiomaOrigen, setFraseOriginal, fraseOriginal } = useContext(ContextoGlobal);
  const [grabando, setGrabando] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

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

  return (
    <div className="grabador-voz">
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