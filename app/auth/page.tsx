'use client';

import { useActionState, useState, useEffect, Suspense } from 'react';
import { loginAction, signupAction } from '@/app/utils/actions';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Mail, Lock, User } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

function AuthContent() {
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(() => {
    return searchParams.get('mode') !== 'signup';
  });

  useEffect(() => {
    setIsLogin(searchParams.get('mode') !== 'signup');
  }, [searchParams]);

  // Login Action
  const [loginState, loginFormAction, isLoginPending] = useActionState(loginAction, undefined);

  // Signup Action
  const [signupState, signupFormAction, isSignupPending] = useActionState(signupAction.bind(null, 'patient'), undefined);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8">

      <Link href="/" className="absolute top-8 left-8 inline-flex items-center text-slate-500 hover:text-primary-600 font-medium z-50 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full transition-all">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>

      <div className="relative w-full max-w-5xl h-[700px] bg-white rounded-3xl shadow-2xl overflow-hidden flex">

        {/* --- SIGN UP FORM CONTAINER --- */}
        <div className={`absolute top-0 left-0 w-full md:w-1/2 h-full flex flex-col justify-center px-6 md:px-12 transition-all duration-700 ease-in-out z-10 ${isLogin ? 'opacity-0 max-md:scale-95 md:-translate-x-full pointer-events-none' : 'opacity-100 max-md:scale-100 md:translate-x-0'
          }`}>
          <div className="w-full max-w-sm mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
            <p className="text-slate-500 mb-8">Join MediHelp to manage your health.</p>

            <form action={signupFormAction} className="space-y-5">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text" name="name" required
                    className="block w-full pl-10 pr-3 py-3 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    placeholder="Full Name"
                  />
                </div>
              </div>
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email" name="email" required
                    className="block w-full pl-10 pr-3 py-3 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    placeholder="Email Address"
                  />
                </div>
              </div>
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password" name="password" required
                    className="block w-full pl-10 pr-3 py-3 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    placeholder="Password"
                  />
                </div>
              </div>

              {signupState?.error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                  {signupState.error}
                </div>
              )}

              <button
                type="submit" disabled={isSignupPending}
                className="w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-all disabled:opacity-50"
              >
                {isSignupPending ? 'Signing up...' : 'Sign Up'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500 md:hidden">
              Already have an account? <button type="button" onClick={() => setIsLogin(true)} className="text-primary-600 font-bold">Log in</button>
            </p>
            <div className="mt-4 text-center">
              <Link href="/auth/doctor" className="text-sm text-primary-600 font-medium hover:underline">
                Are you a doctor? Sign up here
              </Link>
            </div>
          </div>
        </div>

        {/* --- LOGIN FORM CONTAINER --- */}
        <div className={`absolute top-0 right-0 w-full md:w-1/2 h-full flex flex-col justify-center px-6 md:px-12 transition-all duration-700 ease-in-out z-10 ${isLogin ? 'opacity-100 max-md:scale-100 md:translate-x-0' : 'opacity-0 max-md:scale-95 md:translate-x-full pointer-events-none'
          }`}>
          <div className="w-full max-w-sm mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-slate-500 mb-8">Log in to access your dashboard.</p>

            <form action={loginFormAction} className="space-y-5">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email" name="email" required
                    className="block w-full pl-10 pr-3 py-3 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    placeholder="Email Address"
                  />
                </div>
              </div>
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password" name="password" required
                    className="block w-full pl-10 pr-3 py-3 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    placeholder="Password"
                  />
                </div>
              </div>

              {loginState?.error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                  {loginState.error}
                </div>
              )}

              <button
                type="submit" disabled={isLoginPending}
                className="w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-all disabled:opacity-50"
              >
                {isLoginPending ? 'Logging in...' : 'Log In'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500 md:hidden">
              Don't have an account? <button type="button" onClick={() => setIsLogin(false)} className="text-primary-600 font-bold">Sign up</button>
            </p>
          </div>
        </div>

        {/* --- OVERLAY / ILLUSTRATION PANEL --- */}
        <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-20 ${isLogin ? '-translate-x-full' : 'translate-x-0'
          } hidden md:block`}>

          <div className={`bg-gradient-to-br from-primary-900 to-teal-800 w-[200%] h-full relative -left-full transition-transform duration-700 ease-in-out ${isLogin ? 'translate-x-1/2' : 'translate-x-0'
            }`}>

            {/* Overlay Content: LOGIN SIDE (Right side of overlay, shown when on Signup form) */}
            <div className={`absolute top-0 right-0 w-1/2 h-full flex flex-col justify-center items-center text-center p-12 text-white transition-opacity duration-700 ease-in-out ${isLogin ? 'opacity-0' : 'opacity-100'
              }`}>
              <Image
                src="/auth.png" alt="Secure Log in" width={300} height={300}
                className="drop-shadow-2xl mix-blend-screen mb-8" priority
              />
              <h2 className="text-4xl font-bold mb-4">One of us?</h2>
              <p className="text-primary-100 mb-8 text-lg">If you already have an account, just sign in to your dashboard.</p>
              <button
                onClick={() => setIsLogin(true)}
                className="px-8 py-3 rounded-full border-2 border-white/50 hover:bg-white hover:text-primary-900 font-bold transition-all backdrop-blur-sm"
              >
                Log In
              </button>
            </div>

            {/* Overlay Content: SIGNUP SIDE (Left side of overlay, shown when on Login form) */}
            <div className={`absolute top-0 left-0 w-1/2 h-full flex flex-col justify-center items-center text-center p-12 text-white transition-opacity duration-700 ease-in-out ${isLogin ? 'opacity-100' : 'opacity-0'
              }`}>
              <Image
                src="/auth.png" alt="Secure Registration" width={300} height={300}
                className="drop-shadow-2xl mix-blend-screen mb-8" priority
              />
              <h2 className="text-4xl font-bold mb-4">New here?</h2>
              <p className="text-primary-100 mb-8 text-lg">Sign up and discover a great amount of new opportunities!</p>
              <button
                onClick={() => setIsLogin(false)}
                className="px-8 py-3 rounded-full border-2 border-white/50 hover:bg-white hover:text-primary-900 font-bold transition-all backdrop-blur-sm"
              >
                Sign Up
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}
