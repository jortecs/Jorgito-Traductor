import React, { useState, useEffect } from 'react';
import './App.css'
import SelectoresIdioma from './components/SelectoresIdioma';
import GrabadorVoz from './components/GrabadorVoz';
import TraduccionAutomatica from './components/TraduccionAutomatica';
import SintesisVoz from './components/SintesisVoz';
import HistorialFrases from './components/HistorialFrases';
import FrasesRapidas from './components/FrasesRapidas';
import AccesibilidadMenu from './components/AccesibilidadMenu';
import UbicacionMaps from './components/UbicacionMaps';
import OCRTraductor from './components/OCRTraductor'; // Se creará luego

function App() {
  const [vista, setVista] = useState('voz'); // 'voz' o 'imagen'
  const [idiomaDestinoOCR, setIdiomaDestinoOCR] = useState('es');
  const [idiomaOrigenOCR, setIdiomaOrigenOCR] = useState('en');
  const [errorVistaImagen, setErrorVistaImagen] = useState(null);

  // Permitir que OCRTraductor y TraduccionAutomatica compartan el texto extraído
  useEffect(() => {
    window.setFraseOriginalGlobal = (text) => {
      const event = new CustomEvent('setFraseOriginalGlobal', { detail: text });
      window.dispatchEvent(event);
    };
    return () => { window.setFraseOriginalGlobal = undefined; };
  }, []);

  // Hook para sincronizar el idioma destino de TraduccionAutomatica
  useEffect(() => {
    window.setIdiomaDestinoGlobal = (idioma) => {
      const event = new CustomEvent('setIdiomaDestinoGlobal', { detail: idioma });
      window.dispatchEvent(event);
    };
    return () => { window.setIdiomaDestinoGlobal = undefined; };
  }, []);

  // Sincronizar idioma origen
  useEffect(() => {
    window.setIdiomaOrigenGlobal = (idioma) => {
      const event = new CustomEvent('setIdiomaOrigenGlobal', { detail: idioma });
      window.dispatchEvent(event);
    };
    return () => { window.setIdiomaOrigenGlobal = undefined; };
  }, []);

  // Manejo de errores global para la vista de imágenes
  function renderVistaImagen() {
    try {
      return (
        <div className="bloque-ocr">
          <OCRTraductor onSetIdiomaDestino={setIdiomaDestinoOCR} onSetIdiomaOrigen={setIdiomaOrigenOCR} />
          <TraduccionAutomatica idiomaDestinoForzar={idiomaDestinoOCR} idiomaOrigenForzar={idiomaOrigenOCR} />
        </div>
      );
    } catch (err) {
      setErrorVistaImagen('Ocurrió un error inesperado en la vista de imágenes. Intenta recargar la página o revisa la consola.');
      return (
        <div className="bloque-ocr">
          <p className="ocr-error">Ocurrió un error inesperado en la vista de imágenes. Intenta recargar la página o revisa la consola.</p>
        </div>
      );
    }
  }

  return (
    <div className="app-container">
      <AccesibilidadMenu />
      <header>
        <img src={`${import.meta.env.BASE_URL}personas-hablando.png`} alt="Personas hablando" className="vector-personas" />
        <h1>Jorgito Traductor</h1>
        <h2 className="subtitulo">Donde haya idioma, hay solución</h2>
      </header>
      <nav className="menu-principal">
        <button
          className={vista === 'imagen' ? 'activo' : ''}
          onClick={() => setVista('imagen')}
        >
          Traducir texto de imágenes
        </button>
        <button
          className={vista === 'voz' ? 'activo' : ''}
          onClick={() => setVista('voz')}
        >
          Traductor a voz
        </button>
      </nav>
      {vista === 'imagen' && renderVistaImagen()}
      {vista === 'voz' && (
        <>
          <FrasesRapidas />
          {/* Bloque de texto manual */}
          <div className="bloque-texto-manual">
            <GrabadorVoz modo="texto" />
            <TraduccionAutomatica />
          </div>
          {/* Bloque de grabación de voz */}
          <div className="bloque-voz">
            <GrabadorVoz modo="voz" />
            <TraduccionAutomatica />
            <SintesisVoz />
          </div>
          <HistorialFrases />
          <UbicacionMaps />
        </>
      )}
      <footer style={{textAlign: 'center', marginTop: '2rem', padding: '1rem', color: '#555', fontSize: '1rem'}}>
        © 2025 Derechos reservados por Jortecs
      </footer>
    </div>
  );
}

export default App;
