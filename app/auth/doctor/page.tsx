'use client';

import { useActionState } from 'react';
import { signupAction } from '@/app/utils/actions';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Mail, Lock, User, Stethoscope } from 'lucide-react';

export default function DoctorSignupPage() {
  const [state, formAction, isPending] = useActionState(signupAction.bind(null, 'doctor'), undefined);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-primary-50 to-white">
      {/* Left panel with form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 sm:p-12 lg:p-24 justify-center">
        <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="max-w-md w-full mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Join as a Doctor</h1>
          <p className="text-slate-500 mb-8">Connect with patients and expand your digital practice.</p>

          <form action={formAction} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Full Name (with credentials)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  placeholder="Dr. John Doe, MD"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  placeholder="doctor@clinic.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Specialization</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Stethoscope className="h-5 w-5 text-slate-400" />
                </div>
                <select
                  name="specialization"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
                >
                  <option value="">Select your specialty</option>
                  <option value="General Practice">General Practice</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Dermatology">Dermatology</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {state?.error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                {state.error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-700 focus:ring-4 focus:ring-primary-500/50 transition-all disabled:opacity-50"
            >
              {isPending ? 'Creating Account...' : 'Create Provider Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500">
            Already registered?{' '}
            <Link href="/auth" className="text-primary-600 font-bold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Right panel with illustration */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col">
        {/* Full Cover Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/doctor_auth.png"
            alt="Provider Portal"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Gradient Overlay for text readability */}
        {/* <div className="absolute inset-0 bg-gradient-to-b from-primary-950/90 via-primary-900/40 to-transparent z-10" /> */}

        {/* <div className="z-20 p-12 text-center text-white w-full relative pt-24">
          <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">Provider Portal</h2>
          <p className="text-primary-100 text-lg drop-shadow-md">Next-generation tools for modern medical practice.</p>
        </div> */}
      </div>
    </div>
  );
}
