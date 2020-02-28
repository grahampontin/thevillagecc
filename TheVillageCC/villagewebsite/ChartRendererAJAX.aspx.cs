using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Web.UI;
using CricketClubDomain;
using CricketClubMiddle;
using CricketClubMiddle.Stats;
using jqPlot;

public partial class ChartRendererAJAX : Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string chartName = Request["chartName"];
        int playerId = Convert.ToUInt16(Request["playerid"]);
        var player = new Player(playerId);

        var battingChart = new Chart("battingChart");
        var bowlingChart = new Chart("bowlingChart");
        switch (chartName)
        {
            case "battingTimeline":
                MakeBattingTimelineChart(player, battingChart);
                RenderBattingChart(chartName, battingChart);
                break;
            case "scoreBuckets":
                MakeScoreBucketsChart(player, battingChart);
                RenderBattingChart(chartName, battingChart);
                break;
            case "battingTimelineDismissals":
                MakeBattingDismissalsTimelineChart(player, battingChart);
                RenderBattingChart(chartName, battingChart);
                break;
            case "positions":
                MakeBattingPositionsTimelineChart(player, battingChart);
                RenderBattingChart(chartName, battingChart);
                break;
            case "battingDismissals":
                MakeBattingDismissalsPie(player, battingChart);
                RenderBattingChart(chartName, battingChart);
                break;
            case "scoringTypesTimeline":
                MakeScoringTypesTimeLine(player, battingChart);
                RenderBattingChart(chartName, battingChart);
                break;
            case "averageBySeason":
                MakeBattingAverageBySeasonGraph(player, battingChart);
                RenderBattingChart(chartName, battingChart);
                break;
            case "averageByPosition":
                MakeBattingAverageByPositionGraph(player,battingChart);
                RenderBattingChart(chartName, battingChart);
                break;
            case "bowlingEconomyTimeline":
                MakeBowlingTimelineChart(player, bowlingChart, "econ");
                RenderBowlingChart(chartName, bowlingChart);
                break;
            case "bowlingAverageTimeline":
                MakeBowlingTimelineChart(player, bowlingChart, "ave");
                RenderBowlingChart(chartName, bowlingChart);
                break;
            case "bowlingSRTimeline":
                MakeBowlingTimelineChart(player, bowlingChart, "sr");
                RenderBowlingChart(chartName, bowlingChart);
                break;
            case "bowlingDismissals":
                MakeBowlingDismissalsChart(player, bowlingChart);
                RenderBowlingChart(chartName, bowlingChart);
                break;
            case "bowlingBatsmenDismissed":
                MakeBowlingBatsmenDismissedChart(player, bowlingChart);
                RenderBowlingChart(chartName, bowlingChart);
                break;

            default:
                RenderErrorMessage(chartName);
                break;
        }

        
        
    }

   private void MakeBowlingDismissalsChart(Player player, Chart chart)
    {
        Dictionary<Match, List<BattingCardLineData>> dismissedBatsmenData = player.GetDismissedBatsmenData();
        var countsByDismissalType = dismissedBatsmenData.SelectMany<KeyValuePair<Match, List<BattingCardLineData>>, BattingCardLineData>(t => t.Value).GroupBy(l => l.ModeOfDismissal).ToDictionary(g=>(ModesOfDismissal)g.Key, g=>g.AsEnumerable().Count());
        var data =
            new PieSeriesData(
                countsByDismissalType.Select(
                    a => new KeyValuePair<string, double>(a.Key.ToString(), a.Value)));
        chart.AddSeries(data);
        chart.options.AddSeriesOptions(SeriesTypes.Pie);
        chart.options.legend.show = true;
        chart.options.legend.location = LegendLocations.East;

        var onlyXAxisDefinition = new OnlyXAxisDefinition();
        onlyXAxisDefinition.xaxis.showLabel = false;
        chart.options.axes = onlyXAxisDefinition;
    }

    private void MakeBowlingBatsmenDismissedChart(Player player, Chart chart)
    {
        var dismissedBatsmenData = player.GetDismissedBatsmenData();
        var countsByBattingAt = dismissedBatsmenData.SelectMany(t => t.Value).GroupBy(l => l.BattingAt).ToDictionary(g => g.Key, g => g.AsEnumerable().Count());
        YOnlySeriesData data = new YOnlySeriesData();
        for (int position=0; position<11; position++)
        {
            chart.options.axes.xaxis.AddTick((position + 1).ToString());
            data.AddPoint(countsByBattingAt.ContainsKey(position)?countsByBattingAt[position]:0);
        }

        chart.options.axes.xaxis.renderer = AxisRenderers.CategoryAxisRenderer;
        chart.AddSeries(data);
        chart.options.AddSeriesOptions(SeriesTypes.Bar);
        chart.options.axes.xaxis.label = "Batting at";
        chart.options.axes.yaxis.label = "Times dismissed";
    }

    private void MakeBowlingTimelineChart(Player player, Chart chart, string whichStat)
    {
        IEnumerable<KeyValuePair<Match, BowlingStatsEntryData>> bowlingStatsByMatch = player.GetBowlingStatsByMatch();
        int totalWickets = 0;
        int totalRuns = 0;
        decimal totalOvers = 0;
        YOnlySeriesData strikeRates = new YOnlySeriesData();
        YOnlySeriesData econ = new YOnlySeriesData();
        YOnlySeriesData averages = new YOnlySeriesData();

        int count = 0;

        foreach (BowlingStatsEntryData bowlingStatsEntryData in bowlingStatsByMatch.Select(a=>a.Value).Where(a=>a.Overs >0))
        {
            count++;
            totalOvers += bowlingStatsEntryData.Overs;
            totalRuns += bowlingStatsEntryData.Runs;
            totalWickets += bowlingStatsEntryData.Wickets;

            double strikeRate = totalWickets == 0 ? 0 : Convert.ToDouble((totalOvers*6)/totalWickets);
            double economy = totalOvers == 0 ? 0 : Convert.ToDouble(totalRuns/totalOvers);
            double average = totalWickets == 0 ? 0 : (double)totalRuns/totalWickets;

            strikeRates.AddPoint(strikeRate);
            econ.AddPoint(economy);
            averages.AddPoint(average);
            chart.options.axes.xaxis.AddTick(bowlingStatsEntryData.MatchDate.ToString("dd MMM yy"));

        }

        switch(whichStat)
        {
            case "econ":
                chart.AddSeries(econ);
                chart.options.axes.yaxis.label = "Economy";
                break;
            case "sr":
                chart.AddSeries(strikeRates);
                chart.options.axes.yaxis.label = "Strike Rate";
                break;
            case "ave":
                chart.AddSeries(averages);
                chart.options.axes.yaxis.label = "Average";
                break;
        }

        chart.options.axes.xaxis.renderer = AxisRenderers.CategoryAxisRenderer;
        chart.options.axes.xaxis.tickRenderer = TickRenderers.RotatableTickRenderer;
        chart.options.axes.xaxis.tickOptions.angle = -90;
        chart.options.axes.xaxis.label = Labels.NoLabel;
        SeriesOptions options = chart.options.AddSeriesOptions(SeriesTypes.Line);
        options.showMarker = false;
    }

    private void MakeBattingAverageByPositionGraph(Player player, Chart chart)
    {
        IEnumerable<KeyValuePair<Match, BattingCardLineData>> stats = player.GetBattingStatsByMatch().Where(a => a.Value.ModeOfDismissal != (int)ModesOfDismissal.DidNotBat).ToList();
        IOrderedEnumerable<int> positions = stats.Select(a => a.Value.BattingAt).Distinct().OrderBy(a => a);
        YOnlySeriesData data = new YOnlySeriesData();
        foreach (int position in positions)
        {
            chart.options.axes.xaxis.AddTick((position+1).ToString());
            IEnumerable<BattingCardLineData> positionalStats = stats.Where(a => a.Value.BattingAt == position).Select(a => a.Value);
            double average = StatsHelper.GetBattingAverage(positionalStats);
            data.AddPoint(average);
        }

        chart.options.axes.xaxis.renderer = AxisRenderers.CategoryAxisRenderer;
        chart.AddSeries(data);
        chart.options.AddSeriesOptions(SeriesTypes.Bar);
        chart.options.axes.xaxis.label = "Batting at";
        chart.options.axes.yaxis.label = "Batting Average";
    }

    private void MakeBattingAverageBySeasonGraph(Player player, Chart chart)
    {
        IEnumerable<KeyValuePair<Match, BattingCardLineData>> stats = player.GetBattingStatsByMatch().Where(a => a.Value.ModeOfDismissal != (int)ModesOfDismissal.DidNotBat).ToList();
        IOrderedEnumerable<int> seasons = stats.Select(a => a.Value.MatchDate.Year).Distinct().OrderBy(a => a);
        YOnlySeriesData data = new YOnlySeriesData();
        foreach (int season in seasons)
        {
            chart.options.axes.xaxis.AddTick(season.ToString());
            IEnumerable<BattingCardLineData> seasonStats = stats.Where(a => a.Value.MatchDate.Year == season).Select(a=>a.Value);
            double average = StatsHelper.GetBattingAverage(seasonStats);
            data.AddPoint(average);
        }

        chart.options.axes.xaxis.renderer = AxisRenderers.CategoryAxisRenderer;
        chart.AddSeries(data);
        chart.options.AddSeriesOptions(SeriesTypes.Bar);
        chart.options.axes.xaxis.label = Labels.NoLabel;
        chart.options.axes.yaxis.label = "Batting Average";

    }

    private void MakeScoringTypesTimeLine(Player player, Chart chart)
    {
        IList<KeyValuePair<Match, BattingCardLineData>> battingStatsByMatch = player.GetBattingStatsByMatch().ToList();
        var runs = new YOnlySeriesData();
        var fours = new YOnlySeriesData();
        var sixes = new YOnlySeriesData();
        int totalRuns = 0;
        int totalScoreInFours = 0;
        int totalScoreInSixes = 0;
        int totalScoreInRuns = 0;
        int count = 0;

        var ticks = new List<string>();
        foreach (BattingCardLineData battingCardLineData in battingStatsByMatch.Select(a => a.Value).ToList())
        {
            count++;
            ticks.Add(battingCardLineData.MatchDate.ToString("dd MMM yy"));
            totalRuns += battingCardLineData.Score;
            int scoredInFours = battingCardLineData.Fours*4;
            totalScoreInFours += scoredInFours;
            int scoredInSixes = battingCardLineData.Sixes*6;
            totalScoreInSixes += scoredInSixes;
            int scoredInRuns = battingCardLineData.Score - scoredInFours - scoredInSixes;
            totalScoreInRuns += scoredInRuns;

            if (count > 5)
            {
                fours.AddPoint(totalScoreInFours/(double) totalRuns*100);
                sixes.AddPoint(totalScoreInSixes/(double) totalRuns*100);
                runs.AddPoint(totalScoreInRuns/(double) totalRuns*100);
            }
        }

        chart.AddSeries(fours);
        chart.AddSeries(sixes);
        chart.AddSeries(runs);
        SeriesOptions foursSeries = chart.options.AddSeriesOptions(SeriesTypes.Line, "Fours");
        foursSeries.showMarker = false;
        SeriesOptions sixesSeriesOptions = chart.options.AddSeriesOptions(SeriesTypes.Line, "Sixes");
        sixesSeriesOptions.showMarker = false;
        SeriesOptions runsSeriesOptions = chart.options.AddSeriesOptions(SeriesTypes.Line, "Runs");
        runsSeriesOptions.showMarker = false;

        chart.options.axes.xaxis.AddTicks(ticks.Skip(5));
        chart.options.axes.xaxis.renderer = AxisRenderers.CategoryAxisRenderer;
        chart.options.axes.xaxis.tickRenderer = TickRenderers.RotatableTickRenderer;
        chart.options.axes.xaxis.tickOptions.angle = -90;

        chart.options.axes.xaxis.label = Labels.NoLabel;
        chart.options.axes.yaxis.label = "Percentage of Runs";

        chart.options.axes.yaxis.max = "60";
        chart.options.axes.yaxis.min = "0";

        chart.options.legend.show = true;
        chart.options.legend.location = LegendLocations.East;
        chart.options.legend.placement = LegendPlacements.OutsideGrid;
    }

    private void MakeBattingDismissalsPie(Player player, Chart battingChart)
    {
        IEnumerable<KeyValuePair<Match, BattingCardLineData>> battingStatsByMatch = player.GetBattingStatsByMatch();
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
        var data =
            new PieSeriesData(
                dismissalCounts.Select(
                    a => new KeyValuePair<string, double>(((ModesOfDismissal) a.Key).ToString(), a.Value)));
        battingChart.AddSeries(data);
        battingChart.options.AddSeriesOptions(SeriesTypes.Pie);
        battingChart.options.legend.show = true;
        battingChart.options.legend.location = LegendLocations.East;

        var onlyXAxisDefinition = new OnlyXAxisDefinition();
        onlyXAxisDefinition.xaxis.showLabel = false;
        battingChart.options.axes = onlyXAxisDefinition;
    }

    private void MakeBattingPositionsTimelineChart(Player player, Chart battingChart)
    {
        IEnumerable<KeyValuePair<Match, BattingCardLineData>> battingStatsByMatch = player.GetBattingStatsByMatch();
        var seriesData = new YOnlySeriesData();
        foreach (var pair in battingStatsByMatch)
        {
            int battingAt = pair.Value.BattingAt;
            seriesData.AddPoint(battingAt + 1);
            battingChart.options.axes.xaxis.AddTick(pair.Key.MatchDate.ToString("dd MMM yy"));
        }
        battingChart.AddSeries(seriesData);
        battingChart.options.axes.xaxis.renderer = AxisRenderers.CategoryAxisRenderer;
        battingChart.options.axes.xaxis.label = Labels.NoLabel;
        battingChart.options.axes.xaxis.tickRenderer = TickRenderers.RotatableTickRenderer;
        battingChart.options.axes.xaxis.tickOptions.angle = -90;

        battingChart.options.axes.yaxis.label = "Batting Position";
        for (int i = 1; i < 12; i++)
        {
            battingChart.options.axes.yaxis.AddTick(i.ToString());
        }
    }

    private void MakeBattingDismissalsTimelineChart(Player player, Chart battingChart)
    {
        int count = 0;
        var dismissalCounts = new Dictionary<int, int>();
        IEnumerable<KeyValuePair<Match, BattingCardLineData>> battingStatsByMatch = player.GetBattingStatsByMatch();
        var series = new Dictionary<int, YOnlySeriesData>();


        foreach (var statsEntry in battingStatsByMatch)
        {
            int modeOfDismissal = statsEntry.Value.ModeOfDismissal;
            if (modeOfDismissal != (int) ModesOfDismissal.DidNotBat)
            {
                count = count + 1;
                if (!dismissalCounts.ContainsKey(modeOfDismissal))
                {
                    dismissalCounts.Add(modeOfDismissal, 1);
                }
                else
                {
                    dismissalCounts[modeOfDismissal] += 1;
                }
                if (count >= 5)
                {
                    foreach (int dismissalType in Enum.GetValues(typeof (ModesOfDismissal)))
                    {
                        int dismissalCount = 0;
                        if (dismissalCounts.ContainsKey(dismissalType))
                        {
                            dismissalCount = dismissalCounts[dismissalType];
                        }
                        if (!series.ContainsKey(dismissalType))
                        {
                            var seriesData = new YOnlySeriesData();
                            series.Add(dismissalType, seriesData);
                        }
                        series[dismissalType].AddPoint((double) dismissalCount/count*100);
                    }
                    battingChart.options.axes.xaxis.AddTick(statsEntry.Key.MatchDate.ToString("dd MMM yy"));
                }
            }
        }

        battingChart.options.axes.yaxis.max = "60";
        battingChart.options.axes.yaxis.min = "0";
        battingChart.options.axes.yaxis.label = "Percentage of Dismissals";
        battingChart.options.axes.yaxis.angle = -90;

        battingChart.options.axes.xaxis.tickRenderer = TickRenderers.RotatableTickRenderer;
        battingChart.options.axes.xaxis.tickOptions.angle = -90;
        battingChart.options.axes.xaxis.renderer = AxisRenderers.CategoryAxisRenderer;
        battingChart.options.axes.xaxis.label = Labels.NoLabel;

        battingChart.options.legend.show = true;
        battingChart.options.legend.location = LegendLocations.East;
        battingChart.options.legend.placement = LegendPlacements.OutsideGrid;

        foreach (var yOnlySeriesData in series)
        {
            if (yOnlySeriesData.Value.Points.Any(a => a != 0))
            {
                battingChart.AddSeries(yOnlySeriesData.Value);
                var options = new SeriesOptions();
                options.renderer = DataRenderers.LineRenderer;
                options.label = ((ModesOfDismissal) yOnlySeriesData.Key).ToString();
                options.showMarker = false;
                battingChart.options.AddSeriesOptions(options);
            }
        }
    }

    private void MakeScoreBucketsChart(Player player, Chart battingChart)
    {
        IList<KeyValuePair<Match, int>> scores = player.GetAllScores().ToList();
        var buckets = new List<string>();
        var counts = new List<double>();
        int lowValue = 0;
        int highValue = lowValue + 10;
        while (highValue <= 100)
        {
            int low = lowValue;
            int count = scores.Where(a => a.Value >= low && a.Value <= highValue).Count();
            counts.Add(count);
            buckets.Add(lowValue + " - " + highValue);
            lowValue = highValue + 1;
            highValue = lowValue + 9;
        }
        buckets.Add("100+");
        counts.Add(scores.Where(a => a.Value > 100).Count());

        battingChart.AddSeries(new YOnlySeriesData(counts));
        battingChart.options.AddSeriesOptions(SeriesTypes.Bar);
        battingChart.options.axes.xaxis.AddTicks(buckets);
        battingChart.options.axes.xaxis.renderer = AxisRenderers.CategoryAxisRenderer;
        battingChart.options.axes.xaxis.label = Labels.NoLabel;
        var highCount = (int) (counts.Max() + 1);
        int increment = highCount/10;
        if (increment == 0)
        {
            increment = 1;
        }
        for (int i = 0; i <= highCount + 1; i = i + increment)
        {
            battingChart.options.axes.yaxis.AddTick(i.ToString());
        }
        battingChart.options.axes.yaxis.label = Labels.NoLabel;
    }

    private void RenderBowlingChart(string chartName, Chart bowlingChart)
    {
        if (bowlingChart != null)
        {
            try
            {
                Chart1.Text = bowlingChart.Render(700, 300);
            }
            catch (Exception)
            {
                RenderErrorMessage(chartName);
            }
        }
       
    }

    private void RenderBattingChart(string chartName, Chart battingChart)
    {
        if (battingChart != null)
        {
            try
            {
                Chart1.Text = battingChart.Render(700, 300);
            }
            catch (Exception)
            {
                RenderErrorMessage(chartName);
            }
        }
     }

    private void MakeBattingTimelineChart(Player player, Chart chart)
    {
        var rawScores = new YOnlySeriesData();
        IEnumerable<KeyValuePair<Match, int>> scores = player.GetAllScores().ToList();
        rawScores.AddPoints(scores.Select(a => (double) a.Value).ToList());
        chart.AddSeries(rawScores);
        var rawScoresOptions = new SeriesOptions();
        rawScoresOptions.renderer = DataRenderers.BarRenderer;
        chart.options.AddSeriesOptions(rawScoresOptions);

        var average = new YOnlySeriesData();
        double totalRuns = 0;
        int innings = 0;
        foreach (var pair in scores)
        {
            totalRuns += pair.Value;
            if (!player.WasNotOutIn(pair.Key))
            {
                innings += 1;
            }
            if (innings == 0)
            {
                average.AddPoint(0);
                continue;
            }
            average.AddPoint(totalRuns/innings);
        }
        chart.AddSeries(average);

        chart.options.axes.xaxis.AddTicks(scores.Select(a => a.Key.MatchDate.ToString("dd MMM yy")));
        chart.options.axes.xaxis.renderer = AxisRenderers.CategoryAxisRenderer;
        chart.options.axes.xaxis.label = null;
        chart.options.axes.xaxis.tickRenderer = TickRenderers.RotatableTickRenderer;
        chart.options.axes.xaxis.tickOptions.angle = -90;

        chart.options.axes.yaxis.label = null;
        int max = scores.Select(a => a.Value).Max();
        int ymaxValue = ((max/10)*10 + 10);
        for (int i = 0; i <= ymaxValue; i += 10)
        {
            chart.options.axes.yaxis.AddTick(i.ToString());
        }
    }

    private void RenderErrorMessage(string chartName)
    {
        Chart1.Text = "<div class='ChartLoadingMessage'>OOPS! Couldn't create the chart \"" + chartName +
                      "\". It might not be ready yet.</div>";
    }
}