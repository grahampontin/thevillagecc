using System.Diagnostics.CodeAnalysis;
using CricketClubMiddle.Stats;

namespace api.model
{
    [SuppressMessage("ReSharper", "InconsistentNaming")]
    [SuppressMessage("ReSharper", "FieldCanBeMadeReadOnly.Global")]
    [SuppressMessage("ReSharper", "MemberCanBePrivate.Global")]
    [SuppressMessage("ReSharper", "NotAccessedField.Global")]
    public class InningsScoreCardV1
    {
        public BattingCardV1 batting;
        public BowlingCardV1 bowling;
        public FoWV1 fow;

        public InningsScoreCardV1(BattingCard batting, BowlingStats bowling, FoWStats fow, Extras extras)
        {
            this.batting = new BattingCardV1(batting, extras);
            this.bowling = new BowlingCardV1(bowling);
            this.fow = new FoWV1(fow);
        }
    }
}