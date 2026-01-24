import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface Venue {
  Id: number;
  Name: string;
}

interface Team {
  Id: number;
  Name: string;
}

interface Match {
  Id: number;
  Date: string;
  Venue: Venue;
  Opposition: Team;
  Type: string;
  IsHome: boolean;
}

interface FixtureDisplay {
  Id: number;
  MatchDateString: string;
  MatchDate: string; // Original ISO date string
  HomeTeamName: string;
  AwayTeamName: string;
  VenueName: string;
  Type: string;
  IsHome: boolean;
}

const SKELETON_ITEMS_COUNT = 5;

// Default match times for calendar entries
// Cricket matches typically start at noon and can run until late evening
const MATCH_START_TIME = '120000'; // 12:00 PM
const MATCH_END_TIME = '230000';   // 11:00 PM

const Fixtures: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [fixtures, setFixtures] = useState<FixtureDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get season from query params or use current year
  const currentYear = useMemo(() => {
    const seasonParam = searchParams.get('season');
    return seasonParam ? parseInt(seasonParam) : new Date().getFullYear();
  }, [searchParams]);

  const navigateToSeason = (year: number) => {
    setSearchParams({ season: year.toString() });
  };

  // Helper function to format date for calendar
  const formatDateForCalendar = (dateString: string): string => {
    const date = new Date(dateString);
    // Check if date is valid before calling toISOString
    if (isNaN(date.getTime())) {
      console.error(`Invalid date string: ${dateString}`);
      return '';
    }
    return date.toISOString().split('T')[0];
  };

  // Helper function to format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Helper to get opponent name
  const getOpponentName = (fixture: FixtureDisplay): string => {
    return fixture.IsHome ? fixture.AwayTeamName : fixture.HomeTeamName;
  };

  // Helper to generate calendar URL
  const generateCalendarUrl = (fixture: FixtureDisplay): string => {
    const startDate = formatDateForCalendar(fixture.MatchDate);
    const title = encodeURIComponent(`${fixture.HomeTeamName} vs ${fixture.AwayTeamName}`);
    const details = encodeURIComponent(`${fixture.HomeTeamName} vs ${fixture.AwayTeamName} at ${fixture.VenueName}`);
    const location = encodeURIComponent(fixture.VenueName);
    
    // Google Calendar URL format
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate.replace(/-/g, '')}T${MATCH_START_TIME}/${startDate.replace(/-/g, '')}T${MATCH_END_TIME}&details=${details}&location=${location}`;
  };

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(`/api/fixtures?season=${currentYear}`);
        if (!response.ok) {
          throw new Error('Failed to fetch fixtures');
        }

        const matches: Match[] = await response.json();

        // Transform to display format, filtering out invalid dates
        const displayFixtures = matches
          .map(match => {
            const date = new Date(match.Date);
            return { match, date };
          })
          .filter(({ match, date }) => {
            const isValid = !isNaN(date.getTime());
            if (!isValid) {
              console.error(`Skipping fixture with invalid date: ${match.Date}`, match);
            }
            return isValid;
          })
          .map(({ match, date }) => ({
            Id: match.Id,
            MatchDateString: date.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }),
            MatchDate: match.Date,
            HomeTeamName: match.IsHome ? 'The Village CC' : match.Opposition.Name,
            AwayTeamName: match.IsHome ? match.Opposition.Name : 'The Village CC',
            VenueName: match.Venue.Name,
            Type: match.Type,
            IsHome: match.IsHome
          }));

        setFixtures(displayFixtures);
      } catch (error) {
        console.error('Error fetching fixtures:', error);
        setFixtures([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFixtures();
  }, [currentYear]);

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
            Fixtures {currentYear}
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
        ) : fixtures.length === 0 ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <p className="text-blue-700">
              No fixtures available for the {currentYear} season.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {fixtures.map((fixture) => {
              const opponentName = getOpponentName(fixture);
              
              return (
                <article
                  key={fixture.Id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:border-villageGreen hover:shadow-sm transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                      {/* Date, opponent and badge in one line */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-500">
                          <span>{formatDate(fixture.MatchDate)}</span>
                          <span>·</span>
                          <span>vs {opponentName}</span>
                        </div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${fixture.IsHome ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                          {fixture.IsHome ? 'Home' : 'Away'}
                        </span>
                      </div>
                      
                      {/* Match details */}
                      <div className="text-base font-semibold text-gray-800">
                        {fixture.HomeTeamName} vs {fixture.AwayTeamName}
                      </div>
                      
                      {/* Venue and type */}
                      <div className="text-sm text-gray-600">
                        at {fixture.VenueName} · {fixture.Type}
                      </div>
                    </div>
                    
                    {/* Calendar icon */}
                    <div className="flex-shrink-0">
                      <a
                        href={generateCalendarUrl(fixture)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 text-gray-700 hover:border-villageGreen hover:text-villageGreen transition"
                        aria-label="Add to calendar"
                        title="Add to calendar"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Fixtures;
