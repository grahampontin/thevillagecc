using System;
using System.Collections.Generic;
using CricketClubDomain;
using CricketClubMiddle;
// ReSharper disable ArrangeObjectCreationWhenTypeEvident
// ReSharper disable AutoPropertyCanBeMadeGetOnly.Local

namespace api.model
{
    public class BattingStatsRowData
    {
        public static List<StatsColumnDefinitionV1> ColumnDefinitions = new List<StatsColumnDefinitionV1>()
        {
            new StatsColumnDefinitionV1("Name", "name", "LinkToPlayerStatsRenderer"),
            new StatsColumnDefinitionV1("Bats", "batsAt"),
            new StatsColumnDefinitionV1("Mat", "matches"),
            new StatsColumnDefinitionV1("Innings", "innings"),
            new StatsColumnDefinitionV1("NO", "notOuts"),
            new StatsColumnDefinitionV1("Runs", "runs"),
            new StatsColumnDefinitionV1("HS", "highScore"),
            new StatsColumnDefinitionV1("Ave", "average"),
            new StatsColumnDefinitionV1("100s", "tons"),
            new StatsColumnDefinitionV1("50s", "fifties"),
            new StatsColumnDefinitionV1("4s", "fours"),
            new StatsColumnDefinitionV1("6s", "sixes"),
            new StatsColumnDefinitionV1("Ct", "catches"),
            new StatsColumnDefinitionV1("St", "stumpings"),
            new StatsColumnDefinitionV1("RO", "runOuts"),
        };


        public int id { get; private set; }
        public string name { get; private set; }
        public int batsAt { get; private set; }
        public int matches { get; private set; }
        public int innings { get; private set; }
        public int notOuts { get; private set; }
        public int runs { get; private set; }
        public string highScore { get; private set; }
        public decimal average { get; private set; }
        public int tons { get; private set; }
        public int fifties { get; private set; }
        public int fours { get; private set; }
        public int sixes { get; private set; }
        public int catches { get; private set; }
        public int stumpings { get; private set; }
        public int runOuts { get; private set; }

        public BattingStatsRowData(Player player, DateTime startDate, DateTime endDate, List<MatchType> MatchTypes,
            Venue venue)
        {
            id = player.ID;
            name = player.Name;
            batsAt = player.GetBattingPosition(startDate, endDate, MatchTypes, venue);
            matches = player.GetMatchesPlayed(startDate, endDate, MatchTypes, venue);
            innings = player.GetInnings(startDate, endDate, MatchTypes, venue);
            notOuts = player.GetNotOuts(startDate, endDate, MatchTypes, venue);
            tons = player.Get100sScored(startDate, endDate, MatchTypes, venue);
            fifties = player.Get50sScored(startDate, endDate, MatchTypes, venue);
            fours = player.Get4s(startDate, endDate, MatchTypes, venue);
            sixes = player.Get6s(startDate, endDate, MatchTypes, venue);
            catches = player.GetCatchesTaken(startDate, endDate, MatchTypes, venue);
            stumpings = player.GetStumpings(startDate, endDate, MatchTypes, venue);
            runOuts = player.GetRunOuts(startDate, endDate, MatchTypes, venue);
            highScore = player.GetHighScore(startDate, endDate, MatchTypes, venue).ToString();
            runs = player.GetRunsScored(startDate, endDate, MatchTypes, venue);
            if (player.GetHighScoreWasNotOut())
            {
                highScore += "*";
            }

            average = player.GetBattingAverage(startDate, endDate, MatchTypes, venue);
        }
    }
}
