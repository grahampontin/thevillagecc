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
}
