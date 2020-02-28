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

public partial class NewsCreate : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        Header1.PageID = "News";


    }
    protected void SubmitButton_Click(object sender, EventArgs e)
    {
        Message.Visible = false;
        string storyText = Request["FckEditor1"];
        if (storyText.Length > 10 * 254)
        {
            Message.InnerHtml = "Story is too long. Your Text was:<BR><BR><BR>" + storyText;
            Message.Visible = true;
            //story is too long.
        }
        else
        {
            NewsItem story = new NewsItem();
            story.Date = DateTime.Now;
            story.Headline = Headline.Text;
            story.ShortHeadline = ShortHeadline.Text;
            story.Story = storyText;
            story.Teaser = Teaser.Text;
            CricketClubMiddle.News.SubmitNewStory(story);
            Response.Redirect("/News.aspx");
        }

    }
}
