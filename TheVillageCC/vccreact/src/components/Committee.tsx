import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { getAllPlayers } from '../api/playersApi';
import { getAllCommitteePosts } from '../api/committeeApi';
import { getPlayerDetail } from '../api/statsApi';

interface CommitteeDisplay {
  post: string;
  playerName: string;
  playerImageUrl: string | null;
}

const SKELETON_COUNT = 6;

const POST_ORDER: Record<string, number> = {
  Captain: 0,
  ViceCaptain: 1,
  Treasurer: 2,
  FixturesSecretary: 3,
  SocialSecretary: 4,
  DirectorOfCricket: 5,
  TourSecretary: 6,
  Webmaster: 7,
};

const POST_ICON: Record<string, string> = {
  Captain: 'military_tech',
  ViceCaptain: 'military_tech',
  Treasurer: 'account_balance',
  FixturesSecretary: 'event',
  SocialSecretary: 'celebration',
  DirectorOfCricket: 'sports_cricket',
  TourSecretary: 'travel_explore',
  Webmaster: 'code',
};

const humanizePost = (raw: string): string => {
  if (!raw) return '';
  // Split PascalCase: "ViceCaptain" → "Vice Captain"
  return raw
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    .trim();
};

interface DocumentLink {
  label: string;
  href: string;
}

interface DocumentGroup {
  heading: string;
  icon: string;
  links: DocumentLink[];
}

const DOCUMENT_GROUPS: DocumentGroup[] = [
  {
    heading: 'Constitution',
    icon: 'gavel',
    links: [
      { label: 'Club Constitution (Sept 2006)', href: './documents/constitutionSEPT2006.pdf' },
    ],
  },
  {
    heading: 'AGMs',
    icon: 'groups',
    links: [
      { label: 'IGM – 05/02/2004', href: './documents/IGM_5_2_2004.doc' },
      { label: '1st AGM – 29/01/2005', href: './documents/AGM_29_1_2005.doc' },
      { label: '2nd AGM – 12/10/2005', href: './documents/AGM_12_10_2005.doc' },
      { label: '3rd AGM – 30/09/2006', href: './documents/AGM2006.pdf' },
      { label: '4th AGM – 17/11/2007', href: './documents/AGM2007.pdf' },
      { label: '11th AGM & 10‑year gala dinner – 03/12/2014', href: './documents/Review of the 2014 VCC season - FINAL.pptx' },
      { label: '12th AGM – 14/11/2015', href: './documents/Review%20of%20the%202015%20VCC%20season.pptx' },
    ],
  },
  {
    heading: 'Minutes',
    icon: 'description',
    links: [
      { label: '08/04/2004', href: './documents/Minutes_18_4_2004.rtf' },
      { label: '15/01/2006', href: './documents/Minutes_15_1_2006.doc' },
      { label: '18/10/2007 – the infamous pre‑AGM meeting', href: './documents/endofseason2007mins_B.pdf' },
      { label: '22/02/2018', href: './documents/Minutes_22_2_2018.docx' },
    ],
  },
];

const Committee: React.FC = () => {
  const [committeePosts, setCommitteePosts] = useState<CommitteeDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCommitteeData = async () => {
      try {
        setIsLoading(true);

        const [players, allCommittee] = await Promise.all([
          getAllPlayers(),
          getAllCommitteePosts()
        ]);

        if (allCommittee.length === 0) {
          setCommitteePosts([]);
          return;
        }

        // Create player lookup
        const playerMap = new Map(players.map(p => [p.playerId ?? 0, `${p.firstName ?? ''} ${p.surname ?? ''}`.trim()]));

        // Get most recent year
        const mostRecentYear = Math.max(...allCommittee.map(c => c.year ?? 0));
        const postsForMostRecentYear = allCommittee.filter(c => c.year === mostRecentYear);

        const sortedPosts = postsForMostRecentYear
          .sort((a, b) => (POST_ORDER[a.post ?? ''] ?? 999) - (POST_ORDER[b.post ?? ''] ?? 999));

        // Fetch player image URLs in parallel, same approach as PlayerDetail page
        const imageResults = await Promise.all(
          sortedPosts.map(c =>
            getPlayerDetail(c.playerId ?? 0)
              .then(d => d.playerImageUrl ?? null)
              .catch(() => null)
          )
        );

        const displayPosts = sortedPosts.map((c, i) => ({
          post: c.post ?? '',
          playerName: playerMap.get(c.playerId ?? 0) || 'Unknown',
          playerImageUrl: imageResults[i],
        }));

        setCommitteePosts(displayPosts);
      } catch (error) {
        console.error('Error fetching committee data:', error);
        setCommitteePosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommitteeData();
  }, []);

  return (
    <div className="font-sans text-villageText bg-gray-50 min-h-screen">
      <Header />
      <main>
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <h1 className="text-3xl sm:text-4xl font-semibold text-villageText">The Committee</h1>
          <p className="mt-2 text-gray-600 text-base">The people who keep the wheels turning — mostly.</p>

          {/* Committee member cards */}
          {isLoading ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[...Array(SKELETON_COUNT)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm animate-pulse" aria-label="Loading committee member">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          ) : committeePosts.length === 0 ? (
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <p className="text-blue-700">No committee information available.</p>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {committeePosts.map((post, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-100 bg-gray-100 mb-4 flex-shrink-0">
                    {post.playerImageUrl ? (
                      <img
                        src={post.playerImageUrl}
                        alt={post.playerName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 justify-center mb-1">
                    <span className="material-symbols-outlined text-[16px] leading-none text-villageGreen" aria-hidden="true">
                      {POST_ICON[post.post] ?? 'person'}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-villageGreen">
                      {humanizePost(post.post)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-villageText">{post.playerName}</p>
                </div>
              ))}
            </div>
          )}

          {/* Documents section */}
          <section className="mt-14">
            <h2 className="text-2xl font-semibold text-villageText">Documents &amp; Minutes</h2>
            <p className="mt-1 text-gray-600 text-sm">Official club documents, AGM records and meeting minutes.</p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {DOCUMENT_GROUPS.map((group) => (
                <div key={group.heading} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-villageText flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-[18px] leading-none text-gray-600" aria-hidden="true">
                      {group.icon}
                    </span>
                    {group.heading}
                  </h3>
                  <ul className="space-y-2">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          className="flex items-start gap-1.5 text-sm text-villageGreen hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="material-symbols-outlined text-[14px] leading-5 flex-shrink-0" aria-hidden="true">
                            open_in_new
                          </span>
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Committee;
