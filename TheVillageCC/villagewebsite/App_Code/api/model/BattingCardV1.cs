using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using CricketClubMiddle.Stats;

namespace api.model
{
    [SuppressMessage("ReSharper", "InconsistentNaming")]
    [SuppressMessage("ReSharper", "FieldCanBeMadeReadOnly.Global")]
    [SuppressMessage("ReSharper", "MemberCanBePrivate.Global")]
    [SuppressMessage("ReSharper", "NotAccessedField.Global")]
    public class BattingCardV1
    {
        public List<BattingEntryV1> entries;
        public ExtrasV1 extras;

        public BattingCardV1(BattingCard internalModel, Extras extras)
        {
            this.entries = internalModel.ScorecardData.Select(d => new BattingEntryV1(d)).ToList();
            this.extras = new ExtrasV1(extras);
        }
    }
}