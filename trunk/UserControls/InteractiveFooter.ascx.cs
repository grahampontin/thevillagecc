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

public partial class UserControls_InteractiveFooter : System.Web.UI.UserControl
{
    protected void Page_Load(object sender, EventArgs e)
    {
        User LoggedOnUser = null;
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
            }
        }

        if (LoggedOnUser != null)
        {
            LoggedOnUserName.Text = "Logged on as: " + LoggedOnUser.DisplayName;
            MyAccountLink.NavigateUrl = "/secure/accounts/MyAccount.aspx";
            MyAccountLink.Text = "My Account";
            SignInOut.Text = "Sign Out";
        }
        else
        {
            LoggedOnUserName.Text = "Not Logged On";
            SignInOut.Text = "Sign In";
            MyAccountLink.Visible = false;
        }
        
    }
    protected void SignInOut_Click(object sender, EventArgs e)
    {
        if (SignInOut.Text == "Sign Out")
        {
            HttpCookie usernameCookie = Request.Cookies["vccUsername"];
            HttpCookie passwordCookie = Request.Cookies["vccPassword"];
            usernameCookie.Value = "";
            passwordCookie.Value = "";
            Response.Redirect(Request.Url.AbsoluteUri);
        }
        else
        {
            Response.Redirect("/secure/logon.aspx");
        }
    }
}
