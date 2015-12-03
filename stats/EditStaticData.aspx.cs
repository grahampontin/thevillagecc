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

public partial class stats_EditStaticData : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string action = Request["add"];
        try
        {
            switch (action)
            {
                case "Add Villager":
                    Player newPlayer = Player.CreateNewPlayer(Request["thing_to_add"]);
                    message.Text = "new player created with ID: " + newPlayer.ID;
                    break;
                case "Add Venue":
                    Venue newVenue = Venue.CreateNewVenue(Request["thing_to_add"]);
                    message.Text = "new Venue created with ID: " + newVenue.ID;
                    break;
                case "Add Opponent":
                    Team newTeam = Team.CreateNewTeam(Request["thing_to_add"]);
                    message.Text = "new Team created with ID: " + newTeam.ID;
                    break;

            }
        }
        catch (Exception ex)
        {
            message.Text = ex.Message;
        }
    }
}
