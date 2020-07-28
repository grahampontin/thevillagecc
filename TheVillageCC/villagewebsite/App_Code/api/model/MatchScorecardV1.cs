using System.Diagnostics.CodeAnalysis;
using CricketClubMiddle.Stats;

namespace api.model
{
    [SuppressMessage("ReSharper", "InconsistentNaming")]
    [SuppressMessage("ReSharper", "FieldCanBeMadeReadOnly.Global")]
    [SuppressMessage("ReSharper", "MemberCanBePrivate.Global")]
    [SuppressMessage("ReSharper", "NotAccessedField.Global")]
    public class MatchScorecardV1
    {
        public InningsScoreCardV1 ourInnings;
        public InningsScoreCardV1 theirInnings;

        public MatchScorecardV1(BattingCard ourBatting, BowlingStats theirBowling, FoWStats ourFoW, BattingCard theirBatting, BowlingStats ourBowling, FoWStats theirFoW, Extras ourExtras, Extras theirExtras)
        {
            ourInnings = new InningsScoreCardV1(ourBatting, theirBowling, ourFoW, ourExtras );
            theirInnings = new InningsScoreCardV1(theirBatting, ourBowling, theirFoW, theirExtras);
        }
    }

    [SuppressMessage("ReSharper", "InconsistentNaming")]
    [SuppressMessage("ReSharper", "FieldCanBeMadeReadOnly.Global")]
    [SuppressMessage("ReSharper", "MemberCanBePrivate.Global")]
    [SuppressMessage("ReSharper", "NotAccessedField.Global")]
    public class FoWV1
    {
        public FoWV1(FoWStats internalModel)
        {
            
        }
    }

    [SuppressMessage("ReSharper", "InconsistentNaming")]
    [SuppressMessage("ReSharper", "FieldCanBeMadeReadOnly.Global")]
    [SuppressMessage("ReSharper", "MemberCanBePrivate.Global")]
    [SuppressMessage("ReSharper", "NotAccessedField.Global")]
    public class BowlingCardV1
    {
        public BowlingCardV1(BowlingStats internalModel)
        {
            
        }
    }
}