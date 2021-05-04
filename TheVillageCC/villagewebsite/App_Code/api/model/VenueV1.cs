using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CricketClubMiddle;

/// <summary>
/// Summary description for VenueV1
/// </summary>
public class VenueV1
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string MapUrl { get; set; }

    public VenueV1()
    {
    }


    public static VenueV1 FromInternal(Venue venue)
    {
        return new VenueV1()
        {
            Id = venue.ID,
            Name = venue.Name,
            MapUrl = venue.GoogleMapsLocationURL
        };
    }
}