import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col relative font-sans">
      <div className="absolute top-0 right-0 p-6">
        <Link to="/sign-in">
          <button className="bg-black text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors">
            Sign In
          </button>
        </Link>
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
