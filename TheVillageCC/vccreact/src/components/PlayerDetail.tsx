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

// Skeleton loading components
const SkeletonLoader: React.FC = () => (
  <div className="space-y-4" role="status" aria-label="Loading" aria-live="polite">
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
  
  // Career stats toggle (Batting or Bowling)
  const [careerStatsType, setCareerStatsType] = useState<'Batting' | 'Bowling'>('Batting');
  
  // Chart data for all chart types
  const [battingTimelineData, setBattingTimelineData] = useState<ChartDataWrapper | null>(null);
  const [modesOfDismissalData, setModesOfDismissalData] = useState<ChartDataWrapper | null>(null);
  const [scoringZonesData, setScoringZonesData] = useState<ChartDataWrapper | null>(null);
  const [strikeRatesData, setStrikeRatesData] = useState<ChartDataWrapper | null>(null);
  
  const [wicketsBySeasonData, setWicketsBySeasonData] = useState<ChartDataWrapper | null>(null);
  const [averageBySeasonData, setAverageBySeasonData] = useState<ChartDataWrapper | null>(null);
  const [dismissalTypesData, setDismissalTypesData] = useState<ChartDataWrapper | null>(null);
  
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

  // Fetch all charts when overview tab is active
  useEffect(() => {
    const fetchAllCharts = async () => {
      if (!playerId || activeTab !== 'overview') return;
      
      try {
        // Fetch all batting charts
        const [battingTimeline, modesOfDismissal, scoringZones, strikeRates] = await Promise.all([
          getPlayerChart(parseInt(playerId), 'battingTimeline'),
          getPlayerChart(parseInt(playerId), 'modesOfDismissal'),
          getPlayerChart(parseInt(playerId), 'scoringZones'),
          getPlayerChart(parseInt(playerId), 'strikeRates'),
        ]);
        
        setBattingTimelineData(battingTimeline);
        setModesOfDismissalData(modesOfDismissal);
        setScoringZonesData(scoringZones);
        setStrikeRatesData(strikeRates);
        
        // Fetch all bowling charts
        const [wicketsBySeason, averageBySeason, dismissalTypes] = await Promise.all([
          getPlayerChart(parseInt(playerId), 'wicketsBySeason'),
          getPlayerChart(parseInt(playerId), 'averageBySeason'),
          getPlayerChart(parseInt(playerId), 'bowlingDismissalsByType'),
        ]);
        
        setWicketsBySeasonData(wicketsBySeason);
        setAverageBySeasonData(averageBySeason);
        setDismissalTypesData(dismissalTypes);
      } catch (error) {
        console.error('Error fetching charts:', error);
      }
    };

    fetchAllCharts();
  }, [playerId, activeTab]);

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
      <>
        <Header />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <SkeletonLoader />
        </main>
        <Footer />
      </>
    );
  }

  if (error || !playerDetail) {
    return (
      <>
        <Header />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800" role="alert">
            {error || 'Player not found'}
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const { player, playerImageUrl, battingStats, bowlingStats } = playerDetail;
  const playerImageSrc = isHttpUrl(playerImageUrl) ? playerImageUrl : null;

    return (
    <>
      <Header />
      
      <main>
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          {/* PLAYER HEADER */}
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
              {playerImageSrc ? (
                <img 
                  src={playerImageSrc} 
                  alt={`${player.firstName} ${player.surname}`}
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-gray-300"></div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                {player.firstName} {player.surname}
              </h1>
              <p className="mt-1 text-sm text-gray-600">Squad · The Village Cricket Club</p>

              <div className="mt-4 grid sm:grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Batting Style</span>
                  <div className="font-medium">{player.isRightHandBat ? 'Right-hand bat' : 'Left-hand bat'}</div>
                </div>
                <div>
                  <span className="text-gray-500">Bowling Style</span>
                  <div className="font-medium">{player.bowlingStyle}</div>
                </div>
                <div>
                  <span className="text-gray-500">Debut</span>
                  <div className="font-medium">{new Date(player.debut).getFullYear()}</div>
                </div>
                <div>
                  <span className="text-gray-500">Caps</span>
                  <div className="font-medium">{player.matches}</div>
                </div>
              </div>
            </div>
          </div>

          {/* TOP-LEVEL TABS */}
          <div className="mt-8 border-b border-gray-200">
            <nav className="flex gap-6 text-sm font-medium" role="tablist">
              <button 
                className={`pb-3 ${activeTab === 'overview' ? 'border-b-2 border-green-700 text-green-700' : 'text-gray-600 hover:text-green-700'}`}
                onClick={() => setActiveTab('overview')}
                role="tab"
                aria-selected={activeTab === 'overview'}
                aria-controls="overview-panel"
              >
                Overview
              </button>
              <button 
                className={`pb-3 ${activeTab === 'stats' ? 'border-b-2 border-green-700 text-green-700' : 'text-gray-600 hover:text-green-700'}`}
                onClick={() => setActiveTab('stats')}
                role="tab"
                aria-selected={activeTab === 'stats'}
                aria-controls="stats-panel"
              >
                Stats
              </button>
              <button 
                className={`pb-3 ${activeTab === 'matches' ? 'border-b-2 border-green-700 text-green-700' : 'text-gray-600 hover:text-green-700'}`}
                onClick={() => setActiveTab('matches')}
                role="tab"
                aria-selected={activeTab === 'matches'}
                aria-controls="matches-panel"
              >
                Matches
              </button>
            </nav>
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <section id="overview-panel" className="mt-8 space-y-8" role="tabpanel" aria-labelledby="overview-tab">
              
              {/* Summary cards */}
              <div className="grid sm:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Matches</div>
                  <div className="mt-1 text-2xl font-semibold">{player.matches}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Runs</div>
                  <div className="mt-1 text-2xl font-semibold">
                    {(battingStats.gridOptions.rowData?.[0]?.runs as number) || 0}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Wickets</div>
                  <div className="mt-1 text-2xl font-semibold">
                    {(bowlingStats.gridOptions.rowData?.[0]?.wickets as number) || 0}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Catches</div>
                  <div className="mt-1 text-2xl font-semibold">
                    {(battingStats.gridOptions.rowData?.[0]?.catches as number) || 0}
                  </div>
                </div>
              </div>

              {/* Career Stats Toggle and Table */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Career Stats</h2>
                  
                  <div className="flex gap-2 text-sm" role="group" aria-label="Select career stats type">
                    <button
                      className={`px-4 py-2 rounded-full font-medium ${
                        careerStatsType === 'Batting' 
                          ? 'bg-villageGreen text-white' 
                          : 'border border-villageGreen text-villageGreen hover:bg-villageGreenLight'
                      }`}
                      onClick={() => setCareerStatsType('Batting')}
                      aria-pressed={careerStatsType === 'Batting'}
                    >
                      Batting
                    </button>
                    <button
                      className={`px-4 py-2 rounded-full font-medium ${
                        careerStatsType === 'Bowling' 
                          ? 'bg-villageGreen text-white' 
                          : 'border border-villageGreen text-villageGreen hover:bg-villageGreenLight'
                      }`}
                      onClick={() => setCareerStatsType('Bowling')}
                      aria-pressed={careerStatsType === 'Bowling'}
                    >
                      Bowling
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <AgGridReact
                    theme={themeMaterial}
                    columnDefs={careerStatsType === 'Batting' ? battingStats.gridOptions.columnDefs : bowlingStats.gridOptions.columnDefs}
                    rowData={careerStatsType === 'Batting' ? battingStats.gridOptions.rowData : bowlingStats.gridOptions.rowData}
                    pinnedBottomRowData={
                      careerStatsType === 'Batting' 
                        ? (battingStats.gridOptions.footerRow ? [battingStats.gridOptions.footerRow] : undefined)
                        : (bowlingStats.gridOptions.footerRow ? [bowlingStats.gridOptions.footerRow] : undefined)
                    }
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

              {/* Charts Grid */}
              {careerStatsType === 'Batting' && (
                <div className="grid md:grid-cols-2 gap-6">
                  {battingTimelineData && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <h3 className="text-base font-semibold mb-4">Batting Timeline</h3>
                      <div className="h-64">
                        {renderChart(battingTimelineData)}
                      </div>
                    </div>
                  )}
                  
                  {modesOfDismissalData && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <h3 className="text-base font-semibold mb-4">Modes of Dismissal</h3>
                      <div className="h-64">
                        {renderChart(modesOfDismissalData)}
                      </div>
                    </div>
                  )}
                  
                  {scoringZonesData && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <h3 className="text-base font-semibold mb-4">Scoring Areas</h3>
                      <div className="h-64">
                        {renderChart(scoringZonesData)}
                      </div>
                    </div>
                  )}
                  
                  {strikeRatesData && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <h3 className="text-base font-semibold mb-4">Strike Rates</h3>
                      <div className="h-64">
                        {renderChart(strikeRatesData)}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {careerStatsType === 'Bowling' && (
                <div className="grid md:grid-cols-2 gap-6">
                  {wicketsBySeasonData && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <h3 className="text-base font-semibold mb-4">Wickets by Season</h3>
                      <div className="h-64">
                        {renderChart(wicketsBySeasonData)}
                      </div>
                    </div>
                  )}
                  
                  {averageBySeasonData && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <h3 className="text-base font-semibold mb-4">Average by Season</h3>
                      <div className="h-64">
                        {renderChart(averageBySeasonData)}
                      </div>
                    </div>
                  )}
                  
                  {dismissalTypesData && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <h3 className="text-base font-semibold mb-4">Dismissal Types</h3>
                      <div className="h-64">
                        {renderChart(dismissalTypesData)}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {/* STATS TAB */}
          {activeTab === 'stats' && (
            <section id="stats-panel" className="mt-8 space-y-8" role="tabpanel" aria-labelledby="stats-tab">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <h2 className="text-xl font-semibold">Detailed Stats</h2>
                
                <div className="flex gap-2 text-sm" role="group" aria-label="Select stats type">
                  <button
                    className={`px-3 py-1.5 rounded-full font-medium ${statsType === 'Batting' ? 'bg-green-700 text-white' : 'border border-green-700 text-green-700'}`}
                    onClick={() => setStatsType('Batting')}
                    aria-pressed={statsType === 'Batting'}
                  >
                    Batting
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-full font-medium ${statsType === 'Bowling' ? 'bg-green-700 text-white' : 'border border-green-700 text-green-700'}`}
                    onClick={() => setStatsType('Bowling')}
                    aria-pressed={statsType === 'Bowling'}
                  >
                    Bowling
                  </button>
                </div>
              </div>
              
              {statsLoading ? (
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <SkeletonLoader />
                </div>
              ) : (
                statsData && statsData.map((stats, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">{stats.statsType}</h3>
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
            </section>
          )}

          {/* MATCHES TAB */}
          {activeTab === 'matches' && (
            <section id="matches-panel" className="mt-8" role="tabpanel" aria-labelledby="matches-tab">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Matches</h2>
                <span className="text-xs text-gray-500">All matches for this player</span>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                {matchesLoading ? (
                  <SkeletonLoader />
                ) : (
                  matchesData && (
                    <div className="w-full">
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
                  )
                )}
              </div>
            </section>
          )}

        </section>
      </main>
      
      <Footer />
    </>
  );

};

export default PlayerDetail;
