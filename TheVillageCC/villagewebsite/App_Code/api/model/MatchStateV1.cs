using System;
using System.Linq;
using CricketClubDomain;

namespace api.model
{
    public class MatchStateV1
    {
        public int LastCompletedOver { get; set; }
        public int OnStrikeBatsmanId { get; set; }
        public OverV1 Over { get; set; }
        public PlayerStateV1[] Players { get; set; }
        public decimal RunRate { get; set; }
        public int Score { get; set; }
        public string[] Bowlers { get; set; }
        public int MatchId { get; set; }
        public string PreviousBowler { get; set; }
        public string PreviousBowlerButOne { get; set; }
        public PartnershipStubV1 Partnership { get; set; }
        public string NextState { get; set; }
        public int OppositionScore { get; set; }
        public int OppositionWickets { get; set; }
        public string OppositionName { get; set; }
        public string OppositionShortName { get; set; }
        public BowlerInningsDetailsV1[] BowlerDetails { get; set; }
        public LiveScorecardV1 LiveScorecard { get; set; }
    }

    public class PartnershipStubV1
    {
        public int Runs;
        public int Balls;
        public int Fours;
        public int Sixes;}
    public class PlayerStateV1
    {
        public int PlayerId;
        public string PlayerName;
        public int Position;
        public string State;
        public int CurrentScore;
        public int Fours;
        public int BallsFaced;
        public int Sixes;
        public Decimal StrikeRate;
        public const string Batting = "Batting";
        public const string Waiting = "Waiting";
        public const string Out = "Out";
        public int AsOfOver;
    }

    public class BowlerInningsDetailsV1
    {
        public string Name { get; set; }
        public BowlingDetailsV1 JustThisSpell { get; set; }
        public BowlingDetailsV1 Details { get; set; }
    }

    public class BowlingDetailsV1
    {
        public int Overs { get; set; }
        public int Maidens { get; set; }
        public int Runs { get; set; }
        public int Wickets { get; set; }
        public decimal Economy { get; set; }
    }

    public class OverV1
    {
        public int OverNumber { get; set; }
        public string Bowler { get; set; }
        public int RunsConceded { get; set; }
        public int WicketsTaken { get; set; }
        public BallV1[] Balls { get; set; }
    }

    public class BallV1
    {
        public int BallNumber { get; set; }
        public int Amount { get; set; }
        public int Batsman { get; set; }
        public string BatsmanName { get; set; }
        public string Bowler { get; set; }
        public string Thing { get; set; }
        public WicketV1 Wicket { get; set; }
        public decimal? Angle { get; set; }
        public int MatchId { get; set; }
        public int OverNumber { get; set; }
        public bool IsWide { get; set; }
        public bool IsNoBall { get; set; }
        public bool IsBoundary { get; set; }
        public bool IsSix { get; set; }
        public bool IsBowlersWicket { get; set; }
        public bool IsFieldingExtra { get; set; }
    }




    public static class MatchStateMapper
    {
        public static MatchStateV1 MapToMatchStateV1(MatchState matchState)
        {
            return new MatchStateV1
            {
                LastCompletedOver = matchState.LastCompletedOver,
                OnStrikeBatsmanId = matchState.OnStrikeBatsmanId,
                Over = MapOverToOverV1(matchState.Over),
                Players = matchState.Players != null ? matchState.Players.Select(MapPlayerStateToPlayerStateV1).ToArray() : null,
                RunRate = matchState.RunRate,
                Score = matchState.Score,
                Bowlers = matchState.Bowlers,
                MatchId = matchState.MatchId,
                PreviousBowler = matchState.PreviousBowler,
                PreviousBowlerButOne = matchState.PreviousBowlerButOne,
                Partnership = MapPartnershipToPartnershipStubV1(matchState.Partnership),
                NextState = matchState.NextState,
                OppositionScore = matchState.OppositionScore,
                OppositionWickets = matchState.OppositionWickets,
                OppositionName = matchState.OppositionName,
                OppositionShortName = matchState.OppositionShortName,
                BowlerDetails = matchState.BowlerDetails != null ? matchState.BowlerDetails.Select(MapBowlerDetailsToBowlerInningsDetailsV1).ToArray() : null
            };
        }

        private static OverV1 MapOverToOverV1(Over over)
        {
            if (over == null) return null;

            return new OverV1
            {
                OverNumber = over.OverNumber,
                Bowler = over.Balls.First().Bowler,
                RunsConceded = over.Balls.Sum(b=>b.Amount),
                WicketsTaken = over.Balls.Count(b=>b.Wicket!=null),
                Balls = over.Balls != null ? over.Balls.Select(MapBallToBallV1).ToArray() : null
            };
        }

        private static BallV1 MapBallToBallV1(Ball ball)
        {
            if (ball == null) return null;

            return new BallV1
            {
                BallNumber = ball.BallNumber,
                Amount = ball.Amount,
                Batsman = ball.Batsman,
                BatsmanName = ball.BatsmanName,
                Bowler = ball.Bowler,
                Thing = ball.Thing,
                Wicket = MapWicketToWicketV1(ball.Wicket),
                Angle = ball.Angle,
                MatchId = ball.MatchId,
                OverNumber = ball.OverNumber,
                IsWide = ball.IsWide,
                IsNoBall = ball.IsNoBall,
                IsBoundary = ball.IsBoundary(),
                IsSix = ball.IsSix(),
                IsBowlersWicket = ball.IsBowlersWicket(),
                IsFieldingExtra = ball.IsFieldingExtra()
            };
        }

        private static WicketV1 MapWicketToWicketV1(Wicket wicket)
        {
            if (wicket == null) return null;

            return new WicketV1
            {
                Player = wicket.Player,
                PlayerName = wicket.PlayerName,
                ModeOfDismissal = wicket.ModeOfDismissalAsEnum,
                Fielder = wicket.Fielder,
                Description = wicket.Description,
            };
        }

        private static PlayerStateV1 MapPlayerStateToPlayerStateV1(PlayerState playerState)
        {
            if (playerState == null) return null;

            return new PlayerStateV1
            {
                PlayerId = playerState.PlayerId,
                PlayerName = playerState.PlayerName,
                Position = playerState.Position,
                State = playerState.State,
                CurrentScore = playerState.CurrentScore,
                Fours = playerState.Fours,
                BallsFaced = playerState.BallsFaced,
                Sixes = playerState.Sixes,
                StrikeRate = playerState.StrikeRate,
                AsOfOver = playerState.AsOfOver
            };
        }

        private static PartnershipStubV1 MapPartnershipToPartnershipStubV1(PartnershipStub partnership)
        {
            if (partnership == null) return null;

            return new PartnershipStubV1
            {
                Runs = partnership.Runs,
                Balls = partnership.Balls,
                Fours = partnership.Fours,
                Sixes =  partnership.Sixes
            };
        }

        private static BowlerInningsDetailsV1 MapBowlerDetailsToBowlerInningsDetailsV1(BowlerInningsDetails bowlerDetails)
        {
            if (bowlerDetails == null) return null;

            return new BowlerInningsDetailsV1
            {
                Name = bowlerDetails.Name,
                JustThisSpell = MapBowlingDetailsToBowlingDetailsV1(bowlerDetails.JustThisSpell),
                Details = MapBowlingDetailsToBowlingDetailsV1(bowlerDetails.Details)
            };
        }

        private static BowlingDetailsV1 MapBowlingDetailsToBowlingDetailsV1(BowlingDetails bowlingDetails)
        {
            if (bowlingDetails == null) return null;

            return new BowlingDetailsV1
            {
                Overs = bowlingDetails.Overs,
                Maidens = bowlingDetails.Maidens,
                Runs = bowlingDetails.Runs,
                Wickets = bowlingDetails.Wickets,
                Economy = bowlingDetails.Economy
            };
        }
    }
}

