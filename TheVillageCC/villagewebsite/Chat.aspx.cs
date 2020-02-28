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
using System.Net;

public partial class Chat : System.Web.UI.Page
{
    public string ImageUrl = "./Images/unknown_user.jpg";
    public string Name = "";


    protected void Page_Load(object sender, EventArgs e)
    {
        HttpCookie imageCookie = Request.Cookies.Get("VCCChat.Image");
        if (imageCookie != null)
        {
            ImageUrl = imageCookie.Value;
        }
        HttpCookie nameCookie = Request.Cookies.Get("VCCChat.Name");
        if (nameCookie != null)
        {
            Name = nameCookie.Value;
        }

        Header.PageID = "Chat";
        DateTime startDate;
        try
        {
            startDate = DateTime.Parse(Request["startDate"]);
        }
        catch
        {
            startDate = DateTime.Today;
        }
        if (startDate == DateTime.Today)
        {
            nextDay.Visible = false;
        }

        string thisUrl = Request.Url.AbsoluteUri;
        if (thisUrl.Contains('?'))
        {
            thisUrl = thisUrl.Remove(thisUrl.IndexOf('?'));
        }

        previousDay.NavigateUrl = thisUrl + "?startDate="+startDate.AddDays(-1).ToString("dd/MM/yyyy");
        nextDay.NavigateUrl = thisUrl + "?startDate=" + startDate.AddDays(1).ToString("dd/MM/yyyy");

    }
}
