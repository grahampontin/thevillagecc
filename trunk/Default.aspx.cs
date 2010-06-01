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

public partial class _Default : System.Web.UI.Page 
{
    protected void Page_Load(object sender, EventArgs e)
    {
        //Get latest match report.
        IList<Match> matches = Match.GetResults();
        CricketClubMiddle.MatchReport report = matches.Where(a => a.GetMatchReport(Server.MapPath("./match_reports/")).Report.Length > 10).OrderBy(a => a.MatchDate).Reverse().Take(1).Select(a => a.GetMatchReport(Server.MapPath("./match_reports/"))).FirstOrDefault();

        Match thisMatch = new Match(report.MatchID);

        ReportHeadline.Text = thisMatch.HomeTeamName + " (" + thisMatch.HomeTeamScore + ") " + thisMatch.ResultText + " " + thisMatch.AwayTeamName + " (" + thisMatch.AwayTeamScore + ") " + thisMatch.ResultMargin + "<BR>" + thisMatch.MatchDate.ToLongDateString();

        string reportText = report.Report.Substring(report.Report.IndexOf("</conditions>")+13);
        int lenght = 1100;
        if (reportText.Length < lenght)
        {
            lenght = reportText.Length;
        }
        reportText = reportText.Replace("<div>", "").Replace("</div>", "");
        ReportBody.Text = reportText.Substring(0, lenght);

        ReportID.Text = report.MatchID.ToString();

    }
}
