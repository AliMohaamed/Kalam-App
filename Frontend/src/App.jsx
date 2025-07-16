// src/App.jsx

import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import AuthCallbackPage from './pages/AuthCallbackPage';

function App() {
  const { authUser, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div>Application is loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={authUser ? <ChatPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;