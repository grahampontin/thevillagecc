using CricketClubMiddle;

public class PlayerDescriptor
{
    public int playerId;
    public int matches;
    public string name;

    public PlayerDescriptor(Player player)
    {
        playerId = player.ID;
        name = player.FormalName;
        matches = player.NumberOfMatchesPlayedThisSeason;
    }
}