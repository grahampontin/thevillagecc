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
        //fix the below to use Innings Inprogress and set this when we start the match or end and innings
        InProgressMatchesListViewBatting.DataSource = Match.GetInProgressGames().Where(m=> m.OurInningsInProgress);
        InProgressMatchesListViewBatting.DataBind();

        InProgressMatchesListViewBowling.DataSource = Match.GetInProgressGames().Where(m => m.TheirInningsInProgress);
        InProgressMatchesListViewBowling.DataBind();

        FutureMatchesListView.DataSource = Match.GetFixtures().Where(m=>!m.GetIsBallByBallInProgress());
        FutureMatchesListView.DataBind();
    }
}