import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface MatchReport {
  MatchId: number;
  HomeTeamName: string;
  HomeTeamScore: string;
  AwayTeamName: string;
  AwayTeamScore: string;
  ResultText: string;
  ResultMargin: string;
  MatchDate: string;
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

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const isHomeMatch = (result: MatchReport): boolean => {
    return result.HomeTeamName === 'The Village CC';
  };

  const getResultStatus = (result: MatchReport): { color: string; text: string } => {
    const resultLower = result.ResultText.toLowerCase();
    if (resultLower.includes('won')) {
      return { color: 'bg-emerald-100 text-emerald-700', text: 'Won' };
    } else if (resultLower.includes('lost')) {
      return { color: 'bg-red-100 text-red-700', text: 'Lost' };
    } else {
      return { color: 'bg-gray-100 text-gray-700', text: result.ResultText };
    }
  };

  const getOpponentName = (result: MatchReport): string => {
    return isHomeMatch(result) ? result.AwayTeamName : result.HomeTeamName;
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
              {results.map((result) => {
                const status = getResultStatus(result);
                const opponentName = getOpponentName(result);
                
                return (
                  <a
                    key={result.MatchId}
                    href={`/LiveScorecard.aspx?matchId=${result.MatchId}`}
                    className="block"
                  >
                    <article className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:border-villageGreen transition">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>{formatDate(result.MatchDate)} · vs {opponentName}</span>
                        <span className={`px-2 py-0.5 rounded-full font-semibold text-[11px] ${status.color}`}>
                          {status.text.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-villageText">
                        {result.HomeTeamName}{result.HomeTeamScore ? ` ${result.HomeTeamScore}` : ''} · {result.AwayTeamName}{result.AwayTeamScore ? ` ${result.AwayTeamScore}` : ''}
                      </div>
                      {result.ResultMargin && (
                        <p className="mt-1 text-sm text-gray-600 italic">
                          {result.ResultMargin}
                        </p>
                      )}
                    </article>
                  </a>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Results;
