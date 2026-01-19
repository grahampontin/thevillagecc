import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule, ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import Header from './Header';
import Footer from './Footer';
import LinkToPlayerStatsRenderer from './cellRenderers/LinkToPlayerStatsRenderer';
import ParameterizedLinkToMatchReportRenderer from './cellRenderers/ParameterizedLinkToMatchReportRenderer';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface PlayerV1 {
  playerId: number;
  matches: number;
  name: string;
  shortName: string;
  nickname: string;
  battingStyle: string;
  bowlingStyle: string;
  isActive: boolean;
  firstName: string;
  surname: string;
  middleInitials: string;
  debut: string;
  isRightHandBat: boolean;
  lastMatchDate: string;
  playingRole: string;
}

interface GridOptions {
  columnDefs: ColDef[];
  rowData: Record<string, unknown>[];
  footerRow?: Record<string, unknown>;
}

interface StatsData {
  statsType: string;
  gridOptions: GridOptions;
}

interface PlayerDetailData {
  player: PlayerV1;
  playerImage: string;
  battingStats: StatsData;
  bowlingStats: StatsData;
}

interface StatsDataArray extends Array<StatsData> {}

const PlayerDetail: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const [playerDetail, setPlayerDetail] = useState<PlayerDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'matches'>('overview');
  
  // Chart states
  const [battingChartType, setBattingChartType] = useState<string>('battingTimeline');
  const [bowlingChartType, setBowlingChartType] = useState<string>('wicketsBySeason');
  const [battingChartData, setBattingChartData] = useState<any>(null);
  const [bowlingChartData, setBowlingChartData] = useState<any>(null);
  
  // Stats tab states
  const [statsType, setStatsType] = useState<'Batting' | 'Bowling'>('Batting');
  const [statsData, setStatsData] = useState<StatsDataArray | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  
  // Matches tab states
  const [matchesData, setMatchesData] = useState<GridOptions | null>(null);
  const [matchesLoading, setMatchesLoading] = useState(false);

  // Fetch player detail
  useEffect(() => {
    const fetchPlayerDetail = async () => {
      if (!playerId) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(`/api/stats/player/${playerId}/detail`);
        if (!response.ok) {
          throw new Error('Failed to fetch player details');
        }
        const data: PlayerDetailData = await response.json();
        setPlayerDetail(data);
      } catch (error) {
        console.error('Error fetching player details:', error);
        setError('Failed to load player details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayerDetail();
  }, [playerId]);

  // Fetch batting chart
  useEffect(() => {
    const fetchBattingChart = async () => {
      if (!playerId) return;
      
      try {
        const response = await fetch(`/api/stats/chart/${playerId}/${battingChartType}`);
        if (!response.ok) {
          throw new Error('Failed to fetch batting chart');
        }
        const data = await response.json();
        setBattingChartData(data);
      } catch (error) {
        console.error('Error fetching batting chart:', error);
      }
    };

    if (activeTab === 'overview') {
      fetchBattingChart();
    }
  }, [playerId, battingChartType, activeTab]);

  // Fetch bowling chart
  useEffect(() => {
    const fetchBowlingChart = async () => {
      if (!playerId) return;
      
      try {
        const response = await fetch(`/api/stats/chart/${playerId}/${bowlingChartType}`);
        if (!response.ok) {
          throw new Error('Failed to fetch bowling chart');
        }
        const data = await response.json();
        setBowlingChartData(data);
      } catch (error) {
        console.error('Error fetching bowling chart:', error);
      }
    };

    if (activeTab === 'overview') {
      fetchBowlingChart();
    }
  }, [playerId, bowlingChartType, activeTab]);

  // Fetch stats when stats tab is active
  useEffect(() => {
    const fetchStats = async () => {
      if (!playerId || activeTab !== 'stats') return;
      
      try {
        setStatsLoading(true);
        const response = await fetch(`/api/stats/player/${playerId}/${statsType}`);
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data: StatsDataArray = await response.json();
        setStatsData(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [playerId, statsType, activeTab]);

  // Fetch matches when matches tab is active
  useEffect(() => {
    const fetchMatches = async () => {
      if (!playerId || activeTab !== 'matches') return;
      
      try {
        setMatchesLoading(true);
        const response = await fetch(`/api/stats/playermatches/${playerId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch matches');
        }
        const data: { gridOptions: GridOptions } = await response.json();
        setMatchesData(data.gridOptions);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setMatchesLoading(false);
      }
    };

    fetchMatches();
  }, [playerId, activeTab]);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const renderChart = (chartData: any) => {
    if (!chartData) return null;

    const chartType = chartData.type;
    
    if (chartType === 'line') {
      return <Line data={chartData.data} options={chartData.options} />;
    } else if (chartType === 'bar') {
      return <Bar data={chartData.data} options={chartData.options} />;
    } else if (chartType === 'pie') {
      return <Pie data={chartData.data} options={chartData.options} />;
    }
    
    return null;
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="container">
          <div className="text-center mt-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !playerDetail) {
    return (
      <>
        <Header />
        <main className="container">
          <div className="alert alert-danger mt-5" role="alert">
            {error || 'Player not found'}
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const { player, playerImage, battingStats, bowlingStats } = playerDetail;

  return (
    <>
      <Header />
      
      <div className="d-lg-none" style={{
        backgroundImage: 'url(\'/Images/newCarousel/slide1.jpg\')',
        backgroundPosition: '50%',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="d-flex justify-content-between align-items-center" style={{
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}>
          <div style={{ color: 'white' }} className="ps-2">
            <h5>{player.firstName} {player.surname}</h5>
            <div>{player.playingRole}</div>
            <div>Seasons {new Date(player.debut).getFullYear()} - {new Date(player.lastMatchDate).getFullYear()}</div>
          </div>
          <div className="justify-content-flex-end">
            <img 
              className="player-image" 
              src={`data:image/png;base64,${playerImage}`}
              alt={`${player.firstName} ${player.surname}`}
              style={{ maxWidth: '100px' }}
            />
          </div>
        </div>
      </div>

      <nav className="d-block d-lg-none">
        <div className="nav nav-pills nav-justified underline-nav" role="tablist">
          <button 
            className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
            type="button"
          >
            Overview
          </button>
          <button 
            className={`nav-link ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
            type="button"
          >
            Stats
          </button>
          <button 
            className={`nav-link ${activeTab === 'matches' ? 'active' : ''}`}
            onClick={() => setActiveTab('matches')}
            type="button"
          >
            Matches
          </button>
        </div>
      </nav>

      <main className="container">
        <div className="d-flex">
          <div className="d-none d-lg-block me-4 mt-3" style={{ width: '230px' }}>
            <div className="card" style={{
              width: '230px',
              backgroundImage: 'url(\'/Images/newCarousel/slide1.jpg\')',
              backgroundPosition: '50%',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat'
            }}>
              <div className="card-body pb-0 pe-0" style={{
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
              }}>
                <h5 className="card-title">{player.firstName} {player.surname}</h5>
                <h6>{player.isRightHandBat ? 'RHB' : 'LHB'}</h6>
                <div className="ms-auto" style={{ textAlign: 'end' }}>
                  <img 
                    className="player-image" 
                    src={`data:image/png;base64,${playerImage}`}
                    alt={`${player.firstName} ${player.surname}`}
                    style={{ maxWidth: '100px' }}
                  />
                </div>
              </div>
              <div className="bg-primary p-1 ps-3" style={{
                borderBottomLeftRadius: 'var(--bs-card-border-radius)',
                borderBottomRightRadius: 'var(--bs-card-border-radius)'
              }}>
                <h5 className="text-white">
                  Seasons {new Date(player.debut).getFullYear()} - {new Date(player.lastMatchDate).getFullYear()}
                </h5>
              </div>
            </div>
          </div>

          <div className="flex-fill">
            <div className="card mt-3 d-none d-lg-block">
              <div className="card-body pt-0 pb-0">
                <nav>
                  <div className="nav nav-pills nav-justified underline-nav-2" role="tablist">
                    <button 
                      className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                      onClick={() => setActiveTab('overview')}
                      type="button"
                    >
                      Overview
                    </button>
                    <button 
                      className={`nav-link ${activeTab === 'stats' ? 'active' : ''}`}
                      onClick={() => setActiveTab('stats')}
                      type="button"
                    >
                      Stats
                    </button>
                    <button 
                      className={`nav-link ${activeTab === 'matches' ? 'active' : ''}`}
                      onClick={() => setActiveTab('matches')}
                      type="button"
                    >
                      Matches
                    </button>
                  </div>
                </nav>
              </div>
            </div>

            <div className="tab-content">
              {activeTab === 'overview' && (
                <div role="tabpanel" className="tab-pane active">
                  <div className="card mt-3">
                    <div className="card-body">
                      <div className="row row-cols-md-2 row-cols-lg-3">
                        <div className="col">
                          <div className="text-nowrap">
                            <strong>Batting Style: </strong>
                            <span>{player.isRightHandBat ? 'RHB' : 'LHB'}</span>
                          </div>
                        </div>
                        <div className="col">
                          <div className="text-nowrap">
                            <strong>Bowling Style: </strong>
                            <span>{player.bowlingStyle}</span>
                          </div>
                        </div>
                        <div className="col">
                          <div className="text-nowrap">
                            <strong>Debut: </strong>
                            <span>{formatDate(player.debut)}</span>
                          </div>
                        </div>
                        <div className="col">
                          <div className="text-nowrap">
                            <strong>Caps: </strong>
                            <span>{player.matches}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card mt-3">
                    <div className="card-body">
                      <h5 className="card-title">Career Stats</h5>
                      <div>
                        <hr />
                        Batting and Fielding
                      </div>
                      <div className="ag-theme-material mb-3" style={{ width: '100%' }}>
                        <AgGridReact
                          columnDefs={battingStats.gridOptions.columnDefs}
                          rowData={battingStats.gridOptions.rowData}
                          pinnedBottomRowData={battingStats.gridOptions.footerRow ? [battingStats.gridOptions.footerRow] : undefined}
                          domLayout="autoHeight"
                          components={{
                            LinkToPlayerStatsRenderer: LinkToPlayerStatsRenderer,
                            LinkToMatchReportRenderer: ParameterizedLinkToMatchReportRenderer,
                          }}
                          defaultColDef={{
                            resizable: false,
                            sortable: true,
                            flex: 1,
                            filter: false
                          }}
                        />
                      </div>
                      
                      {battingChartData && (
                        <div className="stats-chart">
                          <div className="btn-group dropend mb-2">
                            <button 
                              type="button" 
                              className="btn btn-secondary dropdown-toggle" 
                              data-bs-toggle="dropdown" 
                              aria-expanded="false"
                            >
                              {battingChartData.options?.plugins?.title?.text || 'Select Chart'}
                            </button>
                            <ul className="dropdown-menu">
                              <li>
                                <button 
                                  className="dropdown-item" 
                                  onClick={() => setBattingChartType('battingTimeline')}
                                >
                                  Batting Timeline
                                </button>
                              </li>
                              <li>
                                <button 
                                  className="dropdown-item" 
                                  onClick={() => setBattingChartType('modesOfDismissal')}
                                >
                                  Modes of Dismissal
                                </button>
                              </li>
                              <li>
                                <button 
                                  className="dropdown-item" 
                                  onClick={() => setBattingChartType('scoringZones')}
                                >
                                  Scoring Areas
                                </button>
                              </li>
                              <li>
                                <button 
                                  className="dropdown-item" 
                                  onClick={() => setBattingChartType('strikeRates')}
                                >
                                  Strike Rates
                                </button>
                              </li>
                            </ul>
                          </div>
                          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                            {renderChart(battingChartData)}
                          </div>
                        </div>
                      )}

                      <div className="mt-3">
                        <hr />
                        Bowling
                      </div>
                      <div className="ag-theme-material mb-3" style={{ width: '100%' }}>
                        <AgGridReact
                          columnDefs={bowlingStats.gridOptions.columnDefs}
                          rowData={bowlingStats.gridOptions.rowData}
                          pinnedBottomRowData={bowlingStats.gridOptions.footerRow ? [bowlingStats.gridOptions.footerRow] : undefined}
                          domLayout="autoHeight"
                          components={{
                            LinkToPlayerStatsRenderer: LinkToPlayerStatsRenderer,
                            LinkToMatchReportRenderer: ParameterizedLinkToMatchReportRenderer,
                          }}
                          defaultColDef={{
                            resizable: false,
                            sortable: true,
                            flex: 1,
                            filter: false
                          }}
                        />
                      </div>

                      {bowlingChartData && (
                        <div className="stats-chart">
                          <div className="btn-group dropend mb-2">
                            <button 
                              type="button" 
                              className="btn btn-secondary dropdown-toggle" 
                              data-bs-toggle="dropdown" 
                              aria-expanded="false"
                            >
                              {bowlingChartData.options?.plugins?.title?.text || 'Select Chart'}
                            </button>
                            <ul className="dropdown-menu">
                              <li>
                                <button 
                                  className="dropdown-item" 
                                  onClick={() => setBowlingChartType('wicketsBySeason')}
                                >
                                  Wickets by Season
                                </button>
                              </li>
                              <li>
                                <button 
                                  className="dropdown-item" 
                                  onClick={() => setBowlingChartType('averageBySeason')}
                                >
                                  Average by Season
                                </button>
                              </li>
                              <li>
                                <button 
                                  className="dropdown-item" 
                                  onClick={() => setBowlingChartType('bowlingDismissalsByType')}
                                >
                                  Dismissal Types
                                </button>
                              </li>
                            </ul>
                          </div>
                          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                            {renderChart(bowlingChartData)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'stats' && (
                <div role="tabpanel" className="tab-pane active">
                  <div className="card mt-3">
                    <div className="card-body px-0">
                      <div className="card-title border-bottom px-3">
                        <div className="d-flex justify-content-between pb-2">
                          <h5 className="my-auto">Career Stats</h5>
                          <div className="btn-group dropend">
                            <button 
                              type="button" 
                              className="btn btn-secondary dropdown-toggle" 
                              data-bs-toggle="dropdown" 
                              aria-expanded="false"
                            >
                              {statsType}
                            </button>
                            <ul className="dropdown-menu">
                              <li>
                                <button 
                                  className="dropdown-item" 
                                  onClick={() => setStatsType('Batting')}
                                >
                                  Batting
                                </button>
                              </li>
                              <li>
                                <button 
                                  className="dropdown-item" 
                                  onClick={() => setStatsType('Bowling')}
                                >
                                  Bowling
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      {statsLoading ? (
                        <div className="text-center mt-3">
                          <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : (
                        statsData && statsData.map((stats, index) => (
                          <div key={index}>
                            <div className="stats-grid-divider">{stats.statsType}</div>
                            <div className="ag-theme-material" style={{ width: '100%' }}>
                              <AgGridReact
                                columnDefs={stats.gridOptions.columnDefs}
                                rowData={stats.gridOptions.rowData}
                                domLayout="autoHeight"
                                components={{
                                  LinkToPlayerStatsRenderer: LinkToPlayerStatsRenderer,
                                  LinkToMatchReportRenderer: ParameterizedLinkToMatchReportRenderer,
                                }}
                                defaultColDef={{
                                  resizable: false,
                                  sortable: true,
                                  flex: 1,
                                  filter: false
                                }}
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'matches' && (
                <div role="tabpanel" className="tab-pane active">
                  <div className="card mt-3">
                    <div className="card-body px-0">
                      <div className="card-title border-bottom px-3">
                        <div className="d-flex justify-content-between pb-2">
                          <h5 className="my-auto">Matches</h5>
                        </div>
                      </div>
                      
                      {matchesLoading ? (
                        <div className="text-center mt-3">
                          <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : (
                        matchesData && (
                          <>
                            <div className="stats-grid-divider">All Matches</div>
                            <div className="ag-theme-material" style={{ width: '100%' }}>
                              <AgGridReact
                                columnDefs={matchesData.columnDefs}
                                rowData={matchesData.rowData}
                                domLayout="autoHeight"
                                components={{
                                  LinkToPlayerStatsRenderer: LinkToPlayerStatsRenderer,
                                  LinkToMatchReportRenderer: ParameterizedLinkToMatchReportRenderer,
                                }}
                                defaultColDef={{
                                  resizable: false,
                                  sortable: true,
                                  flex: 1,
                                  filter: false
                                }}
                              />
                            </div>
                          </>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default PlayerDetail;
