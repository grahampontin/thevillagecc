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
using System.Collections.Generic;
using CricketClubDomain;

public partial class Results : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        Header1.PageID = "Results";
        string Year = Request["Season"];
        if (string.IsNullOrEmpty(Year))
        {
            Year = DateTime.Today.Year.ToString();
        }
        int iYear = DateTime.Today.Year;
        int.TryParse(Year, out iYear);

        PrevResultsYear.Text = (iYear - 1).ToString();
        NextResultsYear.Text = (iYear + 1).ToString();
        ResultsYear.Text = iYear.ToString();

        IList<Match> AllFixtures = Match.GetResults(new DateTime(iYear,4,1), new DateTime(iYear+1,4,1));
        FixturesListView.DataSource = AllFixtures;
        FixturesListView.DataBind();
    }
    protected void FixturesListView_ItemDataBound(object sender, ListViewItemEventArgs e)
    {
        Match currentMatch = (Match)((ListViewDataItem)e.Item).DataItem;
        if (currentMatch.HomeOrAway == HomeOrAway.Home)
        {
            ((HtmlControl)e.Item.FindControl("HomeTeam")).Style.Add("font-weight", "bold");
        }
        else
        {
            ((HtmlControl)e.Item.FindControl("AwayTeam")).Style.Add("font-weight", "bold");
        }

    }
}
