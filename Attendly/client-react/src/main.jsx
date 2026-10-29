/**
 * main.jsx — React entry point
 * ==============================
 * Connects the Redux Toolkit Provider, AuthContext Provider,
 * and the main CSS design system.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import store from './store/store';
import './styles/style.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>
  </StrictMode>,
);
