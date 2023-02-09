using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
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
                    var inScopeVenues = Venue.GetAll().Select(a => a.GetStats(query.from, query.to, matchTypes)).Where(a => a.GetMatchesPlayed() > 0).ToList();
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

        public static PlayerDetailV1 QueryPlayer(int playerId)
        {
            var player = new Player(playerId);
            return new PlayerDetailV1()
            {
                player = PlayerV1.FromInternal(player),
                battingStats = BattingStatsFrom(player),
                bowlingStats = BowlingStatsFrom(player)
            };
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
                case MatchType.NELCL_Cup:
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

        private static List<object> BuildBattingRows(Player player, Func<IStatsEntryData, string> keyAccessor, IEnumerable<string> partitions)
        {
            return partitions.Select(p => new BattingStatsRowData(player, s => keyAccessor(s) == p, p)).Cast<object>().ToList();
        }
        private static List<object> BuildBowlingRows(Player player, Func<IStatsEntryData, string> keyAccessor, IEnumerable<string> partitions)
        {
            return partitions.Select(p => new BowlingStatsRowData(player, s => keyAccessor(s) == p, p)).Cast<object>().ToList();
        }
    }

    public class PlayerDetailV1
    {
        public PlayerV1 player;
        public StatsDataV1 battingStats;
        public StatsDataV1 bowlingStats;
    }
}
