'use client';

import { useState } from 'react';
import { BookOpen, Target, Trophy, ArrowRight } from 'lucide-react';
import AppShell from '@/components/ui/AppShell';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import ActionCard from '@/components/ui/ActionCard';

interface LandingPageProps {
  onStart: () => void;
  onDemo: () => void;
}

export default function LandingPage({ onStart, onDemo }: LandingPageProps) {
  return (
    <AppShell showNav={false}>
      <div className="w-full h-screen overflow-y-auto" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#61210F' }}>
              Welcome to StudyGenie
            </h1>
            <p className="text-lg mb-2" style={{ color: '#6B7280' }}>
              Transform your syllabus into a learning adventure
            </p>
            <p className="text-base" style={{ color: '#6B7280' }}>
              Upload your course material and let's generate your skill map!
            </p>
          </div>

          {/* Upload Section */}
          <div className="mb-12">
            <div className="bg-white rounded-[1.5rem] p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] border border-gray-100 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#3FDFD520' }}>
                  <BookOpen size={32} style={{ color: '#3FDFD5' }} />
                </div>
                <h2 className="text-xl font-bold mb-2" style={{ color: '#61210F' }}>
                  Drop your syllabus here
                </h2>
                <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
                  or click to select (PDF, TXT, MD)
                </p>
                <div className="space-y-2 text-sm" style={{ color: '#6B7280' }}>
                  <p>We'll extract units, topics, and difficulty levels</p>
                  <p>Then generate your personalized skill tree</p>
                </div>
              </div>
              <PrimaryButton onClick={onStart} className="w-full sm:w-auto">
                Upload Syllabus
              </PrimaryButton>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <ActionCard
              icon={BookOpen}
              title="Skill Tree with prerequisites"
              description="Visual learning path with topic dependencies"
              iconColor="#3FDFD5"
            />
            <ActionCard
              icon={Target}
              title="Combat Mode quizzes"
              description="Interactive quiz battles to test your knowledge"
              iconColor="#61210F"
            />
            <ActionCard
              icon={Trophy}
              title="Cozy Room aesthetics"
              description="Focus timer and ambient study environment"
              iconColor="#3FDFD5"
            />
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <SecondaryButton onClick={onDemo} className="mr-4">
              Try Demo
            </SecondaryButton>
            <PrimaryButton onClick={onStart}>
              Get Started <ArrowRight size={18} className="inline ml-2" />
            </PrimaryButton>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
