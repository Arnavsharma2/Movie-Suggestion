export interface UserPreferences {
  genres: string[];
  era: string;
  mood: string[];
  contentLevel: string;
  watchTime: string;
  ratingPreference: string;
  scorePreference: string;
}

export interface WatchedMovie {
  id: string;
  title: string;
  year: number;
  rating: number;
  watchedDate: string;
  poster?: string;
}

export interface Recommendation {
  title: string;
  year: number;
  genre: string[];
  description: string;
  reasoning: string;
  poster?: string;
  imdbRating?: string;
  rottenTomatoes?: string;
}

export interface MovieData {
  title: string;
  year: number;
  genre: string[];
  plot: string;
  poster: string;
  imdbRating: string;
  rottenTomatoes?: string;
  director: string;
  actors: string;
}

export interface QuestionnaireStep {
  id: string;
  title: string;
  question: string;
  type: 'multiple' | 'single' | 'rating';
  options: string[];
  required: boolean;
}

export interface GeminiResponse {
  recommendations: Recommendation[];
  surpriseMe?: boolean;
}
