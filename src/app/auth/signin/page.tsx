'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SignInForm from '@/components/auth/signin-form';
import Link from 'next/link';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-400">Sign in to continue your learning journey</p>
          </div>

          {registered && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg mb-4">
              Account created successfully! Please sign in.
            </div>
          )}

          <SignInForm />

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-purple-400 hover:text-purple-300 font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

