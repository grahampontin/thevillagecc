import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import Header from './Header';
import Footer from './Footer';
import { ColDef } from 'ag-grid-community';
import LinkToPlayerStatsRenderer from './cellRenderers/LinkToPlayerStatsRenderer';
import ParameterizedLinkToMatchReportRenderer from './cellRenderers/ParameterizedLinkToMatchReportRenderer';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

interface Venue {
  Id: number;
  Name: string;
  MapUrl: string;
  Description: string;
  Latitude: number | null;
  Longitude: number | null;
}

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
  const [venues, setVenues] = useState<Venue[]>([]);
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
  const [showFilterPanel, setShowFilterPanel] = useState(true);

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
        const response = await fetch('/api/venues');
        if (!response.ok) {
          throw new Error('Failed to fetch venues');
        }
        const venuesData: Venue[] = await response.json();
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
          const response = await fetch('/api/stats/query', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(query),
          });

          if (!response.ok) {
            throw new Error('Failed to load statistics');
          }

          const data: StatsData = await response.json();
          
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
      const response = await fetch('/api/stats/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query),
      });

      if (!response.ok) {
        throw new Error('Failed to load statistics');
      }

      const data: StatsData = await response.json();
      
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
    flex: 1,
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

  return (
    <>
      <Header />
      <main className="container">
        <h1>Club Statistics</h1>

        <div className="accordion" id="accordionExample">
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button
                className={`accordion-button ${showFilterPanel ? '' : 'collapsed'}`}
                type="button"
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                aria-expanded={showFilterPanel}
                aria-controls="collapseOne"
              >
                Filter Statistics
              </button>
            </h2>
            <div
              id="collapseOne"
              className={`accordion-collapse collapse ${showFilterPanel ? 'show' : ''}`}
              aria-labelledby="headingOne"
            >
              <div className="accordion-body">
                <div className="d-flex flex-wrap">
                  <div className="form-group flex-grow-1 me-2 mt-2">
                    <div className="input-group">
                      <span className="input-group-text">Start date:</span>
                      <input
                        type="date"
                        className="form-control"
                        id="fromDate"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group flex-grow-1 me-2 mt-2">
                    <div className="input-group">
                      <span className="input-group-text">End date:</span>
                      <input
                        type="date"
                        className="form-control"
                        id="toDate"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group flex-grow-1 me-2 mt-2">
                    <div className="input-group">
                      <span className="input-group-text">At:</span>
                      <select
                        className="form-select"
                        id="VenuesDropDown"
                        value={selectedVenue}
                        onChange={(e) => setSelectedVenue(e.target.value)}
                      >
                        <option value=""></option>
                        {venues.map(venue => (
                          <option key={venue.Id} value={venue.Name}>
                            {venue.Name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="d-flex flex-fill me-2">
                  <div className="input-group mt-2">
                    <div className="form-check form-switch form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="leagueCB"
                        checked={matchTypes.League}
                        onChange={() => handleMatchTypeChange('League')}
                      />
                      <label className="form-check-label" htmlFor="leagueCB">
                        League
                      </label>
                    </div>
                    <div className="form-check form-switch form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="friendlyCB"
                        checked={matchTypes.Friendly}
                        onChange={() => handleMatchTypeChange('Friendly')}
                      />
                      <label className="form-check-label" htmlFor="friendlyCB">
                        Friendly
                      </label>
                    </div>
                    <div className="form-check form-switch form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="tourCB"
                        checked={matchTypes.Tour}
                        onChange={() => handleMatchTypeChange('Tour')}
                      />
                      <label className="form-check-label" htmlFor="tourCB">
                        Tour
                      </label>
                    </div>
                    <div className="form-check form-switch form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="declarationCB"
                        checked={matchTypes.Declaration}
                        onChange={() => handleMatchTypeChange('Declaration')}
                      />
                      <label className="form-check-label" htmlFor="declarationCB">
                        Declaration
                      </label>
                    </div>
                    <div className="form-check form-switch form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="twenty20CB"
                        checked={matchTypes.T20}
                        onChange={() => handleMatchTypeChange('T20')}
                      />
                      <label className="form-check-label" htmlFor="twenty20CB">
                        Twenty20
                      </label>
                    </div>
                  </div>
                  <div className="mt-2 d-flex justify-content-end flex-column">
                    {!isLoading && (
                      <button
                        id="filterButton"
                        type="button"
                        className="btn btn-primary"
                        onClick={handleFilterClick}
                      >
                        <span className="text-nowrap">Apply filter</span>
                      </button>
                    )}
                    {isLoading && (
                      <button
                        id="loadingButton"
                        className="btn btn-primary"
                        type="button"
                        disabled
                      >
                        <span className="text-nowrap">
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          {' '}Loading...
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="tabFlexContainer">
          <nav
            id="tabs"
            className="nav nav-pills nav-justified p-2 mt-2 underline-nav-2"
            role="tablist"
          >
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                type="button"
                role="tab"
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          <div className="tab-content">
            {tabs.map(tab => (
              <div
                key={tab.id}
                role="tabpanel"
                className={`tab-pane ${activeTab === tab.id ? 'active' : ''}`}
                id={tab.id}
              >
                {activeTab === tab.id && (
                  <div
                    className="ag-theme-balham stats-grid"
                    style={{ height: 'calc(100vh - 400px)', width: '100%' }}
                  >
                    {statsData[tab.id] && (
                      <AgGridReact
                        columnDefs={statsData[tab.id].gridOptions.columnDefs}
                        rowData={statsData[tab.id].gridOptions.rowData}
                        defaultColDef={defaultColDef}
                        suppressColumnVirtualisation={true}
                        components={{
                          LinkToPlayerStatsRenderer: LinkToPlayerStatsRenderer,
                          ParameterizedLinkToMatchReportRenderer: ParameterizedLinkToMatchReportRenderer,
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Modal */}
        {error && (
          <div
            className="modal show"
            style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
            tabIndex={-1}
          >
            <div className="modal-dialog modal-fullscreen-md-down">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Error!</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setError(null)}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Stats;
