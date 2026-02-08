import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col relative font-sans">
      <div className="absolute top-0 right-0 p-6">
        <Button asChild>
          <Link to="/sign-in">Sign In</Link>
        </Button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-6xl font-extrabold text-slate-900 tracking-tighter mb-4">Comparative.</h1>
        <p className="text-xl text-slate-500 font-medium max-w-lg leading-relaxed">
          Structure your analysis by building logical bridges between texts.
        </p>
      </div>
    </div>
  );
}
