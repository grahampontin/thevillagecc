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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Header with season navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigateToSeason(currentYear - 1)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 text-gray-700 hover:border-villageGreen hover:text-villageGreen transition"
            aria-label="Previous season"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h1 className="text-2xl sm:text-3xl font-semibold text-villageText">
            Results {currentYear}
          </h1>
          
          <button
            onClick={() => navigateToSeason(currentYear + 1)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 text-gray-700 hover:border-villageGreen hover:text-villageGreen transition"
            aria-label="Next season"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(SKELETON_ITEMS_COUNT)].map((_, index) => (
              <div 
                key={index} 
                className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <p className="text-blue-700">
              No results available for the {currentYear} season.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((result) => {
              const status = getResultStatus(result);
              const opponentName = getOpponentName(result);
              
              return (
                <a
                  key={result.MatchId}
                  href={`/LiveScorecard.aspx?matchId=${result.MatchId}`}
                  className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-villageGreen hover:shadow-sm transition group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                      {/* Date, opponent and status in one line */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-500">
                          <span>{formatDate(result.MatchDate)}</span>
                          <span>·</span>
                          <span>vs {opponentName}</span>
                        </div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                          {status.text}
                        </span>
                      </div>
                      
                      {/* Match details with scores */}
                      <div className="text-base font-semibold text-gray-800">
                        <div className="flex flex-wrap items-baseline gap-x-2">
                          <span>{result.HomeTeamName}</span>
                          {result.HomeTeamScore && (
                            <span className="text-sm font-normal text-gray-600">
                              {result.HomeTeamScore}
                            </span>
                          )}
                          <span className="text-sm font-normal text-gray-500">
                            {result.ResultText}
                          </span>
                          <span>{result.AwayTeamName}</span>
                          {result.AwayTeamScore && (
                            <span className="text-sm font-normal text-gray-600">
                              {result.AwayTeamScore}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Result margin */}
                      {result.ResultMargin && (
                        <div className="text-sm text-gray-600 italic">
                          {result.ResultMargin}
                        </div>
                      )}
                    </div>
                    
                    {/* Arrow icon */}
                    <div className="flex-shrink-0 text-gray-400 group-hover:text-villageGreen transition">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Results;
