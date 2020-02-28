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

public partial class CreateMatchReport : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!string.IsNullOrEmpty(Request["MatchID"]))
        {
            Match match = new Match(int.Parse(Request["MatchID"]));
            PageHeading.Text = match.Opposition.Name + " (" + match.MatchDate.ToShortDateString() + ")";
            CricketClubMiddle.MatchReport report = match.GetMatchReport(Server.MapPath("./match_reports/"));
            Session.Add("report", report);
            if (report.Report != "")
            {
                AlreadyCreated.Visible = true;
                Create.Visible = false;
                Login.Visible = false;
            }
            else if (Request.Cookies["MatchReportAuth" + match.ID] != null)
            {
                Create.Visible = true;
                Login.Visible = false;
            }
            MatchID.Text = report.MatchID.ToString();


        }
    }
    protected void LoginButton_Click(object sender, EventArgs e)
    {
        CricketClubMiddle.MatchReport report = (CricketClubMiddle.MatchReport)Session["report"];
        if (Password.Text == report.Password)
        {
            Response.Cookies.Add(new HttpCookie("MatchReportAuth" + report.MatchID, "true"));
            Login.Visible = false;
            Create.Visible = true;
        }
    }
    protected void SubmitButton_Click(object sender, EventArgs e)
    {
        if (Request["FcKeditor1"].ToString().Length > 0 && Request["FckEditor2"].ToString().Length > 0)
        {
            CricketClubMiddle.MatchReport report = (CricketClubMiddle.MatchReport)Session["report"];
            string conditions = "<conditions>" + Request["FcKeditor1"].ToString() + " </conditions>";
            report.Report = conditions + Request["FckEditor2"].ToString();
            report.Save();
            Response.Redirect("MatchReport.aspx?MatchID=" + report.MatchID);
        }
        else
        {
            Create.InnerHtml = "Please complete the report and conditions boxes<BR><BR>";
        }
    }
}
