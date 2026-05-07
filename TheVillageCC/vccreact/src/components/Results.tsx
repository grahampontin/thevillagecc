import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { getResultBadge } from '../utils/matchResultUtils';
import { getResultsBySeason } from '../api/resultsApi';
import { ResultV1 } from '../api/swaggerTypes';

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
  VenueId: number | null;
  OppositionId: number | null;
  OppositionLogoUrl: string | null;
}

const mapResultV1ToMatchReport = (r: ResultV1): MatchReport => ({
  MatchId: r.matchId ?? 0,
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
  isTied: r.isTied ?? false,
  isDrawn: r.isDrawn ?? false,
  isAbandoned: r.isAbandoned ?? false,

  WinningTeam: r.winningTeam ?? '',
  LosingTeam: r.losingTeam ?? '',
  OurScore: r.ourScore ?? null,
  OurWickets: r.ourWickets ?? null,
  TheirScore: r.theirScore ?? null,
  TheirWickets: r.theirWickets ?? null,
  // Handle potential venueName variations (backend inconsistency)
  VenueName: r.venueName ?? (r as any).venue ?? (r as any).VenueName ?? '',
  VenueId: r.venueId ?? null,
  OppositionId: r.oppositionId ?? null,
  OppositionLogoUrl: r.oppositionLogoUrl ?? null,
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

        // Use centralized API to fetch results by season
        const seasonResultsApi = await getResultsBySeason(currentYear);
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

  const getVenueText = (result: MatchReport): string => {
    if (result.VenueName) return result.VenueName;
    const m = (result.ResultMargin || '').match(/\s+at\s+(.+)$/i);
    if (m && m[1]) return m[1].trim();
    return '';
  };

  const getOppositionLogoForTeam = (result: MatchReport, teamName: string): string | null => {
    if (teamName === 'The Village CC') return null;
    return result.OppositionLogoUrl;
  };

  const getResultLine = (result: MatchReport): string => {
    if (result.isAbandoned) return 'Match abandoned';
    if (result.isTied) return 'Match tied';
    if (result.isDrawn) return 'Match drawn';
    if (result.WinningTeam && result.LosingTeam) {
      const margin = result.ResultMargin ? ` ${result.ResultMargin}` : '';
      return `${result.WinningTeam} beat ${result.LosingTeam}${margin}`;
    }
    return result.ResultText || '';
  };

  const renderTeamRow = (teamName: string, score: string, logoUrl: string | null) => (
    <div className="flex items-center gap-2">
      {teamName === 'The Village CC' ? (
        <img
          src="/images/vcc_cricle_small.png"
          alt="The Village CC"
          className="h-6 w-6 flex-shrink-0 object-contain"
        />
      ) : logoUrl ? (
        <img
          src={logoUrl}
          alt={teamName}
          className="h-6 w-6 flex-shrink-0 rounded-full object-contain"
        />
      ) : (
        <div className="h-6 w-6 flex-shrink-0 rounded-full border-2 border-gray-300 flex items-center justify-center bg-gray-50">
          <span className="text-[9px] font-bold text-gray-500 leading-none">
            {teamName.substring(0, 2).toUpperCase()}
          </span>
        </div>
      )}
      <span className="text-sm font-semibold text-villageText leading-tight flex-1 truncate">
        {teamName}
      </span>
      {score && (
        <span className="text-sm font-semibold text-villageText leading-tight ml-2 shrink-0">
          {score}
        </span>
      )}
    </div>
  );

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
                const venueText = getVenueText(result);

                return (
                  <a
                    key={result.MatchId}
                    href={`/scorecard/${result.MatchId}`}
                    className="block"
                  >
                    <article className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:border-villageGreen transition">
                      {/* Header row: date + result badge */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs text-gray-500 truncate">
                          {formatDate(result.MatchDate)}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full font-semibold text-[11px] shrink-0 ${status.color}`}>
                          {status.text.toUpperCase()}
                        </span>
                      </div>

                      {/* Team rows with scores */}
                      <div className="flex flex-col gap-1.5 mb-3">
                        {renderTeamRow(
                          result.HomeTeamName,
                          result.HomeTeamScore,
                          getOppositionLogoForTeam(result, result.HomeTeamName),
                        )}
                        {renderTeamRow(
                          result.AwayTeamName,
                          result.AwayTeamScore,
                          getOppositionLogoForTeam(result, result.AwayTeamName),
                        )}
                      </div>

                      {/* Result line */}
                      {getResultLine(result) && (
                        <p className="text-xs text-gray-600 mb-1">{getResultLine(result)}</p>
                      )}

                      {/* Venue */}
                      {venueText && (
                        <p className="text-xs text-gray-500">at {venueText}</p>
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
