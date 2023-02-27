using System;
using System.Collections.Generic;
using System.Linq;
using CricketClubDomain;
using CricketClubMiddle;
using jqPlot;

namespace api.model
{
    internal static class ChartBuilder
    {
        public static ChartJsConfig BuildBattingTimelineChart(int playerId)
        {
            var player = new Player(playerId);
            IEnumerable<KeyValuePair<Match, int>> scores = player.GetAllScores().ToList();
            var averageData = new ChartJsDataSet();
            var scoresData = new ChartJsDataSet()
            {
                type = "bar"
            };
            var labels = new List<string>();

            int innings = 0;
            int totalRuns = 0;

            foreach (var pair in scores)
            {
                var matchScore = pair.Value;
                totalRuns += matchScore;
                if (!player.WasNotOutIn(pair.Key))
                {
                    innings += 1;
                }

                decimal average;
                if (innings == 0)
                {
                    average = totalRuns;
                }
                else
                {
                    average = totalRuns / innings;
                }

                scoresData.data.Add(matchScore);
                labels.Add(pair.Key.MatchDate.ToString("dd MMM yy"));
                averageData.data.Add(average);
            }

            return BuildChartJsConfig("line", labels, "Batting Timeline", scoresData, averageData);
        } 
        
        public static ChartJsConfig BuildModeOfDismissalChart(int playerId)
        {
            var player = new Player(playerId);
            var battingStatsByMatch = player.GetBattingStatsByMatch();
            var dismissalCounts = new Dictionary<int, int>();
            foreach (BattingCardLineData stats in battingStatsByMatch.Select(a => a.Value))
            {
                if (!dismissalCounts.ContainsKey(stats.ModeOfDismissal))
                {
                    dismissalCounts.Add(stats.ModeOfDismissal, 1);
                }
                else
                {
                    dismissalCounts[stats.ModeOfDismissal] ++;
                }
            }

            List<string> labels = new List<string>();

            var dataSet = new ChartJsDataSet();
            
            foreach (var modeOfDismissal in dismissalCounts.Keys)
            {
                var modesOfDismissal = (ModesOfDismissal)modeOfDismissal;
                labels.Add(modesOfDismissal.ToString());
                dataSet.data.Add(dismissalCounts[modeOfDismissal]);
            }


            var modeOfDismissalChart = BuildChartJsConfig("doughnut", labels, "Modes of Dismissal", dataSet);
            modeOfDismissalChart.options.plugins.legend.display = true;
            modeOfDismissalChart.options.plugins.legend.position = "right";
            return modeOfDismissalChart;
        }

        private static ChartJsConfig BuildChartJsConfig(string type, List<string> labels, string title,
            params ChartJsDataSet[] dataSets)
        {
            return new ChartJsConfig()
            {
                type = type,
                data = new ChartJsData()
                {
                    labels = labels,
                    datasets = dataSets.ToList()
                },
                options = new ChartJsOptions()
                {
                    responsive = true,
                    plugins = new ChartJsPlugins()
                    {
                        title = new ChartJsTitleOptions()
                        {
                            display = true,
                            text = title
                        },
                        legend = new ChartJsLegendOptions()
                        {
                            display = false,
                            position = "top"
                        }
                    }
                }
            };
        }

        public static ChartJsConfig BuildWicketsBySeasonChart(int playerId)
        {
            var player = new Player(playerId);
            List<string> labels = new List<string>();
            var wicketCount = new ChartJsDataSet();

            foreach (var pairsByYear in player.GetBowlingStatsByMatch().GroupBy(p => p.Key.MatchDate.Year))
            {
                labels.Add(pairsByYear.Key.ToString());
                wicketCount.data.Add(pairsByYear.Sum(v=>v.Value.Wickets));
            }
            return BuildChartJsConfig("bar", labels, "Wickets by Season", wicketCount);
        }
        
        public static ChartJsConfig BuildAverageBySeasonChart(int playerId)
        {
            var player = new Player(playerId);
            List<string> labels = new List<string>();
            var wicketCount = new ChartJsDataSet();

            foreach (var pairsByYear in player.GetBowlingStatsByMatch().GroupBy(p => p.Key.MatchDate.Year))
            {
                labels.Add(pairsByYear.Key.ToString());
                var wicketsTaken = pairsByYear.Sum(v=>v.Value.Wickets);
                var runConceeded = pairsByYear.Sum(v => v.Value.Runs);
                wicketCount.data.Add(runConceeded / wicketsTaken);
            }
            return BuildChartJsConfig("bar", labels, "Average by Season", wicketCount);
        }
    }
}