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

public partial class Join : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        Header1.PageID = "Join";

    }


    protected void Submit_Click(object sender, EventArgs e)
    {

        if (string.IsNullOrEmpty(Email.Text) || string.IsNullOrEmpty(Name.Text) || string.IsNullOrEmpty(Details.Text))
        {
            Incomplete.Visible = true;
        }
        else
        {
            Incomplete.Visible = false;
            try
            {
                System.Net.Mail.MailMessage mail = new System.Net.Mail.MailMessage("admin@thevillagecc.org.uk", "thevillagecc@gmail.com");
                mail.Subject = "New Joiner";        // put subject here	
                mail.Body = Name.Text + " is interested in joining the Village<BR><BR>Their address is: " + Email.Text + "<BR><BR>Their mobile is " + Mobile.Text + "<BR><BR>And they said:<BR><BR>" + Details.Text;
                mail.IsBodyHtml = true;
                System.Net.Mail.SmtpClient smtp = new System.Net.Mail.SmtpClient("mail.thevillagecc.org.uk");
                smtp.Send(mail);
            }
            catch (Exception ex)
            {
                ThankYou.InnerHtml = "Sorry there was a problem sending your enquiry - did you specify a valid email address?<BR><BR>" + ex.Message;
            }
            ThankYou.Visible = true;
            Form.Visible = false;
        }
    }
}
