import React, { useRef, useState } from 'react';

const idiomasOCR = [
  { codigo: 'spa', nombre: 'Español' },
  { codigo: 'eng', nombre: 'Inglés' },
  { codigo: 'cat', nombre: 'Catalán' },
  { codigo: 'fra', nombre: 'Francés' },
  { codigo: 'por', nombre: 'Portugués' },
  { codigo: 'ita', nombre: 'Italiano' },
  { codigo: 'deu', nombre: 'Alemán' },
  { codigo: 'rus', nombre: 'Ruso' },
  { codigo: 'ara', nombre: 'Árabe' },
  { codigo: 'hin', nombre: 'Hindi' },
  { codigo: 'chi_sim', nombre: 'Chino Simplificado' },
  { codigo: 'chi_tra', nombre: 'Chino Tradicional' },
  { codigo: 'jpn', nombre: 'Japonés' },
  { codigo: 'tur', nombre: 'Turco' },
  { codigo: 'nld', nombre: 'Neerlandés' },
  { codigo: 'pol', nombre: 'Polaco' },
  { codigo: 'ukr', nombre: 'Ucraniano' },
  { codigo: 'ron', nombre: 'Rumano' },
  { codigo: 'swe', nombre: 'Sueco' },
  { codigo: 'ell', nombre: 'Griego' },
  { codigo: 'ces', nombre: 'Checo' },
  { codigo: 'fin', nombre: 'Finlandés' },
  { codigo: 'dan', nombre: 'Danés' },
  { codigo: 'bul', nombre: 'Búlgaro' },
  { codigo: 'hun', nombre: 'Húngaro' },
  { codigo: 'slk', nombre: 'Eslovaco' },
  { codigo: 'hrv', nombre: 'Croata' },
  { codigo: 'srp', nombre: 'Serbio' },
  { codigo: 'vie', nombre: 'Vietnamita' },
  { codigo: 'kor', nombre: 'Coreano' },
  { codigo: 'tha', nombre: 'Tailandés' },
];

export default function OCRTraductor({ onSetIdiomaDestino, onSetIdiomaOrigen }) {
  const [imagen, setImagen] = useState(null);
  const [textoExtraido, setTextoExtraido] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState(null);
  const [idiomaDestino, setIdiomaDestino] = useState('spa');
  const [idiomaOrigen, setIdiomaOrigen] = useState('spa');
  const inputRef = useRef();

  React.useEffect(() => {
    if (onSetIdiomaDestino) onSetIdiomaDestino(idiomaDestino);
    if (textoExtraido) {
      window.setFraseOriginalGlobal && window.setFraseOriginalGlobal(textoExtraido);
    }
  }, [idiomaDestino, onSetIdiomaDestino]);

  React.useEffect(() => {
    if (onSetIdiomaOrigen) onSetIdiomaOrigen(idiomaOrigen);
  }, [idiomaOrigen, onSetIdiomaOrigen]);

  React.useEffect(() => {
    if (textoExtraido && onSetIdiomaDestino) {
      window.setFraseOriginalGlobal && window.setFraseOriginalGlobal(textoExtraido);
    }
  }, [textoExtraido, onSetIdiomaDestino]);

  const handleImagen = (e) => {
    setError(null);
    setTextoExtraido('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagen(URL.createObjectURL(file));
      procesarImagen(file);
    }
  };

  const procesarImagen = async (file) => {
    setProcesando(true);
    setError(null);
    console.log('Iniciando procesamiento de imagen...');
    
    // Función para intentar OCR con diferentes configuraciones
    const intentarOCR = async (config) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('language', config.language);
      formData.append('isOverlayRequired', 'false');
      formData.append('apikey', 'helloworld');
      formData.append('OCREngine', config.engine);
      formData.append('scale', 'true');
      formData.append('detectOrientation', 'true');
      
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      
      const res = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });
      
      clearTimeout(timeout);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('Datos recibidos:', data);
      
      if (data.IsErroredOnProcessing) {
        throw new Error(data.ErrorMessage || 'Error en el procesamiento de OCR');
      }
      
      return data.ParsedResults?.[0]?.ParsedText;
    };
    
    try {
      // Primer intento: idioma específico con motor OCR 2
      console.log('Intento 1: OCR con idioma específico y motor 2');
      let texto = await intentarOCR({ language: idiomaOrigen, engine: '2' });
      
      // Segundo intento: si falla, probar con motor OCR 1
      if (!texto || texto.trim().length === 0) {
        console.log('Intento 2: OCR con motor 1');
        texto = await intentarOCR({ language: idiomaOrigen, engine: '1' });
      }
      
      // Tercer intento: si falla, probar con detección automática de idioma
      if (!texto || texto.trim().length === 0) {
        console.log('Intento 3: OCR con detección automática de idioma');
        texto = await intentarOCR({ language: 'auto', engine: '2' });
      }
      
      if (texto && texto.trim().length > 0) {
        console.log('Texto extraído:', texto);
        setTextoExtraido(texto);
        window.setFraseOriginalGlobal && window.setFraseOriginalGlobal(texto);
      } else {
        setError('No se pudo extraer texto de la imagen después de varios intentos. Intenta con una imagen más clara o con mejor contraste.');
      }
    } catch (err) {
      console.error('Error en OCR:', err);
      if (err.name === 'AbortError') {
        setError('La extracción de texto tardó demasiado. Intenta con una imagen más pequeña.');
      } else {
        setError(`Error: ${err.message}`);
      }
    }
    setProcesando(false);
  };

  return (
    <div className="ocr-traductor">
      <div className="ocr-instrucciones">
        <strong>¿Cómo funciona?</strong>
        <ol>
          <li>Haz clic en <b>Seleccionar imagen</b> para tomar una foto o subir una imagen desde tu galería.</li>
          <li>La app extraerá el texto de la imagen usando OCR.space (servicio gratuito) y lo traducirá automáticamente al idioma que elijas.</li>
        </ol>
        <p className="ocr-tip">Consejo: Usa fotos nítidas y con buen contraste para mejores resultados. El servicio gratuito tiene un límite de 500 requests por día.</p>
      </div>
      <div className="ocr-idioma-select">
        <label htmlFor="idioma-origen">Idioma del texto en la imagen:</label>
        <select
          id="idioma-origen"
          value={idiomaOrigen}
          onChange={e => setIdiomaOrigen(e.target.value)}
        >
          <option value="spa">Español</option>
          <option value="eng">Inglés</option>
          <option value="cat">Catalán</option>
          <option value="fra">Francés</option>
          <option value="por">Portugués</option>
          <option value="ita">Italiano</option>
          <option value="deu">Alemán</option>
          <option value="rus">Ruso</option>
          <option value="ara">Árabe</option>
          <option value="hin">Hindi</option>
          <option value="chi_sim">Chino Simplificado</option>
          <option value="chi_tra">Chino Tradicional</option>
          <option value="jpn">Japonés</option>
          <option value="tur">Turco</option>
          <option value="nld">Neerlandés</option>
          <option value="pol">Polaco</option>
          <option value="ukr">Ucraniano</option>
          <option value="ron">Rumano</option>
          <option value="swe">Sueco</option>
          <option value="ell">Griego</option>
          <option value="ces">Checo</option>
          <option value="fin">Finlandés</option>
          <option value="dan">Danés</option>
          <option value="bul">Búlgaro</option>
          <option value="hun">Húngaro</option>
          <option value="slk">Eslovaco</option>
          <option value="hrv">Croata</option>
          <option value="srp">Serbio</option>
          <option value="vie">Vietnamita</option>
          <option value="kor">Coreano</option>
          <option value="tha">Tailandés</option>
        </select>
      </div>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', margin: '0.5rem 0'}}>
        <button
          type="button"
          aria-label="Intercambiar idiomas"
          style={{padding: '0.4rem 0.8rem', borderRadius: '50%', border: '1px solid #ccc', background: '#f5f5f5', cursor: 'pointer', fontSize: '1.2rem'}}
          onClick={() => {
            const temp = idiomaOrigen;
            setIdiomaOrigen(idiomaDestino);
            setIdiomaDestino(temp);
          }}
        >
          ⇄
        </button>
      </div>
      <div className="ocr-idioma-select">
        <label htmlFor="idioma-destino">Traducir texto de imagen a:</label>
        <select
          id="idioma-destino"
          value={idiomaDestino}
          onChange={e => setIdiomaDestino(e.target.value)}
        >
          <option value="spa">Español</option>
          <option value="eng">Inglés</option>
          <option value="cat">Catalán</option>
          <option value="fra">Francés</option>
          <option value="por">Portugués</option>
          <option value="ita">Italiano</option>
          <option value="deu">Alemán</option>
          <option value="rus">Ruso</option>
          <option value="ara">Árabe</option>
          <option value="hin">Hindi</option>
          <option value="chi_sim">Chino Simplificado</option>
          <option value="chi_tra">Chino Tradicional</option>
          <option value="jpn">Japonés</option>
          <option value="tur">Turco</option>
          <option value="nld">Neerlandés</option>
          <option value="pol">Polaco</option>
          <option value="ukr">Ucraniano</option>
          <option value="ron">Rumano</option>
          <option value="swe">Sueco</option>
          <option value="ell">Griego</option>
          <option value="ces">Checo</option>
          <option value="fin">Finlandés</option>
          <option value="dan">Danés</option>
          <option value="bul">Búlgaro</option>
          <option value="hun">Húngaro</option>
          <option value="slk">Eslovaco</option>
          <option value="hrv">Croata</option>
          <option value="srp">Serbio</option>
          <option value="vie">Vietnamita</option>
          <option value="kor">Coreano</option>
          <option value="tha">Tailandés</option>
        </select>
      </div>
      <label className="ocr-label">
        Sube una foto o imagen con texto:
        <input
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: 'none' }}
          ref={inputRef}
          onChange={handleImagen}
        />
        <button type="button" onClick={() => inputRef.current.click()} className="btn-ocr">
          Seleccionar imagen
        </button>
      </label>
      {imagen && (
        <img src={imagen} alt="Previsualización" className="ocr-preview" />
      )}
      {procesando && <p className="ocr-procesando">Extrayendo texto...</p>}
      {error && <p className="ocr-error">{error}</p>}
      {textoExtraido && (
        <div className="ocr-resultado">
          <strong>Texto extraído:</strong>
          <p>{textoExtraido}</p>
        </div>
      )}
    </div>
  );
} 