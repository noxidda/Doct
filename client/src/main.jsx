import React from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './styles/index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { AppProvider } from './context/AppContext'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key in environment configuration.");
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        layout: {
          unsafe_disableDevelopmentModeWarnings: true
        }
      }}
    >
      <AuthProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </AuthProvider>
    </ClerkProvider>
  </React.StrictMode>
)
