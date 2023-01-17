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
    
    public class LiveScorecardV1
    {
        public LiveScorecard InPlayData { get; set; }
        public MatchScorecardV1 FinalScorecard { get; set; }
        public MatchReportV1 MatchReport { get; set; }
        public MatchV1 MatchData { get; set; }
        public ResultV1 Result { get; set; }
    }
}