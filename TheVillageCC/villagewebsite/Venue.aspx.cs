using System;
using CricketClubMiddle;

public partial class Venue : System.Web.UI.Page
{
    protected string VenueName;
    protected string VenueDescription;
    protected string VenueMapUrl;
    protected decimal? VenueLatitude;
    protected decimal? VenueLongitude;
    
    protected string GetMapUrl()
    {
        // If custom map URL is provided, use it
        if (!string.IsNullOrEmpty(VenueMapUrl))
        {
            return VenueMapUrl;
        }
        
        // Validate coordinates are present and within valid ranges
        if (!VenueLatitude.HasValue || !VenueLongitude.HasValue)
        {
            return string.Empty;
        }
        
        // Validate latitude is in range [-90, 90] and longitude is in range [-180, 180]
        if (VenueLatitude.Value < -90 || VenueLatitude.Value > 90 ||
            VenueLongitude.Value < -180 || VenueLongitude.Value > 180)
        {
            return string.Empty;
        }
        
        // Generate Google Maps embed URL with URL-encoded coordinates
        return string.Format("https://maps.google.com/maps?q={0},{1}&hl=en&z=15&output=embed",
            Uri.EscapeDataString(VenueLatitude.Value.ToString(System.Globalization.CultureInfo.InvariantCulture)),
            Uri.EscapeDataString(VenueLongitude.Value.ToString(System.Globalization.CultureInfo.InvariantCulture)));
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        int venueId = 0;
        //Check validity of venue id
        if (!int.TryParse(Request["venueId"], out venueId))
        {
            throw new ApplicationException("Could not parse venue id from string value: " + Request["venueId"]);
        }
        
        CricketClubMiddle.Venue currentVenue = new CricketClubMiddle.Venue(venueId);
        if (string.IsNullOrEmpty(currentVenue.Name))
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
