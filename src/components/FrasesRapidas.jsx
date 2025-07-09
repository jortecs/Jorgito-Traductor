import React, { useContext } from 'react';
import { ContextoGlobal } from '../contextoGlobal';

export default function FrasesRapidas() {
  const { frasesRapidas, setFraseOriginal } = useContext(ContextoGlobal);

  if (!frasesRapidas.length) return null;

  return (
    <div className="frases-rapidas">
      <h2>Frases rápidas</h2>
      <div className="lista-frases">
        {frasesRapidas.map((frase, idx) => (
          <button key={idx} onClick={() => setFraseOriginal(frase)}>
            {frase}
          </button>
        ))}
      </div>
    </div>
  );
} 