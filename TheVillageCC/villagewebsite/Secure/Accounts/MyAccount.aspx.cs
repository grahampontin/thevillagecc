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
using CricketClubAccounts;

public partial class Secure_Accounts_MyAccount : CricketClubMiddle.Web.SecurePage
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string action = Request["action"];
        switch (action)
        {
            case "claimRinger":
                Statement.Visible = false;
                ClaimRinger.Visible = true;
                break;
            case "registerPayment" :
                Statement.Visible = false;
                RegisterPayment.Visible = true;

                if (!IsPostBack)
                {

                    PaymentType.Items.Add(new ListItem(CricketClubDomain.PaymentType.DigitalBanking.ToString()));
                    PaymentType.Items.Add(new ListItem(CricketClubDomain.PaymentType.Cash.ToString()));
                    PaymentType.Items.Add(new ListItem(CricketClubDomain.PaymentType.Cheque.ToString()));
                }

                

                break;
            default:
                Player p = Player.GetAll().Where(a => a.EmailAddress == LoggedOnUser.EmailAddress).FirstOrDefault();
                if (p == null)
                {
                    Statement.InnerHtml = "Sorry, your user account is not linked to a player at present.";
                }
                else
                {
                    PlayerAccount pa = new PlayerAccount(p);
                    AccountSummary.DataSource = pa.GetStatement();
                    AccountSummary.DataBind();
                    Balance.Text = pa.GetBalance().ToString();
                    if (pa.GetBalance() < 0)
                    {
                        BalanceSpan.Style.Add("color", "red");
                        Balance.Text = "-£" + Balance.Text.Substring(1);
                        inDebt.Visible = true;
                        inCredit.Visible = false;
                    }
                    else
                    {
                        Balance.Text = "£" + Balance.Text;
                    }
                }
                break;
        }
    }
    protected void AccountSummary_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            if (e.Row.RowIndex % 2 == 0)
            {
                e.Row.Style.Add("background-color", "#96B58F");
            }
            AccountEntry ae = ((AccountEntry)e.Row.DataItem);
            e.Row.Cells[0].Text = ae.Type.ToString();
            if (ae.CreditOrDebit == CricketClubDomain.CreditDebit.Credit)
            {
                e.Row.Cells[1].Text = "£" + ae.Amount;
            }
            else
            {
                e.Row.Cells[2].Text = "£" + ae.Amount;
            }
            e.Row.Cells[3].Text = ae.Status.ToString();
            e.Row.Cells[4].Text = ae.Description;
            if (ae.MatchID > 0) {
                Match m = new Match(ae.MatchID);
                e.Row.Cells[5].Text = "vs " + m.Opposition.Name + " (" + m.MatchDateString + ")";
            }
        }
    }
    protected void RegPayment_Click(object sender, EventArgs e)
    {
        CricketClubDomain.PaymentType pt = (CricketClubDomain.PaymentType)Enum.Parse(typeof(CricketClubDomain.PaymentType), PaymentType.Text);
        double dAmount = 0.00;
        bool success = double.TryParse(amount.Text, out dAmount);
        if (!success)
        {

            return;
        }
        else
        {
            Player p = Player.GetAll().Where(a=>a.EmailAddress == LoggedOnUser.EmailAddress).FirstOrDefault();
            PlayerAccount pa = new PlayerAccount(p);
            pa.AddPayment(dAmount, Comments.Text, DateTime.Now, null, CricketClubDomain.PaymentStatus.Unconfirmed, pt, CricketClubDomain.CreditDebit.Credit);

            RegisterPayment.InnerHtml = "Your Payment has bee registered - it will be confirmed by the treasurer in due course.";
        }
    }
}
