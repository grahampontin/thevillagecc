using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using CricketClubMiddle.Security;
using CricketClubMiddle;
using CricketClubAccounts;
using CricketClubMiddle.Utility;

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
            Response.Redirect("/NotAuthorized.aspx");
        }
        string action = Request["action"];

        var AllPlayers = Player.GetAll().Where(a => a.IsActive).Where(a=>a.Name.Length>0).ToList().OrderBy(a => a.FormalName);


        switch (action)
        {
            #region List Balances
            case "listBalances":
                Welcome.Visible = false;
                ListBalances.Visible = true;

                int offset = 0;
                string sOffset = Request["offset"];
                int.TryParse(sOffset, out offset);
                string showDebtors = Request["showdebtors"];

                var Players2 = AllPlayers.Skip(offset);
                if (showDebtors == "true")
                {
                    Players2 = AllPlayers.Where(a => (new PlayerAccount(a)).GetBalance() < 0);
                    ShowDebtors.NavigateUrl = "./accountadmin.aspx?action=listBalances";
                    ShowDebtors.Text = "Show All Players";
                }
                else
                {
                    ShowDebtors.NavigateUrl = "./accountadmin.aspx?action=listBalances&showdebtors=true";
                }

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

                    int PlayerID = 0;
                    string pID = Request["playerid"];
                    if (int.TryParse(pID, out PlayerID))
                    {
                        Player p = new Player(PlayerID);

                        PlayerAccount pa = new PlayerAccount(p);
                        AmmendPaymentAccountSummary.DataSource = pa.GetStatement();
                        AmmendPaymentAccountSummary.DataBind();
                        AmmendPaymentsPlayerList.SelectedIndex = AmmendPaymentsPlayerList.Items.IndexOf(AmmendPaymentsPlayerList.Items.FindByText(p.FormalName));
                    }
                }
                


                break;
            #endregion
            #region ManagePermissions
            case "managePermissions":
                
                ManagePermissions.Visible = true;
                Welcome.Visible = false;
                if (!IsPostBack)
                {
                    PermissionsGridView.DataSource = CricketClubMiddle.Interactive.User.GetAll();
                    PermissionsGridView.DataBind();
                }

                break;
            #endregion
            #region ManageEmailAddresses
            case "manageEmails":
                ManageEmailAddresses.Visible = true;
                Welcome.Visible = false;

                if (!IsPostBack)
                {
                    ManageEmailsGridView.DataSource = Player.GetAll().Where(a => a.IsActive).Where(a => a.Name.Length > 0).Where(a => a.ID >= 0).OrderBy(a => a.FormalName);
                    ManageEmailsGridView.DataBind();
                }

                break;
            #endregion
            #region SendEmails
            case "sendEmails":
                SendEmails.Visible = true;
                Welcome.Visible = false;
                break;
            #endregion
            #region ManageSettings
            case "manageSettings":
                ManageSettings.Visible = true;
                Welcome.Visible = false;
                
                if (!IsPostBack)
                {
                    SettingsGridview.DataSource = SettingsWrapper.GetAll();
                    SettingsGridview.DataBind();
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
            e.Row.Cells[0].Text = "<a href=./accountadmin.aspx?action=ammendPayments&playerid=" + p.ID + ">" + p.FormalName + "</a>";
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
                Player p = Player.GetAll().Where(a=>a.FormalName == li.Text).FirstOrDefault();
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
        Player p = Player.GetAll().Where(a => a.FormalName == playerName).FirstOrDefault();

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
        if (ae.Status != CricketClubDomain.PaymentStatus.Deleted)
        {
            ae.Amount = 0.00;
            ae.Status = CricketClubDomain.PaymentStatus.Deleted;
            ae.Description += " [Deleted by "+LoggedOnUser.DisplayName+", was £" + previousAmount + "]";
            ae.Save();
        }

        string playerName = AmmendPaymentsPlayerList.SelectedItem.Text;
        Player p = Player.GetAll().Where(a => a.FormalName == playerName).FirstOrDefault();

        PlayerAccount pa = new PlayerAccount(p);
        AmmendPaymentAccountSummary.DataSource = pa.GetStatement();
        AmmendPaymentAccountSummary.DataBind();

    }
    protected void AmmendPaymentAccountSummary_RowCommand(object sender, GridViewCommandEventArgs e)
    {
        if (e.CommandName == "Edit")
        {
            int paymentID = int.Parse(AmmendPaymentAccountSummary.Rows[int.Parse(e.CommandArgument.ToString())].Cells[8].Text);
            AmmedPaymentListing.Visible = false;
            AmmendPaymentEditPayment.Visible = true;
            AccountEntry ae = new AccountEntry(paymentID);
            AmmendAmount.Text = ae.Amount.ToString();
            AmmendComment.Text = ae.Description;
            AmmendCreditDebit.DataSource = Enum.GetValues(typeof(CricketClubDomain.CreditDebit));
            AmmendCreditDebit.DataBind();
            AmmendCreditDebit.SelectedValue = ae.CreditOrDebit.ToString();
            AmmendType.DataSource = Enum.GetValues(typeof(CricketClubDomain.PaymentType));
            AmmendType.DataBind();
            AmmendType.SelectedValue = ae.Type.ToString();
            AmmendStatus.DataSource = Enum.GetValues(typeof(CricketClubDomain.PaymentStatus));
            AmmendStatus.DataBind();
            AmmendStatus.SelectedValue = ae.Status.ToString();
            AmmendingPaymentID.Text = paymentID.ToString();

        }
    }
    protected void AmmendPaymentSave_Click(object sender, EventArgs e)
    {
        int paymentID = int.Parse(AmmendingPaymentID.Text);
        AccountEntry ae = new AccountEntry(paymentID);
        ae.Amount = double.Parse(AmmendAmount.Text);
        ae.Description = AmmendComment.Text;
        ae.Status = (CricketClubDomain.PaymentStatus)Enum.Parse(typeof(CricketClubDomain.PaymentStatus), AmmendStatus.Text);
        ae.Type = (CricketClubDomain.PaymentType)Enum.Parse(typeof(CricketClubDomain.PaymentType), AmmendType.Text);
        ae.CreditOrDebit = (CricketClubDomain.CreditDebit)Enum.Parse(typeof(CricketClubDomain.CreditDebit), AmmendCreditDebit.Text);
        ae.Save();

        string playerName = AmmendPaymentsPlayerList.SelectedItem.Text;
        Player p = Player.GetAll().Where(a => a.FormalName == playerName).FirstOrDefault();

        PlayerAccount pa = new PlayerAccount(p);
        AmmendPaymentAccountSummary.DataSource = pa.GetStatement();
        AmmendPaymentAccountSummary.DataBind();


        AmmedPaymentListing.Visible = true;
        AmmendPaymentEditPayment.Visible = false;
            
            
    }
    protected void AmmendPaymentAccountSummary_RowEditing(object sender, GridViewEditEventArgs e)
    {
        //not used but handler must remain in place - uses _RowCommand
    }
    protected void SavePermissions_Click(object sender, EventArgs e)
    {
        foreach (GridViewRow Row in PermissionsGridView.Rows)
        {
            int UserID = int.Parse(Row.Cells[0].Text); 
            string name = Row.Cells[1].Text;
            CheckBox IsAccountantCB = (CheckBox)Row.FindControl("IsAccountantCB");
            CheckBox IsChatAdminCB = (CheckBox)Row.FindControl("IsChatAdminCB");
            CricketClubMiddle.Interactive.User u = new CricketClubMiddle.Interactive.User(UserID);
                

            if (IsAccountantCB.Checked)
            {
                u.GrantPermission(Permissions.Accountant);
            }
            else
            {
                u.RevokePermission(Permissions.Accountant);
            }

            if (IsChatAdminCB.Checked)
            {
                u.GrantPermission(Permissions.ChatAdmin);
            }
            else
            {
                u.RevokePermission(Permissions.ChatAdmin);
            }

            PermissionsGridView.DataSource = CricketClubMiddle.Interactive.User.GetAll();
            PermissionsGridView.DataBind();


        }

    }


    protected void ManageEmailsGridView_SelectedIndexChanged(object sender, EventArgs e)
    {

    }
    protected void ManageEmailsGridView_RowCommand(object sender, GridViewCommandEventArgs e)
    {
        int playerID = int.Parse(ManageEmailsGridView.Rows[int.Parse(e.CommandArgument.ToString())].Cells[0].Text);
        Player p = new Player(playerID);

        if (e.CommandName == "MarkInactive")
        {
            p.IsActive = false;
            p.Save();
            ManageEmailsGridView.DataSource = Player.GetAll().Where(a => a.IsActive).Where(a => a.Name.Length > 0).Where(a => a.ID >= 0).OrderBy(a => a.FormalName);
            ManageEmailsGridView.DataBind();
        }

        if (e.CommandName == "LinkToUser")
        {
            ManageEmailsListUsers.Visible = true;
            ManageEmailsGridView.Visible = false;
            ManageEmailsListUsers.DataSource = CricketClubMiddle.Interactive.User.GetAll().Where(a => !Player.GetAll().Any(b => b.EmailAddress == a.EmailAddress));
            ManageEmailsListUsers.DataBind();
            Session["playerID"] = playerID;
        }

        
        
    }
    protected void ManageEmailsGridView_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            string emailAddress = ((Player)e.Row.DataItem).EmailAddress;
            CricketClubMiddle.Interactive.User u = CricketClubMiddle.Interactive.User.GetAll().Where(a => a.EmailAddress == emailAddress).FirstOrDefault();
            if (u != null)
            {
                e.Row.Cells[3].Text = u.DisplayName;
                e.Row.Cells[4].Visible = false;
                e.Row.Cells[5].Visible = false;

            }
        }
    }
    protected void ManageEmailsSaveButton_Click(object sender, EventArgs e)
    {
        foreach (GridViewRow Row in ManageEmailsGridView.Rows)
        {
            if (Row.RowType == DataControlRowType.DataRow)
            {
                string emailAddress = ((TextBox)Row.FindControl("EmailAddressTB")).Text;
                int playerID = int.Parse(Row.Cells[0].Text);
                Player p = new Player(playerID);
                if (p.EmailAddress != emailAddress)
                {
                    p.EmailAddress = emailAddress;
                    p.Save();
                }

            }
        }

        ManageEmailsGridView.DataSource = Player.GetAll().Where(a => a.IsActive).Where(a => a.Name.Length > 0).Where(a=>a.ID>=0).OrderBy(a => a.FormalName);
        ManageEmailsGridView.DataBind();

    }
    protected void ManageEmailsListUsers_RowCommand(object sender, GridViewCommandEventArgs e)
    {
        int userID = int.Parse(ManageEmailsListUsers.Rows[int.Parse(e.CommandArgument.ToString())].Cells[0].Text);
        int playerID = (int)Session["playerID"];
        Player p = new Player(playerID);
        CricketClubMiddle.Interactive.User user = new CricketClubMiddle.Interactive.User(userID);
        if (user.EmailAddress != null && user.EmailAddress.Length > 0)
        {
            p.EmailAddress = user.EmailAddress;
            p.Save();
        }

        ManageEmailsListUsers.Visible = false;
        ManageEmailsGridView.Visible = true;
        ManageEmailsGridView.DataSource = Player.GetAll().Where(a => a.IsActive).Where(a => a.Name.Length > 0).Where(a => a.ID >= 0).OrderBy(a => a.FormalName);
        ManageEmailsGridView.DataBind();
    }
    protected void SendEmailsButton_Click(object sender, EventArgs e)
    {
        if (EmailLimit.Text.Length > 0)
        {
            int amount = 0;
            bool success = int.TryParse(EmailLimit.Text, out amount);
            if (!success)
            {
                Message.Visible = true;
                Message.InnerText = "Could not parse the amount - please enter an integer";
            }
            else
            {
                string PlayersWithNoEmailAddresses = "";
                string FailedToEmail = "";
                string Emailed = "";
                foreach (Player p in Player.GetAll())
                {
                    PlayerAccount pa = new PlayerAccount(p);
                    if (pa.GetBalance() * -1 > amount)
                    {
                        if (p.EmailAddress != null && p.EmailAddress.Contains('@'))
                        {
                            //Player has what seems to be a valid email address
                            try
                            {
                                System.Net.Mail.MailMessage mail = new System.Net.Mail.MailMessage("admin@thevillagecc.org.uk", p.EmailAddress); 
                                mail.Bcc.Add("thevillagecc@gmail.com");
                                mail.Subject = "Village CC Payment Request";        // put subject here	
                                mail.Body = "Hi " + p.Name + ",<BR><BR> According to our records you now owe the club more than £" + amount.ToString() + ", in order for us to be able to meet payments through the season we would appreciate your payment. You can check the details of your account by visiting <a href=\"http://thevillagecc.org.uk/secure/Accounts/MyAccount.aspx\">My Account</a>.<BR><BR>If you do not currently have a VCC Online Account you will be directed to register for one in order to see your account. It is important that you register your account using <b>the email address that this mail was sent to.</b><BR><BR>Once you have transferred funds or sent a cheque, or indeed if you paid cash on the day please <b>complete the Register Payment form</b>, the Treasurer will then be notified and your account balance updated.<BR><BR>If you have any issues with this system, or want to delay payment for any reason please speak to the treasurer or email thevillagecc@gmail.com.<BR><BR>Thanks,<BR>The VCC Committee.";

                                CricketClubMiddle.Interactive.User u = CricketClubMiddle.Interactive.User.GetAll().Where(a => a.EmailAddress == p.EmailAddress).FirstOrDefault();
                                if (u != null)
                                {
                                    mail.Body = mail.Body + "<BR><BR>Forgotten your logon details? Click <a href='http://thevillagecc.org.uk/Secure/Logon.aspx?username="+u.Name+"'>here</a> for a reminder email";
                                }

                                mail.IsBodyHtml = true;
                                System.Net.Mail.SmtpClient smtp = new System.Net.Mail.SmtpClient("mail.thevillagecc.org.uk");
                                smtp.Send(mail);
                                Emailed += p.FormalName + ", ";
                            }
                            catch (Exception)
                            {
                                FailedToEmail += p.FormalName + ", ";
                            }

                        }
                        else
                        {
                            PlayersWithNoEmailAddresses += p.FormalName + ", ";
                        }
                    }
                    SendEmails.InnerHtml = "<B>Emailed:</b> " + Emailed + "<BR><BR><b>Failed to Email (Errors):</b> " + FailedToEmail + "<BR><BR><b>No Email Address:</b>" + PlayersWithNoEmailAddresses;
                }
            }
        }
    }

    protected void ShowDebtors_Click(object sender, EventArgs e)
    {

    }
    protected void SettingsGridview_SelectedIndexChanged(object sender, EventArgs e)
    {

    }
    protected void SettingsGridview_RowEditing(object sender, GridViewEditEventArgs e)
    {
        SettingsGridview.EditIndex = e.NewEditIndex;
        SettingsGridview.DataSource = SettingsWrapper.GetAll();
        SettingsGridview.DataBind();
    }
    protected void SettingsGridview_RowDeleting(object sender, GridViewDeleteEventArgs e)
    {

    }
    protected void SettingsGridview_RowUpdating(object sender, GridViewUpdateEventArgs e)
    {
        string key = ((Label)SettingsGridview.Rows[e.RowIndex].Cells[0].FindControl("Label1")).Text;
        string value = ((TextBox)SettingsGridview.Rows[e.RowIndex].Cells[1].FindControl("Textbox2")).Text;
        string desc = ((Label)SettingsGridview.Rows[e.RowIndex].Cells[2].FindControl("Label3")).Text;

        SettingsWrapper.Set(key, value, desc);
        SettingsGridview.EditIndex = -1;
        SettingsGridview.DataSource = SettingsWrapper.GetAll();
        SettingsGridview.DataBind();
    
    }
    protected void SettingsGridview_RowCancelingEdit(object sender, GridViewCancelEditEventArgs e)
    {
        SettingsGridview.EditIndex = -1;
        SettingsGridview.DataSource = SettingsWrapper.GetAll();
        SettingsGridview.DataBind();
    }
}
