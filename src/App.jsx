import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { SignedIn, SignedOut } from "@clerk/clerk-react"
import WorkspaceLayout from './components/WorkspaceLayout'
import LandingPage from './components/LandingPage'
import SignInPage from './components/SignInPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <>
          <SignedIn>
            <WorkspaceLayout />
          </SignedIn>
          <SignedOut>
            <LandingPage />
          </SignedOut>
        </>
      } />
      <Route path="/map/:mapId" element={
        <>
          <SignedIn>
            <WorkspaceLayout />
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
