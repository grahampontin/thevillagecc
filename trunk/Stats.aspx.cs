using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using CricketClubMiddle;
using CricketClubDomain;

public partial class Stats : System.Web.UI.Page
{
    protected string test = "";
    private DateTime startDate;
    private DateTime endDate;

    protected void Page_Load(object sender, EventArgs e)
    {
        Header1.PageID = "Stats";
        if (!IsPostBack)
        {
            VenuesDropDown.DataSource = Venue.GetAll().OrderBy(a => a.Name);
            VenuesDropDown.DataBind();
        }

        if (VenuesDropDown.SelectedItem.Text != "")
        {
            test+= "&Venue="+Server.UrlEncode(VenuesDropDown.SelectedItem.Text);
        }

        if (!DateTime.TryParse(FromDate.Value, out startDate))
        {
            startDate = new DateTime(DateTime.Today.Year, 4, 1);
            
        }
        test += "&fromDate=" + Server.UrlEncode(startDate.ToString());
        if (!DateTime.TryParse(ToDate.Value, out endDate))
        {
            endDate = new DateTime(DateTime.Today.Year + 1, 3, 30);
            
        }
        test += "&toDate=" + Server.UrlEncode(endDate.ToString());


        if (FriendlyCB.Checked)
        {
            test += "&Friendly=1";
        }
        if (TourCB.Checked)
        {
            test += "&Tour=1";
        }
        if (DeclarationCB.Checked)
        {
            test += "&Declaration=1";
        }
        if (LeagueCB.Checked)
        {
            test += "&League=1";
        }
        if (Twenty20CB.Checked)
        {
            test += "&Twenty20=1";
        }

    }
}