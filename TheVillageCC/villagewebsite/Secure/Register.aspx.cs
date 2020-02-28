using System;
using System.Collections;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Xml.Linq;
using CricketClubMiddle.Interactive;
using CricketClubMiddle;

public partial class Secure_Register : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    protected void Button1_Click(object sender, EventArgs e)
    {
        string Username = tbUsername.Text;
        string EmailAddress = tbEmailAddress.Text;
        string DisplayName = tbDisplayName.Text;

        if (string.IsNullOrEmpty(Username) || string.IsNullOrEmpty(EmailAddress) || string.IsNullOrEmpty(DisplayName))
        {
            message.InnerHtml = "Please complete all fields";
        }
        else
        {
            if (CricketClubMiddle.Interactive.User.GetAll().Any(a => a.EmailAddress == EmailAddress))
            {
                message.InnerHtml = "That email address is alreay registered. To resend your password click here";
            }
            else if (CricketClubMiddle.Interactive.User.GetAll().Any(a => a.Name == Username)) 
            {
                message.InnerHtml = "That username is alreay registered. Try another one.";
            } 
            else 
            {
                string password = Helpers.CreateRandomPassword(6);
                try
                {
                    System.Net.Mail.MailMessage mail = new System.Net.Mail.MailMessage("admin@thevillagecc.org.uk", EmailAddress);
                    mail.Subject = "New VCC User Account";        // put subject here	
                    mail.Body = "Your VCC Account is Created as Follows:<BR><BR> Username: " + Username + "<BR><BR>Password: " + password;
                    mail.IsBodyHtml = true;
                    System.Net.Mail.SmtpClient smtp = new System.Net.Mail.SmtpClient("mail.thevillagecc.org.uk");
                    smtp.Send(mail);
                    CricketClubMiddle.Interactive.User.CreateNew(Username, password, EmailAddress, DisplayName);
                    form1.InnerHtml = "New account created. Check your email for a password.";
                }
                catch (Exception ex)
                {
                    message.InnerHtml = "Email was not sent! Did you enter an invalid email address?<BR><BR>" + ex.Message + "<BR><BR>" + ex.StackTrace;
                }
                
            }
        }


    }
}
