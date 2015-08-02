using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using CricketClubMiddle;

public partial class MobileWeb_BallByBall_SelectTeam : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        IList<Player> players = Player.GetAll().Where(p => p.IsActive && p.ID > 0).OrderByDescending(p=>p.NumberOfMatchesPlayedThisSeason).ThenBy(p => p.FormalName).ToList();
        PlayersListView.DataSource = players;
        PlayersListView.DataBind();
    }
}