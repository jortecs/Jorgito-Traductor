import React, { useContext, useEffect, useState } from 'react';
import { ContextoGlobal } from '../contextoGlobal';

export default function TraduccionAutomatica({ idiomaDestinoForzar, idiomaOrigenForzar }) {
  const {
    fraseOriginal,
    idiomaOrigen,
    idiomaDestino,
    setFraseTraducida,
    fraseTraducida,
    agregarAlHistorial,
    setIdiomaDestino
  } = useContext(ContextoGlobal);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [frase, setFrase] = useState(fraseOriginal);
  const [copiado, setCopiado] = useState(false);

  // Determinar idiomas a usar
  const idiomaOrig = idiomaOrigenForzar || idiomaOrigen;
  const idiomaDest = idiomaDestinoForzar || idiomaDestino;

  // Mapeo de códigos de idioma para LibreTranslate
  const mapearIdiomaParaLibreTranslate = (codigo) => {
    const mapeo = {
      'spa': 'es',
      'eng': 'en', 
      'cat': 'ca',
      'fra': 'fr',
      'por': 'pt',
      'ita': 'it',
      'deu': 'de',
      'rus': 'ru',
      'ara': 'ar',
      'hin': 'hi',
      'chi_sim': 'zh',
      'chi_tra': 'zh',
      'jpn': 'ja',
      'tur': 'tr',
      'nld': 'nl',
      'pol': 'pl',
      'ukr': 'uk',
      'ron': 'ro',
      'swe': 'sv',
      'ell': 'el',
      'ces': 'cs',
      'fin': 'fi',
      'dan': 'da',
      'bul': 'bg',
      'hun': 'hu',
      'slk': 'sk',
      'hrv': 'hr',
      'srp': 'sr',
      'vie': 'vi',
      'kor': 'ko',
      'tha': 'th'
    };
    return mapeo[codigo] || codigo;
  };

  // Sincronizar frase desde OCR
  useEffect(() => {
    const handler = (e) => setFrase(e.detail);
    window.addEventListener('setFraseOriginalGlobal', handler);
    return () => window.removeEventListener('setFraseOriginalGlobal', handler);
  }, []);

  // Sincronizar frase con el contexto global (voz)
  useEffect(() => {
    setFrase(fraseOriginal);
  }, [fraseOriginal]);

  useEffect(() => {
    if (!frase || idiomaOrig === idiomaDest) {
      setFraseTraducida('');
      return;
    }
    setCargando(true);
    setError(null);
    
    console.log('[TraduccionAutomatica] Traduciendo:', { frase, idiomaOrig, idiomaDest });
    
    // Función para intentar traducción con MyMemory
    const intentarMyMemory = async () => {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(frase)}&langpair=${idiomaOrig}|${idiomaDest}`;
      const res = await fetch(url);
      const data = await res.json();
      
      console.log('[TraduccionAutomatica] Respuesta MyMemory:', data);
      
      if (data && data.responseData && data.responseData.translatedText) {
        return data.responseData.translatedText;
      } else if (data && data.matches && data.matches.length > 0) {
        const primeraCoincidencia = data.matches[0];
        if (primeraCoincidencia.translation) {
          return primeraCoincidencia.translation;
        }
      }
      return null;
    };

    // Función para intentar traducción con MyMemory usando códigos de idioma alternativos
    const intentarMyMemoryAlternativo = async () => {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(frase)}&langpair=${mapearIdiomaParaLibreTranslate(idiomaOrig)}|${mapearIdiomaParaLibreTranslate(idiomaDest)}`;
      const res = await fetch(url);
      const data = await res.json();
      
      console.log('[TraduccionAutomatica] Respuesta MyMemory Alternativo:', data);
      
      if (data && data.responseData && data.responseData.translatedText) {
        return data.responseData.translatedText;
      } else if (data && data.matches && data.matches.length > 0) {
        const primeraCoincidencia = data.matches[0];
        if (primeraCoincidencia.translation) {
          return primeraCoincidencia.translation;
        }
      }
      return null;
    };
    
    // Función para intentar traducción con LibreTranslate (fallback)
    const intentarLibreTranslate = async () => {
      try {
        // Usar un proxy CORS para evitar problemas de CORS
        const url = 'https://api.allorigins.win/raw?url=https://libretranslate.de/translate';
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: frase,
            source: mapearIdiomaParaLibreTranslate(idiomaOrig),
            target: mapearIdiomaParaLibreTranslate(idiomaDest),
            format: 'text'
          })
        });
        const data = await res.json();
        
        console.log('[TraduccionAutomatica] Respuesta LibreTranslate:', data);
        
        if (data && data.translatedText) {
          return data.translatedText;
        }
      } catch (error) {
        console.log('[TraduccionAutomatica] LibreTranslate falló:', error);
      }
      return null;
    };

    // Función para intentar traducción con Google Translate (tercer fallback)
    const intentarGoogleTranslate = async () => {
      try {
        // Usar un proxy CORS para Google Translate
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(frase)}&langpair=${mapearIdiomaParaLibreTranslate(idiomaOrig)}|${mapearIdiomaParaLibreTranslate(idiomaDest)}&de=user@example.com`;
        const res = await fetch(url);
        const data = await res.json();
        
        console.log('[TraduccionAutomatica] Respuesta Google Translate (via MyMemory):', data);
        
        if (data && data.responseData && data.responseData.translatedText) {
          return data.responseData.translatedText;
        }
      } catch (error) {
        console.log('[TraduccionAutomatica] Google Translate falló:', error);
      }
      return null;
    };
    
    // Intentar traducción con múltiples servicios
    const traducir = async () => {
      try {
        // Primer intento: MyMemory con códigos originales
        let traduccion = await intentarMyMemory();
        
        // Segundo intento: MyMemory con códigos alternativos si el primero falla
        if (!traduccion) {
          console.log('[TraduccionAutomatica] Intentando MyMemory con códigos alternativos...');
          traduccion = await intentarMyMemoryAlternativo();
        }
        
        // Tercer intento: LibreTranslate si MyMemory falla
        if (!traduccion) {
          console.log('[TraduccionAutomatica] Intentando LibreTranslate como fallback...');
          traduccion = await intentarLibreTranslate();
        }
        
        if (traduccion) {
          setFraseTraducida(traduccion);
          agregarAlHistorial(frase, traduccion);
        } else {
          setError('No se pudo traducir con ningún servicio disponible. Intenta de nuevo.');
        }
      } catch (error) {
        setError('Error de red: ' + (error?.message || 'No se pudo traducir.'));
        console.error('[TraduccionAutomatica] Error de red:', error);
      } finally {
        setCargando(false);
      }
    };
    
    traducir();
    // eslint-disable-next-line
  }, [frase, idiomaOrig, idiomaDest]);

  if (!frase || idiomaOrig === idiomaDest) return null;

  return (
    <div className="traduccion-automatica">
      <strong>Traducción:</strong>
      {cargando ? (
        <p>Traduciendo...</p>
      ) : error ? (
        <p className="error-traduccion">{error}</p>
      ) : (
        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
          <p style={{margin: 0, flex: 1}}>{fraseTraducida}</p>
          {fraseTraducida && (
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(fraseTraducida);
                setCopiado(true);
                setTimeout(() => setCopiado(false), 1200);
              }}
              style={{background: '#5B7B93', color: '#fff', border: 'none', borderRadius: 8, padding: '0.3rem 0.8rem', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer'}}
              title="Copiar traducción"
            >
              {copiado ? '¡Copiado!' : 'Copiar'}
            </button>
          )}
        </div>
      )}
    </div>
  );
} 