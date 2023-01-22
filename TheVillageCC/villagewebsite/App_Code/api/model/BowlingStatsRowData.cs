using System;
using System.Collections.Generic;
using CricketClubDomain;
using CricketClubMiddle;

namespace api.model
{
    public class BowlingStatsRowData
    {
        public static List<StatsColumnDefinitionV1> ColumnDefinitions = new List<StatsColumnDefinitionV1>()
        {
            new StatsColumnDefinitionV1("Name", "name", "LinkToPlayerStatsRenderer"),
            new StatsColumnDefinitionV1("Ave", "average"),
            new StatsColumnDefinitionV1("Wkt", "wickets"),
            new StatsColumnDefinitionV1("Eco", "economy"),
            new StatsColumnDefinitionV1("5Fer", "fiveFers"),
            new StatsColumnDefinitionV1("SR", "strikeRate"),
            new StatsColumnDefinitionV1("O", "overs"),
            new StatsColumnDefinitionV1("R", "runs"),
            new StatsColumnDefinitionV1("BBM", "bbm"),
            
        };
        public int id { get; private set; }
        public string name {get; private set; }
        public decimal average {get; private set; }
        public int wickets {get; private set; }
        public decimal economy {get; private set; }
        public int fiveFers {get; private set; }
        public decimal strikeRate {get; private set; }
        public decimal overs {get; private set; }
        public int runs {get; private set; }
        public string bbm {get; private set; }
    
        public BowlingStatsRowData(Player player, DateTime startDate, DateTime endDate, List<MatchType> MatchTypes,
            Venue venue)
        {
            id = player.ID;
            name = player.Name;
            average = player.GetBowlingAverage(startDate, endDate, MatchTypes, venue);
            wickets = player.GetWicketsTaken(startDate, endDate, MatchTypes, venue);
            economy = player.GetEconomy(startDate, endDate, MatchTypes, venue);
            fiveFers = player.GetFiveFers(startDate, endDate, MatchTypes, venue);
            strikeRate = player.GetStrikeRate(startDate, endDate, MatchTypes, venue);
            overs = player.GetOversBowled(startDate, endDate, MatchTypes, venue);
            runs = player.GetRunsConceeded(startDate, endDate, MatchTypes, venue);
            bbm = player.GetBestMatchFigures(startDate, endDate, MatchTypes, venue);
        
        }
    }
}