import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { LanguageProvider } from './context/LanguageContext';
import { LightboxProvider } from './components/Lightbox';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <LightboxProvider>
        <App />
      </LightboxProvider>
    </LanguageProvider>
  </StrictMode>,
);
