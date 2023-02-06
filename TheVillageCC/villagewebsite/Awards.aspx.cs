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

public partial class Stats : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        Header1.PageID = "Awards";

        var players = Player.GetAll().Where(a=>a.Id >0);
        
        var mostRuns = players.Max(a => a.GetRunsScored());
        var leadingScorer = players.Where(a => a.GetRunsScored() == mostRuns).FirstOrDefault();
        LeadingRSName.Text = leadingScorer.Name;
        LeadingRSRuns.Text = mostRuns.ToString();

        var mostWickets = players.Max(a => a.GetWicketsTaken());
        var leadingWicketTaker = players.Where(a => a.GetWicketsTaken() == mostWickets).FirstOrDefault();
        LeadingWTName.Text = leadingWicketTaker.Name;
        LeadingWTWickets.Text = mostWickets.ToString();

        var mostCatches = players.Max(a => a.GetCatchesTaken());
        var leadingCatcher = players.Where(a => a.GetCatchesTaken() == mostCatches).FirstOrDefault();
        MostCatchesName.Text = leadingCatcher.Name;
        MostCatchesNumber.Text = mostCatches.ToString();


    }
}
