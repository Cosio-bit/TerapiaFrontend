// index.js

import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Elimina StrictMode para ver si resuelve el problema
createRoot(document.getElementById('root')).render(
  <App />
);
