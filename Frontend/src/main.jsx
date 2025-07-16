import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthContextProvider } from './context/AuthContext.jsx'; // <-- Import the provider
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>  
      <App />
    </AuthContextProvider>
  </React.StrictMode>
);