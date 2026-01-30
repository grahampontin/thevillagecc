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

              {/* Career batting & bowling tables */}
              <div className="grid lg:grid-cols-2 gap-8">
                
                {/* Batting summary */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">Career Batting</h2>
                  <div className="overflow-x-auto">
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
                    <div className="mt-4">
                      <div className="mb-2">
                        <select
                          className="text-sm border border-gray-300 rounded px-3 py-1.5"
                          value={battingChartType}
                          onChange={(e) => setBattingChartType(e.target.value)}
                          aria-label="Select batting chart type"
                        >
                          <option value="battingTimeline">Batting Timeline</option>
                          <option value="modesOfDismissal">Modes of Dismissal</option>
                          <option value="scoringZones">Scoring Areas</option>
                          <option value="strikeRates">Strike Rates</option>
                        </select>
                      </div>
                      <div key={battingChartType} className="h-64">
                        {renderChart(battingChartData)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bowling summary */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">Career Bowling</h2>
                  <div className="overflow-x-auto">
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
                    <div className="mt-4">
                      <div className="mb-2">
                        <select
                          className="text-sm border border-gray-300 rounded px-3 py-1.5"
                          value={bowlingChartType}
                          onChange={(e) => setBowlingChartType(e.target.value)}
                          aria-label="Select bowling chart type"
                        >
                          <option value="wicketsBySeason">Wickets by Season</option>
                          <option value="averageBySeason">Average by Season</option>
                          <option value="bowlingDismissalsByType">Dismissal Types</option>
                        </select>
                      </div>
                      <div key={bowlingChartType} className="h-64">
                        {renderChart(bowlingChartData)}
                      </div>
                    </div>
                  )}
                </div>
                
              </div>
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
