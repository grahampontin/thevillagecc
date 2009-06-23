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
using CricketClubMiddle.Stats;

public partial class UserControls_FoWScorecard : System.Web.UI.UserControl
{
    public FoWStats stats;
    protected void Page_Load(object sender, EventArgs e)
    {
        if (stats != null)
        {
            ScorecardLV.DataSource = stats.Data;
            ScorecardLV.DataBind();
        }
    }


    protected void ScorecardLV_ItemDataBound(object sender, ListViewItemEventArgs e)
    {
        if (((ListViewDataItem)e.Item).DisplayIndex % 2 == 0)
        {
            ((HtmlTableRow)e.Item.FindControl("TableRow")).Attributes["class"] += " scOddRow";
        }
        else
        {
            ((HtmlTableRow)e.Item.FindControl("TableRow")).Attributes["class"] += " scEvenRow";

        }
    }
}
