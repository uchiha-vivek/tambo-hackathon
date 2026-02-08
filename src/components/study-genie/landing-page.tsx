'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Menu, X, ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface LandingPageProps {
  onStart: () => void;
  onDemo: () => void;
}

export default function LandingPage({ onStart, onDemo }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Left Bar - Settings */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50 hidden xl:block">
        <button className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-r-lg flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all">
          <span className="text-white text-xl">⚙</span>
        </button>
      </div>

      {/* Scroll Top Button */}
      <button
        id="goTop"
        className="fixed bottom-8 right-8 w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all z-50"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ChevronRight className="text-white rotate-[-90deg]" size={20} />
      </button>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="w-1/6 md:w-1/12">
              <Link href="/" className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3FDFD5] to-[#61210F] flex items-center justify-center">
                  <span className="text-white font-bold text-lg">SG</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
              <Link href="#workScroll" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                <span className="text-[#3FDFD5]">01 /</span> WORKS
              </Link>
              <Link href="#serviceScroll" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                <span className="text-[#3FDFD5]">02 /</span> SERVICES
              </Link>
              <Link href="#aboutScroll" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                <span className="text-[#3FDFD5]">03 /</span> ABOUT
              </Link>
              <Link href="#contactScroll" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                <span className="text-[#3FDFD5]">04 /</span> CONTACT
              </Link>
            </nav>

            {/* Contact Info */}
            <div className="hidden sm:flex items-center gap-4 text-sm">
              <a href="mailto:contact@studygenie.com" className="text-white/70 hover:text-white transition-colors">
                CONTACT@STUDYGENIE.COM
              </a>
              <p className="text-white/70">
                EST <span className="text-[#3FDFD5]">{currentTime}</span>
              </p>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center gap-2 text-sm text-white"
            >
              <Menu size={24} />
              MENU
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black z-50 md:hidden">
          <div className="container mx-auto px-4 py-8 h-full flex flex-col">
            <div className="flex justify-between items-center mb-12">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3FDFD5] to-[#61210F] flex items-center justify-center">
                <span className="text-white font-bold text-lg">SG</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-white">
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 flex flex-col justify-center space-y-8">
              <Link href="#workScroll" onClick={() => setMobileMenuOpen(false)} className="text-4xl font-bold text-white hover:text-[#3FDFD5] transition-colors">
                WORKS
              </Link>
              <Link href="#serviceScroll" onClick={() => setMobileMenuOpen(false)} className="text-4xl font-bold text-white hover:text-[#3FDFD5] transition-colors">
                SERVICES
              </Link>
              <Link href="#aboutScroll" onClick={() => setMobileMenuOpen(false)} className="text-4xl font-bold text-white hover:text-[#3FDFD5] transition-colors">
                ABOUT
              </Link>
              <Link href="#contactScroll" onClick={() => setMobileMenuOpen(false)} className="text-4xl font-bold text-white hover:text-[#3FDFD5] transition-colors">
                CONTACT
              </Link>
            </nav>
            <div className="border-t border-white/10 pt-8">
              <a href="mailto:contact@studygenie.com" className="text-white/70 block mb-2">CONTACT@STUDYGENIE.COM</a>
              <p className="text-white/70">EST <span className="text-[#3FDFD5]">{currentTime}</span></p>
            </div>
          </div>
        </div>
      )}

      <main>
        {/* Hero Banner with Video Background */}
        <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
          {/* Video Background Placeholder */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-[#61210F]/20 to-black">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Left Column */}
              <div className="md:col-span-8">
                <div className="space-y-4 mb-8">
                  <div className="overflow-hidden">
                    <a href="#" className="text-sm font-medium text-white/70 hover:text-[#3FDFD5] transition-colors inline-block">
                      LEARNING PLATFORM
                    </a>
                  </div>
                  <div className="overflow-hidden">
                    <a href="#" className="text-sm font-medium text-white/70 hover:text-[#3FDFD5] transition-colors inline-block">
                      INTERACTIVE QUIZZES
                    </a>
                  </div>
                  <div className="overflow-hidden">
                    <a href="#" className="text-sm font-medium text-white/70 hover:text-[#3FDFD5] transition-colors inline-block">
                      PROGRESS TRACKING
                    </a>
                  </div>
                </div>
                <div className="overflow-hidden">
                  <h1 className="text-7xl md:text-9xl font-bold leading-tight mb-4">
                    STUDYGENIE<span className="text-[#3FDFD5]">_</span>
                  </h1>
                </div>
              </div>

              {/* Right Column */}
              <div className="md:col-span-4">
                <div className="flex justify-between items-center mb-8 text-sm font-medium">
                  <p className="text-white/70 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#3FDFD5]"></span>
                    AVAILABLE FOR LEARNING
                  </p>
                  <span className="text-white/70">© 2025</span>
                </div>
                <div className="space-y-6">
                  <p className="text-white/70 text-lg leading-relaxed">
                    Transform your syllabus into an interactive learning adventure. Each feature balances engagement and education for maximum impact. Your learning journey adapts as your knowledge grows.
                  </p>
                  <button
                    onClick={onStart}
                    className="px-8 py-4 bg-white text-black hover:bg-white/90 transition-all font-semibold text-sm uppercase tracking-wider flex items-center gap-2 group"
                  >
                    START LEARNING
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Selected Works Section */}
        <section className="section-selected-work py-24 relative" id="workScroll">
          <div className="absolute inset-0 bg-gradient-to-b from-black to-[#61210F]/10 pointer-events-none"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
              <div className="md:col-span-4">
                <p className="text-sm text-white/70 mb-4 uppercase tracking-wider">SELECTED FEATURES</p>
                <div className="space-y-4">
                  <h3 className="text-6xl font-semibold text-white">Skill Tree</h3>
                  <h3 className="text-6xl font-semibold text-white/50">Quiz Battles</h3>
                  <h3 className="text-6xl font-semibold text-white/50">Progress Dashboard</h3>
                </div>
              </div>
              <div className="md:col-span-8">
                <div className="relative h-[500px] bg-gradient-to-br from-[#61210F]/20 to-[#3FDFD5]/20 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#3FDFD5] to-[#61210F] flex items-center justify-center">
                        <span className="text-white text-5xl font-bold">SG</span>
                      </div>
                      <p className="text-white/70 text-xl">Interactive Learning Experience</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags and Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-12">
              <div className="md:col-span-4">
                <div className="flex flex-wrap gap-2">
                  <span className="px-4 py-2 border border-white/20 text-sm text-white/70">GAMIFIED LEARNING</span>
                  <span className="px-4 py-2 border border-white/20 text-sm text-white/70">PROGRESS TRACKING</span>
                </div>
              </div>
              <div className="md:col-span-4 flex items-center justify-center gap-6">
                <button className="text-sm font-medium text-white/70 hover:text-white flex items-center gap-2">
                  <ChevronLeft size={18} />
                  PREV
                </button>
                <button className="text-sm font-medium text-white/70 hover:text-white flex items-center gap-2">
                  NEXT
                  <ChevronRight size={18} />
                </button>
              </div>
              <div className="md:col-span-4 text-right">
                <p className="text-6xl font-semibold">
                  20<span className="text-[#3FDFD5]">25</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="section-service py-24 relative overflow-hidden" id="serviceScroll">
          <div className="absolute inset-0 bg-gradient-to-br from-[#61210F]/10 to-black"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h2 className="text-7xl md:text-9xl font-semibold mb-16">Services</h2>
            
            <div className="space-y-24">
              {/* Service 1 */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-5">
                  <div className="relative h-[400px] bg-gradient-to-br from-[#3FDFD5]/20 to-[#61210F]/20 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl">📚</span>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-7">
                  <h3 className="text-4xl font-semibold mb-4">Interactive Learning</h3>
                  <p className="text-white/70 text-lg mb-6 leading-relaxed">
                    Transform your syllabus into engaging learning paths with interactive quizzes, coding challenges, and progress tracking. Every feature serves a purpose—engaging, accessible, and ready for growth.
                  </p>
                  <div className="border-t border-white/10 pt-6 mb-6">
                    <ul className="space-y-2 text-white/70">
                      <li className="flex items-center gap-2">
                        <span className="text-[#3FDFD5]">//</span> Skill Tree Navigation
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#3FDFD5]">//</span> Adaptive Quiz Generation
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#3FDFD5]">//</span> Progress Analytics
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#3FDFD5]">//</span> Gamified Experience
                      </li>
                    </ul>
                  </div>
                  <button
                    onClick={onStart}
                    className="px-6 py-3 border border-white/20 hover:bg-white/10 transition-all text-sm font-medium uppercase tracking-wider"
                  >
                    START LEARNING
                  </button>
                </div>
              </div>

              {/* Service 2 */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-7 order-2 md:order-1">
                  <h3 className="text-4xl font-semibold mb-4">Progress Tracking</h3>
                  <p className="text-white/70 text-lg mb-6 leading-relaxed">
                    Monitor your learning journey with detailed analytics, streak tracking, and performance insights. Visualize your growth over time and identify areas for improvement.
                  </p>
                  <div className="border-t border-white/10 pt-6 mb-6">
                    <ul className="space-y-2 text-white/70">
                      <li className="flex items-center gap-2">
                        <span className="text-[#3FDFD5]">//</span> Real-time Analytics
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#3FDFD5]">//</span> Performance Metrics
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#3FDFD5]">//</span> Streak Tracking
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#3FDFD5]">//</span> Achievement System
                      </li>
                    </ul>
                  </div>
                  <button
                    onClick={onStart}
                    className="px-6 py-3 border border-white/20 hover:bg-white/10 transition-all text-sm font-medium uppercase tracking-wider"
                  >
                    START LEARNING
                  </button>
                </div>
                <div className="md:col-span-5 order-1 md:order-2">
                  <div className="relative h-[400px] bg-gradient-to-br from-[#61210F]/20 to-[#3FDFD5]/20 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl">📊</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="section-process py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-7xl md:text-9xl font-semibold mb-16">The Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  number: '01',
                  title: 'Upload Your Syllabus',
                  description: 'Start by uploading your course material. We extract topics, units, and learning objectives to build your personalized skill tree.'
                },
                {
                  number: '02',
                  title: 'Explore & Learn',
                  description: 'Navigate your skill tree, take interactive quizzes, and practice coding challenges. Track your progress as you master each topic.'
                },
                {
                  number: '03',
                  title: 'Master & Excel',
                  description: 'Level up your knowledge, unlock achievements, and prepare for interviews. Your learning journey adapts as you grow.'
                }
              ].map((step, idx) => (
                <div key={idx} className="relative bg-gradient-to-br from-white/5 to-white/0 rounded-lg p-8 border border-white/10">
                  <div className="text-6xl font-semibold mb-4 text-white/20">{step.number}</div>
                  <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-white/70 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="section-about py-24 relative" id="aboutScroll">
          <div className="absolute inset-0 bg-gradient-to-br from-[#61210F]/10 to-black"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
              <div className="md:col-span-5">
                <div className="relative h-[500px] bg-gradient-to-br from-[#3FDFD5]/20 to-[#61210F]/20 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#3FDFD5] to-[#61210F] flex items-center justify-center">
                      <span className="text-white text-5xl font-bold">SG</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:col-span-7">
                <p className="text-sm text-white/70 mb-4 uppercase tracking-wider">ABOUT STUDYGENIE</p>
                <h2 className="text-5xl font-semibold mb-6 leading-tight">
                  Transforming Education Through Interactive Learning
                </h2>
                <div className="border-t border-white/10 pt-6 mb-8">
                  <p className="text-white/70 text-lg leading-relaxed mb-6">
                    StudyGenie is a modern learning platform that transforms traditional syllabi into engaging, gamified learning experiences. We combine interactive quizzes, coding challenges, and progress tracking to make learning both effective and enjoyable.
                  </p>
                  <p className="text-white/70 text-lg leading-relaxed">
                    Our platform adapts to your learning pace, providing personalized feedback and recommendations. Whether you're preparing for exams or building new skills, StudyGenie makes the journey engaging and rewarding.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="section-cta py-24 relative" id="contactScroll">
          <div className="absolute inset-0 bg-gradient-to-br from-black to-[#61210F]/10"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-7xl md:text-9xl font-semibold mb-16 text-center">
                Let's start<br />
                learning together
              </h2>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-white/70 mb-2 uppercase tracking-wider">
                      Name <span className="text-[#3FDFD5]">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white focus:outline-none focus:border-[#3FDFD5] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-2 uppercase tracking-wider">
                      Email <span className="text-[#3FDFD5]">*</span>
                    </label>
                    <input
                      type="email"
                      className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white focus:outline-none focus:border-[#3FDFD5] transition-all"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-2 uppercase tracking-wider">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white focus:outline-none focus:border-[#3FDFD5] transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  onClick={(e) => { e.preventDefault(); onStart(); }}
                  className="w-full md:w-auto px-8 py-4 bg-white text-black hover:bg-white/90 transition-all font-semibold text-sm uppercase tracking-wider"
                >
                  START LEARNING
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-white/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
              <div className="md:col-span-4">
                <p className="text-sm text-white/70 mb-4 uppercase tracking-wider">WORKING GLOBALLY</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-white/70 mb-4 uppercase tracking-wider">SITEMAP</p>
                <ul className="space-y-2">
                  <li><Link href="#aboutScroll" className="text-white hover:text-[#3FDFD5] transition-colors">About</Link></li>
                  <li><Link href="#workScroll" className="text-white hover:text-[#3FDFD5] transition-colors">Works</Link></li>
                  <li><Link href="#serviceScroll" className="text-white hover:text-[#3FDFD5] transition-colors">Services</Link></li>
                  <li><Link href="#contactScroll" className="text-white hover:text-[#3FDFD5] transition-colors">Contact</Link></li>
                </ul>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-white/70 mb-4 uppercase tracking-wider">SOCIALS</p>
                <ul className="space-y-2">
                  <li><a href="#" className="text-white hover:text-[#3FDFD5] transition-colors">Twitter</a></li>
                  <li><a href="#" className="text-white hover:text-[#3FDFD5] transition-colors">LinkedIn</a></li>
                  <li><a href="#" className="text-white hover:text-[#3FDFD5] transition-colors">GitHub</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/10 pt-8 flex justify-between items-center">
              <p className="text-sm text-white/70">© STUDYGENIE LEARNING PLATFORM</p>
              <a href="#" className="text-sm text-white/70 hover:text-white flex items-center gap-2">
                BACK TO TOP
                <ChevronRight size={16} className="rotate-[-90deg]" />
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
