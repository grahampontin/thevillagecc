﻿using System;
using System.Collections.Generic;
using System.Linq;
using CricketClubDAL;
using CricketClubDomain;
using CricketClubMiddle;
using CricketClubMiddle.Stats;
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
                    dismissalCounts[stats.ModeOfDismissal]++;
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
                wicketCount.data.Add(pairsByYear.Sum(v => v.Value.Wickets));
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
                var wicketsTaken = pairsByYear.Sum(v => v.Value.Wickets);
                var runConceeded = pairsByYear.Sum(v => v.Value.Runs);
                if (wicketsTaken == 0)
                {
                    wicketCount.data.Add(0);
                }
                else
                {
                    wicketCount.data.Add(runConceeded / wicketsTaken);
                }
            }

            return BuildChartJsConfig("bar", labels, "Average by Season", wicketCount);
        }

        public static ChartJsConfig BuildScoringZonesChart(int playerId)
        {
            var player = new Player(playerId);
            var ballsForBatsman = GetBallsForBatsman(playerId);
            List<string> labels = player.IsRightHandBat
                ? ScoringArea.GetAll().Select(s => s.nameForRightHandBat).ToList()
                : ScoringArea.GetAll().Select(s => s.nameForLeftHandBat).ToList();
            var ballsByScoringArea = ballsForBatsman.Where(b => b.Angle.HasValue)
                .GroupBy(b => ScoringArea.For(b.Angle.Value)).ToDictionary(g=>g.Key, g=>g.Sum(b=>b.Amount));
            List<object> data = new List<object>();
            foreach (var scoringArea in ScoringArea.GetAll())
            {
                data.Add(ballsByScoringArea.GetValueOrInitializeDefault(scoringArea, 0));
            }
            
            labels.Insert(6, "");
            data.Insert(6, null);
            
            labels.Insert(0, "");
            data.Insert(0, null);


            var chartJsDataSet = new ChartJsDataSet()
            {
                data = data,
                spanGaps = true
            };
            
            var chartJsConfig = BuildChartJsConfig("radar", labels, "Scoring Areas ("+ballsForBatsman.Count()+" Balls)", chartJsDataSet);
            chartJsConfig.options.scales = new ChartJsScales()
            {
                r = new ChartJsScale() { min = 0 }

            };
            return chartJsConfig;
        }
        
        public static ChartJsConfig BuildStrikeRateChart(int playerId)
        {
            var ballsForBatsman = GetBallsForBatsman(playerId);

            var data = new List<object>();
            var labels = new List<string>();

            var ballsByMatch = ballsForBatsman.GroupBy(b => b.MatchId).ToList();

            for (int ballNumber = 1; ballNumber < ballsForBatsman.Count; ballNumber+=10)
            {
            
                var ballsForThisSection = ballsByMatch.SelectMany(g => g.Where(b => !b.IsFieldingExtra() && !b.IsWide).OrderBy(b => b.BallNumber + (b.OverNumber * 6)).Skip(ballNumber - 1)
                    .Take(10)).ToArray();

                if (ballsForThisSection.Length > 0)
                {
                    labels.Add(ballNumber + "-"+ (ballNumber+9) + " ("+ballsForThisSection.Length+" balls)");
                    var score = ballsForThisSection.Sum(b => b.Amount);
                
                    var count = (decimal)score / ballsForThisSection.Length;
                    data.Add(count*100);    
                }
                
            }
            var chartJsDataSet = new ChartJsDataSet()
            {
                data = data
            };
            
            var chartJsConfig = BuildChartJsConfig("bar", labels, "Strike Rates ("+ballsForBatsman.Count()+" Balls)", chartJsDataSet);
            return chartJsConfig;
        }
        public static ChartJsConfig BuildSoreVelocityChart(int playerId)
        {
            var ballsForBatsman = GetBallsForBatsman(playerId);

            var data = new List<object>();
            var labels = new List<string>();

            var ballsByMatch = ballsForBatsman.GroupBy(b => b.MatchId).ToList();

            var player = new Player(playerId);
            int scoreBuckets = player.GetHighScore() / 10;

            for (int i = 1; i < scoreBuckets-1; i++)
            {
                var scoreToAttain = i * 10;
                List<int> ballsAttainScore = new List<int>();
                foreach (var match in ballsByMatch)
                {
                    var attainedScore = 0;
                    
                    var ballsInOrder = match.OrderBy(b => b.OverNumber * 6 + b.BallNumber);
                    while (attainedScore < scoreToAttain)
                    {
                        
                    }

                }
            }
            
            
            var chartJsDataSet = new ChartJsDataSet()
            {
                data = data
            };
            
            var chartJsConfig = BuildChartJsConfig("bar", labels, "Strike Rates ("+ballsForBatsman.Count()+" Balls)", chartJsDataSet);
            return chartJsConfig;
        }

        private static List<Ball> GetBallsForBatsman(int playerId)
        {
            var ballsForBatsman = BallByBallStats.GetAllBalls().Where(b => b.Batsman == playerId).ToList();
            return ballsForBatsman;
        }

        public static ChartJsConfig BuildBowlingDismissalTypesPieChart(int playerId)
        {
            var player = new Player(playerId);
            var wicketsByDismissalType = Match.GetResults()
                .SelectMany(m => m.GetTheirBattingScoreCard().ScorecardData)
                .Where(l => l.Bowler.Id == playerId)
                .GroupBy(l => l.Dismissal)
                .ToDictionary(g=>g.Key, g=>g.Count());

            
            var pieChart = BuildChartJsConfig("pie",
                wicketsByDismissalType.Keys.Select(k => k.ToString()).ToList(), "Dismissal Types", new ChartJsDataSet()
                {
                    data = wicketsByDismissalType.Values.Cast<object>().ToList(),
                    
                });
            pieChart.options.plugins.legend.display = true;
            pieChart.options.plugins.legend.position = "right";

            return pieChart;

        }
    }
}