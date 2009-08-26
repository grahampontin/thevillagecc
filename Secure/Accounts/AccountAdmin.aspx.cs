using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using CricketClubMiddle.Security;
using CricketClubMiddle;
using CricketClubAccounts;

public partial class Secure_Accounts_AccountAdmin : CricketClubMiddle.Web.SecurePage
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (LoggedOnUser.HasPermission(Permissions.Accountant))
        {

        }
        else
        {
            //... Not allowed.
        }
        string action = Request["action"];

        var AllPlayers = Player.GetAll().Where(a => a.IsActive).Where(a=>a.Name.Length>0).ToList().OrderBy(a => a.Name);


        switch (action)
        {
            #region List Balances
            case "listBalances":
                Welcome.Visible = false;
                ListBalances.Visible = true;

                int offset = 0;
                string sOffset = Request["offset"];
                int.TryParse(sOffset, out offset);

                var Players2 = AllPlayers.Skip(offset);

                BalancesGrid.DataSource = Players2.Take(10);
                BalancesGrid2.DataSource = Players2.Skip(10).Take(10);
                BalancesGrid3.DataSource = Players2.Skip(20).Take(10);
                BalancesGrid4.DataSource = Players2.Skip(30).Take(10);

                BalancesGrid.DataBind();
                BalancesGrid2.DataBind();
                BalancesGrid3.DataBind();
                BalancesGrid4.DataBind();

                if (offset >= 40)
                {
                    previousLink.NavigateUrl = Request.RawUrl.Replace("offset=", "") + "&offset=" + (offset - 40);
                }
                else
                {
                    previousLink.Visible = false;
                }
                NextLink.NavigateUrl = Request.RawUrl.Replace("offset=", "") + "&offset=" + (offset + 40);
                
                break;
            #endregion
            #region Add Payements
            case "addPayments":
                Welcome.Visible = false;
                AddPayments.Visible = true;

                if (!IsPostBack)
                {
                    PlayersCheckBoxes.DataSource = AllPlayers;
                    PlayersCheckBoxes.DataBind();

                    PaymentType.DataSource = Enum.GetValues(typeof(CricketClubDomain.PaymentType));
                    CreditDebit.DataSource = Enum.GetValues(typeof(CricketClubDomain.CreditDebit));
                    PaymentType.DataBind();
                    CreditDebit.DataBind();

                }

                break;
            #endregion
            #region UnconfirmedPayments
            case "confirmPayments":
                if (!IsPostBack)
                {
                    var payments = AccountEntry.GetAll().Where(a => a.Status == CricketClubDomain.PaymentStatus.Unconfirmed);
                    UncomfirmedPayments.DataSource = payments;
                    UncomfirmedPayments.DataBind();
                }
                ConfirmPayments.Visible = true;
                Welcome.Visible = false;
                break;
            #endregion
            #region AmmendPayments
            case "ammendPayments":
                AmmendPayment.Visible = true;
                Welcome.Visible = false;
                if (!IsPostBack)
                {
                    AmmendPaymentsPlayerList.DataSource = AllPlayers;
                    AmmendPaymentsPlayerList.DataBind();
                }
                break;
            #endregion

        }
        

    }
    protected void BalancesGrid_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            Player p = ((Player)(e.Row.DataItem));
            PlayerAccount pa = new PlayerAccount(p);
            double balance = pa.GetBalance(); 
            e.Row.Cells[1].Text = "£" + balance.ToString();
            if (balance < 0)
            {
                e.Row.Cells[1].Style.Add("color", "red") ;
            }

            if (e.Row.RowIndex % 2 == 0)
            {
                e.Row.Style.Add("background-color", "#96B58F");
            }
            
        }
    }
    protected void AddPaymentsButton_Click(object sender, EventArgs e)
    {

        string players = "";

        foreach (ListItem li in PlayersCheckBoxes.Items)
        {
           
            if (li.Selected)
            {
                Player p = Player.GetAll().Where(a=>a.Name == li.Text).FirstOrDefault();
                PlayerAccount pa = new PlayerAccount(p);
                double dAmount = 0.00;
                bool success = double.TryParse(amount.Text,out dAmount);
                if (!success) 
                {
                    return;
                } else {

                    pa.AddPayment(dAmount, Comments.Text, DateTime.Now, null, CricketClubDomain.PaymentStatus.Confirmed, (CricketClubDomain.PaymentType)Enum.Parse(typeof(CricketClubDomain.PaymentType), PaymentType.Text), (CricketClubDomain.CreditDebit)Enum.Parse(typeof(CricketClubDomain.CreditDebit), CreditDebit.Text));
                players = players + p.Name + ", ";
                AddPayments.InnerHtml = "The following players have been updated:<BR><BR> " + players;

                }
            }
        }
    }
    protected void UncomfirmedPayments_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            AccountEntry ae = ((AccountEntry)e.Row.DataItem);
            Player p = new Player(ae.PlayerID);
            e.Row.Cells[0].Text = p.Name;
            e.Row.Cells[1].Text = ae.Type.ToString();
            e.Row.Cells[2].Text = ae.Amount.ToString();
            e.Row.Cells[3].Text = ae.Date.ToLongDateString();
            e.Row.Cells[4].Text = ae.Description;
            e.Row.Cells[5].Text = ae.Status.ToString();
            
            
        }
    }
    protected void UncomfirmedPayments_RowCommand(object sender, GridViewCommandEventArgs e)
    {
        int rowNumber = int.Parse(e.CommandArgument.ToString());

        GridViewRow row = ((GridView)e.CommandSource).Rows[rowNumber];

        int entryId = int.Parse(row.Cells[7].Text);

        AccountEntry ae = new AccountEntry(entryId);
        ae.Status = CricketClubDomain.PaymentStatus.Confirmed;
        ae.Save();
        var payments = AccountEntry.GetAll().Where(a => a.Status == CricketClubDomain.PaymentStatus.Unconfirmed);
        UncomfirmedPayments.DataSource = payments;
        UncomfirmedPayments.DataBind();
                

    }
    protected void AmmendPaymentsPlayerList_SelectedIndexChanged(object sender, EventArgs e)
    {
        string playerName = AmmendPaymentsPlayerList.SelectedItem.Text;
        Player p = Player.GetAll().Where(a => a.Name == playerName).FirstOrDefault();

        PlayerAccount pa = new PlayerAccount(p);
        AmmendPaymentAccountSummary.DataSource = pa.GetStatement();
        AmmendPaymentAccountSummary.DataBind();
        


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
            if (ae.MatchID > 0)
            {
                Match m = new Match(ae.MatchID);
                e.Row.Cells[5].Text = "vs " + m.Opposition.Name + " (" + m.MatchDateString + ")";
            }
        }
    }
    protected void AmmendPaymentAccountSummary_RowDeleting(object sender, GridViewDeleteEventArgs e)
    {
        int paymentID = int.Parse(AmmendPaymentAccountSummary.Rows[e.RowIndex].Cells[8].Text);
        AccountEntry ae = new AccountEntry(paymentID);
        double previousAmount = ae.Amount;
        ae.Amount = 0.00;
        ae.Status = CricketClubDomain.PaymentStatus.Deleted;
        ae.Description += " [Deleted by Administator, was £"+previousAmount+"]";
        ae.Save();

    }
    protected void AmmendPaymentAccountSummary_RowEditing(object sender, GridViewEditEventArgs e)
    {
        //todo
    }
}
