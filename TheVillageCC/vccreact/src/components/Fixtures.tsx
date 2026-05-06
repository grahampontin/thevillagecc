import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { getFixturesBySeason } from '../api/fixturesApi';

interface FixtureDisplay {
  id: number;
  matchDateString: string;
  matchDate: string; // Original ISO date string
  homeTeamName: string;
  awayTeamName: string;
  venueName: string;
  venueId: number | null;
  oppositionId: number | null;
  oppositionLogoUrl: string | null;
  type: string;
  isHome: boolean;
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
    // Extract the date portion directly to avoid timezone shifts
    const datePart = dateString.split('T')[0];
    if (!datePart || !/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
      console.error(`Invalid date string: ${dateString}`);
      return '';
    }
    return datePart;
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
    return fixture.isHome ? fixture.awayTeamName : fixture.homeTeamName;
  };

  // Helper to generate calendar URL
  const generateCalendarUrl = (fixture: FixtureDisplay): string => {
    const startDate = formatDateForCalendar(fixture.matchDate);
    const title = encodeURIComponent(`${fixture.homeTeamName} vs ${fixture.awayTeamName}`);
    const details = encodeURIComponent(`${fixture.homeTeamName} vs ${fixture.awayTeamName} at ${fixture.venueName}`);
    const location = encodeURIComponent(fixture.venueName);
    
    // Google Calendar URL format
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate.replace(/-/g, '')}T${MATCH_START_TIME}/${startDate.replace(/-/g, '')}T${MATCH_END_TIME}&details=${details}&location=${location}`;
  };

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        setIsLoading(true);

        const matches = await getFixturesBySeason(currentYear);

        // Transform to display format, filtering out invalid dates
        const displayFixtures = matches
          .map(match => {
            const date = new Date(match.date ?? '');
            return { match, date };
          })
          .filter(({ match, date }) => {
            const isValid = !isNaN(date.getTime());
            if (!isValid) {
              console.error(`Skipping fixture with invalid date: ${match.date}`, match);
            }
            return isValid;
          })
          .map(({ match, date }) => ({
            id: match.id ?? 0,
            matchDateString: date.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }),
            matchDate: match.date ?? '',
            homeTeamName: match.isHome ? 'The Village CC' : (match.opposition?.name ?? ''),
            awayTeamName: match.isHome ? (match.opposition?.name ?? '') : 'The Village CC',
            venueName: match.venue?.name ?? '',
            venueId: match.venue?.id ?? null,
            oppositionId: match.opposition?.id ?? null,
            oppositionLogoUrl: match.opposition?.logoUrl ?? null,
            type: match.type ?? '',
            isHome: match.isHome ?? false
          }));

        // Sort ascending by date (earliest / next fixture first)
        displayFixtures.sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime());

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
                     key={fixture.id}
                     className="bg-white border border-gray-200 rounded-lg p-4 pb-12 shadow-sm relative min-w-0 overflow-hidden"
                   >
                     {/* Header row: date and HOME/AWAY badge */}
                     <div className="flex items-center justify-between gap-2 mb-3">
                       <span className="text-xs text-gray-500 truncate">
                         {formatDate(fixture.matchDate)}
                       </span>
                       <span
                         className={`px-2 py-0.5 rounded-full font-semibold text-[11px] shrink-0 ${fixture.isHome ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}
                       >
                         {fixture.isHome ? 'HOME' : 'AWAY'}
                       </span>
                     </div>

                     {/* Teams */}
                     <div className="flex flex-col gap-1.5 mb-2">
                       {/* Village CC row */}
                       <div className="flex items-center gap-2">
                         <img
                           src="/images/vcc_cricle_small.png"
                           alt="The Village CC"
                           className="h-6 w-6 flex-shrink-0 object-contain"
                         />
                         <span className="text-sm font-semibold text-villageText leading-tight">
                           The Village CC
                         </span>
                       </div>

                       {/* Opposition row */}
                       <div className="flex items-center gap-2">
                         {fixture.oppositionLogoUrl ? (
                           <img
                             src={fixture.oppositionLogoUrl}
                             alt={opponentName}
                             className="h-6 w-6 flex-shrink-0 rounded-full object-contain"
                           />
                         ) : (
                           <div className="h-6 w-6 flex-shrink-0 rounded-full border-2 border-gray-300 flex items-center justify-center bg-gray-50">
                             <span className="text-[9px] font-bold text-gray-500 leading-none">
                               {opponentName.substring(0, 2).toUpperCase()}
                             </span>
                           </div>
                         )}
                         <span className="text-sm font-semibold text-villageText leading-tight">
                           {fixture.oppositionId ? (
                             <Link to={`/teams/${fixture.oppositionId}`} className="hover:underline text-villageGreen">
                               {opponentName}
                             </Link>
                           ) : (
                             opponentName
                           )}
                         </span>
                       </div>
                     </div>

                     {/* Venue and type */}
                     <p className="text-xs text-gray-500 italic pr-10">
                       {fixture.venueId ? (
                         <Link to={`/venues/${fixture.venueId}`} className="hover:underline text-villageGreen">
                           {fixture.venueName}
                         </Link>
                       ) : (
                         fixture.venueName
                       )}
                       {fixture.venueName && fixture.type ? ' · ' : ''}{fixture.type}
                     </p>

                     {/* Add to calendar */}
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
