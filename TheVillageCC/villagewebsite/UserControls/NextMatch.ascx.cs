using System;
using System.Collections;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Xml.Linq;
using CricketClubMiddle;

public partial class UserControls_NextMatch : System.Web.UI.UserControl
{
    protected void Page_Load(object sender, EventArgs e)
    {
        Match nextMatch = Match.GetNextMatch();
        if (nextMatch != null)
        {
            if (nextMatch.HomeOrAway == CricketClubDomain.HomeOrAway.Home)
            {
                HomeTeam.Text = nextMatch.Us.Name;
                AwayTeam.Text = nextMatch.Opposition.Name;
            }
            else
            {
                HomeTeam.Text = nextMatch.Opposition.Name;
                AwayTeam.Text = nextMatch.Us.Name;
            }
            MatchDate.Text = nextMatch.MatchDate.DayOfWeek + " " + nextMatch.MatchDate.ToLongDateString();
            MatchVenue.Text = nextMatch.Venue.Name;
        }
        else
        {
            hasFixture.Visible = false;
            noFixture.Visible = true;
        }

    }
}
