using System;
using CricketClubMiddle;

public partial class Venue : System.Web.UI.Page
{
    protected string VenueName;
    protected string VenueDescription;
    protected string VenueMapUrl;
    protected decimal? VenueLatitude;
    protected decimal? VenueLongitude;

    protected void Page_Load(object sender, EventArgs e)
    {
        int venueId = 0;
        //Check validity of venue id
        if (!int.TryParse(Request["venueId"], out venueId))
        {
            throw new ApplicationException("Could not parse venue id from string value: " + Request["venueId"]);
        }
        
        CricketClubMiddle.Venue currentVenue = new CricketClubMiddle.Venue(venueId);
        if (currentVenue == null || string.IsNullOrEmpty(currentVenue.Name))
        {
            throw new ApplicationException("Failed to collect venue object for venue id " + venueId.ToString());
        }
        
        //Everything looks good
        VenueName = currentVenue.Name;
        VenueDescription = currentVenue.Description;
        VenueMapUrl = currentVenue.GoogleMapsLocationURL;
        
        if (currentVenue.Coordinates != null)
        {
            VenueLatitude = currentVenue.Coordinates.Item1;
            VenueLongitude = currentVenue.Coordinates.Item2;
        }
        
        Header1.PageID = "Venue";
    }
}
