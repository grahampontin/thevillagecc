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
using CricketClubMiddle.Interactive;
using CricketClubMiddle;

public partial class Gallery : System.Web.UI.Page
{
    int MatchID = 0;

    protected void Page_Load(object sender, EventArgs e)
    {
            string strMatchID = Request["MatchID"];
            int.TryParse(strMatchID, out MatchID);

            if (MatchID > 0)
            {
                Pictures.DataSource = MatchPhoto.GetForMatch(MatchID);
                Pictures.DataBind();
                Match thisMatch = new Match(MatchID);
                oppo.Text = thisMatch.Opposition.Name;
                matchdate.Text = thisMatch.MatchDateString;
            }
            else
            {
                form1.InnerHtml = "No MatchID Supplied";
            }
    }
    protected void Pictures_ItemDataBound(object sender, ListViewItemEventArgs e)
    {
        string MatchReportImageBase = "\\match_reports\\images\\";
        string TargetDirectory = MatchReportImageBase + MatchID + "\\";
        MatchPhoto photo = ((MatchPhoto)((ListViewDataItem)e.Item).DataItem);
        HtmlAnchor ThumbLink = (HtmlAnchor)e.Item.FindControl("ThumbLink");
        ThumbLink.HRef = TargetDirectory + photo.FileName;
        ThumbLink.Title = photo.Title;
        HtmlImage ImageTag = (HtmlImage)e.Item.FindControl("ImageTag");
        ImageTag.Src = "Handlers/ImageThumbnail.ashx?p=" + ThumbLink.HRef;
        ImageTag.Alt = ThumbLink.Title;
        Literal Title = (Literal)e.Item.FindControl("ImageTitle");
        Literal Author = (Literal)e.Item.FindControl("ImageAuthor");
        Title.Text = photo.Title;
        Author.Text = photo.Owner.DisplayName;

    }
}
