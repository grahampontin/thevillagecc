using System.Collections.Generic;
using CricketClubMiddle;

namespace TheVillageCC.Web.Stats
{
    public class IsTheSameFreakingMatch : EqualityComparer<Match>
    {
        public override bool Equals(Match x, Match y)
        {
            return y != null && x != null && x.ID == y.ID;
        }

        public override int GetHashCode(Match obj)
        {
            return obj.ID.GetHashCode();
        }
    }
}