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

public partial class UserControls_NewsTicker : System.Web.UI.UserControl
{
    protected void Page_Load(object sender, EventArgs e)
    {
        var NewsList = News.GetLastXStories(4);
        NewsItems.DataSource = NewsList;
        NewsItems.DataBind();
    }
}
