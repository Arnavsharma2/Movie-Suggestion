'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, Sparkles, Star } from 'lucide-react';
import Link from 'next/link';
import MovieCard from '@/components/MovieCard';
import { Recommendation } from '@/types';
import { fetchMultipleMovieData } from '@/lib/omdb';

function RecommendationsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSurpriseMode, setIsSurpriseMode] = useState(false);

  useEffect(() => {
    const dataParam = searchParams.get('data');
    const surpriseParam = searchParams.get('surprise');
    
    if (dataParam) {
      try {
        const parsedData = JSON.parse(dataParam);
        setRecommendations(parsedData);
        setIsSurpriseMode(surpriseParam === 'true');
        
        // Fetch movie data for all recommendations
        fetchMovieDataForRecommendations(parsedData);
      } catch (error) {
        console.error('Error parsing recommendations data:', error);
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [searchParams, router]);

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

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      // Get stored preferences and watch history
      const preferences = localStorage.getPreferences();
      const watchHistory = localStorage.getWatchHistory();

      if (!preferences) {
        router.push('/questionnaire');
        return;
      }

      // Generate new recommendations
      const { generateRecommendations } = await import('@/lib/gemini');
      const newRecommendations = await generateRecommendations(
        preferences,
        watchHistory,
        isSurpriseMode
      );

      setRecommendations(newRecommendations);
      
      // Fetch movie data for new recommendations
      fetchMovieDataForRecommendations(newRecommendations);
    } catch (error) {
      console.error('Error refreshing recommendations:', error);
      alert('Failed to refresh recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToHistory = async (movie: Recommendation) => {
    // Fetch additional movie data for better display
    try {
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

  const fetchMovieData = async (title: string, year: number) => {
    const { fetchMovieData: fetchData } = await import('@/lib/omdb');
    return fetchData(title, year);
  };

  if (recommendations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Recommendations</h2>
          <p className="text-gray-600">Please wait while we prepare your personalized suggestions...</p>
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
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 text-dark-300 hover:text-dark-100 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            {isSurpriseMode ? (
              <Sparkles className="w-8 h-8 text-accent-400 mr-3" />
            ) : (
              <Star className="w-8 h-8 text-primary-400 mr-3" />
            )}
            <h1 className="text-4xl font-bold text-dark-50">
              {isSurpriseMode ? 'Surprise Recommendations' : 'Your Movie Recommendations'}
            </h1>
          </div>
          <p className="text-xl text-dark-300 max-w-3xl mx-auto">
            {isSurpriseMode 
              ? "Here are some unexpected but excellent movies that might expand your horizons!"
              : "Based on your preferences and watch history, here are movies we think you'll love:"
            }
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
              Don&apos;t like these recommendations? Try refreshing or start over with new preferences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="btn-primary disabled:opacity-50"
              >
                Get New Recommendations
              </button>
              <Link href="/questionnaire" className="btn-secondary">
                Start Over
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

export default function RecommendationsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-dark-50 mb-2">Loading Recommendations</h2>
          <p className="text-dark-300">Please wait while we prepare your personalized movie suggestions...</p>
        </div>
      </div>
    }>
      <RecommendationsContent />
    </Suspense>
  );
}
