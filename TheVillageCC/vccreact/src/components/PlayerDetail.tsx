import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule, ColDef, themeMaterial } from 'ag-grid-community';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut, Radar } from 'react-chartjs-2';
import Header from './Header';
import Footer from './Footer';
import LinkToPlayerStatsRenderer from './cellRenderers/LinkToPlayerStatsRenderer';
import ParameterizedLinkToMatchReportRenderer from './cellRenderers/ParameterizedLinkToMatchReportRenderer';
import { getPlayerDetail, getPlayerChart, getPlayerStats, getPlayerMatches } from '../api/statsApi';
import type { PlayerDetailV1, StatsDataV1 } from '../api/statsApi';

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
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

// Remove LocalPlayerV1 / StatsData / PlayerDetailData duplicates and reuse types from statsApi
// (type imports moved up with the rest)

// Constants
const BACKGROUND_IMAGE_URL = '/Images/newCarousel/slide1.jpg';

// Helper function to get chart title based on chart type
const getChartTitle = (chartType: string): string => {
  const titles: Record<string, string> = {
    'battingTimeline': 'Batting Timeline',
    'modesOfDismissal': 'Modes of Dismissal',
    'scoringZones': 'Scoring Areas',
    'strikeRates': 'Strike Rates',
    'wicketsBySeason': 'Wickets by Season',
    'averageBySeason': 'Average by Season',
    'bowlingDismissalsByType': 'Dismissal Types',
  };
  return titles[chartType] || 'Select Chart';
};

// Skeleton loading components
const SkeletonLoader: React.FC = () => (
  <div className="space-y-4" role="status" aria-label="Loading">
    <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
  </div>
);

// Local lightweight types used only for rendering
interface GridOptions {
  columnDefs: ColDef[];
  rowData: Record<string, unknown>[];
  footerRow?: Record<string, unknown>;
}

interface StatsDataArray extends Array<StatsDataV1> {}

interface ChartDataWrapper {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar';
  data: ChartData<'line' | 'bar' | 'pie' | 'doughnut' | 'radar'>;
  options?: ChartOptions<'line' | 'bar' | 'pie' | 'doughnut' | 'radar'>;
}

const PlayerDetail: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const [playerDetail, setPlayerDetail] = useState<PlayerDetailV1 | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'matches'>('overview');
  
  // Chart states
  const [battingChartType, setBattingChartType] = useState<string>('battingTimeline');
  const [bowlingChartType, setBowlingChartType] = useState<string>('wicketsBySeason');
  const [battingChartData, setBattingChartData] = useState<ChartDataWrapper | null>(null);
  const [bowlingChartData, setBowlingChartData] = useState<ChartDataWrapper | null>(null);
  
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
        const data = await getPlayerDetail(parseInt(playerId));
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
        const data = await getPlayerChart(parseInt(playerId), battingChartType);
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
        const data = await getPlayerChart(parseInt(playerId), bowlingChartType);
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
        const data: StatsDataArray = await getPlayerStats(parseInt(playerId), statsType);
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
        const data: { gridOptions: GridOptions } = await getPlayerMatches(parseInt(playerId));
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

  const renderChart = (chartData: ChartDataWrapper | null) => {
    if (!chartData) return null;

    const chartType = chartData.type;
    
    if (chartType === 'line') {
      return <Line data={chartData.data as ChartData<'line'>} options={chartData.options as ChartOptions<'line'>} />;
    } else if (chartType === 'bar') {
      return <Bar data={chartData.data as ChartData<'bar'>} options={chartData.options as ChartOptions<'bar'>} />;
    } else if (chartType === 'pie') {
      return <Pie data={chartData.data as ChartData<'pie'>} options={chartData.options as ChartOptions<'pie'>} />;
    } else if (chartType === 'doughnut') {
      return <Doughnut data={chartData.data as ChartData<'doughnut'>} options={chartData.options as ChartOptions<'doughnut'>} />;
    } else if (chartType === 'radar') {
      return <Radar data={chartData.data as ChartData<'radar'>} options={chartData.options as ChartOptions<'radar'>} />;
    }
    
    return null;
  };

  // Player images are now returned as absolute http(s) URLs.
  const isHttpUrl = (value: string | null | undefined): value is string => {
    return typeof value === 'string' && /^https?:\/\//i.test(value);
  };

  if (isLoading) {
    return (
      <div className="font-sans text-villageText bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SkeletonLoader />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !playerDetail) {
    return (
      <div className="font-sans text-villageText bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800" role="alert">
            {error || 'Player not found'}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { player, playerImageUrl, battingStats, bowlingStats } = playerDetail;
  const playerImageSrc = isHttpUrl(playerImageUrl) ? playerImageUrl : null;

  return (
    <div className="font-sans text-villageText bg-gray-50">
      <Header />
      
      {/* Mobile Header */}
      <div className="lg:hidden relative overflow-hidden" style={{
        backgroundImage: `url('${BACKGROUND_IMAGE_URL}')`,
        backgroundPosition: '50%',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="flex justify-between items-center backdrop-blur-md bg-black/30 p-4">
          <div className="text-white">
            <h1 className="text-xl font-semibold">{player.firstName} {player.surname}</h1>
            <p className="text-sm opacity-90">{player.playingRole}</p>
            <p className="text-xs opacity-80 mt-1">
              Seasons {new Date(player.debut).getFullYear()} - {new Date(player.lastMatchDate).getFullYear()}
            </p>
          </div>
          {playerImageSrc && (
            <img
              className="w-24 h-24 object-cover rounded-lg shadow-lg"
              src={playerImageSrc}
              alt={`${player.firstName} ${player.surname}`}
            />
          )}
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <nav className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex">
          <button 
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'overview' 
                ? 'text-villageGreen border-b-2 border-villageGreen' 
                : 'text-gray-600 hover:text-villageGreen'
            }`}
            onClick={() => setActiveTab('overview')}
            type="button"
          >
            Overview
          </button>
          <button 
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'stats' 
                ? 'text-villageGreen border-b-2 border-villageGreen' 
                : 'text-gray-600 hover:text-villageGreen'
            }`}
            onClick={() => setActiveTab('stats')}
            type="button"
          >
            Stats
          </button>
          <button 
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'matches' 
                ? 'text-villageGreen border-b-2 border-villageGreen' 
                : 'text-gray-600 hover:text-villageGreen'
            }`}
            onClick={() => setActiveTab('matches')}
            type="button"
          >
            Matches
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-6">
              <div 
                className="relative h-48"
                style={{
                  backgroundImage: `url('${BACKGROUND_IMAGE_URL}')`,
                  backgroundPosition: '50%',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                <div className="absolute inset-0 backdrop-blur-md bg-black/30 p-4 flex flex-col justify-between">
                  <div className="text-white">
                    <h2 className="text-lg font-semibold">{player.firstName} {player.surname}</h2>
                    <p className="text-sm opacity-90 mt-1">{player.isRightHandBat ? 'RHB' : 'LHB'}</p>
                  </div>
                  {playerImageSrc && (
                    <div className="flex justify-end">
                      <img
                        className="w-20 h-20 object-cover rounded-lg shadow-lg"
                        src={playerImageSrc}
                        alt={`${player.firstName} ${player.surname}`}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-villageGreen p-3">
                <p className="text-white text-sm font-medium">
                  Seasons {new Date(player.debut).getFullYear()} - {new Date(player.lastMatchDate).getFullYear()}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Desktop Tab Navigation */}
            <div className="hidden lg:block bg-white rounded-lg shadow-sm mb-6">
              <nav className="flex border-b border-gray-200">
                <button 
                  className={`flex-1 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'overview' 
                      ? 'text-villageGreen border-b-2 border-villageGreen -mb-px' 
                      : 'text-gray-600 hover:text-villageGreen hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('overview')}
                  type="button"
                >
                  Overview
                </button>
                <button 
                  className={`flex-1 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'stats' 
                      ? 'text-villageGreen border-b-2 border-villageGreen -mb-px' 
                      : 'text-gray-600 hover:text-villageGreen hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('stats')}
                  type="button"
                >
                  Stats
                </button>
                <button 
                  className={`flex-1 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'matches' 
                      ? 'text-villageGreen border-b-2 border-villageGreen -mb-px' 
                      : 'text-gray-600 hover:text-villageGreen hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('matches')}
                  type="button"
                >
                  Matches
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div>
              {activeTab === 'overview' && (
                <div role="tabpanel">
                  {/* Player Info Card */}
                  <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Batting Style</p>
                        <p className="font-medium">{player.isRightHandBat ? 'RHB' : 'LHB'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Bowling Style</p>
                        <p className="font-medium">{player.bowlingStyle}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Debut</p>
                        <p className="font-medium">{formatDate(player.debut)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Caps</p>
                        <p className="font-medium">{player.matches}</p>
                      </div>
                    </div>
                  </div>

                  {/* Career Stats Card */}
                  <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-semibold text-villageText mb-4">Career Stats</h2>
                    
                    {/* Batting Section */}
                    <div className="mb-6">
                      <h3 className="text-md font-medium text-gray-700 mb-3 pb-2 border-b border-gray-200">
                        Batting and Fielding
                      </h3>
                      <div className="mb-4">
                        <AgGridReact
                          theme={themeMaterial}
                          columnDefs={battingStats.gridOptions.columnDefs}
                          rowData={battingStats.gridOptions.rowData}
                          pinnedBottomRowData={battingStats.gridOptions.footerRow ? [battingStats.gridOptions.footerRow] : undefined}
                          domLayout="autoHeight"
                          headerHeight={40}
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
                        <div className="mt-6">
                          <div className="relative inline-block mb-4">
                            <select 
                              className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-villageGreen focus:outline-none focus:ring-2 focus:ring-villageGreen focus:border-transparent"
                              value={battingChartType}
                              onChange={(e) => setBattingChartType(e.target.value)}
                            >
                              <option value="battingTimeline">Batting Timeline</option>
                              <option value="modesOfDismissal">Modes of Dismissal</option>
                              <option value="scoringZones">Scoring Areas</option>
                              <option value="strikeRates">Strike Rates</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                              </svg>
                            </div>
                          </div>
                          <div key={battingChartType} className="max-w-2xl mx-auto">
                            {renderChart(battingChartData)}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bowling Section */}
                    <div>
                      <h3 className="text-md font-medium text-gray-700 mb-3 pb-2 border-b border-gray-200">
                        Bowling
                      </h3>
                      <div className="mb-4">
                        <AgGridReact
                          theme={themeMaterial}
                          columnDefs={bowlingStats.gridOptions.columnDefs}
                          rowData={bowlingStats.gridOptions.rowData}
                          pinnedBottomRowData={bowlingStats.gridOptions.footerRow ? [bowlingStats.gridOptions.footerRow] : undefined}
                          domLayout="autoHeight"
                          headerHeight={40}
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
                        <div className="mt-6">
                          <div className="relative inline-block mb-4">
                            <select 
                              className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-villageGreen focus:outline-none focus:ring-2 focus:ring-villageGreen focus:border-transparent"
                              value={bowlingChartType}
                              onChange={(e) => setBowlingChartType(e.target.value)}
                            >
                              <option value="wicketsBySeason">Wickets by Season</option>
                              <option value="averageBySeason">Average by Season</option>
                              <option value="bowlingDismissalsByType">Dismissal Types</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                              </svg>
                            </div>
                          </div>
                          <div key={bowlingChartType} className="max-w-2xl mx-auto">
                            {renderChart(bowlingChartData)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'stats' && (
                <div role="tabpanel">
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-villageText">Career Stats</h2>
                        <div className="relative inline-block">
                          <select 
                            className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-villageGreen focus:outline-none focus:ring-2 focus:ring-villageGreen focus:border-transparent"
                            value={statsType}
                            onChange={(e) => setStatsType(e.target.value as 'Batting' | 'Bowling')}
                          >
                            <option value="Batting">Batting</option>
                            <option value="Bowling">Bowling</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {statsLoading ? (
                      <div className="p-6">
                        <SkeletonLoader />
                      </div>
                    ) : (
                      statsData && statsData.map((stats, index) => (
                        <div key={index}>
                          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                            <p className="text-sm font-medium text-gray-700">{stats.statsType}</p>
                          </div>
                          <div className="overflow-x-auto">
                            <AgGridReact
                              theme={themeMaterial}
                              columnDefs={stats.gridOptions.columnDefs}
                              rowData={stats.gridOptions.rowData}
                              domLayout="autoHeight"
                              headerHeight={40}
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
              )}

              {activeTab === 'matches' && (
                <div role="tabpanel">
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-villageText">Matches</h2>
                    </div>
                    
                    {matchesLoading ? (
                      <div className="p-6">
                        <SkeletonLoader />
                      </div>
                    ) : (
                      matchesData && (
                        <>
                          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                            <p className="text-sm font-medium text-gray-700">All Matches</p>
                          </div>
                          <div className="overflow-x-auto">
                            <AgGridReact
                              theme={themeMaterial}
                              columnDefs={matchesData.columnDefs}
                              rowData={matchesData.rowData}
                              domLayout="autoHeight"
                              headerHeight={40}
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
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PlayerDetail;
