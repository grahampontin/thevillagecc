import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { getResultBadge } from '../utils/matchResultUtils';

interface ResultV1 {
  matchId: number;
  homeTeamName?: string | null;
  homeTeamScore?: string | null;
  awayTeamName?: string | null;
  awayTeamScore?: string | null;
  resultText?: string | null;
  resultMargin?: string | null;
  matchDate?: string | null;
  // NOTE: venue is not in cricketclub.json ResultV1, but some deployments include it.
  venue?: string | null;
  venueName?: string | null;
  VenueName?: string | null;
  winningTeam?: string | null;
  losingTeam?: string | null;
  theirOversFaced?: number;
  theirWickets?: number;
  theirScore?: number;
  ourOversFaced?: number;
  ourWickets?: number;
  ourScore?: number;
  margin?: string | null;
  matchReportConditions?: string | null;
  matchReportText?: string | null;
  matchReportImage?: string | null;
  isWinner?: boolean | null;
  isTied: boolean;
  isDrawn: boolean;
  isAbandoned: boolean;
}

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
  isWinner: boolean | null;
  isTied: boolean;
  isDrawn: boolean;
  isAbandoned: boolean;

  // Extra fields for richer rendering
  WinningTeam: string;
  LosingTeam: string;
  OurScore: number | null;
  OurWickets: number | null;
  TheirScore: number | null;
  TheirWickets: number | null;
  VenueName: string;
}

const mapResultV1ToMatchReport = (r: ResultV1): MatchReport => ({
  MatchId: r.matchId,
  HomeTeamName: r.homeTeamName ?? '',
  HomeTeamScore: r.homeTeamScore ?? '',
  AwayTeamName: r.awayTeamName ?? '',
  AwayTeamScore: r.awayTeamScore ?? '',
  ResultText: r.resultText ?? '',
  ResultMargin: r.resultMargin ?? r.margin ?? '',
  MatchDate: r.matchDate ?? '',
  Conditions: r.matchReportConditions ?? '',
  Report: r.matchReportText ?? '',
  ReportImage: r.matchReportImage ?? '',
  isWinner: r.isWinner ?? null,
  isTied: r.isTied,
  isDrawn: r.isDrawn,
  isAbandoned: r.isAbandoned,

  WinningTeam: r.winningTeam ?? '',
  LosingTeam: r.losingTeam ?? '',
  OurScore: typeof r.ourScore === 'number' ? r.ourScore : null,
  OurWickets: typeof r.ourWickets === 'number' ? r.ourWickets : null,
  TheirScore: typeof r.theirScore === 'number' ? r.theirScore : null,
  TheirWickets: typeof r.theirWickets === 'number' ? r.theirWickets : null,
  VenueName: (r.venueName ?? r.venue ?? (r as any).VenueName ?? ''),
});

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
        const response = await fetch(`/api/Results?season=${currentYear}`);
        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }

        const seasonResultsApi: ResultV1[] = await response.json();
        const seasonResults: MatchReport[] = seasonResultsApi.map(mapResultV1ToMatchReport);

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

  const formatInnings = (teamName: string, score?: number | null, wickets?: number | null, scoreString?: string): string => {
    // Prefer numeric score/wickets if present
    if (typeof score === 'number' && typeof wickets === 'number') {
      return `${teamName} ${score} for ${wickets}`;
    }

    // Fall back to the API string (often like "162-7")
    const s = (scoreString || '').trim();
    if (s) {
      // Try to convert "162-7" => "162 for 7"
      const m = s.match(/^\s*(\d+)\s*[-–]\s*(\d+)\s*$/);
      if (m) return `${teamName} ${m[1]} for ${m[2]}`;
      return `${teamName} ${s}`;
    }

    return teamName;
  };

  const getScorelineText = (result: MatchReport): string => {
    const homeText = formatInnings(result.HomeTeamName, null, null, result.HomeTeamScore);
    const awayText = formatInnings(result.AwayTeamName, null, null, result.AwayTeamScore);

    // Neutral outcomes
    if (result.isAbandoned || result.isTied || result.isDrawn) {
      return `${homeText} vs ${awayText}`;
    }

    // Determine if home team won.
    // Prefer explicit winning/losing team names from API.
    let homeWon: boolean | null = null;
    if (result.WinningTeam && result.LosingTeam) {
      if (result.WinningTeam === result.HomeTeamName) homeWon = true;
      else if (result.WinningTeam === result.AwayTeamName) homeWon = false;
    }

    // Fallback to isWinner (Village perspective)
    if (homeWon === null) {
      if (result.isWinner === null) {
        homeWon = null;
      } else {
        const villageIsHome = result.HomeTeamName === 'The Village CC';
        // If Village is home, isWinner reflects home result; otherwise invert.
        homeWon = villageIsHome ? result.isWinner : !result.isWinner;
      }
    }

    if (homeWon === true) return `${homeText} beat ${awayText}`;
    if (homeWon === false) return `${homeText} lost to ${awayText}`;
    return `${homeText} vs ${awayText}`;
  };

  const getVenueText = (result: MatchReport): string => {
    if (result.VenueName) return result.VenueName;

    // Sometimes resultMargin includes "... at Venue" in legacy systems.
    const m = (result.ResultMargin || '').match(/\s+at\s+(.+)$/i);
    if (m && m[1]) return m[1].trim();

    return 'TBC';
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
                const status = getResultBadge(result);

                return (
                  <a
                    key={result.MatchId}
                    href={`/LiveScorecard.aspx?matchId=${result.MatchId}`}
                    className="block"
                  >
                    <article className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:border-villageGreen transition">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>{formatDate(result.MatchDate)} · {getVenueText(result)}</span>
                        <span className={`px-2 py-0.5 rounded-full font-semibold text-[11px] ${status.color}`}>
                          {status.text.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-villageText">
                        {getScorelineText(result)}
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
