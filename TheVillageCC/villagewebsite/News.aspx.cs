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

public partial class News : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        Header1.PageID = "News";
        IEnumerable<NewsItem> stories = CricketClubMiddle.News.GetLastXStories(10);
        StoriesLV.DataSource = stories;
        StoriesLV.DataBind();



        
    }
}
