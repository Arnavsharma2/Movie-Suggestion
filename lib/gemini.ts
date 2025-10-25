import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserPreferences, WatchedMovie, Recommendation, GeminiResponse } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export const generateRecommendations = async (
  preferences: UserPreferences,
  watchHistory: WatchedMovie[],
  surpriseMe: boolean = false
): Promise<Recommendation[]> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = buildPrompt(preferences, watchHistory, surpriseMe);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the response text to extract JSON
    let jsonText = text.trim();
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    // Try to find JSON object in the response
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    // Parse the JSON response
    const parsedResponse: GeminiResponse = JSON.parse(jsonText);
    return parsedResponse.recommendations || [];
  } catch (error) {
    console.error('Error generating recommendations:', error);
    throw new Error('Failed to generate recommendations. Please try again.');
  }
};

const buildPrompt = (
  preferences: UserPreferences,
  watchHistory: WatchedMovie[],
  surpriseMe: boolean
): string => {
  const watchHistoryText = watchHistory.length > 0 
    ? `\n\nWatch History (with ratings):\n${watchHistory.map(movie => 
        `- ${movie.title} (${movie.year}) - Rating: ${movie.rating}/10`
      ).join('\n')}`
    : '\n\nNo watch history available.';

  const surpriseMeText = surpriseMe 
    ? '\n\nIMPORTANT: The user wants to be surprised! Ignore some of their preferences and suggest unexpected but great movies that might expand their horizons.'
    : '';

  return `You are an expert movie recommendation AI. Based on the user's preferences and watch history, suggest 8-10 movies that match their taste.

User Preferences:
- Favorite Genres: ${preferences.genres.join(', ')}
- Preferred Era: ${preferences.era}
- Mood/Tone: ${preferences.mood.join(', ')}
- Content Level: ${preferences.contentLevel}
- Watch Time: ${preferences.watchTime}
- Rating Preference: ${preferences.ratingPreference}
- Score Preference: ${preferences.scorePreference}${watchHistoryText}${surpriseMeText}

Please respond with a JSON object in this exact format:
{
  "recommendations": [
    {
      "title": "Movie Title",
      "year": 2023,
      "genre": ["Action", "Thriller"],
      "description": "Brief plot description (2-3 sentences)",
      "reasoning": "Why this movie matches their preferences (1-2 sentences)"
    }
  ]
}

Guidelines:
- Include a mix of well-known and hidden gems
- Consider the user's rating preferences (highly-rated vs hidden gems)
- Balance their genre preferences with their mood and content preferences
- If they have watch history, consider patterns in their ratings
- For surprise recommendations, suggest movies that are excellent but might not perfectly match their stated preferences
- Ensure all movies are real and available
- Provide diverse recommendations within their preferences
- Make reasoning specific and helpful

Return only the JSON object, no additional text.`;
};
