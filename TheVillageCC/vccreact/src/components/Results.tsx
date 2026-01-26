import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ResultCard, { MatchResult } from './ResultCard';

interface MatchReport extends MatchResult {
  Conditions: string;
  Report: string;
  ReportImage: string;
}

const SKELETON_ITEMS_COUNT = 5;

const Results: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<MatchReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get season from query params or use current year - calculate immediately and memoize
  const currentYear = useMemo(() => {
    const seasonParam = searchParams.get('season');
    return seasonParam ? parseInt(seasonParam) : new Date().getFullYear();
  }, [searchParams]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setIsLoading(true);

        // Fetch results from the dedicated results endpoint with season parameter
        const response = await fetch(`/api/results?season=${currentYear}`);
        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }

        const seasonResults: MatchReport[] = await response.json();

        // Sort by date descending (most recent first)
        seasonResults.sort((a, b) => new Date(b.MatchDate).getTime() - new Date(a.MatchDate).getTime());

        setResults(seasonResults);
      } catch (error) {
        console.error('Error fetching results:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [currentYear]);

  const navigateToSeason = (year: number) => {
    setSearchParams({ season: year.toString() });
  };

  return (
    <div className="font-sans text-villageText bg-gray-50 min-h-screen">
      <Header />
      <main>
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <h1 className="text-3xl sm:text-4xl font-semibold text-villageText">Results</h1>
          <p className="mt-2 text-gray-600 text-base">The highs, the lows, and the occasional miracle.</p>

          {/* Season Navigation */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => navigateToSeason(currentYear - 1)}
              className="text-sm font-medium text-villageGreen hover:underline"
            >
              ← Previous season
            </button>
            <span className="text-sm text-gray-500">{currentYear} Season</span>
            <button
              onClick={() => navigateToSeason(currentYear + 1)}
              className="text-sm font-medium text-villageGreen hover:underline"
            >
              Next season →
            </button>
          </div>

          {/* Loading state */}
          {isLoading ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {[...Array(SKELETON_ITEMS_COUNT)].map((_, index) => (
                <div 
                  key={index} 
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <p className="text-blue-700">
                No results available for the {currentYear} season.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {results.map((result) => (
                <ResultCard key={result.MatchId} result={result} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Results;
