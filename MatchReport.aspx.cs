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
using CricketClubMiddle.Stats;

public partial class MatchReport : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string temp = Request["MatchID"];
        if (string.IsNullOrEmpty(temp))
        {
            //error
        }

        int MatchID = int.Parse(temp);
        Match match = new Match(MatchID);
        MatchID1.Text = MatchID.ToString();
        MatchID2.Text = MatchID.ToString();
        _PageTitle.Text = match.HomeTeamName + " vs " + match.AwayTeamName + " (" + match.MatchDate.ToShortDateString() + ")";
        PageHeading.Text = match.HomeTeamName + " ("+match.HomeTeamScore+") " + match.ResultText + " " + match.AwayTeamName +" ("+match.AwayTeamScore+") " + match.ResultMargin;
        OppositionName.Text = match.Opposition.Name;
        MatchSummary.Text = match.TossWinner.Name + " won the toss and elected to " + match.TossWinnerElectedTo;
        OurBatting.Card = match.GetOurBattingScoreCard();
        TheirBatting.Card = match.GetTheirBattingScoreCard();
        OurBowling.stats = match.GetOurBowlingStats();
        TheirBowing.stats = match.GetThierBowlingStats();
        OurFoWCard.stats = new FoWStats(match.ID, CricketClubDomain.ThemOrUs.Us);
        TheirFoWCard.stats = new FoWStats(match.ID, CricketClubDomain.ThemOrUs.Them);

        CricketClubMiddle.MatchReport report = match.GetMatchReport(Server.MapPath("./match_reports/"));
        try
        {
            ReportText.Text = report.Report.Substring(report.Report.IndexOf("</conditions>") + 13);
        }
        catch
        {
            //
        }
        try
        {
            Conditions.Text = report.Report.Substring(0, report.Report.IndexOf("</conditions>")).Replace("<conditions>", "");
        }
        catch
        {
            //
        }

    }
}
