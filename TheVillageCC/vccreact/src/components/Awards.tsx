import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Awards: React.FC = () => {
  // Static data matching the template
  const currentYear = 2024;
  
  const currentSeasonAwards = {
    playerOfYear: 'Neil Barstow',
    batterOfYear: 'Ian Mutch',
    bowlerOfYear: 'Mehdi Hasan',
    clubmanOfYear: 'Ken Mackenzie',
    mostImproved: 'Louis Stonier',
    spiritOfCricket: 'Jon Ryall-Charme'
  };

  const captains = [
    { Year: 2024, PlayerName: 'Toby de Mellow' },
    { Year: 2023, PlayerName: 'Toby de Mellow' },
    { Year: 2022, PlayerName: 'Oliver Morgans' },
    { Year: 2021, PlayerName: 'Oliver Morgans' }
  ];

  const viceCaptains = [
    { Year: 2024, PlayerName: 'Prashant Misra' },
    { Year: 2023, PlayerName: 'Toby de Mellow' },
    { Year: 2022, PlayerName: 'Ken Mackenzie' },
    { Year: 2021, PlayerName: 'Ken Mackenzie' }
  ];

  return (
    <>
      <Header />
      <main>
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {/* Page Title */}
          <h1 className="text-3xl sm:text-4xl font-semibold text-villageText">Awards</h1>
          <p className="mt-2 text-gray-600 text-base">Celebrating excellence, effort, and the occasional fluke.</p>

          {/* Season Navigation */}
          <div className="mt-6 flex items-center justify-center">
            <span className="text-sm text-gray-500">{currentYear} Awards</span>
          </div>

          {/* Player Awards */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-villageText">Player Awards</h2>
            <p className="mt-1 text-gray-600 text-sm">The big ones — the glory, the prestige, the bragging rights.</p>

            <div className="mt-6 grid gap-6 md:grid-cols-3 sm:grid-cols-2">
              <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-villageText">Player of the Year</h3>
                <p className="mt-1 text-gray-700">{currentSeasonAwards.playerOfYear}</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-villageText">Batter of the Year</h3>
                <p className="mt-1 text-gray-700">{currentSeasonAwards.batterOfYear}</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-villageText">Bowler of the Year</h3>
                <p className="mt-1 text-gray-700">{currentSeasonAwards.bowlerOfYear}</p>
              </div>
            </div>
          </section>

          {/* Club Awards */}
          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-villageText">Club Awards</h2>
            <p className="mt-1 text-gray-600 text-sm">For contributions on and off the field.</p>

            <div className="mt-6 grid gap-6 md:grid-cols-3 sm:grid-cols-2">
              <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-villageText">Clubman of the Year</h3>
                <p className="mt-1 text-gray-700">{currentSeasonAwards.clubmanOfYear}</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-villageText">Most Improved Player</h3>
                <p className="mt-1 text-gray-700">{currentSeasonAwards.mostImproved}</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-villageText">Spirit of Cricket Award</h3>
                <p className="mt-1 text-gray-700">{currentSeasonAwards.spiritOfCricket}</p>
              </div>
            </div>
          </section>

          {/* Captains & Vice-Captains */}
          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-villageText">Captains & Vice‑Captains</h2>

            <div className="mt-6 grid md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-lg font-semibold text-villageText">Captains</h3>
                <ul className="mt-3 space-y-1 text-gray-700 text-sm">
                  {captains.map((captain, idx) => (
                    <li key={idx}>{captain.Year} — {captain.PlayerName}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-villageText">Vice‑Captains</h3>
                <ul className="mt-3 space-y-1 text-gray-700 text-sm">
                  {viceCaptains.map((viceCaptain, idx) => (
                    <li key={idx}>{viceCaptain.Year} — {viceCaptain.PlayerName}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Awards;
