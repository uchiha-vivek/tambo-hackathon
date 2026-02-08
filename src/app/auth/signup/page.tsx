'use client';

import SignUpForm from '@/components/auth/signup-form';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Join StudyGenie
            </h1>
            <p className="text-slate-400">Start your gamified learning adventure</p>
          </div>

          <SignUpForm />

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-purple-400 hover:text-purple-300 font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

