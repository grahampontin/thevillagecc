import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface AdminNavItem {
  to: string;
  icon: string;
  label: string;
  description: string;
}

const NAV_ITEMS: AdminNavItem[] = [
  { to: '/admin/players', icon: 'people', label: 'Players', description: 'Add and edit player profiles' },
  { to: '/admin/teams', icon: 'groups', label: 'Teams', description: 'Manage opposition teams' },
  { to: '/admin/matches', icon: 'emoji_events', label: 'Matches', description: 'Schedule and edit matches' },
  { to: '/admin/venues', icon: 'stadium', label: 'Venues', description: 'Add and edit venues' },
  { to: '/admin/awards', icon: 'social_leaderboard', label: 'Awards', description: 'Manage season awards' },
  { to: '/admin/committee', icon: 'diversity_3', label: 'Committee', description: 'Manage committee posts' },
  { to: '/admin/scorecards', icon: 'table_chart', label: 'Scorecards', description: 'Add and edit match scorecards' },
];

const AdminLanding: React.FC = () => {
  return (
    <div className="font-sans text-villageText bg-gray-50 min-h-screen">
      <Header />
      <main>
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <h1 className="text-3xl sm:text-4xl font-semibold text-villageText">Admin</h1>
          <p className="mt-2 text-gray-600 text-base">Manage club reference data.</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md hover:border-villageGreen transition-all flex items-start gap-4 no-underline"
              >
                <span className="material-symbols-outlined text-[32px] leading-none text-villageGreen mt-0.5" aria-hidden="true">
                  {item.icon}
                </span>
                <div>
                  <p className="font-semibold text-villageText">{item.label}</p>
                  <p className="mt-0.5 text-sm text-gray-500">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLanding;
