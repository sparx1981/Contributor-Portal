import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Chrome } from 'lucide-react';
import TrimbleLogo from './TrimbleLogo';

export default function Login() {
  const [email, setEmail] = useState('');

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">
      {/* Left Side: Abstract Pattern */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-slate-50">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <circle cx="20" cy="30" r="15" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <path d="M 80 10 L 90 20 M 90 10 L 80 20" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>
        
        <div className="absolute bottom-12 left-12">
          <TrimbleLogo className="h-10" />
        </div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none text-trimble-blue">
           <svg width="600" height="600" viewBox="0 0 100 100">
             <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" />
             <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="currentColor" strokeWidth="1" />
             <ellipse cx="50" cy="50" rx="15" ry="45" fill="none" stroke="currentColor" strokeWidth="1" />
           </svg>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-[500px] flex flex-col p-8 md:p-16 border-l border-slate-100">
        <div className="flex justify-between items-start mb-12">
           <TrimbleLogo className="h-8" />
        </div>

        <div className="flex-1 max-w-sm mx-auto w-full flex flex-col justify-center">
          <h1 className="text-3xl font-light text-slate-800 mb-2">Sign In</h1>
          <p className="text-sm text-slate-500 mb-8">
            New user? <a href="#" className="text-trimble-blue hover:underline">Create a Trimble ID</a>
          </p>

          <div className="space-y-6">
            <div className="space-y-2 group relative">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Email or username
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 focus:border-trimble-blue focus:ring-1 focus:ring-trimble-blue outline-none transition-all"
              />
            </div>

            <div className="flex justify-end relative group">
              <button 
                disabled
                title="Please use the 'Continue with Google' option to login."
                className="bg-slate-200 text-slate-400 px-8 py-2 font-medium cursor-not-allowed transition-colors"
              >
                Next
              </button>
              <div className="absolute bottom-full mb-2 right-0 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                Please use the "Continue with Google" option to login.
              </div>
            </div>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-4 text-slate-400 font-medium lowercase">or</span>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-slate-300 hover:bg-slate-50 transition-colors text-sm font-bold text-slate-700"
              >
                <Chrome className="w-4 h-4 text-blue-500" />
                Continue with Google
              </button>
            </div>

            <div className="flex items-center gap-2 pt-4">
              <input type="checkbox" id="remember" className="rounded border-slate-300 text-trimble-blue focus:ring-trimble-blue cursor-pointer" />
              <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer">Remember me</label>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap gap-x-4 gap-y-2 justify-center text-[10px] text-slate-400 font-medium">
          <a href="#" className="hover:text-trimble-blue">Help</a>
          <span className="text-slate-200">|</span>
          <a href="#" className="hover:text-trimble-blue">Privacy Notice</a>
          <span className="text-slate-200">|</span>
          <a href="#" className="hover:text-trimble-blue">Terms of Use</a>
          <span className="text-slate-200">|</span>
          <a href="#" className="hover:text-trimble-blue">CA Notice at Collection</a>
          <span className="text-slate-200">|</span>
          <a href="#" className="hover:text-trimble-blue flex items-center gap-1">
            Your Privacy Choices (US)
            <svg viewBox="0 0 24 14" className="h-3 w-auto fill-blue-500"><path d="M12.4 0H4.4C1.9 0 0 2.1 0 4.6v4.8C0 11.9 1.9 14 4.4 14h8l1-1.4L15.3 14h4.3c2.5 0 4.4-2.1 4.4-4.6V4.6C24 2.1 22.1 0 19.7 0h-4.4l-1.9 2.6L12.4 0zM7.1 10.6c-2 0-3.6-1.6-3.6-3.6s1.6-3.6 3.6-3.6 3.6 1.6 3.6 3.6-1.6 3.6-3.6 3.6zm10.7 0c-2 0-3.6-1.6-3.6-3.6s1.6-3.6 3.6-3.6 3.6 1.6 3.6 3.6-1.6 3.6-3.6 3.6z"/></svg>
          </a>
        </div>
        
        <div className="mt-4 text-center text-[9px] text-slate-400 font-medium">
          ©2026, Trimble Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
}
