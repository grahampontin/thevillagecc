import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface AwardApiItem {
  Id?: number;
  Year: number;
  Award: string;
  PlayerId?: number;
  PlayerName?: string;
  Data?: string;
}

const SKELETON_ITEMS_COUNT = 6;

const PLAYER_AWARD_KEYS = new Set(['playeroftheyear', 'batsmanoftheyear', 'bowleroftheyear']);
const CORRIDOR_AWARD_KEY = 'corridorofuncertainty';

const humanizeAwardTitle = (raw: string): string => {
  if (!raw) return '';

  // Convert common separators to spaces
  let s = raw.replace(/[_-]+/g, ' ').trim();

  // Split camelCase / PascalCase transitions: "BowlerOfTheYear" -> "Bowler Of The Year"
  s = s
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');

  // Normalise whitespace
  s = s.replace(/\s+/g, ' ').trim();

  // Title-case each word (while leaving small words in lower-case except at start)
  const lowerWords = new Set(['of', 'the', 'and', 'for', 'in', 'on', 'to', 'a']);
  const words = s.split(' ');
  return words
    .map((w, idx) => {
      const lower = w.toLowerCase();
      if (idx !== 0 && lowerWords.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
};

// Replace getAwardValue with a small renderer so we can style Data on a new line.
const AwardValue: React.FC<{ award: AwardApiItem }> = ({ award }) => {
  const player = award.PlayerName?.trim();
  const data = award.Data?.trim();

  const primary = player || data || '—';
  const secondary = player && data ? data : undefined;

  return (
    <>
      <p className="mt-1 text-gray-700">{primary}</p>
      {secondary ? (
        <p className="mt-1 text-sm text-gray-600 italic">{secondary}</p>
      ) : null}
    </>
  );
};

const extractYouTubeVideoId = (url: string): string | undefined => {
  try {
    const u = new URL(url);

    // https://www.youtube.com/embed/VIDEO_ID
    if (u.pathname.startsWith('/embed/')) {
      const id = u.pathname.split('/embed/')[1]?.split('/')[0];
      return id || undefined;
    }

    // https://youtu.be/VIDEO_ID
    if (u.hostname === 'youtu.be') {
      const id = u.pathname.replace('/', '');
      return id || undefined;
    }

    // https://www.youtube.com/watch?v=VIDEO_ID
    const v = u.searchParams.get('v');
    if (v) return v;

    return undefined;
  } catch {
    return undefined;
  }
};

const AWARD_ICON_BY_KEY: Record<string, string> = {
  playeroftheyear: 'emoji_events',
  bowleroftheyear: 'sports_handball',
  batsmanoftheyear: 'sports_cricket',
  fielderoftheyear: 'back_hand',
  corridorofuncertainty: 'video_library',
  clubmanoftheyear: 'toys',
  mostimprovedplayer: 'trending_up',
  captainsplayeroftheyear: 'military_tech',
};

const getAwardIconName = (awardKey: string): string => {
  const key = (awardKey || '').toLowerCase();
  return AWARD_ICON_BY_KEY[key] || 'award_star';
};

const AwardTitle: React.FC<{ awardKey: string; title: string }> = ({ awardKey, title }) => {
  const iconName = getAwardIconName(awardKey);
  return (
    <h3 className="text-sm font-semibold text-villageText flex items-center gap-2">
      <span className="material-symbols-outlined text-[18px] leading-none text-gray-700" aria-hidden="true">
        {iconName}
      </span>
      <span>{title}</span>
    </h3>
  );
};

const CorridorOfUncertaintyCard: React.FC<{ award: AwardApiItem }> = ({ award }) => {
  const title = humanizeAwardTitle(award.Award);
  const winner = award.PlayerName?.trim() || '—';
  const embedUrl = award.Data?.trim();

  if (!embedUrl) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
        <AwardTitle awardKey={award.Award} title={title} />
        <p className="mt-1 text-gray-700">{winner}</p>
      </div>
    );
  }

  const videoId = extractYouTubeVideoId(embedUrl);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : undefined;
  const watchUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : embedUrl;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
      <AwardTitle awardKey={award.Award} title={title} />
      <p className="mt-1 text-gray-700">{winner}</p>

      {thumbnailUrl ? (
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block"
          aria-label="Watch Corridor of Uncertainty video"
          title="Watch video"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-md border border-gray-200 bg-gray-100">
            <img
              src={thumbnailUrl}
              alt="YouTube video thumbnail"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[26px] leading-none text-gray-700">play_arrow</span>
              </div>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600 italic">Click to watch</p>
        </a>
      ) : (
        <p className="mt-3 text-sm text-gray-600 italic">Video link: {watchUrl}</p>
      )}
    </div>
  );
};

const Awards: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [awards, setAwards] = useState<AwardApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentYear = useMemo(() => {
    const seasonParam = searchParams.get('season');
    return seasonParam ? parseInt(seasonParam) : new Date().getFullYear();
  }, [searchParams]);

  const navigateToSeason = (year: number) => {
    setSearchParams({ season: year.toString() });
  };

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/awards?season=${currentYear}`);
        if (!response.ok) {
          throw new Error('Failed to fetch awards');
        }
        const data: AwardApiItem[] = await response.json();
        // Stable ordering for rendering
        data.sort((a, b) => (a.Award || '').localeCompare(b.Award || ''));
        setAwards(data);
      } catch (error) {
        console.error('Error fetching awards:', error);
        setAwards([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAwards();
  }, [currentYear]);

  const playerAwards = useMemo(
    () => awards.filter(a => PLAYER_AWARD_KEYS.has((a.Award || '').toLowerCase())),
    [awards]
  );

  const corridorAward = useMemo(
    () => awards.find(a => (a.Award || '').toLowerCase() === CORRIDOR_AWARD_KEY),
    [awards]
  );

  const clubAwards = useMemo(
    () => awards.filter(a => {
      const key = (a.Award || '').toLowerCase();
      return !PLAYER_AWARD_KEYS.has(key) && key !== CORRIDOR_AWARD_KEY;
    }),
    [awards]
  );

  return (
    <div className="font-sans text-villageText bg-gray-50 min-h-screen">
      <Header />
      <main>
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <h1 className="text-3xl sm:text-4xl font-semibold text-villageText">Awards</h1>
          <p className="mt-2 text-gray-600 text-base">Celebrating excellence, effort, and the occasional fluke.</p>

          {/* Season Navigation (match Results page style) */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => navigateToSeason(currentYear - 1)}
              className="text-sm font-medium text-villageGreen hover:underline"
            >
              ← Previous season
            </button>
            <span className="text-sm text-gray-500">{currentYear} Awards</span>
            <button
              onClick={() => navigateToSeason(currentYear + 1)}
              className="text-sm font-medium text-villageGreen hover:underline"
            >
              Next season →
            </button>
          </div>

          {isLoading ? (
            <div className="mt-8 grid gap-6 md:grid-cols-3 sm:grid-cols-2">
              {[...Array(SKELETON_ITEMS_COUNT)].map((_, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : awards.length === 0 ? (
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <p className="text-blue-700">No awards available for the {currentYear} season.</p>
            </div>
          ) : (
            <>
              {/* Player Awards */}
              <section className="mt-10">
                <h2 className="text-2xl font-semibold text-villageText">Player Awards</h2>
                <p className="mt-1 text-gray-600 text-sm">The big ones — the glory, the prestige, the bragging rights.</p>

                {playerAwards.length === 0 ? (
                  <p className="mt-6 text-gray-600 text-sm">—</p>
                ) : (
                  <div className="mt-6 grid gap-6 md:grid-cols-3 sm:grid-cols-2">
                    {playerAwards.map((award) => (
                      <div key={award.Id ?? `${award.Year}-${award.Award}`} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                        <AwardTitle awardKey={award.Award} title={humanizeAwardTitle(award.Award)} />
                        <AwardValue award={award} />
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Club Awards */}
              <section className="mt-12">
                <h2 className="text-2xl font-semibold text-villageText">Club Awards</h2>
                <p className="mt-1 text-gray-600 text-sm">For contributions on and off the field.</p>

                {clubAwards.length === 0 ? (
                  <p className="mt-6 text-gray-600 text-sm">—</p>
                ) : (
                  <div className="mt-6 grid gap-6 md:grid-cols-3 sm:grid-cols-2">
                    {clubAwards.map((award) => (
                      <div key={award.Id ?? `${award.Year}-${award.Award}`} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                        <AwardTitle awardKey={award.Award} title={humanizeAwardTitle(award.Award)} />
                        <AwardValue award={award} />
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Corridor of Uncertainty */}
              {corridorAward ? (
                <section className="mt-12">
                  <h2 className="text-2xl font-semibold text-villageText">Corridor of Uncertainty</h2>
                  <p className="mt-1 text-gray-600 text-sm">A special mention for the finest moment of hesitation.</p>

                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <CorridorOfUncertaintyCard award={corridorAward} />
                  </div>
                </section>
              ) : null}
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Awards;
