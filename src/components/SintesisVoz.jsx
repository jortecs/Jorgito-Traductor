import React, { useContext, useState } from 'react';
import { ContextoGlobal } from '../contextoGlobal';

export default function SintesisVoz() {
  const { fraseTraducida, idiomaDestino } = useContext(ContextoGlobal);
  const [hablando, setHablando] = useState(false);
  const [error, setError] = useState(null);

  const reproducirVoz = () => {
    setError(null);
    if (!('speechSynthesis' in window)) {
      setError('Tu navegador no soporta síntesis de voz.');
      return;
    }
    if (!fraseTraducida) return;
    const utter = new window.SpeechSynthesisUtterance(fraseTraducida);
    utter.lang = idiomaDestino;
    utter.onstart = () => setHablando(true);
    utter.onend = () => setHablando(false);
    utter.onerror = () => {
      setError('No se pudo reproducir la voz.');
      setHablando(false);
    };
    window.speechSynthesis.speak(utter);
  };

  if (!fraseTraducida) return null;

  return (
    <div className="sintesis-voz">
      <button onClick={reproducirVoz} disabled={hablando}>
        {hablando ? 'Reproduciendo...' : 'Escuchar traducción'}
      </button>
      {error && <p className="error-sintesis">{error}</p>}
    </div>
  );
} 