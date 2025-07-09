import React, { useContext } from 'react';
import { ContextoGlobal } from '../contextoGlobal';

export default function AccesibilidadMenu() {
  const {
    modoAccesible, setModoAccesible,
    letraGrande, setLetraGrande,
    altoContraste, setAltoContraste
  } = useContext(ContextoGlobal);

  // Pantalla completa
  const togglePantallaCompleta = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="accesibilidad-menu">
      <button
        title="Pantalla completa"
        onClick={togglePantallaCompleta}
      >
        🖥️
      </button>
      <button
        title="Letra grande"
        onClick={() => setLetraGrande(lg => !lg)}
        className={letraGrande ? 'activo' : ''}
      >
        A+
      </button>
      <button
        title="Alto contraste"
        onClick={() => setAltoContraste(ac => !ac)}
        className={altoContraste ? 'activo' : ''}
      >
        ◼️
      </button>
      <button
        title="Modo accesible (combina todo)"
        onClick={() => setModoAccesible(ma => !ma)}
        className={modoAccesible ? 'activo' : ''}
      >
        ♿
      </button>
    </div>
  );
} 