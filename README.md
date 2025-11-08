# Movie Suggestion

Next.js web application that provides personalized movie recommendations using Google Gemini AI based on user preferences and questionnaire responses.

## What It Does

- Collects user preferences through interactive questionnaire
- Uses AI to analyze preferences and suggest movies
- Fetches movie details from OMDB API
- Displays recommendations with movie cards
- Saves recommendation history to localStorage
- Provides surprise movie option

Controls:
- Navigate through questionnaire steps
- Answer preference questions
- View recommendations and movie details
- Access recommendation history

## How It Works

1. **Questionnaire**: Collects user preferences (genres, moods, themes)
2. **AI Analysis**: Sends preferences to Google Gemini for personalized recommendations
3. **Movie Lookup**: Fetches detailed movie information from OMDB API
4. **Display**: Shows movie cards with posters, ratings, and descriptions
5. **History**: Saves recommendations to localStorage for later viewing

## Dependencies

- `next` - React framework
- `@google/generative-ai` - Gemini AI integration
- `lucide-react` - Icons
- `tailwindcss` - Styling
- `typescript` - Type safety
- `OMDB API` - Movie data

## Technical Details

- Framework: Next.js 16 (App Router)
- AI Model: Google Gemini
- External APIs: OMDB API for movie data
- State Management: React hooks + localStorage
- Styling: Tailwind CSS utility classes
