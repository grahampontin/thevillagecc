using System;
using System.Diagnostics.CodeAnalysis;
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

        public BattingEntryV1(BattingCardLine battingCardLine)
        {
            playerId = battingCardLine.Batsman.ID;
            playerName = battingCardLine.Batsman.Name;
            runs = battingCardLine.Score;
            modeOfDismissal = battingCardLine.Dismissal.ToString();
            bowlerId = battingCardLine.Bowler.ID;
            bowlerName = battingCardLine.Bowler.Name;
            fielderId = battingCardLine.Fielder.ID;
            fielderName = battingCardLine.Fielder.Name;
            fours = battingCardLine.Fours;
            sixes = battingCardLine.Sixes;
            battingAt = battingCardLine.BattingAt;
            ballsFaced = battingCardLine.BallsFaced;
            dotBalls = battingCardLine.DotBalls;
        }
    }
}