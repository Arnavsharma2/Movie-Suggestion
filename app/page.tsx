'use client';

import Link from 'next/link';
import { Film, Sparkles, Brain, Heart, TrendingUp, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="relative z-50 border-b border-dark-700/50">
        <div className="container-max">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Film className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-dark-50">CineMatch</span>
            </div>
            <div className="flex space-x-8">
              <Link href="/history" className="text-dark-300 hover:text-dark-100 transition-colors duration-300 font-medium">
                Watch History
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container-max section-padding">
        <div className="text-center max-w-4xl mx-auto">
          <div className="fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-dark-50 mb-8 leading-tight">
              Movie Recommendations
            </h1>
            
            <p className="text-xl text-dark-300 mb-12 max-w-2xl mx-auto">
              Get personalized movie suggestions based on your preferences and watch history.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/questionnaire" className="btn-primary text-lg px-8 py-4">
                Get Recommendations
              </Link>
              <Link href="/surprise" className="btn-secondary text-lg px-8 py-4">
                Surprise Me
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
