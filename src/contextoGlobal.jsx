import React, { createContext, useState } from 'react';

export const ContextoGlobal = createContext();

export function ContextoGlobalProvider({ children }) {
  // Idiomas disponibles
  const idiomasDisponibles = [
    { codigo: 'es', nombre: 'Español' },
    { codigo: 'en', nombre: 'Inglés' },
    { codigo: 'ca', nombre: 'Catalán' },
    { codigo: 'fr', nombre: 'Francés' },
    { codigo: 'pt', nombre: 'Portugués' },
    { codigo: 'ar', nombre: 'Árabe' },
    { codigo: 'ru', nombre: 'Ruso' },
    { codigo: 'zh', nombre: 'Chino' },
    { codigo: 'hi', nombre: 'Hindi' },
    // Puedes agregar más idiomas soportados por LibreTranslate/MyMemory
  ];

  // Estado global
  const [idiomaOrigen, setIdiomaOrigen] = useState('es');
  const [idiomaDestino, setIdiomaDestino] = useState('en');
  const [fraseOriginal, setFraseOriginal] = useState('');
  const [fraseTraducida, setFraseTraducida] = useState('');
  const [historial, setHistorial] = useState([]); // {origen, destino, original, traduccion, fecha}
  const [modoAccesible, setModoAccesible] = useState(false);
  const [letraGrande, setLetraGrande] = useState(false);
  const [altoContraste, setAltoContraste] = useState(false);

  // Frases rápidas predefinidas
  const frasesRapidas = [
    '¿Dónde está el baño?',
    'Necesito ayuda',
    'No hablo el idioma',
    '¿Puede llamar a la policía?',
    '¿Dónde está el hospital?',
    'Estoy perdido/a',
    '¿Cuánto cuesta?',
    '¿Puede repetir, por favor?',
    'No entiendo',
    'Gracias',
  ];

  // Función para agregar al historial
  const agregarAlHistorial = (original, traduccion) => {
    setHistorial(prev => [
      { 
        origen: idiomaOrigen, 
        destino: idiomaDestino, 
        original, 
        traduccion, 
        fecha: new Date().toISOString() 
      },
      ...prev
    ]);
  };

  return (
    <ContextoGlobal.Provider value={{
      idiomaOrigen, setIdiomaOrigen,
      idiomaDestino, setIdiomaDestino,
      fraseOriginal, setFraseOriginal,
      fraseTraducida, setFraseTraducida,
      historial, agregarAlHistorial,
      modoAccesible, setModoAccesible,
      letraGrande, setLetraGrande,
      altoContraste, setAltoContraste,
      idiomasDisponibles,
      frasesRapidas
    }}>
      {children}
    </ContextoGlobal.Provider>
  );
} 