import React, { useContext, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ContextoGlobalProvider, ContextoGlobal } from './contextoGlobal.jsx'

function AccesibilidadBodyWrapper({ children }) {
  const { letraGrande, altoContraste, modoAccesible } = useContext(ContextoGlobal);
  useEffect(() => {
    const body = document.body;
    body.classList.toggle('letra-grande', letraGrande);
    body.classList.toggle('alto-contraste', altoContraste);
    body.classList.toggle('modo-accesible', modoAccesible);
    return () => {
      body.classList.remove('letra-grande', 'alto-contraste', 'modo-accesible');
    };
  }, [letraGrande, altoContraste, modoAccesible]);
  return children;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ContextoGlobalProvider>
      <AccesibilidadBodyWrapper>
        <App />
      </AccesibilidadBodyWrapper>
    </ContextoGlobalProvider>
  </React.StrictMode>
)
