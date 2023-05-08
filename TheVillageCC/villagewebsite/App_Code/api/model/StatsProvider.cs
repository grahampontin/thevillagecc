﻿using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Runtime.Remoting;
using CricketClubDAL;
using CricketClubDomain;
using CricketClubMiddle;
using CricketClubMiddle.Stats;

namespace api.model
{
    [SuppressMessage("ReSharper", "InconsistentNaming")]
    [SuppressMessage("ReSharper", "FieldCanBeMadeReadOnly.Global")]
    [SuppressMessage("ReSharper", "MemberCanBePrivate.Global")]
    public class StatsProvider
    {
        public static StatsDataV1 Query(StatsQueryV1 query)
        {
            List<object> rows = new List<object>();
            List<StatsColumnDefinitionV1> columns = new List<StatsColumnDefinitionV1>();
            var venue = string.IsNullOrEmpty(query.venue) ? null : Venue.GetByName(query.venue);
            var matchTypes = query.matchTypes.SelectMany(ToEnum).ToList();
            switch (query.category)
            {
                case "batting":
                    var inScopeBatsmen = Player.GetAll().Where(a =>
                        a.GetMatchesPlayed(query.from, query.to, matchTypes,
                            venue) > 0);
                    rows = inScopeBatsmen.Select(p => new BattingStatsRowData(p, query.from, query.to,
                            matchTypes, venue)).Cast<object>()
                        .ToList();
                    columns = BattingStatsRowData.WithColumns(
                        BattingStatsRowData.PlayerName,
                        BattingStatsRowData.BattingPosition,
                        BattingStatsRowData.MatchesPlayed,
                        BattingStatsRowData.Innings,
                        BattingStatsRowData.NotOuts,
                        BattingStatsRowData.RunsScored,
                        BattingStatsRowData.HighScore,
                        BattingStatsRowData.BattingAverage,
                        BattingStatsRowData.HundredsScored,
                        BattingStatsRowData.FiftiesScored,
                        BattingStatsRowData.FoursHit,
                        BattingStatsRowData.SixesHit,
                        BattingStatsRowData.CatchesTaken,
                        BattingStatsRowData.Stumpings,
                        BattingStatsRowData.RunOuts);
                    break;
                case "bowling":
                    var inScopeBowlers = Player.GetAll().Where(a =>
                        a.GetMatchesPlayed(query.from, query.to, matchTypes,
                            venue) > 0);
                    rows = inScopeBowlers.Select(p => new BowlingStatsRowData(p, query.from, query.to,
                            matchTypes, venue)).Cast<object>()
                        .ToList();
                    columns = BowlingStatsRowData.WithColumns(
                        BowlingStatsRowData.PlayerName,
                        BowlingStatsRowData.BowlingAverage,
                        BowlingStatsRowData.WicketsTaken,
                        BowlingStatsRowData.Economy,
                        BowlingStatsRowData.Fivefers,
                        BowlingStatsRowData.StrikeRate,
                        BowlingStatsRowData.OversBowled,
                        BowlingStatsRowData.RunsConceded,
                        BowlingStatsRowData.BestBowlingFigures);
                    break;
                case "teams":
                    var inScopeTeams = Team.GetAll().Select(a => a.GetStats(query.from, query.to, matchTypes, venue))
                        .Where(a => a.GetMatchesPlayed() > 0).ToList();
                    rows = inScopeTeams.Select(t => new TeamStatsRowData(t)).Cast<object>().ToList();
                    columns = TeamStatsRowData.ColumnDefinitions;
                    break;
                case "venues":
                    var inScopeVenues = Venue.GetAll().Select(a => a.GetStats(query.from, query.to, matchTypes))
                        .Where(a => a.GetMatchesPlayed() > 0).ToList();
                    rows = inScopeVenues.Select(t => new VenueStatsRowData(t)).Cast<object>().ToList();
                    columns = VenueStatsRowData.ColumnDefinitions;
                    break;
                case "captains":
                    var captainStatsList = CaptainStats.GetAll(query.from, query.to, matchTypes, venue);
                    rows = captainStatsList.Select(t => new CaptainStatsRowData(t)).Cast<object>().ToList();
                    columns = CaptainStatsRowData.ColumnDefinitions;
                    break;
                case "keepers":
                    var keeperStatsList = KeeperStats.GetAll(query.from, query.to, matchTypes, venue);
                    rows = keeperStatsList.Select(t => new KeeperStatsRowData(t)).Cast<object>().ToList();
                    columns = KeeperStatsRowData.ColumnDefinitions;
                    break;
                case "matches":
                    var matchStatsList = Match.GetAll(query.from, query.to, matchTypes, venue);
                    rows = matchStatsList.Select(t => new MatchStatsRowData(t)).Cast<object>().ToList();
                    columns = MatchStatsRowData.ColumnDefinitions;
                    break;
            }

            return new StatsDataV1()
            {
                statsType = query.category,
                gridOptions = new AGGridOptions()
                {
                    columnDefs = columns,
                    rowData = rows
                }
            };
        }

        private static IEnumerable<MatchType> ToEnum(string s)
        {
            switch (s)
            {
                case "League":
                    yield return MatchType.NELCL;
                    yield return MatchType.NELCL_Cup;
                    break;
                case "Friendly":
                    yield return MatchType.Friendly;
                    break;
                case "Tour":
                    yield return MatchType.Tour;
                    break;
                case "Declaration":
                    yield return MatchType.Declaration;
                    break;
                case "T20":
                    yield return MatchType.Twenty20;
                    break;
                default:
                    throw new Exception("Don't know how to parse " + s);
            }
        }

        public static PlayerDetailV1 QueryPlayer(int playerId, Func<String, String> pathMapper)
        {
            var player = new Player(playerId);
            return new PlayerDetailV1()
            {
                player = PlayerV1.FromInternal(player),
                battingStats = BattingStatsFrom(player),
                bowlingStats = BowlingStatsFrom(player),
                playerImage = LoadPlayerImage(player, pathMapper)
            };
        }

        private static string LoadPlayerImage(Player player, Func<string, string> pathMapper)
        {
            var filePath = MakeFileName(player.Id, pathMapper);
            var image = Image.FromFile(File.Exists(filePath) ? filePath : MakeFileName(0, pathMapper));

            return ImageToBase64(image, ImageFormat.Png);
        }

        private static string MakeFileName(int playerId, Func<string, string> pathMapper)
        {
            return pathMapper("/images/player_profiles/" + playerId + ".png");
        }

        public static string ImageToBase64(Image image,
            ImageFormat format)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                // Convert Image to byte[]
                image.Save(ms, format);
                byte[] imageBytes = ms.ToArray();

                // Convert byte[] to Base64 String
                return Convert.ToBase64String(imageBytes);
            }
        }

        private static StatsDataV1 BowlingStatsFrom(Player player)
        {
            return new StatsDataV1()
            {
                statsType = "player bowling",
                gridOptions = new AGGridOptions()
                {
                    columnDefs = BowlingStatsRowData.WithColumns(
                        BowlingStatsRowData.MatchType,
                        BowlingStatsRowData.MatchesPlayed,
                        BowlingStatsRowData.BowlingAverage,
                        BowlingStatsRowData.WicketsTaken,
                        BowlingStatsRowData.Economy,
                        BowlingStatsRowData.Fivefers,
                        BowlingStatsRowData.StrikeRate,
                        BowlingStatsRowData.OversBowled,
                        BowlingStatsRowData.RunsConceded,
                        BowlingStatsRowData.BestBowlingFigures),
                    rowData = BuildBowlingRows(player, b => Format((MatchType)b.MatchTypeID),
                        new[] { "League", "Tour", "Friendly", "T20" }),
                    footerRow = new BowlingStatsRowData(player, s => true, "Total")
                }
            };
        }

        private static StatsDataV1 BattingStatsFrom(Player player)
        {
            return new StatsDataV1()
            {
                statsType = "player batting",
                gridOptions = new AGGridOptions()
                {
                    columnDefs = BattingStatsRowData.WithColumns(
                        BattingStatsRowData.MatchType,
                        BattingStatsRowData.MatchesPlayed,
                        BattingStatsRowData.BattingPosition,
                        BattingStatsRowData.Innings,
                        BattingStatsRowData.NotOuts,
                        BattingStatsRowData.RunsScored,
                        BattingStatsRowData.HighScore,
                        BattingStatsRowData.BattingAverage,
                        BattingStatsRowData.HundredsScored,
                        BattingStatsRowData.FiftiesScored,
                        BattingStatsRowData.FoursHit,
                        BattingStatsRowData.SixesHit,
                        BattingStatsRowData.CatchesTaken,
                        BattingStatsRowData.Stumpings,
                        BattingStatsRowData.RunOuts),
                    rowData = BuildBattingRows(player, b => Format((MatchType)b.MatchTypeID),
                        new[] { "League", "Tour", "Friendly", "T20" }),
                    footerRow = new BattingStatsRowData(player, s => true, "Total")
                }
            };
        }

        private static string Format(MatchType matchType)
        {
            switch (matchType)
            {
                case MatchType.NELCL:
                    return "League";
                case MatchType.Tour:
                    return "Tour";
                case MatchType.Friendly:
                case MatchType.Declaration:
                    return "Friendly";
                case MatchType.Twenty20:
                    return "T20";
                default:
                    throw new ArgumentOutOfRangeException("matchType", matchType, null);
            }
        }

        private static List<object> BuildBattingRows(Player player, Func<IStatsEntryData, string> keyAccessor,
            IEnumerable<string> partitions)
        {
            return partitions.Select(p => new BattingStatsRowData(player, s => keyAccessor(s) == p, p)).Cast<object>()
                .ToList();
        }

        private static List<object> BuildBowlingRows(Player player, Func<IStatsEntryData, string> keyAccessor,
            IEnumerable<string> partitions)
        {
            return partitions.Select(p => new BowlingStatsRowData(player, s => keyAccessor(s) == p, p)).Cast<object>()
                .ToList();
        }

        public static ChartJsConfig BuildChartData(int playerId, string chartType)
        {
            switch (chartType)
            {
                //Batting
                case "battingTimeline":
                    return ChartBuilder.BuildBattingTimelineChart(playerId);
                case "modesOfDismissal":
                    return ChartBuilder.BuildModeOfDismissalChart(playerId);
                case "scoringZones":
                    return ChartBuilder.BuildScoringZonesChart(playerId);
                //Bowling
                case "wicketsBySeason":
                    return ChartBuilder.BuildWicketsBySeasonChart(playerId);
                case "averageBySeason":
                    return ChartBuilder.BuildAverageBySeasonChart(playerId);
                case "bowlingDismissalsByType":
                    return ChartBuilder.BuildBowlingDismissalTypesPieChart(playerId);
                default:
                    throw new Exception("Chart " + chartType + " not supported");
            }
        }

        public static IEnumerable<StatsDataV1> GetPlayerStatsBreakDown(int playerId, string statsType)
        {
            var player = new Player(playerId);
            switch (statsType.ToUpper())
            {
                case "BATTING":
                    return GetPlayerBattingStatsBreakDown(player);
                case "BOWLING":
                    return GetPlayerBowlingStatsBreakDown(player);
                default:
                    throw new ArgumentOutOfRangeException("Must supply Batting or Bowling, not " + statsType);
            }
        }

        private static IEnumerable<StatsDataV1> GetPlayerBattingStatsBreakDown(Player player)
        {
            var dataByMatch = player.GetBattingStatsByMatch().ToList();

            yield return PlayerBattingDataWithPivot("Vs Opposition", k => k.Key.Opposition.Name, dataByMatch, player,
                new StatsColumnDefinitionV1("", "tableKey"));
            yield return PlayerBattingDataWithPivot("At Position", k => k.Value.BattingAt, dataByMatch, player);
            yield return PlayerBattingDataWithPivot("By Year", k => k.Key.MatchDate.Year, dataByMatch, player,
                new StatsColumnDefinitionV1("", "tableKey"));
            yield return PlayerBattingDataWithPivot("Under Captain", k => k.Key.Captain.Name, dataByMatch, player,
                new StatsColumnDefinitionV1("", "tableKey", "LinkToPlayerStatsRenderer"));
            yield return PlayerBattingDataWithPivot("Batting 1st", k => k.Key.OppositionBattedFirst ? "2nd" : "1st",
                dataByMatch,
                player, new StatsColumnDefinitionV1("", "tableKey"));
            yield return PlayerBattingDataWithPivot("Toss", k => k.Key.WonToss ? "Won" : "Lost", dataByMatch, player,
                new StatsColumnDefinitionV1("", "tableKey"));
            yield return PlayerBattingDataWithPivot("As Captain",
                k => k.Key.Captain.Id == player.Id ? "Captain" : "Not Captain",
                dataByMatch, player, new StatsColumnDefinitionV1("", "tableKey"));
            yield return PlayerBattingDataWithPivot("As Keeper",
                k => k.Key.WicketKeeper.Id == player.Id ? "Keeper" : "Not Keeper",
                dataByMatch, player, new StatsColumnDefinitionV1("", "tableKey"));
            yield return PlayerBattingDataWithPivot("Match Result",
                k => k.Key.Winner != null && k.Key.Winner.ID == Team.OurTeam.ID ? "Won" :
                    k.Key.ResultDrawn ? "Drawn" : "Lost",
                dataByMatch, player, new StatsColumnDefinitionV1("", "tableKey"));
        }

        private static IEnumerable<StatsDataV1> GetPlayerBowlingStatsBreakDown(Player player)
        {
            List<KeyValuePair<Match, BowlingStatsEntryData>> dataByMatch = player.GetBowlingStatsByMatch().ToList();

            yield return PlayerBowlingDataWithPivot("Vs Opposition", k => k.Key.Opposition.Name, dataByMatch, player,
                new StatsColumnDefinitionV1("", "tableKey"));
            yield return PlayerBowlingDataWithPivot("By Year", k => k.Key.MatchDate.Year, dataByMatch, player,
                new StatsColumnDefinitionV1("", "tableKey"));
            yield return PlayerBowlingDataWithPivot("Under Captain", k => k.Key.Captain.Name, dataByMatch, player,
                new StatsColumnDefinitionV1("", "tableKey", "LinkToPlayerStatsRenderer"));
            yield return PlayerBowlingDataWithPivot("Bowling 1st", k => k.Key.OppositionBattedFirst ? "1st" : "2nd",
                dataByMatch,
                player, new StatsColumnDefinitionV1("", "tableKey"));
            yield return PlayerBowlingDataWithPivot("Toss", k => k.Key.WonToss ? "Won" : "Lost", dataByMatch, player,
                new StatsColumnDefinitionV1("", "tableKey"));
            yield return PlayerBowlingDataWithPivot("As Captain",
                k => k.Key.Captain.Id == player.Id ? "Captain" : "Not Captain",
                dataByMatch, player, new StatsColumnDefinitionV1("", "tableKey"));
            yield return PlayerBowlingDataWithPivot("Match Result",
                k => k.Key.Winner != null && k.Key.Winner.ID == Team.OurTeam.ID ? "Won" :
                    k.Key.ResultDrawn ? "Drawn" : "Lost",
                dataByMatch, player, new StatsColumnDefinitionV1("", "tableKey"));
        }

        private static StatsDataV1 PlayerBattingDataWithPivot<T>(string gridName,
            Func<KeyValuePair<Match, BattingCardLineData>, T> groupFunction,
            List<KeyValuePair<Match, BattingCardLineData>> dataByMatch, Player player,
            params StatsColumnDefinitionV1[] additionalKeyColumn)
        {
            return PlayerStatsBreakDown(gridName, () =>
            {
                var rows = new List<BattingStatsRowData>();
                foreach (var group in dataByMatch.GroupBy(groupFunction).OrderBy(g => g.Key))
                {
                    var matchIdsVsThisOpposition = group.Select(g => g.Key.ID).ToHashSet();
                    rows.Add(new BattingStatsRowData(player, e => matchIdsVsThisOpposition.Contains(e.MatchID),
                        group.Key.ToString()));
                }

                return rows;
            }, BattingStatsRowData.WithColumns(
                BattingStatsRowData.BattingPosition,
                BattingStatsRowData.MatchesPlayed,
                BattingStatsRowData.Innings,
                BattingStatsRowData.NotOuts,
                BattingStatsRowData.RunsScored,
                BattingStatsRowData.HighScore,
                BattingStatsRowData.BattingAverage,
                BattingStatsRowData.HundredsScored,
                BattingStatsRowData.FiftiesScored,
                BattingStatsRowData.FoursHit,
                BattingStatsRowData.SixesHit,
                BattingStatsRowData.CatchesTaken,
                BattingStatsRowData.Stumpings,
                BattingStatsRowData.RunOuts), additionalKeyColumn);
        }

        private static StatsDataV1 PlayerBowlingDataWithPivot<T>(string gridName,
            Func<KeyValuePair<Match, BowlingStatsEntryData>, T> groupFunction,
            List<KeyValuePair<Match, BowlingStatsEntryData>> dataByMatch, Player player,
            params StatsColumnDefinitionV1[] additionalKeyColumn)
        {
            return PlayerStatsBreakDown(gridName, () =>
            {
                var rows = new List<BowlingStatsRowData>();
                foreach (var group in dataByMatch.GroupBy(groupFunction).OrderBy(g => g.Key))
                {
                    var matchIdsVsThisOpposition = group.Select(g => g.Key.ID).ToHashSet();
                    rows.Add(new BowlingStatsRowData(player, e => matchIdsVsThisOpposition.Contains(e.MatchID),
                        group.Key.ToString()));
                }

                return rows;
            }, BowlingStatsRowData.WithColumns(BowlingStatsRowData.BowlingAverage,
                BowlingStatsRowData.WicketsTaken,
                BowlingStatsRowData.Economy,
                BowlingStatsRowData.Fivefers,
                BowlingStatsRowData.StrikeRate,
                BowlingStatsRowData.OversBowled,
                BowlingStatsRowData.RunsConceded,
                BowlingStatsRowData.BestBowlingFigures), additionalKeyColumn);
        }

        private static StatsDataV1 PlayerStatsBreakDown<T>(string gridName, Func<List<T>> rowSupplier,
            List<StatsColumnDefinitionV1> defaultColumns, params StatsColumnDefinitionV1[] extraCols)
        {
            //vs Team
            var statsColumnDefinitionV1s = defaultColumns;
            statsColumnDefinitionV1s.InsertRange(0, extraCols);

            var data1 = new StatsDataV1()
            {
                statsType = gridName,
                gridOptions = new AGGridOptions()
                {
                    columnDefs = statsColumnDefinitionV1s,
                    rowData = new List<object>()
                }
            };
            data1.gridOptions.rowData.AddRange(((Func<IEnumerable<object>>)rowSupplier)());

            return data1;
        }

        private static StatsDataV1 GetMatchStatsForPlayer(int playerId)
        {
            var player = new Player(playerId);
            var bowlingStatsByMatch = player.GetBowlingStatsByMatch().ToArray();
            var battingStatsByMatch = player.GetBattingStatsByMatch().ToArray();
            var allMatches = bowlingStatsByMatch.Select(k => k.Key)
                .Union(battingStatsByMatch.Select(k => k.Key), new IsTheSameFreakingMatch()).OrderBy(m => m.MatchDate);

            var bowlingStatsByMatchID = bowlingStatsByMatch.ToDictionary(k => k.Key.ID, k => k.Value);
            var battingStatsByMatchID = battingStatsByMatch.ToDictionary(k => k.Key.ID, k => k.Value);

            return new StatsDataV1()
            {
                statsType = "Matches",
                gridOptions = new AGGridOptions()
                {
                    rowData = allMatches.Select(m => new PlayerMatchStatsV1(MatchV1.FromInternal(m),
                        new BattingStatsRowData(player, s => s.MatchID == m.ID, ""),
                        new BowlingStatsRowData(player, s => s.MatchID == m.ID, ""))).Cast<object>().ToList(),
                    columnDefs = PlayerMatchStatsV1.ColumnDefs
                }
            };
        }

        public static StatsDataV1 QueryPlayerMatches(int playerId)
        {
            return GetMatchStatsForPlayer(playerId);
        }
    }

    [SuppressMessage("ReSharper", "UnusedAutoPropertyAccessor.Global")]
    [SuppressMessage("ReSharper", "AutoPropertyCanBeMadeGetOnly.Local")]
    [SuppressMessage("ReSharper", "InconsistentNaming")]
    [SuppressMessage("ReSharper", "ArrangeObjectCreationWhenTypeEvident")]
    public class PlayerMatchStatsV1
    {
        public int id { get; private set; }
        public string matchDate { get; private set; }
        public string opposition { get; private set; }
        public int runs { get; private set; }
        public int batsAt { get; private set; }
        public string bowlingFigures { get; private set; }
        public string venue { get; private set; }
        public string format { get; private set; }

        
        public PlayerMatchStatsV1(MatchV1 match, BattingStatsRowData battingStatsRowData, BowlingStatsRowData bowlingStatsRowData)
        {
            id = match.Id;
            matchDate = match.Date;
            opposition = match.IsHome
                ? "The Village vs " + match.Opposition.Name
                : match.Opposition.Name + " vs The Village";
            batsAt = battingStatsRowData.batsAt;
            runs = battingStatsRowData.runs;
            bowlingFigures = bowlingStatsRowData.overs == 0 ? "-/-" : bowlingStatsRowData.wickets + "/" + bowlingStatsRowData.runs;
            venue = match.Venue.Name;
            format = match.Type;
        }

        public static List<StatsColumnDefinitionV1> ColumnDefs
        {
            get
            {
                return new List<StatsColumnDefinitionV1>()
                {
                    new StatsColumnDefinitionV1("Match", "opposition", "LinkToMatchReportRenderer"),
                    new StatsColumnDefinitionV1("Bat", "runs"),
                    new StatsColumnDefinitionV1("Bowl", "bowlingFigures"),
                    new StatsColumnDefinitionV1("Date", "matchDate"),
                    new StatsColumnDefinitionV1("At", "venue"),
                    new StatsColumnDefinitionV1("Format", "format"),
                };
            }
        }
    }

    public class PlayerDetailV1
    {
        public PlayerV1 player;
        public string playerImage;
        public StatsDataV1 battingStats;
        public StatsDataV1 bowlingStats;
    }

    public class IsTheSameFreakingMatch : EqualityComparer<Match>
    {
        public override bool Equals(Match x, Match y)
        {
            return y != null && x != null && x.ID == y.ID;
        }

        public override int GetHashCode(Match obj)
        {
            return obj.ID.GetHashCode();
        }
    }
}