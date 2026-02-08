import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import FirebaseAuthProvider from './components/FirebaseAuthConfig'
import './index.css'
import App from './App.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key")
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <BrowserRouter>
        <SignedIn>
          <FirebaseAuthProvider>
            <App />
          </FirebaseAuthProvider>
        </SignedIn>
        <SignedOut>
          <App />
        </SignedOut>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)
