using System;
using CricketClubMiddle;

public class PlayerV1
{
    public int playerId;
    public int matches;
    public string name;
    public string shortName;
    public string nickname;
    public string battingStyle;
    public string bowlingStyle;
    public bool isActive;
    public string firstName;
    public string surname;
    public string middleInitials;
    public PlayerV1 clubConnection;
    public bool isRightHandBat;


    public static PlayerV1 FromInternal(Player player)
    {
        return new PlayerV1()
        {
            playerId = player.Id,
            name = player.FormalName,
            matches = player.NumberOfMatchesPlayedThisSeason,
            shortName = player.Name,
            nickname = player.Nickname,
            battingStyle = player.BattingStyle,
            bowlingStyle = player.BowlingStyle,
            isActive = player.IsActive,
            firstName = player.FirstName,
            surname = player.Surname,
            middleInitials = player.MiddleInitials,
            clubConnection = player.RingerOf==null?null:FromInternal(player.RingerOf),
            isRightHandBat = player.IsRightHandBat
        };

    }
}