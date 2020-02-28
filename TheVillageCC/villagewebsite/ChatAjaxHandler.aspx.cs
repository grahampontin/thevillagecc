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
using System.Text.RegularExpressions;

public partial class ChatAjaxHandler : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string fromMS = Request["timestamp"];
        if (string.IsNullOrEmpty(fromMS))
        {
            fromMS = "0";
        }

        string action = Request["action"];
        if (string.IsNullOrEmpty(fromMS))
        {
            action = "read";
        }

        if (action == "post")
        {
            string comment = Request["comment"];
            Regex youTube = new Regex("\\[(.+?)@[Yy]ou[Tt]ube\\]");
            if (youTube.IsMatch(comment))
            {
                string youtubelink = "<p><object width=\"425\" height=\"344\"><param name=\"movie\" value=\"http://www.youtube.com/v/" + youTube.Match(comment).Groups[1].Value + "&hl=en&fs=1&rel=0\"></param><param name=\"allowFullScreen\" value=\"false\"></param><param name=\"allowscriptaccess\" value=\"always\"></param><embed src=\"http://www.youtube.com/v/" + youTube.Match(comment).Groups[1].Value + "&hl=en&fs=1&rel=0\" type=\"application/x-shockwave-flash\" allowscriptaccess=\"always\" allowfullscreen=\"false\" width=\"425\" height=\"344\"></embed></object></p>";
                string replaceText = youTube.Match(comment).Groups[0].Value;
                comment = comment.Replace(replaceText, youtubelink);
            }
            Regex image = new Regex("\\[(.+?)@[Ii][Mm][Gg]\\]");
            if (image.IsMatch(comment))
            {
                string imagelink = "<p><img src=\"" + image.Match(comment).Groups[1].Value + "\" class=constrainedImage></p>";
                string replaceText = image.Match(comment).Groups[0].Value;
                comment = comment.Replace(replaceText, imagelink);
            }


            ChatItem c = new ChatItem();
            c.Comment = comment;
            c.Date = DateTime.Now;
            c.IPAddress = Request.UserHostAddress.ToString();
            c.Name = Request["name"];
            HttpCookie nameCookie = new HttpCookie("VCCChat.Name", c.Name);
            nameCookie.Expires = DateTime.Today.AddYears(1);
            Response.Cookies.Add(nameCookie);

            c.ImageUrl = Request["imageUrl"];
            HttpCookie imageCookie = new HttpCookie("VCCChat.Image", c.ImageUrl);
            imageCookie.Expires = DateTime.Today.AddYears(1);
            Response.Cookies.Add(imageCookie);
            
            CricketClubMiddle.Chat.PostItem(c);
        }
        


        DateTime fromTime = new DateTime(1970,1,1);
        fromTime = fromTime.AddMilliseconds(double.Parse(fromMS));
        if (fromMS == "0")
        {
            fromTime = DateTime.Today;
        }
        DateTime toTime = fromTime.AddDays(1);
        string LastChatID = Request["lastchatid"];
        int LastID = 0;
        IEnumerable<ChatItem> comments;
        if (int.TryParse(LastChatID, out LastID)) 
        {
            comments = CricketClubMiddle.Chat.GetAllCommentsAfter(LastID).OrderBy(a => a.Date).Reverse();
        } else {
            comments = CricketClubMiddle.Chat.GetAllBetween(fromTime, toTime).OrderBy(a => a.Date).Reverse();
        }

        string isMobileView = Request["mobileView"];
        if (!string.IsNullOrEmpty(isMobileView) && isMobileView.ToLower() == "true")
        {
            commentsMobileView.DataSource = comments;
            commentsMobileView.DataBind();
            commentsView.Visible = false;
            commentsMobileView.Visible = true;

        } else
        {
            commentsView.DataSource = comments;
            commentsView.DataBind();
        }

        if (comments.Count() >0) {
            lastID.Text = comments.ToList()[0].ID.ToString(); 
        }

    }
}
