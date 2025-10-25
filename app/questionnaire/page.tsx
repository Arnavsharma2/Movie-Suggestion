'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Film, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import QuestionStep from '@/components/QuestionStep';
import { UserPreferences, QuestionnaireStep } from '@/types';
import { localStorage } from '@/lib/localStorage';
import { generateRecommendations } from '@/lib/gemini';

const questionnaireSteps: QuestionnaireStep[] = [
  {
    id: 'genres',
    title: 'What genres do you enjoy?',
    question: 'Select all the genres you like (you can choose multiple):',
    type: 'multiple',
    options: [
      'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
      'Documentary', 'Drama', 'Family', 'Fantasy', 'Film-Noir', 'History',
      'Horror', 'Music', 'Mystery', 'Romance', 'Sci-Fi', 'Sport',
      'Thriller', 'War', 'Western'
    ],
    required: true
  },
  {
    id: 'era',
    title: 'What movie era appeals to you?',
    question: 'Choose your preferred time period for movies:',
    type: 'single',
    options: [
      'Classic (pre-1970s)',
      '70s-80s Golden Age',
      '90s-2000s',
      'Recent (2010s-present)',
      'I enjoy movies from all eras'
    ],
    required: true
  },
  {
    id: 'mood',
    title: 'What mood are you in?',
    question: 'Select the types of movies that match your current mood (choose multiple):',
    type: 'multiple',
    options: [
      'Light-hearted and fun',
      'Intense and thrilling',
      'Thought-provoking and deep',
      'Romantic and emotional',
      'Dark and mysterious',
      'Inspiring and uplifting',
      'Funny and comedic',
      'Action-packed and exciting'
    ],
    required: true
  },
  {
    id: 'contentLevel',
    title: 'What content level do you prefer?',
    question: 'How comfortable are you with mature content?',
    type: 'single',
    options: [
      'Family-friendly only',
      'Mild content (PG-13 level)',
      'Moderate content (R level)',
      'Any content level is fine'
    ],
    required: true
  },
  {
    id: 'watchTime',
    title: 'How much time do you have?',
    question: 'What\'s your preferred movie length?',
    type: 'single',
    options: [
      'Short (under 90 minutes)',
      'Standard (90-120 minutes)',
      'Long (2-3 hours)',
      'Epic (3+ hours)',
      'Length doesn\'t matter'
    ],
    required: true
  },
  {
    id: 'ratingPreference',
    title: 'What about movie ratings?',
    question: 'Do you prefer highly-rated movies or are you open to hidden gems?',
    type: 'single',
    options: [
      'Only highly-rated movies (8+ stars)',
      'Well-rated movies (7+ stars)',
      'Open to hidden gems (6+ stars)',
      'I don\'t care about ratings'
    ],
    required: true
  },
  {
    id: 'scorePreference',
    title: 'Critics vs Audience?',
    question: 'Whose opinion do you trust more for movie recommendations?',
    type: 'single',
    options: [
      'Trust critics more',
      'Trust audience more',
      'Balanced approach',
      'I don\'t pay attention to scores'
    ],
    required: true
  }
];

export default function QuestionnairePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const surpriseMe = searchParams.get('surprise') === 'true';

  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({});
  const [isLoading, setIsLoading] = useState(false);

  const currentQuestion = questionnaireSteps[currentStep];

  const handleAnswer = (value: string | string[]) => {
    setPreferences(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < questionnaireSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Save preferences to localStorage
      const fullPreferences: UserPreferences = {
        genres: preferences.genres as string[] || [],
        era: preferences.era as string || '',
        mood: preferences.mood as string[] || [],
        contentLevel: preferences.contentLevel as string || '',
        watchTime: preferences.watchTime as string || '',
        ratingPreference: preferences.ratingPreference as string || '',
        scorePreference: preferences.scorePreference as string || ''
      };

      localStorage.setPreferences(fullPreferences);

      // Get watch history
      const watchHistory = localStorage.getWatchHistory();

      // Generate recommendations
      const recommendations = await generateRecommendations(fullPreferences, watchHistory, surpriseMe);

      // Navigate to recommendations page with data
      const params = new URLSearchParams();
      params.set('data', JSON.stringify(recommendations));
      if (surpriseMe) params.set('surprise', 'true');
      
      router.push(`/recommendations?${params.toString()}`);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      alert('Failed to generate recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Generating Recommendations</h2>
          <p className="text-gray-600">Our AI is analyzing your preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-dark-700/50">
        <div className="container-max">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-2 text-dark-300 hover:text-dark-100 transition-colors duration-300">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Film className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-dark-50">CineMatch</span>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-dark-800/50">
        <div className="container-max py-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-dark-300">
              Step {currentStep + 1} of {questionnaireSteps.length}
            </span>
            <span className="text-sm font-bold text-primary-400">
              {Math.round(((currentStep + 1) / questionnaireSteps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-dark-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / questionnaireSteps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <QuestionStep
          step={currentQuestion}
          value={preferences[currentQuestion.id as keyof UserPreferences] || (currentQuestion.type === 'multiple' ? [] : '')}
          onChange={handleAnswer}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isFirst={currentStep === 0}
          isLast={currentStep === questionnaireSteps.length - 1}
        />
      </div>
    </div>
  );
}
