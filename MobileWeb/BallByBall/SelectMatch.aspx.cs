using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using CricketClubMiddle;

public partial class MobileWeb_BallByBall_SelectMatch : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        MatchesListView.DataSource = Match.GetResults();
        MatchesListView.DataBind();
    }
}