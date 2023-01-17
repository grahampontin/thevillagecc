using System.Collections.Generic;
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
    [SuppressMessage("ReSharper", "NotAccessedField.Global")]
    public class MatchScorecardV1
    {
        public InningsScoreCardV1 ourInnings;
        public InningsScoreCardV1 theirInnings;
        public MatchConditionsV1 matchConditions;

        public MatchScorecardV1(BattingCard ourBatting, BowlingStats theirBowling, FoWStats ourFoW, BattingCard theirBatting, BowlingStats ourBowling, FoWStats theirFoW, Extras ourExtras, Extras theirExtras, Match match)
        {
            ourInnings = new InningsScoreCardV1(ourBatting, theirBowling, ourFoW, ourExtras,  match.OurInningsLength);
            theirInnings = new InningsScoreCardV1(theirBatting, ourBowling, theirFoW, theirExtras, match.TheirInningsLength);
            matchConditions = new MatchConditionsV1(match);
        }

        // Deserialize
        // ReSharper disable once UnusedMember.Global
        public MatchScorecardV1()
        {

        }

        public static MatchScorecardV1 GetExternalScorecard(Match match)
        {
            return new MatchScorecardV1(match.GetOurBattingScoreCard(), match.GetThierBowlingStats(),
                new FoWStats(match.ID, ThemOrUs.Us), match.GetTheirBattingScoreCard(), match.GetOurBowlingStats(),
                new FoWStats(match.ID, ThemOrUs.Them), new Extras(match.ID, ThemOrUs.Them),
                new Extras(match.ID, ThemOrUs.Us), match);
        }
    }

    public class MatchConditionsV1
    {
        public bool abandoned;
        public int captainId;
        public int wicketKeeperId;
        public int overs;
        public bool declaration;
        public bool weWonTheToss;
        public bool tossWinnerBatted;

        public MatchConditionsV1()
        {
        }

        public MatchConditionsV1(Match match)
        {
            abandoned = match.Abandoned;
            captainId = match.Captain.ID;
            wicketKeeperId = match.WicketKeeper.ID;
            overs = match.Overs;
            declaration = match.WasDeclaration;
            weWonTheToss = match.TossWinner.IsUs;
            tossWinnerBatted = match.TossWinnerBatted;
        }
    }

    [SuppressMessage("ReSharper", "InconsistentNaming")]
    [SuppressMessage("ReSharper", "FieldCanBeMadeReadOnly.Global")]
    [SuppressMessage("ReSharper", "MemberCanBePrivate.Global")]
    [SuppressMessage("ReSharper", "NotAccessedField.Global")]
    public class FoWV1
    {
        public List<FoWEntryV1> entries;

        // ReSharper disable once UnusedMember.Global
        public FoWV1()
        {
        }

        public FoWV1(FoWStats internalModel)
        {
            entries = internalModel.Data.Select(d => new FoWEntryV1(d)).ToList();
        }

        public FoWStats ToInternal(Match match, ThemOrUs themOrUs)
        {
            var foWStats = new FoWStats(match.ID, themOrUs);
            foWStats.Data.Clear();
            foWStats.Data.AddRange(entries.Select(e=>e.ToInternal(match.ID, themOrUs)));
            return foWStats;

        }
    }

    [SuppressMessage("ReSharper", "NotAccessedField.Global")]
    [SuppressMessage("ReSharper", "InconsistentNaming")]
    public class FoWEntryV1
    {
        // ReSharper disable once UnusedMember.Global
        public FoWEntryV1()
        {
        }

        public FoWPlayerV1 outgoingPlayer;
        public FoWPlayerV1 notOutPlayer;
        public int wicket;
        public int score;
        public decimal overs;
        public int partnership;
        

        public FoWEntryV1(FoWStatsLine foWStatsLine)
        {
            outgoingPlayer = new FoWPlayerV1()
            {
                battingAt = foWStatsLine.OutgoingBatsmanPosition,
                id = foWStatsLine.OutgoingBatsman.ID,
                name = foWStatsLine.OutgoingBatsman.Name,
                score = foWStatsLine.OutgoingBatsmanScore
            };
            notOutPlayer = new FoWPlayerV1()
            {
                battingAt = foWStatsLine.NotOutBatsmanPosition,
                id = foWStatsLine.NotOutBatsman.ID,
                name = foWStatsLine.NotOutBatsman.Name,
                score = foWStatsLine.NotOutBatsmanScore
            };
            wicket = foWStatsLine.Wicket;
            score = foWStatsLine.Score;
            overs = foWStatsLine.Over;
            partnership = foWStatsLine.Partnership;
        }

        public FoWStatsLine ToInternal(int matchId, ThemOrUs themOrUs)
        {
            return new FoWStatsLine(new FoWDataLine()
            {
                OutgoingBatsman = outgoingPlayer.battingAt,
                OutgoingBatsmanScore = outgoingPlayer.score,
                NotOutBatsman = notOutPlayer.battingAt,
                NotOutBatsmanScore = notOutPlayer.score,
                Score = score,
                Partnership = partnership,
                Wicket = wicket,
                MatchID = matchId,
                OverNumber = (int) overs,
                Who = themOrUs
            });
        }
    }

    [SuppressMessage("ReSharper", "InconsistentNaming")]
    [SuppressMessage("ReSharper", "NotAccessedField.Global")]
    public class FoWPlayerV1
    {
        public int id;
        public string name;
        public int battingAt;
        public int score;
    }
}