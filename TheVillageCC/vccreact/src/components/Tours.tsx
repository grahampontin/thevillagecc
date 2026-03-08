import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface TourMatch {
  matchId: number;
  date: string;
  opposition: string;
  venue: string;
  ourScore: string;
  theirScore: string;
  result: string;
  won: boolean;
}

interface Tour {
  id: string;
  title: string;
  year: number;
  dates: string;
  location: string;
  summary: React.ReactNode;
  matches: TourMatch[];
  reportMatchId?: number;
}

const TOURS: Tour[] = [
  {
    id: 'malta-2015',
    title: 'Malta',
    year: 2015,
    dates: '24–27 April 2015',
    location: 'Marsa Sports Club, Malta',
    summary: (
      <>
        <p>
          The Village's debut overseas tour saw thirteen intrepid Villagers descend on the island of Malta over the St George's Day bank holiday weekend — armed with cricket kit,
          an insatiable appetite for Cisk lager, and absolutely no idea what they were letting themselves in for.
        </p>
        <p>
          The touring party split across two flights — one from Gatwick at an ungodly 6.25am, the other from Luton later that evening — and were united in Paceville in time to
          discover the Sun in Splendour and, crucially, Cisk. Malta's golden 4.2% lager became the unofficial fourteenth member of the squad for the entire trip.
        </p>
        <p>
          Three matches were played in a round-robin tournament at Marsa Sports Club. The highlight on the pitch came against the home side Marsa CC, where Nick Thompson's
          relentless bowling attack and a captain's innings of 39 from Nick Troja — ended by a one-handed screamer at backward point — guided the Village to a five-run victory.
          Oliver Morgans and Stephen Harty each compiled a well-crafted fifty in the opening game against the Pretenders, and Chris Pitcher was voted Player of the Tour for his
          miserly 2-17 in the final match — and notably for not staging an ultimatum about his continued presence on the field.
        </p>
        <p>
          The Village finished runners-up in the three-team tournament on a complicated count-back after Marsa beat the Pretenders in the final game. Off the field, the highlights
          were plentiful: karaoke at the Scotsman (Troja and Cressey's rendition of Shake It Off; the de Mellow brothers on Thunder Road; Thomo getting banned for swearing),
          the infamous Glaswegian Nicole incident, Ollie Morgans' Tinder date appearing at the ground, a crate of Cisk in the last rays of the Maltese sun, and a surreal trip
          to historic Valletta with a bar called Cockney's. Cisk — lest we forget.
        </p>
      </>
    ),
    matches: [
      {
        matchId: 299,
        date: '25 Apr 2015',
        opposition: 'Pretenders CC',
        venue: 'Malta',
        ourScore: '194/6 (35 overs)',
        theirScore: '205/9 (35 overs)',
        result: 'Lost by 1 wicket',
        won: false,
      },
      {
        matchId: 300,
        date: '26 Apr 2015',
        opposition: 'Pretenders CC',
        venue: 'Malta',
        ourScore: '93 all out (18 overs)',
        theirScore: '94/7 (17 overs)',
        result: 'Lost by 3 wickets',
        won: false,
      },
      {
        matchId: 301,
        date: '26 Apr 2015',
        opposition: 'Marsa CC',
        venue: 'Malta',
        ourScore: '145/9 (20 overs)',
        theirScore: '140/7 (20 overs)',
        result: 'Won by 5 runs',
        won: true,
      },
    ],
    reportMatchId: 300,
  },
  {
    id: 'amsterdam-2017',
    title: 'Amsterdam',
    year: 2017,
    dates: '28–29 April 2017',
    location: 'VRA Cricket Ground, Amstelveen & Cricket Club Qui Vive, Amsterdam',
    summary: (
      <>
        <p>
          The Village's second overseas adventure took them to Amsterdam over the Koningsdag bank holiday weekend, and delivered two comprehensive wins alongside a legendary
          tour report written in the style of a rolling news bulletin.
        </p>
        <p>
          The bulletin led with breaking news of a "serious boating accident" on the King's Day canals — in which several Villagers "contracted Typhoid fever" (known to UK medics
          as drunkenness) after their beer-laden barge tipped over when all the men started peeing off one side simultaneously. An Australian made a world-record attempt on the
          "longest doobie". "Fake bouncers" put Amsterdam nightspots on alert. A peep-show price inquiry was launched. And 202-year-old VRA groundsman Paul Polak was nominated for
          Man of the Year after some brave barbecuing and judicious use of lighter fluid.
        </p>
        <p>
          On the pitch, the Village were simply brilliant. At VRA on Friday, they were restricted to 121 all out, but Dan Slevison (37) and Ollie Morgans (22) laid the foundation
          before Bilal Husain blitzed the VRA Zamigo's batting with a devastating 4-14, Naz Choudhury chipping in with 3-20. The Village won by 46 runs.
        </p>
        <p>
          On Saturday, Slevison went to another level entirely, posting a magnificent match-winning 106 against Qui Vive — supported by Bosh (54) and EK (26*) — to chase down
          208 with seven wickets to spare. Bilal had earlier returned 6-25 with the ball to keep the Village in the game after Qui Vive recovered from 50/5. The player of the
          tour vote — a democratic affair at a hip burger joint — was won overwhelmingly by Bilal Husain, who took ten wickets on the tour. Ian from Qui Vive came a close second.
        </p>
      </>
    ),
    matches: [
      {
        matchId: 331,
        date: '28 Apr 2017',
        opposition: 'VRA Zamigo\'s',
        venue: 'VRA Cricket Ground, Amstelveen',
        ourScore: '121 all out (33 overs)',
        theirScore: '75 all out (31 overs)',
        result: 'Won by 46 runs',
        won: true,
      },
      {
        matchId: 332,
        date: '29 Apr 2017',
        opposition: 'Qui Vive CC',
        venue: 'Cricket Club Qui Vive',
        ourScore: '209/3 (34 overs)',
        theirScore: '208 all out (34 overs)',
        result: 'Won by 7 wickets',
        won: true,
      },
    ],
    reportMatchId: 332,
  },
  {
    id: 'montenegro-2019',
    title: 'Montenegro & Dubrovnik',
    year: 2019,
    dates: '25–26 May 2019',
    location: 'Bokaneer Zentraal, Montenegro',
    summary: (
      <>
        <p>
          The Village headed to the Adriatic for their 2019 tour, taking on the Montenegro Bokaneers in two back-to-back fixtures. It proved to be the most dramatic series
          the Village had contested on tour — featuring an individual batting masterclass and a one-run heartbreaker.
        </p>
        <p>
          In the first match, Nick Troja produced the innings of his Village career: a superb century (103) anchored the Village total of 229/6. Chris Bosshardt (30) and
          Steve Dean (22) provided strong support, while Eklavya Gupte's figures of 3-11 were the highlight of a disciplined bowling performance that skittled the Bokaneers
          for 182. The Village won comfortably by 47 runs.
        </p>
        <p>
          The second match produced one of the most painful finishes in club history. Chasing 92 off 25 overs, the Village were all out for 91 — losing by a single run.
          James de Mellow's 29 was the top score as the Village couldn't quite get over the line. The Bokaneers took the series 1-1 on the most exquisite of margins.
        </p>
        <p>
          The tour also featured the now-legendary crossing into Montenegro: a desolate border shack, a man with a machine gun, and the careful concealment of at least one
          Villager under a pile of kit bags — a far cry from the electronic border control experienced on later tours.
        </p>
      </>
    ),
    matches: [
      {
        matchId: 386,
        date: '25 May 2019',
        opposition: 'Montenegro Bokaneers',
        venue: 'Bokaneer Zentraal',
        ourScore: '229/6 (40 overs)',
        theirScore: '182 all out (37 overs)',
        result: 'Won by 47 runs',
        won: true,
      },
      {
        matchId: 387,
        date: '26 May 2019',
        opposition: 'Montenegro Bokaneers',
        venue: 'Bokaneer Zentraal',
        ourScore: '91 all out (25 overs)',
        theirScore: '92 all out (19 overs)',
        result: 'Lost by 1 run',
        won: false,
      },
    ],
  },
  {
    id: 'copenhagen-2022',
    title: 'Copenhagen',
    year: 2022,
    dates: '9–10 July 2022',
    location: 'Copenhagen, Denmark',
    summary: (
      <>
        <p>
          The Village returned to European touring in 2022, heading to Copenhagen for a midsummer two-match series against Danish opposition. The cricket was challenging,
          but the city — and its celebrated nightlife — more than made up for it.
        </p>
        <p>
          The opening match at Valby Idrætspark against Boldklubben FREM proved a tough baptism. FREM posted a formidable 257/7 and the Village, despite a composed 35 from
          Eklavya Gupte and a steady 25 from James de Mellow, could only reach 118/8 — losing by 139 runs.
        </p>
        <p>
          The second match at Ishøj saw a marked improvement. James de Mellow (78) played arguably the innings of the tour in a masterful knock that carried the Village to
          149/5. Nick Troja added a vital 33 and the total looked imposing, but the hosts Ishøj CC edged home with four wickets to spare off 23 overs.
        </p>
        <p>
          The tour ended 0-2 on results, but Copenhagen — with its long summer evenings, excellent food and drink, and warm hospitality from the hosts — ensured it was another
          Village adventure to remember.
        </p>
      </>
    ),
    matches: [
      {
        matchId: 488,
        date: '9 Jul 2022',
        opposition: 'Boldklubben FREM',
        venue: 'Valby Idrætspark, Copenhagen',
        ourScore: '118/8 (35 overs)',
        theirScore: '257/7 (35 overs)',
        result: 'Lost by 139 runs',
        won: false,
      },
      {
        matchId: 489,
        date: '10 Jul 2022',
        opposition: 'Ishøj CC',
        venue: 'Ishøj Idrætscenter',
        ourScore: '149/5 (29 overs)',
        theirScore: '152/6 (23 overs)',
        result: 'Lost by 4 wickets',
        won: false,
      },
    ],
  },
  {
    id: 'porto-2024',
    title: 'Porto',
    year: 2024,
    dates: '3–5 May 2024',
    location: 'Oporto Cricket and Lawn Tennis Club, Porto',
    summary: (
      <>
        <p>
          Village Go Porto. The most luxurious tour in club history — featuring a hotel with an actual spa, a rooftop bar, a Douro River boat trip, a guided port cellar tasting,
          and a surprise appearance from "Abs" at the most inopportune moment imaginable. Preparation began at 8.48am in Brewdog Gatwick North, 26 hours before the scheduled
          toss — fully 26 hours more preparation than for a normal match.
        </p>
        <p>
          The first match, against the Further Friars, started encouragingly enough: some tidy early bowling from Anupam Sharma and Tom de Mellow had the Friars in early
          trouble at 20-odd for three. Then two brothers at the crease — one in a Super Bock T-shirt, one in knitwear — both found peak performance and proceeded to post
          106 and 92 respectively. Five drops — four of them by Eddie, including one that burst through his hands and bobbled up off his chest — didn't help. The Village were
          eventually set 253 to win and subsided to 88 all out, with Troja's tortuous duck the nadir. The lunch that preceded this had featured red wine, white wine, port, and a
          pour-your-own Super Bock honesty system.
        </p>
        <p>
          The second match, against the Oporto Cricket Club on the Sunday, saw the Village recover admirably. Graham Pontin carried his bat for 48* in difficult conditions —
          becoming only the second ever Villager to do so, after himself — while Chris Pitcher's bowling delivered his traditional tour twofer. A late diving catch by Pontin
          off Pitcher's bowling was described as "what we play for." Porto won with five wickets to spare, but the real victory was a magnificent curry sourced by the tour sec
          on a Sunday night. Man of Tour: Abs (non-playing tourist who contributed most to the local economy). Player of Tour: an extremely close call between Graham Pontin
          and Anupam Sharma ("Frank").
        </p>
        <p>
          The tour report was filed from A&E at Homerton University Hospital, where the author was waiting for an X-ray following a fielding incident. It remains one of the
          finest dispatches in Village tour history.
        </p>
      </>
    ),
    matches: [
      {
        matchId: 530,
        date: '3 May 2024',
        opposition: 'Further Friars',
        venue: 'Oporto Cricket and Lawn Tennis Club',
        ourScore: '88 all out (29 overs)',
        theirScore: '250/7 (47 overs)',
        result: 'Lost by 162 runs',
        won: false,
      },
      {
        matchId: 514,
        date: '5 May 2024',
        opposition: 'Porto CC',
        venue: 'Oporto Cricket and Lawn Tennis Club',
        ourScore: '90/9 (30 overs)',
        theirScore: '91/5 (21 overs)',
        result: 'Lost by 5 wickets',
        won: false,
      },
    ],
    reportMatchId: 514,
  },
];

const ImagePlaceholder: React.FC<{ alt: string }> = ({ alt }) => (
  <div
    className="w-full bg-gray-100 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 text-sm"
    style={{ minHeight: '220px' }}
    aria-label={alt}
  >
    <span className="material-symbols-outlined text-5xl mb-2" aria-hidden="true">
      photo_camera
    </span>
    <span>Photo coming soon</span>
  </div>
);

const ResultBadge: React.FC<{ won: boolean; result: string }> = ({ won, result }) => (
  <span
    className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${
      won ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}
  >
    {result}
  </span>
);

const TourSection: React.FC<{ tour: Tour }> = ({ tour }) => (
  <section
    id={tour.id}
    className="mt-12 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
  >
    {/* Tour header banner */}
    <div className="bg-villageGreen px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold text-white">{tour.title}</h2>
        <p className="text-green-100 text-sm mt-0.5">{tour.dates} · {tour.location}</p>
      </div>
      <span className="text-white text-4xl font-bold opacity-30" aria-hidden="true">
        {tour.year}
      </span>
    </div>

    <div className="p-6">
      {/* Two-column layout on large screens: image left, summary right */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/5 flex-shrink-0">
          <ImagePlaceholder alt={`${tour.title} ${tour.year} tour photo`} />
        </div>
        <div className="lg:w-3/5 space-y-3 text-sm text-gray-700 leading-relaxed">
          {tour.summary}
        </div>
      </div>

      {/* Match results */}
      <div className="mt-6">
        <h3 className="text-base font-semibold text-villageText mb-3">Match Results</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {tour.matches.map((match) => (
            <a
              key={match.matchId}
              href={`/scorecard/${match.matchId}`}
              className="block border border-gray-200 rounded-lg p-4 hover:border-villageGreen hover:shadow-sm transition group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 mb-0.5">{match.date} · {match.venue}</p>
                  <p className="font-medium text-sm text-gray-800 truncate">vs {match.opposition}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    VCC {match.ourScore} &nbsp;|&nbsp; {match.opposition} {match.theirScore}
                  </p>
                </div>
                <div className="flex-shrink-0 mt-0.5">
                  <ResultBadge won={match.won} result={match.result} />
                </div>
              </div>
              <p className="mt-2 text-xs text-villageGreen group-hover:underline font-medium">
                View scorecard →
              </p>
            </a>
          ))}
        </div>
      </div>

      {/* Report link */}
      {tour.reportMatchId && (
        <div className="mt-4">
          <a
            href={`/scorecard/${tour.reportMatchId}`}
            className="inline-flex items-center gap-1.5 text-sm text-villageGreen hover:underline font-medium"
          >
            <span className="material-symbols-outlined text-[18px] leading-none" aria-hidden="true">
              article
            </span>
            Read the full tour report
          </a>
        </div>
      )}
    </div>
  </section>
);

const Tours: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {/* Page title */}
          <h1 className="text-3xl sm:text-4xl font-semibold text-villageText">Touring</h1>
          <p className="mt-2 text-gray-600 text-base">
            Every two years The Village packs its bags, its cricket kit, and its considerable thirst and heads abroad. Here's a record of our overseas adventures.
          </p>

          {/* Quick navigation */}
          <nav className="mt-6 flex flex-wrap gap-2" aria-label="Tour navigation">
            {TOURS.map((tour) => (
              <a
                key={tour.id}
                href={`#${tour.id}`}
                className="text-sm border border-gray-200 rounded-full px-3 py-1 text-gray-700 hover:border-villageGreen hover:text-villageGreen transition"
              >
                {tour.title} {tour.year}
              </a>
            ))}
          </nav>

          {/* Tour sections, newest first */}
          {[...TOURS].reverse().map((tour) => (
            <TourSection key={tour.id} tour={tour} />
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Tours;
