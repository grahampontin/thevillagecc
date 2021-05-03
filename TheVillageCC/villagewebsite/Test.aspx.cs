using System;
using System.Collections;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Xml.Linq;
using Match = CricketClubMiddle.Match;

public partial class Test : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        var matchesWithReports = Match.GetAll(DateTime.MinValue, DateTime.MaxValue, null, null)
            .Select(m => Tuple.Create(m, m.GetMatchReport(Server.MapPath("./match_reports/"))))
            .Where(t => t.Item2.Report.Length > 10).ToList();

        foreach (var matchWithReport in matchesWithReports)
        {
            try
            {
                var html = matchWithReport.Item2.Report;
                if (!html.Contains("</conditions>"))
                {
                    //old skool
                    string weather = "Not recorded";
                    try
                    {
                        weather = Regex.Matches(html,
                                "<div class=report_title>Weather Conditions</div>\r\n(.+)\r\n</div><div id=pitch_conditions>")
                            [0].Groups[1].Value;
                    }
                    catch (Exception exception)
                    {
                        
                    }

                    string pitch = "Not recorded";
                    try
                    {
                        pitch = Regex.Matches(html,
                            "<div class=report_title>Pitch Condition</div>\r\n(.+)\r")[0].Groups[1].Value;
                    }
                    catch (Exception ex)
                    {

                    }
                    var conditions = "Weather: " + weather + "; Pitch: " + pitch;
                    var report = Regex.Matches(html,
                        "<div class=report_title>Match Report</div>\r\n(.+)</div><div id=weather_conditions>",
                        System.Text.RegularExpressions.RegexOptions.Singleline)[0].Groups[1].Value;
                    matchWithReport.Item1.CreateOrUpdateMatchReport(conditions, report, "");

                }
                else
                {
                    var report = html.Substring(html.IndexOf("</conditions>") + 13);
                    var conditions = html.Substring(0, html.IndexOf("</conditions>")).Replace("<conditions>", "");
                    matchWithReport.Item1.CreateOrUpdateMatchReport(conditions, report, "");
                }
                results.InnerHtml += "<BR>migrated match report " + matchWithReport.Item1.ID;
            }
            catch (Exception ex)
            {
                results.InnerHtml += "<BR><STRONG>failed to migrate match report " + matchWithReport.Item1.ID +"</STRONG>";
            }
            
        }
    }
}
