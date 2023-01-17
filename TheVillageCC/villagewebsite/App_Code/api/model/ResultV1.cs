using System.Diagnostics.CodeAnalysis;
using System.Linq;
using CricketClubDomain;
using CricketClubMiddle;
using CricketClubMiddle.Stats;

namespace api.model
{
    [SuppressMessage("ReSharper", "InconsistentNaming")]
    [SuppressMessage("ReSharper", "FieldCanBeMadeReadOnly.Global")]
    [SuppressMessage("ReSharper", "MemberCanBePrivate.Global")]
    public class ResultV1
    {
        public string WinningTeam { get; set; }
        public string LosingTeam { get; set; }
        public string Margin { get; set; }
        public decimal TheirOversFaced { get; set; }
        public int TheirWickets { get; set; }
        public int TheirScore { get; set; }
        public decimal OurOversFaced { get; set; }
        public int OurWickets { get; set; }
        public int OurScore { get; set; }
        public bool IsTied { get; set; }
        public bool IsDrawn { get; set; }
        public bool IsAbandoned { get; set; }

        public static ResultV1 FromInternal(Match match)
        {
            return new ResultV1()
            {
                WinningTeam = match.Winner != null ? match.Winner.Name : null,
                LosingTeam = match.Loser != null ? match.Loser.Name : null,
                Margin = match.ResultMargin,
                IsTied = match.ResultTied,
                IsDrawn = match.ResultDrawn,
                OurScore = match.GetTeamScore(Team.OurTeam),
                OurWickets = match.GetTeamWicketsDown(Team.OurTeam),
                OurOversFaced = match.GetOurBowlingStats().BowlingStatsData.Sum(b => b.Overs),
                TheirScore = match.GetTeamScore(match.Opposition),
                TheirWickets = match.GetTeamWicketsDown(match.Opposition),
                TheirOversFaced = match.GetThierBowlingStats().BowlingStatsData.Sum(b => b.Overs),
                IsAbandoned = match.Abandoned
            };
        }
    }
}