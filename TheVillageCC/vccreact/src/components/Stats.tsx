import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule, themeBalham } from 'ag-grid-community';
import Header from './Header';
import Footer from './Footer';
import { ColDef } from 'ag-grid-community';
import LinkToPlayerStatsRenderer from './cellRenderers/LinkToPlayerStatsRenderer';
import ParameterizedLinkToMatchReportRenderer from './cellRenderers/ParameterizedLinkToMatchReportRenderer';
import { getAllVenues } from '../api/venuesApi';
import { queryStats } from '../api/statsApi';
import { VenueV1 } from '../api/swaggerTypes';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

interface StatsQuery {
  category: string;
  from: string;
  to: string;
  venue: string;
  matchTypes: string[];
}

interface StatsData {
  statsType: string;
  gridOptions: {
    columnDefs: ColDef[];
    rowData: Record<string, unknown>[];
  };
}

const Stats: React.FC = () => {
  const [venues, setVenues] = useState<VenueV1[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [matchTypes, setMatchTypes] = useState({
    League: true,
    Friendly: true,
    Tour: true,
    Declaration: true,
    T20: true,
  });
  const [activeTab, setActiveTab] = useState<string>('batting');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statsData, setStatsData] = useState<{ [key: string]: StatsData }>({});

  // Initialize dates
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setFromDate(`${currentYear - 30}-01-01`);
    setToDate(`${currentYear}-12-31`);
  }, []);

  // Fetch venues
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const venuesData = await getAllVenues();
        setVenues(venuesData);
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };

    fetchVenues();
  }, []);

  // Helper function to get selected match types
  const getSelectedMatchTypes = () => {
    return Object.entries(matchTypes)
      .filter(([_, checked]) => checked)
      .map(([type, _]) => type);
  };

  // Helper function to configure first column
  const configureFirstColumn = (columnDefs: ColDef[]) => {
    if (columnDefs && columnDefs.length > 0) {
      columnDefs[0].pinned = 'left';
      columnDefs[0].sort = 'asc';
      columnDefs[0].filter = 'agTextColumnFilter';
      columnDefs[0].minWidth = 150;
    }
  };

  // Load initial batting stats
  useEffect(() => {
    if (fromDate && toDate) {
      // Load batting stats on initial render
      const loadInitialStats = async () => {
        const query: StatsQuery = {
          category: 'batting',
          from: fromDate,
          to: toDate,
          venue: selectedVenue,
          matchTypes: getSelectedMatchTypes(),
        };

        setIsLoading(true);
        setError(null);

        try {
          const data: StatsData = await queryStats(query);
          
          // Configure first column
          configureFirstColumn(data.gridOptions.columnDefs);

          setStatsData({ batting: data });
        } catch (error) {
          setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
          setIsLoading(false);
        }
      };
      
      loadInitialStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate]);

  const loadStats = async (category: string) => {
    // If we already have data for this category, don't reload
    if (statsData[category]) {
      return;
    }

    const query: StatsQuery = {
      category,
      from: fromDate,
      to: toDate,
      venue: selectedVenue,
      matchTypes: getSelectedMatchTypes(),
    };

    setIsLoading(true);
    setError(null);

    try {
      const data: StatsData = await queryStats(query);
      
      // Configure first column
      configureFirstColumn(data.gridOptions.columnDefs);

      setStatsData(prev => ({ ...prev, [category]: data }));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterClick = () => {
    // Clear all cached stats data to force reload
    setStatsData({});
    // Reload current tab
    loadStats(activeTab);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    loadStats(tab);
  };

  const handleMatchTypeChange = (type: keyof typeof matchTypes) => {
    setMatchTypes(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    minWidth: 100,
    filter: 'agNumberColumnFilter',
  };

  const tabs = [
    { id: 'batting', label: 'Batting' },
    { id: 'bowling', label: 'Bowling' },
    { id: 'teams', label: 'Teams' },
    { id: 'venues', label: 'Venues' },
    { id: 'captains', label: 'Captains' },
    { id: 'keepers', label: 'Keepers' },
    { id: 'matches', label: 'Matches' },
    { id: 'innings', label: 'Innings' },
  ];

  const handleResetFilters = async () => {
    // Reset to default values
    const currentYear = new Date().getFullYear();
    setFromDate(`${currentYear - 30}-01-01`);
    setToDate(`${currentYear}-12-31`);
    setSelectedVenue('');
    setMatchTypes({
      League: true,
      Friendly: true,
      Tour: true,
      Declaration: true,
      T20: true,
    });
    // Clear all cached stats data to force reload
    setStatsData({});
    // Reload current tab
    await loadStats(activeTab);
  };

  return (
    <>
      <Header />
      <main>
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Page Title */}
          <h1 className="text-3xl sm:text-4xl font-semibold text-villageText">Stats</h1>
          <p className="mt-2 text-gray-600 text-base">
            Dive into the numbers. Filter, refine, obsess — it's what the Village does best.
          </p>

          {/* CATEGORY TABS */}
          <div className="mt-8 overflow-x-auto">
            <div className="flex gap-2 whitespace-nowrap pb-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    activeTab === tab.id
                      ? 'bg-villageGreen text-white'
                      : 'border border-villageGreen text-villageGreen hover:bg-villageGreenLight'
                  }`}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* FILTER CARD */}
          <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-villageText mb-4">Filters</h2>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  id="fromDate"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  id="toDate"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>

              {/* Venue */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  id="VenuesDropDown"
                  value={selectedVenue}
                  onChange={(e) => setSelectedVenue(e.target.value)}
                >
                  <option value="">All Venues</option>
                  {venues.map(venue => (
                    <option key={venue.id} value={venue.name ?? ''}>
                      {venue.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Match Type */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Match Type</label>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      matchTypes.League
                        ? 'bg-villageGreen text-white'
                        : 'border border-villageGreen text-villageGreen hover:bg-villageGreenLight'
                    }`}
                    onClick={() => handleMatchTypeChange('League')}
                  >
                    League
                  </button>

                  <button
                    type="button"
                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      matchTypes.Friendly
                        ? 'bg-villageGreen text-white'
                        : 'border border-villageGreen text-villageGreen hover:bg-villageGreenLight'
                    }`}
                    onClick={() => handleMatchTypeChange('Friendly')}
                  >
                    Friendly
                  </button>

                  <button
                    type="button"
                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      matchTypes.Tour
                        ? 'bg-villageGreen text-white'
                        : 'border border-villageGreen text-villageGreen hover:bg-villageGreenLight'
                    }`}
                    onClick={() => handleMatchTypeChange('Tour')}
                  >
                    Tour
                  </button>

                  <button
                    type="button"
                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      matchTypes.T20
                        ? 'bg-villageGreen text-white'
                        : 'border border-villageGreen text-villageGreen hover:bg-villageGreenLight'
                    }`}
                    onClick={() => handleMatchTypeChange('T20')}
                  >
                    T20
                  </button>

                  <button
                    type="button"
                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      matchTypes.Declaration
                        ? 'bg-villageGreen text-white'
                        : 'border border-villageGreen text-villageGreen hover:bg-villageGreenLight'
                    }`}
                    onClick={() => handleMatchTypeChange('Declaration')}
                  >
                    Declaration
                  </button>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex gap-3">
              {!isLoading && (
                <button
                  type="button"
                  className="px-4 py-2 bg-villageGreen text-white rounded-md text-sm font-medium"
                  onClick={handleFilterClick}
                >
                  Apply Filters
                </button>
              )}
              {isLoading && (
                <button
                  type="button"
                  className="px-4 py-2 bg-villageGreen text-white rounded-md text-sm font-medium opacity-50 cursor-not-allowed"
                  disabled
                >
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Loading...
                  </span>
                </button>
              )}
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium"
                onClick={handleResetFilters}
              >
                Reset
              </button>
            </div>
          </div>

          {/* GRID CONTAINER */}
          <div className="mt-10 bg-white border border-gray-200 rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold text-villageText mb-4">Results</h2>

            {/* Grid */}
            <div className="w-full h-[400px] sm:h-[600px] border border-gray-200 rounded-md">
              {isLoading && !statsData[activeTab] && (
                <div className="skeleton-grid p-4">
                  <span className="visually-hidden">Loading...</span>
                  <div className="skeleton skeleton-grid-header h-10 bg-gray-200 rounded mb-2 animate-pulse" aria-hidden="true"></div>
                  {Array.from({ length: 10 }).map((_, index) => (
                    <div key={index} className="skeleton skeleton-grid-row h-8 bg-gray-100 rounded mb-1 animate-pulse" aria-hidden="true"></div>
                  ))}
                </div>
              )}
              {statsData[activeTab] && (
                <div className="vcc-ag-grid-compact w-full h-full">
                  <AgGridReact
                    theme={themeBalham}
                    columnDefs={statsData[activeTab].gridOptions.columnDefs}
                    rowData={statsData[activeTab].gridOptions.rowData}
                    defaultColDef={defaultColDef}
                    autoSizeStrategy={{ type: 'fitGridWidth' }}
                    suppressColumnVirtualisation={true}
                    components={{
                      LinkToPlayerStatsRenderer: LinkToPlayerStatsRenderer,
                      ParameterizedLinkToMatchReportRenderer: ParameterizedLinkToMatchReportRenderer,
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-red-800">Error!</h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
                <button
                  type="button"
                  className="text-red-400 hover:text-red-600"
                  onClick={() => setError(null)}
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Stats;
