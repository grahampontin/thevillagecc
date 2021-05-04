using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CricketClubDomain;
using CricketClubMiddle;

/// <summary>
/// Summary description for MatchV1
/// </summary>
public class MatchV1
{
    public MatchV1()
    {
        //
        // TODO: Add constructor logic here
        //
    }

    public static MatchV1 FromInternal(Match match)
    {
        return new MatchV1()
        {
            Id = match.ID,
            Venue = VenueV1.FromInternal(match.Venue),
            Opposition = TeamV1.FromInternal(match.Opposition),
            Date = match.MatchDate.ToShortDateString(),
            Type = match.Type.ToString(),
            IsHome = match.HomeOrAway == HomeOrAway.Home
        };
    }

    public bool IsHome { get; set; }

    public string Type { get; set; }

    public string Date { get; set; }

    public TeamV1 Opposition { get; set; }

    public VenueV1 Venue { get; set; }

    public int Id { get; set; }
}