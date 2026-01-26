import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LeadingPlayer {
  playerId: number;
  playerName: string;
  value: number;
}

interface LeadingPlayerCategory {
  category: string;
  players: LeadingPlayer[];
}

// Map category names to Material Icons
const getCategoryIcon = (category: string): string => {
  const normalizedCategory = category.toLowerCase();
  
  if (normalizedCategory.includes('run')) return 'sports_cricket';
  if (normalizedCategory.includes('wicket')) return 'sports_baseball';
  if (normalizedCategory.includes('catch')) return 'back_hand';
  if (normalizedCategory.includes('appearance')) return 'calendar_month';
  
  // Default icon for unknown categories
  return 'emoji_events';
};

const About: React.FC = () => {
  const [leadingPlayers, setLeadingPlayers] = useState<LeadingPlayerCategory[]>([]);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState<boolean>(true);
  const [playersError, setPlayersError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeadingPlayers = async () => {
      try {
        setIsLoadingPlayers(true);
        const response = await fetch('/api/Stats/leadingplayers');
        if (!response.ok) {
          throw new Error('Failed to fetch leading players');
        }
        const data: LeadingPlayerCategory[] = await response.json();
        setLeadingPlayers(data);
        setPlayersError(null);
      } catch (err) {
        console.error('Error fetching leading players:', err);
        setPlayersError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoadingPlayers(false);
      }
    };

    fetchLeadingPlayers();
  }, []);
  return (
    <>
      <Header />
      <main>
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {/* Page Title */}
          <h1 className="text-3xl sm:text-4xl font-semibold text-villageText">About the Club</h1>
          <p className="mt-2 text-gray-600 text-base">
            A wandering cricket club with a talent for enthusiasm, chaos, and the occasional moment of brilliance.
          </p>

          {/* Club Stats */}
          <section className="mt-8 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Club Stats</h2>

            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div>
                Formed: <strong>Feb 2004</strong>
              </div>
              <div>
                Home Ground: <strong>Parliament Hill</strong>
              </div>
              <div>
                Capacity: <strong>250,000 (standing); 5 (seated)</strong>
              </div>
            </div>
          </section>

          {/* History */}
          <section className="mt-10 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">History</h2>

            <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
              <p>
                The Village Cricket Club is a small nomadic club with its roots in North East London and players spread across London and surrounding areas. After one bizarre meeting in Stamford Hill's Birdcage, we were formed in 2004 by a bunch of singularly talentless but over enthusiastic cricketers who decided that they wanted to continue to entertain non-existent crowds beyond the end of their university days.
              </p>
              <p>
                Its first competitive foray was initial enrollment in NELC League exalting it's status for the first few seasons and then instinctive transition into the world of friendly Cricket across London and invitational relationships outside of it, playing games either Saturday or Sunday every weekend for most of the summer from April to September.
              </p>
              <p>
                Since its inception, much has changed. The social and cultural fabric of the club has grown, diversified and integrated with members from Australia, New Zealand, India, Pakistan, Nepal, Canada, Oman, Netherlands, Greece and of course, from all over the UK. Our second generation is starting to come through with contributions both in and out of the field of play.
              </p>
              <p>
                We play most of our matches in central London but we also make yearly trips to Oxford, Maidenhead and the West Country through some of the relationships we have built over the last 20 years. Every two years, we strive to take an International tour. We've visited Corfu, Malta, Amsterdam, Montenegro, Croatia, Porto and the 2026 tour is already under planning stages.
              </p>
              <p>
                We are always on the lookout for new members of any ability from anywhere. Enthusiasm for the game and an inclination to bond with our club and members is our only selection criteria.
              </p>
              <p>
                Email us and find out more on how our mutual cricketing journey can start and build.
              </p>
            </div>
          </section>

          {/* Leading Players */}
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Leading Players</h2>

            {isLoadingPlayers ? (
              <div className="grid gap-6 md:grid-cols-4 sm:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : playersError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-700">Failed to load leading players: {playersError}</p>
              </div>
            ) : leadingPlayers.length === 0 ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <p className="text-blue-700">No leading players data available.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-4 sm:grid-cols-2">
                {leadingPlayers.map((category) => {
                  const iconName = getCategoryIcon(category.category);
                  const player = category.players[0]; // Get the top player

                  return (
                    <div key={category.category} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                      <h3 className="text-sm font-semibold text-villageText flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] leading-none text-gray-700" aria-hidden="true">
                          {iconName}
                        </span>
                        <span>{category.category}</span>
                      </h3>
                      {player ? (
                        <>
                          <p className="mt-1 text-gray-700">{player.playerName}</p>
                          <p className="mt-1 text-sm text-gray-600">{player.value.toLocaleString()}</p>
                        </>
                      ) : (
                        <p className="mt-1 text-gray-700">—</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default About;
