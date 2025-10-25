'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import MovieCard from '@/components/MovieCard';
import { Recommendation } from '@/types';
import { localStorage } from '@/lib/localStorage';
import { generateRecommendations } from '@/lib/gemini';

export default function SurprisePage() {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const generateSurpriseRecommendations = async () => {
    try {
      // Create default preferences for surprise mode
      const surprisePreferences = {
        genres: ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Thriller'], // Mix of popular genres
        era: 'I enjoy movies from all eras',
        mood: ['Light-hearted and fun', 'Intense and thrilling', 'Thought-provoking and deep'],
        contentLevel: 'Any content level is fine',
        watchTime: 'Length doesn\'t matter',
        ratingPreference: 'Open to hidden gems (6+ stars)',
        scorePreference: 'Balanced approach',
        cinemaRegion: ['I enjoy movies from all regions'] // Open to all cinema regions for surprises
      };

      // Get any existing watch history
      const watchHistory = localStorage.getWatchHistory();

      // Generate surprise recommendations
      const surpriseRecommendations = await generateRecommendations(
        surprisePreferences,
        watchHistory,
        true // surpriseMe = true
      );

      setRecommendations(surpriseRecommendations);
      
      // Fetch movie data for all recommendations
      fetchMovieDataForRecommendations(surpriseRecommendations);
    } catch (error) {
      console.error('Error generating surprise recommendations:', error);
      alert('Failed to generate surprise recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMovieDataForRecommendations = async (recs: Recommendation[]) => {
    try {
      const { fetchMultipleMovieData } = await import('@/lib/omdb');
      const movieDataList = await fetchMultipleMovieData(recs);
      
      // Update recommendations with fetched data
      const updatedRecommendations = recs.map(rec => {
        const movieData = movieDataList.find(data => 
          data.title.toLowerCase() === rec.title.toLowerCase() && 
          data.year === rec.year
        );
        
        if (movieData) {
          return {
            ...rec,
            poster: movieData.poster,
            imdbRating: movieData.imdbRating,
            rottenTomatoes: movieData.rottenTomatoes
          };
        }
        return rec;
      });
      
      setRecommendations(updatedRecommendations);
    } catch (error) {
      console.error('Error fetching movie data for recommendations:', error);
      // Continue without movie data if OMDB fails
    }
  };

  const handleAddToHistory = async (movie: Recommendation) => {
    // Fetch additional movie data for better display
    try {
      const { fetchMovieData } = await import('@/lib/omdb');
      const movieData = await fetchMovieData(movie.title, movie.year);
      if (movieData) {
        setRecommendations(prev => 
          prev.map(rec => 
            rec.title === movie.title && rec.year === movie.year
              ? { ...rec, poster: movieData.poster, imdbRating: movieData.imdbRating }
              : rec
          )
        );
      }
    } catch (error) {
      console.error('Error fetching movie data:', error);
    }
  };

  useEffect(() => {
    generateSurpriseRecommendations();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-dark-50 mb-2">Generating Surprise Recommendations</h2>
          <p className="text-dark-300">Finding unexpected movies you might love...</p>
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
              <span className="text-2xl font-bold text-dark-50">Surprise Me</span>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-max section-padding">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-dark-50 mb-4">
            Surprise Recommendations
          </h1>
          <p className="text-xl text-dark-300 max-w-3xl mx-auto">
            Here are some unexpected but excellent movies that might expand your horizons!
          </p>
        </div>

        {/* Recommendations Grid */}
        <div className="space-y-8">
          {recommendations.map((movie, index) => (
            <MovieCard
              key={`${movie.title}-${movie.year}-${index}`}
              movie={movie}
              onAddToHistory={handleAddToHistory}
              showAddButton={true}
            />
          ))}
        </div>

        {/* Footer Actions */}
        <div className="mt-16 text-center">
          <div className="space-y-4">
            <p className="text-dark-300">
              Want different surprises? Try again or answer the questionnaire for personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={async () => {
                  setIsLoading(true);
                  await generateSurpriseRecommendations();
                }}
                className="btn-primary"
              >
                Surprise Me Again
              </button>
              <Link href="/questionnaire" className="btn-secondary">
                Get Personalized Recommendations
              </Link>
              <Link href="/history" className="btn-secondary">
                View Watch History
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
