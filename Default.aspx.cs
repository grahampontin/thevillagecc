using System;
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
using System.Collections.Generic;
using System.Text.RegularExpressions;
using Match = CricketClubMiddle.Match;

public partial class _Default : System.Web.UI.Page 
{
    protected void Page_Load(object sender, EventArgs e)
    {
        //Get latest match report.
        IList<Match> matches = Match.GetResults();
        List<CricketClubMiddle.MatchReport> reports = matches.Where(a => a.GetMatchReport(Server.MapPath("./match_reports/")).Report.Length > 10).OrderBy(a => a.MatchDate).Reverse().Take(3).Select(a => a.GetMatchReport(Server.MapPath("./match_reports/"))).ToList();

        RenderReport(reports[0], matchReportOne_Heading, matchReportOne_SubText, matchReportOne_Text, matchReportOne_Id);
        RenderReport(reports[1], matchReportTwo_Heading, matchReportTwo_Subtext, matchReportTwo_Text, matchReportTwo_Id);
        RenderReport(reports[2], matchReportThree_Heading, matchReportThree_Subtext, matchReportThree_Text, matchReportThree_Id);
    }

    private void RenderReport(CricketClubMiddle.MatchReport report, Literal headingControl, Literal subTextControl, Literal bodyControl, Literal idControl)
    {
        Match thisMatch = new Match(report.MatchID);

        headingControl.Text = thisMatch.HomeTeamName + " (" + thisMatch.HomeTeamScore + ") " + thisMatch.ResultText +
                                      " " + thisMatch.AwayTeamName + " (" + thisMatch.AwayTeamScore + ") ";
        subTextControl.Text = thisMatch.ResultMargin + ", " + thisMatch.MatchDate.ToLongDateString();

        string reportText = report.Report.Substring(report.Report.IndexOf("</conditions>") + 13);
        int lenght = 400;
        
        reportText = Regex.Replace(reportText, @"<[^>]+>|&nbsp;", "").Trim();
        reportText = Regex.Replace(reportText, @"\s{2,}", " ");
        if (reportText.Length < lenght)
        {
            lenght = reportText.Length;
        }

        bodyControl.Text = reportText.Substring(0, lenght - 1) + "...";
        idControl.Text = report.MatchID.ToString();
    }
}
