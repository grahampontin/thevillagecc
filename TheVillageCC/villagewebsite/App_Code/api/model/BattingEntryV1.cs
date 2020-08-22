﻿using System;
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

        // ReSharper disable once UnusedMember.Global
        public BattingEntryV1()
        {
        }

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
}