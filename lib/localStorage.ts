import { UserPreferences, WatchedMovie } from '@/types';

const STORAGE_KEYS = {
  PREFERENCES: 'movie-recommender-preferences',
  WATCH_HISTORY: 'movie-recommender-watch-history',
} as const;

export const localStorage = {
  // Preferences
  getPreferences: (): UserPreferences | null => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading preferences:', error);
      return null;
    }
  },

  setPreferences: (preferences: UserPreferences): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  },

  clearPreferences: (): void => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
  },

  // Watch History
  getWatchHistory: (): WatchedMovie[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = window.localStorage.getItem(STORAGE_KEYS.WATCH_HISTORY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading watch history:', error);
      return [];
    }
  },

  addToWatchHistory: (movie: WatchedMovie): void => {
    if (typeof window === 'undefined') return;
    try {
      const history = localStorage.getWatchHistory();
      const updatedHistory = [...history, movie];
      window.localStorage.setItem(STORAGE_KEYS.WATCH_HISTORY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error adding to watch history:', error);
    }
  },

  updateWatchHistory: (movieId: string, updates: Partial<WatchedMovie>): void => {
    if (typeof window === 'undefined') return;
    try {
      const history = localStorage.getWatchHistory();
      const updatedHistory = history.map(movie => 
        movie.id === movieId ? { ...movie, ...updates } : movie
      );
      window.localStorage.setItem(STORAGE_KEYS.WATCH_HISTORY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error updating watch history:', error);
    }
  },

  removeFromWatchHistory: (movieId: string): void => {
    if (typeof window === 'undefined') return;
    try {
      const history = localStorage.getWatchHistory();
      const updatedHistory = history.filter(movie => movie.id !== movieId);
      window.localStorage.setItem(STORAGE_KEYS.WATCH_HISTORY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error removing from watch history:', error);
    }
  },

  clearWatchHistory: (): void => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(STORAGE_KEYS.WATCH_HISTORY);
  },

  // Utility
  clearAll: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.clearPreferences();
    localStorage.clearWatchHistory();
  }
};
