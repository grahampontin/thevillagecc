using System.Collections.Generic;
using CricketClubDomain;
using CricketClubMiddle;

public class MatchDescriptor
{
    public readonly int matchId;
    public readonly string batOrBowl;
    public readonly string opponent;
    public readonly string dateString;
    public readonly int overs;
    private static readonly IEqualityComparer<MatchDescriptor> Comparer = new MatchIdEqualityComparer();

    public MatchDescriptor(Match m)
    {
        matchId = m.ID;
        var currentBallByBallState = m.GetCurrentBallByBallState();
        if (m.GetIsBallByBallInProgress())
        {
            if (m.OurInningsInProgress)
            {
                batOrBowl = "Bat";
                overs = currentBallByBallState.LastCompletedOver;
            }
            else if (m.TheirInningsInProgress)
            {
                batOrBowl = "Bowl";
                overs = currentBallByBallState.OppositionOver;
            }
        }
        else
        {
            batOrBowl = "";
            overs = 0;
        }

        opponent = m.HomeOrAway == HomeOrAway.Home ? m.AwayTeamName : m.HomeTeamName;
        dateString = m.MatchDate.ToShortDateString();
    }

    protected bool Equals(MatchDescriptor other)
    {
        return matchId == other.matchId;
    }

    private sealed class MatchIdEqualityComparer : IEqualityComparer<MatchDescriptor>
    {
        public bool Equals(MatchDescriptor x, MatchDescriptor y)
        {
            if (ReferenceEquals(x, y)) return true;
            if (ReferenceEquals(x, null)) return false;
            if (ReferenceEquals(y, null)) return false;
            if (x.GetType() != y.GetType()) return false;
            return x.matchId == y.matchId;
        }

        public int GetHashCode(MatchDescriptor obj)
        {
            return obj.matchId;
        }
    }

    public static IEqualityComparer<MatchDescriptor> MatchIdComparer
    {
        get
        {
            return Comparer;
        }
    }
}