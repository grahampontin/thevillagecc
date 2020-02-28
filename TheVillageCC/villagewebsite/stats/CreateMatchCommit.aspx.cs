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
using CricketClubDomain;

public partial class stats_CreateMatchCommit : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            Team opponent = Team.GetByName(Request["opponent"]);
            Venue venue = Venue.GetByName(Request["venue"]);

            MatchType type = MatchType.Friendly;
            switch (Request["competition"])
            {
                case "Tour":
                    type = MatchType.Tour;
                    break;
                case "Friendly":
                    type = MatchType.Friendly;
                    break;
                case "20-20":
                    type = MatchType.Twenty20;
                    break;
                case "Declaration":
                    type = MatchType.Declaration;
                    break;
            }

            DateTime matchDate = DateTime.Parse(Request["date1"]);

            HomeOrAway ha = HomeOrAway.Home;
            if (Request["home_away"] == "Away")
            {
                ha = HomeOrAway.Away;
            }


            Match match = Match.CreateNewMatch(opponent, matchDate, venue, type, ha);
            message.Text = "Match created with match id: " + match.ID;
        }
        catch (Exception ex)
        {
            message.Text = ex.Message;
        }




    }
}
