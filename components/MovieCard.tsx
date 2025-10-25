'use client';

import { useState } from 'react';
import { Star, Plus, Check, ExternalLink, Film } from 'lucide-react';
import { Recommendation } from '@/types';
import { localStorage } from '@/lib/localStorage';
import Image from 'next/image';

interface MovieCardProps {
  movie: Recommendation;
  onAddToHistory?: (movie: Recommendation) => void;
  showAddButton?: boolean;
}

export default function MovieCard({ movie, onAddToHistory, showAddButton = true }: MovieCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);

  const handleAddToHistory = () => {
    const watchedMovie = {
      id: `${movie.title}-${movie.year}-${Date.now()}`,
      title: movie.title,
      year: movie.year,
      rating: 0, // User can rate later
      watchedDate: new Date().toISOString(),
      poster: movie.poster
    };

    localStorage.addToWatchHistory(watchedMovie);
    setIsAdded(true);
    onAddToHistory?.(movie);
  };

  return (
    <div className="card group hover:scale-[1.02] transition-all duration-500">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Movie Poster */}
        <div className="flex-shrink-0 relative">
          {movie.poster ? (
            <div className="relative overflow-hidden rounded-2xl shadow-2xl group-hover:shadow-3xl transition-all duration-500">
              <Image
                src={movie.poster}
                alt={`${movie.title} poster`}
                width={200}
                height={300}
                className="w-full md:w-56 h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ) : (
            <div className="w-full md:w-56 h-80 bg-gradient-to-br from-dark-700 to-dark-800 rounded-2xl flex items-center justify-center shadow-2xl border border-dark-600">
              <div className="text-center">
                <Film className="w-12 h-12 text-dark-400 mx-auto mb-2" />
                <span className="text-dark-400 text-sm font-medium">No poster available</span>
              </div>
            </div>
          )}
        </div>

        {/* Movie Details */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h3 className="text-3xl font-bold text-dark-50 mb-3 group-hover:text-primary-400 transition-colors duration-300">
                {movie.title}
                <span className="text-xl font-normal text-dark-300 ml-3">({movie.year})</span>
              </h3>
              <div className="flex flex-wrap gap-3 mb-4">
                {movie.genre.map((genre, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-dark-700 text-dark-200 text-sm font-medium rounded-full border border-dark-600 hover:border-primary-500 transition-colors duration-300"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Ratings */}
            <div className="flex flex-col items-end space-y-3">
              {movie.imdbRating && (
                <div className="flex items-center space-x-2 bg-accent-500/20 px-4 py-2 rounded-xl border border-accent-500/30">
                  <Star className="w-5 h-5 text-accent-400 fill-current" />
                  <span className="text-sm font-bold text-accent-300">
                    {movie.imdbRating}/10
                  </span>
                </div>
              )}
              {movie.rottenTomatoes && (
                <div className="flex items-center space-x-2 bg-red-500/20 px-4 py-2 rounded-xl border border-red-500/30">
                  <span className="text-sm font-bold text-red-300">
                    RT: {movie.rottenTomatoes}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-dark-300 mb-6 leading-relaxed text-lg">
            {movie.description}
          </p>

          {/* Reasoning */}
          <div className="mb-8">
            <button
              onClick={() => setShowReasoning(!showReasoning)}
              className="text-primary-400 hover:text-primary-300 font-medium text-sm flex items-center group transition-colors duration-300"
            >
              {showReasoning ? 'Hide' : 'Show'} reasoning
              <ExternalLink className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform duration-300" />
            </button>
            {showReasoning && (
              <div className="mt-4 p-6 bg-dark-700/50 rounded-2xl border border-dark-600/50">
                <p className="text-sm text-dark-200 italic leading-relaxed">
                  "{movie.reasoning}"
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              {showAddButton && (
                <button
                  onClick={handleAddToHistory}
                  disabled={isAdded}
                  className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    isAdded
                      ? 'bg-green-500/20 text-green-300 cursor-not-allowed border border-green-500/30'
                      : 'bg-primary-500 text-dark-900 hover:bg-primary-400 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Added to History
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Add to Watch History
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="text-sm text-dark-400">
              Learn more about this movie
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
