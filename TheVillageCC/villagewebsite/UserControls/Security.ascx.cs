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
using CricketClubMiddle.Interactive;

public partial class UserControls_Security : System.Web.UI.UserControl
{

    public User LoggedOnUser = null;

    protected void Page_Load(object sender, EventArgs e)
    {
        
    }

    override protected void OnInit(EventArgs e)
    {
        HttpCookie usernameCookie = Request.Cookies["vccUsername"];
        HttpCookie passwordCookie = Request.Cookies["vccPassword"];
        if (usernameCookie != null && passwordCookie != null)
        {
            string username = usernameCookie.Value;
            string password = passwordCookie.Value;

            User u = User.GetByName(username);
            if (u != null)
            {
                u.AuthenticateUser(password, true);
                if (u.IsLoggedIn)
                {
                    LoggedOnUser = u;
                }
                else
                {
                    Response.Redirect("/Secure/Logon.aspx?reason=autherror&destination=" + Server.UrlEncode(Request.RawUrl));
                }
            }
            else
            {
                Response.Redirect("/Secure/Logon.aspx?reason=autherror&destination=" + Server.UrlEncode(Request.RawUrl));
            }
        }
        else
        {
            Response.Redirect("/Secure/Logon.aspx?destination=" + Server.UrlEncode(Request.RawUrl));
        }
        base.OnInit(e); 
    }
}
