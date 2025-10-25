'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Star, Edit, Trash2, Plus, Calendar } from 'lucide-react';
import Link from 'next/link';
import { WatchedMovie } from '@/types';
import { localStorage } from '@/lib/localStorage';
import Image from 'next/image';

export default function HistoryPage() {
  const [watchHistory, setWatchHistory] = useState<WatchedMovie[]>([]);
  const [editingMovie, setEditingMovie] = useState<WatchedMovie | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: '',
    year: new Date().getFullYear(),
    rating: 0
  });

  useEffect(() => {
    const history = localStorage.getWatchHistory();
    setWatchHistory(history);
  }, []);

  const handleDeleteMovie = (movieId: string) => {
    if (confirm('Are you sure you want to delete this movie from your history?')) {
      localStorage.removeFromWatchHistory(movieId);
      setWatchHistory(prev => prev.filter(movie => movie.id !== movieId));
    }
  };

  const handleUpdateRating = (movieId: string, rating: number) => {
    localStorage.updateWatchHistory(movieId, { rating });
    setWatchHistory(prev => 
      prev.map(movie => 
        movie.id === movieId ? { ...movie, rating } : movie
      )
    );
  };

  const handleAddMovie = () => {
    if (newMovie.title.trim() && newMovie.year > 1900 && newMovie.year <= new Date().getFullYear()) {
      const movie: WatchedMovie = {
        id: `${newMovie.title}-${newMovie.year}-${Date.now()}`,
        title: newMovie.title.trim(),
        year: newMovie.year,
        rating: newMovie.rating,
        watchedDate: new Date().toISOString()
      };

      localStorage.addToWatchHistory(movie);
      setWatchHistory(prev => [...prev, movie]);
      setNewMovie({ title: '', year: new Date().getFullYear(), rating: 0 });
      setShowAddForm(false);
    }
  };

  const handleEditMovie = (movie: WatchedMovie) => {
    setEditingMovie(movie);
  };

  const handleSaveEdit = () => {
    if (editingMovie) {
      localStorage.updateWatchHistory(editingMovie.id, editingMovie);
      setWatchHistory(prev => 
        prev.map(movie => 
          movie.id === editingMovie.id ? editingMovie : movie
        )
      );
      setEditingMovie(null);
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 10 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Watch History</h1>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Movie
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {watchHistory.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Movies in Your History</h2>
            <p className="text-gray-600 mb-8">
              Start building your watch history by adding movies you&apos;ve watched or getting recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowAddForm(true)}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Movie
              </button>
              <Link href="/questionnaire" className="btn-secondary">
                Get Recommendations
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="card text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {watchHistory.length}
                </div>
                <div className="text-gray-600">Movies Watched</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {watchHistory.length > 0 
                    ? (watchHistory.reduce((sum, movie) => sum + movie.rating, 0) / watchHistory.length).toFixed(1)
                    : '0.0'
                  }
                </div>
                <div className="text-gray-600">Average Rating</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {watchHistory.filter(movie => movie.rating >= 8).length}
                </div>
                <div className="text-gray-600">Highly Rated (8+)</div>
              </div>
            </div>

            {/* Movie List */}
            <div className="space-y-6">
              {watchHistory
                .sort((a, b) => new Date(b.watchedDate).getTime() - new Date(a.watchedDate).getTime())
                .map((movie) => (
                <div key={movie.id} className="card">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Movie Poster */}
                    <div className="flex-shrink-0">
                      {movie.poster ? (
                        <Image
                          src={movie.poster}
                          alt={`${movie.title} poster`}
                          width={150}
                          height={225}
                          className="rounded-lg shadow-md w-full md:w-36 h-54 object-cover"
                        />
                      ) : (
                        <div className="w-full md:w-36 h-54 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500 text-xs">No poster</span>
                        </div>
                      )}
                    </div>

                    {/* Movie Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {movie.title}
                            <span className="text-lg font-normal text-gray-600 ml-2">({movie.year})</span>
                          </h3>
                          <div className="flex items-center text-gray-600 mb-4">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>Watched on {formatDate(movie.watchedDate)}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditMovie(movie)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMovie(movie.id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-gray-700">Your Rating:</span>
                          <div className="flex">
                            {getRatingStars(movie.rating)}
                          </div>
                          <span className="text-sm text-gray-600">({movie.rating}/10)</span>
                        </div>
                        <div className="flex space-x-1">
                          {Array.from({ length: 10 }, (_, i) => (
                            <button
                              key={i}
                              onClick={() => handleUpdateRating(movie.id, i + 1)}
                              className={`w-6 h-6 rounded-full border-2 transition-colors ${
                                i < movie.rating
                                  ? 'bg-yellow-400 border-yellow-400'
                                  : 'border-gray-300 hover:border-yellow-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Add Movie Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Add Movie to History</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Movie Title
                  </label>
                  <input
                    type="text"
                    value={newMovie.title}
                    onChange={(e) => setNewMovie(prev => ({ ...prev, title: e.target.value }))}
                    className="input-field"
                    placeholder="Enter movie title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year
                  </label>
                  <input
                    type="number"
                    value={newMovie.year}
                    onChange={(e) => setNewMovie(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                    className="input-field"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Rating (1-10)
                  </label>
                  <input
                    type="number"
                    value={newMovie.rating}
                    onChange={(e) => setNewMovie(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                    className="input-field"
                    min="1"
                    max="10"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMovie}
                  className="btn-primary"
                >
                  Add Movie
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Movie Modal */}
        {editingMovie && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Edit Movie</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Movie Title
                  </label>
                  <input
                    type="text"
                    value={editingMovie.title}
                    onChange={(e) => setEditingMovie(prev => prev ? { ...prev, title: e.target.value } : null)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year
                  </label>
                  <input
                    type="number"
                    value={editingMovie.year}
                    onChange={(e) => setEditingMovie(prev => prev ? { ...prev, year: parseInt(e.target.value) } : null)}
                    className="input-field"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Rating (1-10)
                  </label>
                  <input
                    type="number"
                    value={editingMovie.rating}
                    onChange={(e) => setEditingMovie(prev => prev ? { ...prev, rating: parseInt(e.target.value) } : null)}
                    className="input-field"
                    min="1"
                    max="10"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setEditingMovie(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="btn-primary"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
