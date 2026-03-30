import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { SocketProvider } from './contexts/SocketContext.jsx';
import { registerSW } from 'virtual:pwa-register'

registerSW({ immediate: true })

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "405774559770-tsdj9hevcs6hvfehuocpuc2dqr543big.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <SocketProvider>
        <App />
      </SocketProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
