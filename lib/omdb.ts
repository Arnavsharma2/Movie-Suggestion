import { MovieData } from '@/types';

const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;
const OMDB_BASE_URL = 'https://www.omdbapi.com';

export const fetchMovieData = async (title: string, year?: number): Promise<MovieData | null> => {
  if (!OMDB_API_KEY) {
    console.warn('OMDB API key not provided. Movie posters and metadata will not be available.');
    return null;
  }

  try {
    const searchTitle = encodeURIComponent(title);
    const yearParam = year ? `&y=${year}` : '';
    const url = `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&t=${searchTitle}${yearParam}&plot=short`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === 'False') {
      console.warn(`Movie not found: ${title} (${year})`);
      return null;
    }

    return {
      title: data.Title,
      year: parseInt(data.Year),
      genre: data.Genre ? data.Genre.split(', ').map((g: string) => g.trim()) : [],
      plot: data.Plot || 'No description available',
      poster: data.Poster !== 'N/A' ? data.Poster : undefined,
      imdbRating: data.imdbRating !== 'N/A' ? data.imdbRating : undefined,
      rottenTomatoes: data.Ratings?.find((r: any) => r.Source === 'Rotten Tomatoes')?.Value,
      director: data.Director || 'Unknown',
      actors: data.Actors || 'Unknown'
    };
  } catch (error) {
    console.error('Error fetching movie data:', error);
    return null;
  }
};

export const fetchMultipleMovieData = async (recommendations: Array<{title: string, year: number}>): Promise<MovieData[]> => {
  const promises = recommendations.map(rec => fetchMovieData(rec.title, rec.year));
  const results = await Promise.all(promises);
  return results.filter((movie): movie is MovieData => movie !== null);
};
