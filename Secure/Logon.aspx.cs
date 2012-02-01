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

public partial class Secure_Logon : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string url = Request["destination"];
        string uname = Request["username"];
        if (!string.IsNullOrEmpty(uname))
        {
            Username.Text = uname;
            subcontent.Visible = false;
        }
        if (string.IsNullOrEmpty(url))
        {
            welcomeMessage.InnerHtml = "Logon with your VCC Account.";
        }
        else
        {
            Redirect.Text = url;
        }
    }
    protected void Button1_Click(object sender, EventArgs e)
    {
        string username = Username.Text;
        string password = Password.Text;

        if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
        {
            welcomeMessage.InnerHtml = "You must complete both the username and password fields.";
        }
        else
        {
            CricketClubMiddle.Interactive.User u = CricketClubMiddle.Interactive.User.GetByName(username);
            if (u == null)
            {
                welcomeMessage.InnerHtml = "Username not recognised or incorrect password";
            }
            else
            {
                u.AuthenticateUser(password, false);
                if (u.IsLoggedIn)
                {
                    HttpCookie name = new HttpCookie("vccUsername", username);
                    name.Expires = DateTime.Now.AddMonths(1);
                    HttpCookie pass = new HttpCookie("vccPassword", Helpers.MD5HashString(password));
                    pass.Expires = DateTime.Now.AddMonths(1);
                    Response.Cookies.Add(name);
                    Response.Cookies.Add(pass);
                    string url = Request["destination"];
                    if (string.IsNullOrEmpty(url))
                    {
                        form1.InnerHtml = "You are now Logged in";
                    }
                    else
                    {
                        Response.Redirect(url);
                    }
                }
                else
                {
                    welcomeMessage.InnerHtml = "Username not recognised or incorrect password";
                }
            }
        }
    }
    protected void Button2_Click(object sender, EventArgs e)
    {
        if (string.IsNullOrEmpty(Username.Text))
        {
            welcomeMessage.InnerHtml = "You need to fill in your username";
        }
        else
        {
            CricketClubMiddle.Interactive.User u = CricketClubMiddle.Interactive.User.GetByName(Username.Text);
            if (u == null)
            {
                welcomeMessage.InnerHtml = "That username doesn't exist";
            }
            else
            {
                System.Net.Mail.MailMessage mail = new System.Net.Mail.MailMessage("admin@thevillagecc.org.uk", u.EmailAddress);
                mail.Subject = "VCC User Account Password Reminder";        // put subject here	
                mail.Body = "Your VCC Account is Registered as Follows:<BR><BR> Username: " + u.Name + "<BR><BR>Password: " + u.Password;
                mail.IsBodyHtml = true;
                System.Net.Mail.SmtpClient smtp = new System.Net.Mail.SmtpClient("mail.thevillagecc.org.uk");
                smtp.Send(mail);
                welcomeMessage.InnerHtml = "Email sent. Check your inbox.";
            }
        }
    }
}
