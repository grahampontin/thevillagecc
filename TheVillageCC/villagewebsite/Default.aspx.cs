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
using CricketClubDAL;
using CricketClubDomain;
using Match = CricketClubMiddle.Match;

public partial class _Default : System.Web.UI.Page 
{
    protected void Page_Load(object sender, EventArgs e)
    {
        //Get latest match report.
        IList<Match> matches = Match.GetResults();
        List<Tuple<Match, MatchReportAndConditions>> reports = matches.Select(a => Tuple.Create(a, a.GetMatchReport())).Where(a=>a.Item2 != MatchReportAndConditions.None && !string.IsNullOrEmpty(a.Item2.Report)).OrderBy(a => a.Item1.MatchDate).Reverse().Take(3).ToList();

        RenderReport(reports[0], matchReportOne_Heading, matchReportOne_SubText, matchReportOne_Text, matchReportOne_Id, mathcReportOne_Image);
        RenderReport(reports[1], matchReportTwo_Heading, matchReportTwo_Subtext, matchReportTwo_Text, matchReportTwo_Id, mathcReportTwo_Image);
        RenderReport(reports[2], matchReportThree_Heading, matchReportThree_Subtext, matchReportThree_Text, matchReportThree_Id, mathcReportThree_Image);
    }

    private void RenderReport(Tuple<Match, MatchReportAndConditions> report, Literal headingControl, Literal subTextControl, Literal bodyControl, Literal idControl, HtmlImage image)
    {
        Match thisMatch = report.Item1;
        var matchReportAndConditions = report.Item2;

        headingControl.Text = thisMatch.HomeTeamName + " (" + thisMatch.HomeTeamScore + ") " + thisMatch.ResultText +
                              " " + thisMatch.AwayTeamName + " (" + thisMatch.AwayTeamScore + ") ";
        subTextControl.Text = thisMatch.ResultMargin + ", " + thisMatch.MatchDate.ToLongDateString();

        string reportText = matchReportAndConditions.Report;
        int lenght = 400;
        
        reportText = Regex.Replace(reportText, @"<[^>]+>|&nbsp;", "").Trim();
        reportText = Regex.Replace(reportText, @"\s{2,}", " ");
        if (reportText.Length < lenght)
        {
            lenght = reportText.Length;
        }

        if (!string.IsNullOrEmpty(matchReportAndConditions.ReportImage))
        {
            image.Src = matchReportAndConditions.ReportImage;
        }

        bodyControl.Text = reportText.Substring(0, lenght - 1) + "...";
        idControl.Text = thisMatch.ID.ToString();
    }
}
