using TheVillageCC.Web.Domain;

namespace TheVillageCC.Web.Stats
{
    public class PlayerDetailV1
    {
        public PlayerV1 player;
        public string playerImage;
        public StatsDataV1 battingStats;
        public StatsDataV1 bowlingStats;
    }
}