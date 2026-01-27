import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { getFixturesBySeason } from '../api/fixturesApi';

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
  const [searchParams] = useSearchParams();
  const [fixtures, setFixtures] = useState<FixtureDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get season from query params or use current year
  const currentYear = useMemo(() => {
    const seasonParam = searchParams.get('season');
    return seasonParam ? parseInt(seasonParam) : new Date().getFullYear();
  }, [searchParams]);

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

        const apiMatches = await getFixturesBySeason(currentYear);

        // Map MatchV1 to Match (PascalCase for component usage)
        const matches: Match[] = apiMatches.map(m => ({
          Id: m.id ?? 0,
          Date: m.date ?? '',
          Venue: {
            Id: m.venue?.id ?? 0,
            Name: m.venue?.name ?? '',
          },
          Opposition: {
            Id: m.opposition?.id ?? 0,
            Name: m.opposition?.name ?? '',
          },
          Type: m.type ?? '',
          IsHome: m.isHome ?? false,
        }));

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
      <main>
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <h1 className="text-3xl sm:text-4xl font-semibold text-villageText">Fixtures</h1>
          <p className="mt-2 text-gray-600 text-base">Upcoming matches for the season ahead.</p>

          {/* Loading state */}
          {isLoading ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {[...Array(SKELETON_ITEMS_COUNT)].map((_, index) => (
                <div 
                  key={index} 
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm animate-pulse"
                  role="status"
                  aria-label="Loading fixture"
                >
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : fixtures.length === 0 ? (
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <p className="text-blue-700">
                No fixtures available for the {currentYear} season.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {fixtures.map((fixture) => {
                const opponentName = getOpponentName(fixture);
                
                return (
                  <article
                    key={fixture.Id}
                    className="bg-white border border-gray-200 rounded-lg p-4 pb-12 shadow-sm relative"
                  >
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <span className="text-xs text-gray-500 flex-1 min-w-0 truncate">
                        {formatDate(fixture.MatchDate)} · vs {opponentName}
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded-full font-semibold text-[11px] shrink-0 ${fixture.IsHome ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}
                      >
                        {fixture.IsHome ? 'HOME' : 'AWAY'}
                      </span>
                    </div>

                    <div className="text-sm font-semibold text-villageText">
                      {fixture.HomeTeamName} vs {fixture.AwayTeamName}
                    </div>
                    <p className="mt-1 text-sm text-gray-600 italic">
                      {fixture.VenueName} · {fixture.Type}
                    </p>

                    <a
                      href={generateCalendarUrl(fixture)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-4 right-4 inline-flex items-center justify-center h-8 w-8 rounded-md border border-gray-200 bg-white text-gray-600 shadow-sm hover:border-villageGreen hover:text-villageGreen hover:bg-gray-50 transition"
                      aria-label="Add to calendar"
                      title="Add to calendar"
                    >
                      <span className="material-symbols-outlined text-[20px] leading-none">calendar_add_on</span>
                    </a>
                  </article>
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

export default Fixtures;
