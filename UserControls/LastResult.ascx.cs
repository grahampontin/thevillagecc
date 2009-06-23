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

public partial class UserControls_LastResult : System.Web.UI.UserControl
{
    protected void Page_Load(object sender, EventArgs e)
    {
        Match lastMatch = Match.GetLastMatch();
        if (lastMatch.HomeOrAway == CricketClubDomain.HomeOrAway.Home)
        {
            HomeTeam.Text = lastMatch.Us.Name;
            AwayTeam.Text = lastMatch.Opposition.Name;
        }
        else
        {
            HomeTeam.Text = lastMatch.Opposition.Name;
            AwayTeam.Text = lastMatch.Us.Name;
        }
        Venue.Text = lastMatch.VenueName;
        ResultText.Text = lastMatch.ResultText;
        WinningMargin.Text = lastMatch.ResultMargin;
    }
}
