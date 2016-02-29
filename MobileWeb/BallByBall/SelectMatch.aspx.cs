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
        InProgressMatchesListViewBatting.DataSource = Match.GetInProgressGames().Where(m=> !m.OurInningsComplete && ((m.OppositionBattedFirst && m.OppositionInningsComplete) || !m.OppositionBattedFirst));
        InProgressMatchesListViewBatting.DataBind();

        InProgressMatchesListViewBowling.DataSource = Match.GetInProgressGames().Where(m => (m.OppositionBattedFirst && !m.OppositionInningsComplete) || (m.OurInningsComplete && !m.OppositionInningsComplete));
        InProgressMatchesListViewBowling.DataBind();

        FutureMatchesListView.DataSource = Match.GetFixtures().Where(m=>!m.GetIsBallByBallInProgress());
        FutureMatchesListView.DataBind();
    }
}