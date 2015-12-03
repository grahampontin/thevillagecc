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
    protected string filter = "";
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

//        if (VenuesDropDown.SelectedItem.Text != "")
//        {
//            filter+= "&Venue="+Server.UrlEncode(VenuesDropDown.SelectedItem.Text);
//        }
//
//        if (!DateTime.TryParse(FromDate.Value, out startDate))
//        {
//            startDate = new DateTime(DateTime.Today.Year, 4, 1);
//            
//        }
//        filter += "&fromDate=" + Server.UrlEncode(startDate.ToString());
//        if (!DateTime.TryParse(ToDate.Value, out endDate))
//        {
//            endDate = new DateTime(DateTime.Today.Year + 1, 3, 30);
//            
//        }
//        filter += "&toDate=" + Server.UrlEncode(endDate.ToString());
//
//
//        if (FriendlyCB.Checked)
//        {
//            filter += "&Friendly=1";
//        }
//        if (TourCB.Checked)
//        {
//            filter += "&Tour=1";
//        }
//        if (DeclarationCB.Checked)
//        {
//            filter += "&Declaration=1";
//        }
//        if (LeagueCB.Checked)
//        {
//            filter += "&League=1";
//        }
//        if (Twenty20CB.Checked)
//        {
//            filter += "&Twenty20=1";
//        }

    }
}