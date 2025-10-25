import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CineMatch - AI-Powered Movie Discovery',
  description: 'Discover your next favorite movie with personalized recommendations powered by Google Gemini AI. Answer a few questions and get curated suggestions that match your taste perfectly.',
  keywords: 'movie recommendations, AI, personalized suggestions, cinema, films, entertainment',
  authors: [{ name: 'CineMatch Team' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased">
        <div className="min-h-screen bg-dark-900 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900"></div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
            <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl animate-float" style={{animationDelay: '6s'}}></div>
          </div>
          {children}
        </div>
      </body>
    </html>
  )
}
