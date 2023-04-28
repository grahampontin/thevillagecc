using System;
using System.Diagnostics.CodeAnalysis;
using System.Linq.Expressions;
using CricketClubDomain;
using CricketClubMiddle;
using CricketClubMiddle.Stats;

namespace api.model
{
    [SuppressMessage("ReSharper", "InconsistentNaming")]
    [SuppressMessage("ReSharper", "FieldCanBeMadeReadOnly.Global")]
    [SuppressMessage("ReSharper", "MemberCanBePrivate.Global")]
    [SuppressMessage("ReSharper", "NotAccessedField.Global")]
    public class BattingEntryV1
    {
        public int playerId;
        public string playerName;
        public int runs;
        public string modeOfDismissal;
        public int bowlerId;
        public string bowlerName;
        public int fielderId;
        public string fielderName;
        public int fours;
        public int sixes;
        public int battingAt;
        public int ballsFaced;
        public int dotBalls;
        public WicketV1 wicket;

        // ReSharper disable once UnusedMember.Global
        public BattingEntryV1()
        {
        }

        public BattingEntryV1(BattingCardLine battingCardLine)
        {
            playerId = battingCardLine.Batsman.Id;
            playerName = battingCardLine.Batsman.Name;
            runs = battingCardLine.Score;
            modeOfDismissal = battingCardLine.Dismissal.ToString();
            bowlerId = battingCardLine.Bowler.Id;
            bowlerName = battingCardLine.Bowler.Name;
            fielderId = battingCardLine.Fielder.Id;
            fielderName = battingCardLine.Fielder.Name;
            fours = battingCardLine.Fours;
            sixes = battingCardLine.Sixes;
            battingAt = battingCardLine.BattingAt;
            ballsFaced = battingCardLine.BallsFaced;
            dotBalls = battingCardLine.DotBalls;
            wicket = new WicketV1(bowlerName, fielderName, battingCardLine.Dismissal);

        }

        public BattingCardLine ToInternal(Match match)
        {
            ModesOfDismissal dismissal;
            ModesOfDismissal.TryParse(modeOfDismissal, true, out dismissal);
            return new BattingCardLine(new BattingCardLineData()
            {
                BattingAt = battingAt,
                BowlerID = bowlerId,
                BowlerName = bowlerName,
                FielderID = fielderId,
                FielderName = fielderName,
                Fours = fours,
                MatchDate = match.MatchDate,
                MatchID = match.ID,
                MatchTypeID = (int)match.Type,
                ModeOfDismissal = (int)dismissal,
                PlayerID = playerId,
                PlayerName = playerName,
                Runs = runs - (fours * 4 + sixes * 6),
                Score = runs,
                Sixes = sixes,
                VenueID = match.VenueID,
                BallsFaced = ballsFaced,
                DotBalls = dotBalls
            });
        }
    }

    public class WicketV1
    {
        public string Bowler { get; set; }

        public string Fielder { get; set; }

        public ModesOfDismissal ModeOfDismissal { get; set; }

        public bool IsRunOut
        {
            get { return this.ModeOfDismissal == ModesOfDismissal.RunOut; }
        }

        public bool IsCaught
        {
            get { return this.ModeOfDismissal == ModesOfDismissal.Caught; }
        }

        public bool IsCaughtAndBowled
        {
            get { return this.ModeOfDismissal == ModesOfDismissal.CaughtAndBowled; }
        }

        public bool IsBowled
        {
            get { return this.ModeOfDismissal == ModesOfDismissal.Bowled; }
        }

        public bool IsLbw
        {
            get { return this.ModeOfDismissal == ModesOfDismissal.LBW; }
        }

        public bool IsStumped
        {
            get { return this.ModeOfDismissal == ModesOfDismissal.Stumped; }
        }

        public bool IsHitWicket
        {
            get { return this.ModeOfDismissal == ModesOfDismissal.HitWicket; }
        }

        public bool IsRetired
        {
            get { return this.ModeOfDismissal == ModesOfDismissal.Retired; }
        }

        public bool IsRetiredHurt
        {
            get { return this.ModeOfDismissal == ModesOfDismissal.RetiredHurt; }
        }

        public WicketV1(string bowlerName, string fielderName, ModesOfDismissal modeOfDismissal)
        {
            Bowler = bowlerName;
            Fielder = fielderName;
            ModeOfDismissal = modeOfDismissal;
        }

        public WicketV1()
        {
        }
    }
}