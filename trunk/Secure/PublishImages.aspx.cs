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
using System.IO;
using System.Collections.Generic;
using CricketClubMiddle.Interactive;

public partial class Secure_PublishImages : System.Web.UI.Page
{

    int MatchID = 0;
    User LoggedOnUser;
    
        
    protected void Page_Load(object sender, EventArgs e)
    {
            LoggedOnUser = security1.LoggedOnUser;
            string strMatchID = Request["MatchID"];
            int.TryParse(strMatchID, out MatchID);
            if (!IsPostBack)
            {
            if (MatchID > 0)
            {
                Match thisMatch = new Match(MatchID);
                //MatchText.Text = " vs " + thisMatch.Opposition.Name;
                string MatchReportImageBase = Server.MapPath("\\match_reports\\images\\");
                string tempDir = MatchReportImageBase + MatchID + "\\" + LoggedOnUser.Name + "_upload";
                DirectoryInfo dir = new DirectoryInfo(tempDir);
                if (dir.Exists && dir.GetFiles().Count() > 0)
                {
                    int MaxWidth = 700;
                    int MaxHeight = 500;
                    foreach (FileInfo file in dir.GetFiles())
                    {
                        Helpers.ResizeImage(file.FullName, file.FullName, MaxWidth, MaxHeight, false);

                    }
                    Pictures.DataSource = dir.GetFiles();
                    Pictures.DataBind();
                }
                else
                {
                    form1.InnerHtml = "You have no uploaded files awaiting publishing";
                }
            }
            else
            {
                form1.InnerHtml = "No Match ID Presented";
            }
        }
    }
    protected void Pictures_ItemDataBound(object sender, ListViewItemEventArgs e)
    {
        string MatchReportImageBase = "\\match_reports\\images\\";
        string tempDir = MatchReportImageBase + MatchID + "\\" + LoggedOnUser.Name + "_upload\\";
        Image image = (Image)e.Item.FindControl("Picture");
        image.ImageUrl = tempDir + ((FileInfo)((ListViewDataItem)e.Item).DataItem).Name;
    }

    protected void PublishImages_Click(object sender, EventArgs e)
    {
        string TitlesTemp = Request["Title"];
        List<string> Titles = TitlesTemp.Split(',').ToList<string>();
        string MatchReportImageBase = Server.MapPath("\\match_reports\\images\\");
        string tempDir = MatchReportImageBase + MatchID + "\\" + LoggedOnUser.Name + "_upload";
        string TargetDir = MatchReportImageBase + MatchID + "\\";
        DirectoryInfo dir = new DirectoryInfo(tempDir);
        int count = 0;
        if (dir.Exists && dir.GetFiles().Count() > 0)
        {
            if (Titles.Count == dir.GetFiles().Count())
            {
                foreach (FileInfo image in dir.GetFiles())
                {
                    Random r = new Random(1234);

                    string newFileName = r.Next(1000, 9999).ToString() + "_" + image.Name;
                    MatchPhoto photo = MatchPhoto.AddNew(newFileName, Titles[count], MatchID, LoggedOnUser);
                    image.MoveTo(TargetDir + newFileName);
                    count++;
                }
                form1.InnerHtml = "Images Published Successfully. The Gallery is <a href=\"/Gallery.aspx?MatchID=" + MatchID + "\">here.</a>";
                Match match = new Match(MatchID);
                ChatItem chatter = new ChatItem();
                chatter.Date = DateTime.Now;
                chatter.Comment = LoggedOnUser.DisplayName + " has added photos to the gallery for the game vs " + match.Opposition.Name + " you can see them <a href=\"/Gallery.aspx?MatchID=" + MatchID + "\">here</a>";
                chatter.Name = "Village CC Online";
                chatter.ImageUrl = "http://thevillagecc.org.uk/images/logo.jpg";
                Chat.PostItem(chatter);
            }
            else
            {
                form1.InnerHtml = "You must give every image a title, even if it's just a dot or something. Titles cannot contain commas, sorry about that. Use you back button to go back and change them.";
            }
        }
        else
        {
            form1.InnerHtml = "Umm. There don't seem to be any images anymore. Something went wrong.";
        }

    }
}
