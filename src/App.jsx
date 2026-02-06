import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { SignedIn, SignedOut } from "@clerk/clerk-react"
import ComparativeApp from './components/ComparativeApp'
import LandingPage from './components/LandingPage'
import SignInPage from './components/SignInPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <>
          <SignedIn>
            <ComparativeApp />
          </SignedIn>
          <SignedOut>
            <LandingPage />
          </SignedOut>
        </>
      } />
      <Route path="/sign-in/*" element={<SignInPage />} />
    </Routes>
  )
}

export default App
