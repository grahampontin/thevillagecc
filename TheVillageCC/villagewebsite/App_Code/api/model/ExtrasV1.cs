using System.Diagnostics.CodeAnalysis;
using CricketClubDomain;
using CricketClubMiddle.Stats;

namespace api.model
{
    [SuppressMessage("ReSharper", "InconsistentNaming")]
    [SuppressMessage("ReSharper", "FieldCanBeMadeReadOnly.Global")]
    [SuppressMessage("ReSharper", "MemberCanBePrivate.Global")]
    public class ExtrasV1
    {
        public int wides;
        public int noBalls;
        public int penalties;
        public int byes;
        public int legByes;

        public ExtrasV1(Extras internalModelExtras)
        {
            this.wides = internalModelExtras.Wides;
            this.noBalls = internalModelExtras.NoBalls;
            this.penalties = internalModelExtras.Penalty;
            this.byes = internalModelExtras.Byes;
            this.legByes = internalModelExtras.LegByes;
        }

        public Extras ToInternal(int matchId)
        {
            return new Extras(matchId, ThemOrUs.Us)
            {
                Byes = byes,
                LegByes = legByes,
                NoBalls = noBalls,
                Penalty = penalties,
                Wides = wides
            };
        }

    }
}