<%@ Page Language="C#" AutoEventWireup="true" CodeFile="AccountAdmin.aspx.cs" Inherits="Secure_Accounts_AccountAdmin" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>VCC Online Accounts Admin</title>
    <CC:Styles runat=server ID=styles /> 
    
</head>
<body>
    <div class=AdminPageHeader>
        <div class=AdminPageLogo>
            <img src="/Images/logo.jpg" width="200px" />
        </div>
        <div class="AdminPageTitle">
            VCC Account System Admin
        </div>
    </div>
    <div class=AdminPageLeftMenu>
        <!-- MENU HERE -->
        <ul>
            <li>
               <a href=AccountAdmin.aspx?action=addPayments>Add New Payments</a>
            </li>
            <li>
                <a href=AccountAdmin.aspx?action=confirmPayments>Confirm Payments</a>
            </li>
            <li>
                <a href=AccountAdmin.aspx?action=ammendPayments>Ammend a Payment</a>
            </li>
            <li>
                <a href=AccountAdmin.aspx?action=listBalances>List Balances</a>
            </li>
            <li>
                <a href=AccountAdmin.aspx?action=managePermissions>Manage Permissions</a>
            </li>
            <li>
                <a href=AccountAdmin.aspx?action=manageEmails>Manage Email Addresses</a>
            </li>
            <li>
                <a href=AccountAdmin.aspx?action=sendEmails>Email Debtors</a>
            </li>
            <li>
                <a href="../StatsAdmin/Home.aspx">Go to Stats Admin</a>
            </li>
        </ul>
        <!-- END MENU -->
    </div>
    <div class=AdminPageBody>
        <form id="form1" runat="server">
            <!-- BODY CONTENT HERE -->
            
            
            <div id=Welcome runat=server>
                Welcome to the VCC Account System. Please choose from the options on
                the left.
            </div>
            
            <div id=ListBalances runat=server visible=false>
                <div class=floatLeft>
                <asp:GridView ID=BalancesGrid runat=server AutoGenerateColumns="False" 
                    onrowdatabound="BalancesGrid_RowDataBound">
                    <Columns>
                        <asp:BoundField DataField="FormalName" HeaderText="Name" />
                        <asp:BoundField HeaderText="Balance" NullDisplayText="£0" />
                    </Columns>
                </asp:GridView>
                </div>
                
                <div class=floatLeft>
                <asp:GridView ID=BalancesGrid2 runat=server AutoGenerateColumns="False" 
                    onrowdatabound="BalancesGrid_RowDataBound">
                    <Columns>
                        <asp:BoundField DataField="FormalName" HeaderText="Name" />
                        <asp:BoundField HeaderText="Balance" NullDisplayText="£0" />
                    </Columns>
                </asp:GridView>
                </div>
                <div class=floatLeft>
                <asp:GridView ID=BalancesGrid3 runat=server AutoGenerateColumns="False" 
                    onrowdatabound="BalancesGrid_RowDataBound">
                    <Columns>
                        <asp:BoundField DataField="FormalName" HeaderText="Name" />
                        <asp:BoundField HeaderText="Balance" NullDisplayText="£0" />
                    </Columns>
                </asp:GridView>
                </div>
                <div class=floatLeft>
                <asp:GridView ID=BalancesGrid4 runat=server AutoGenerateColumns="False" 
                    onrowdatabound="BalancesGrid_RowDataBound">
                    <Columns>
                        <asp:BoundField DataField="FormalName" HeaderText="Name" />
                        <asp:BoundField HeaderText="Balance" NullDisplayText="£0" />
                    </Columns>
                </asp:GridView>
                </div>
                <div class="clearer Centered">
                    <asp:HyperLink ID=ShowDebtors runat=server>Show Only Debtors</asp:HyperLink><br /><br />
                </div>
                <div class=clearer>
                <div class=floatLeft>
                    <asp:HyperLink ID=previousLink runat=server><< Previous Page</asp:HyperLink>
                </div>
                <div class=floatRight>
                    <asp:HyperLink ID=NextLink runat=server>Next Page >></asp:HyperLink>
                </div>
                </div>
            </div>
            
            <div id=AddPayments runat=server visible=false>
                <table>
                    <tr>
                        <td>Amount:</td>
                        <td><asp:TextBox ID=amount runat=server Height="21px">0.00</asp:TextBox></td>
                    </tr>
                    <tr>
                        <td>Type:</td>
                        <td><asp:DropDownList ID=PaymentType runat=server ></asp:DropDownList></td>
                    </tr>
                    <tr>
                        <td>Credit or Debit:</td>
                        <td><asp:DropDownList ID=CreditDebit runat=server></asp:DropDownList></td>
                    </tr>
                    <tr>
                        <td>Comments:</td>
                        <td><asp:TextBox ID=Comments runat=server Height="108px" TextMode="MultiLine" 
                                Width="285px"></asp:TextBox></td>
                    </tr>
                </table>
                
                
                <asp:CheckBoxList ID="PlayersCheckBoxes" runat="server" RepeatDirection="Vertical" RepeatLayout="Table" RepeatColumns="5">
                </asp:CheckBoxList>
            
                <asp:Button ID=AddPaymentsButton runat=server Text="Add Payments" 
                onclick="AddPaymentsButton_Click" />
                
                
            </div>
            
            <div id=ConfirmPayments runat=server visible=false>
                <asp:GridView ID=UncomfirmedPayments runat=server AutoGenerateColumns="False" 
                    onrowdatabound="UncomfirmedPayments_RowDataBound" 
                    onrowcommand="UncomfirmedPayments_RowCommand">
                    <Columns>
                        <asp:BoundField HeaderText="Name" />
                        <asp:BoundField HeaderText="Type" />
                        <asp:BoundField HeaderText="Amount" />
                        <asp:BoundField HeaderText="Date" />
                        <asp:BoundField HeaderText="Comments" />
                        <asp:BoundField HeaderText="Status" />
                        <asp:CommandField ButtonType="Button" SelectText="Confirm" 
                            ShowSelectButton="True" />
                        <asp:BoundField DataField="ID" HeaderText="ID (system use)" />
                    </Columns>
                </asp:GridView>
                
            </div>
            
            <div id=AmmendPayment visible=false runat=server>
                <div id=AmmedPaymentListing runat=server>
                <div id=AmmendPaymentChoosePlayer runat=server>
                    Choose Player: <asp:DropDownList ID=AmmendPaymentsPlayerList runat=server 
                        onselectedindexchanged="AmmendPaymentsPlayerList_SelectedIndexChanged" 
                        AutoPostBack="True"></asp:DropDownList>
                </div>
                
                <asp:GridView ID=AmmendPaymentAccountSummary runat=server AutoGenerateColumns="False" 
                    onrowdatabound="AccountSummary_RowDataBound" 
                    onrowcommand="AmmendPaymentAccountSummary_RowCommand" 
                    onrowdeleting="AmmendPaymentAccountSummary_RowDeleting" 
                    onrowediting="AmmendPaymentAccountSummary_RowEditing">
                    <Columns>
                        <asp:BoundField HeaderText="Type" />
                        <asp:BoundField HeaderText="Paid In" />
                        <asp:BoundField HeaderText="Paid out" />
                        <asp:BoundField HeaderText="Status" />
                        <asp:BoundField HeaderText="Comments" />
                        <asp:BoundField HeaderText="Match" />
                        <asp:CommandField ButtonType="Button" ShowCancelButton="False" 
                            ShowEditButton="True" />
                        <asp:CommandField ButtonType="Button" ShowDeleteButton="True" />
                        <asp:BoundField DataField="ID" HeaderText="ID" />
                    </Columns>
                </asp:GridView>
            </div>
            <div id=AmmendPaymentEditPayment runat=server visible=false>
                <table>
                    <tr>
                        <td>Amount:</td>
                        <td><asp:TextBox ID=AmmendAmount runat=server>0.00</asp:TextBox></td>
                    </tr>
                    <tr>
                        <td>Type:</td>
                        <td><asp:DropDownList ID=AmmendType runat=server></asp:DropDownList></td>
                    </tr>
                    <tr>
                        <td>Status:</td>
                        <td><asp:DropDownList ID=AmmendStatus runat=server></asp:DropDownList></td>
                    </tr>
                    <tr>
                        <td>Credit / Debit:</td>
                        <td><asp:DropDownList ID=AmmendCreditDebit runat=server></asp:DropDownList></td>
                    </tr>                    
                    <tr>
                        <td>Comments:</td>
                        <td><asp:TextBox ID=AmmendComment runat=server Height="108px" TextMode="MultiLine" 
                                Width="285px"></asp:TextBox>
                            
                        </td>
                    </tr>
                </table>
                <asp:TextBox ID="AmmendingPaymentID" runat="server" Visible="False"></asp:TextBox>
                <asp:Button ID=AmmendPaymentSave runat=server onclick="AmmendPaymentSave_Click" 
                    Text="Save" />
                
            
            </div>    
            </div>
            
            <div id=ManagePermissions runat=server visible=false>
                Checked users have the indicated permissions:<br />
                
                
                <br />
                <asp:GridView ID="PermissionsGridView" runat="server" 
                    AutoGenerateColumns="False" GridLines="None">
                    <Columns>
                        <asp:BoundField DataField="ID" HeaderText="ID" />
                        <asp:BoundField DataField="DisplayName" HeaderText="Name" />
                        <asp:TemplateField HeaderText="Accountant">
                            <ItemTemplate>
                                <asp:CheckBox ID="IsAccountantCB" runat="server" 
                                    Checked='<%# Bind("IsAccountant") %>' Enabled="true" />
                            </ItemTemplate>
                        </asp:TemplateField>
                        <asp:TemplateField HeaderText="Chat Admin">
                            <ItemTemplate>
                                <asp:CheckBox ID="IsChatAdminCB" runat="server" 
                                    Checked='<%# Bind("IsChatAdmin") %>' Enabled="true" />
                            </ItemTemplate>
                        </asp:TemplateField>
                    </Columns>
                </asp:GridView>
                <asp:Button Text="Save Permissions" runat=server ID="SavePermissions" 
                    onclick="SavePermissions_Click" />
            </div>
            
            <div id=ManageEmailAddresses runat=server visible="False">
                <asp:GridView ID="ManageEmailsListUsers" runat=server Visible=False 
                    AutoGenerateColumns="False" onrowcommand="ManageEmailsListUsers_RowCommand">
                    <Columns>
                        <asp:BoundField DataField="ID" HeaderText="ID" />
                        <asp:BoundField DataField="DisplayName" HeaderText="User Name" />
                        <asp:BoundField DataField="EmailAddress" HeaderText="Email Address" />
                        <asp:ButtonField ButtonType="Button" CommandName="LinkToUser" 
                            Text="Link to This User" />
                    </Columns>
                    
                </asp:GridView>
            
                <asp:GridView ID="ManageEmailsGridView" runat="server" 
                    AutoGenerateColumns="False" onrowcommand="ManageEmailsGridView_RowCommand" 
                    onrowdatabound="ManageEmailsGridView_RowDataBound" >
                    <Columns>
                        <asp:BoundField DataField="ID" HeaderText="ID" />
                        <asp:BoundField DataField="Name" HeaderText="Player Name" />
                        <asp:TemplateField HeaderText="Registered EmailAddress">
                            <ItemTemplate>
                                <asp:TextBox id=EmailAddressTB runat="server" Text='<%# Bind("EmailAddress") %>'>
                                </asp:TextBox>
                            </ItemTemplate>
                        </asp:TemplateField>
                        <asp:BoundField HeaderText="Linked User Account" />
                        <asp:ButtonField ButtonType="Button" Text="Mark as Inactive" 
                            CommandName="MarkInactive" />
                        <asp:ButtonField ButtonType="Button" Text="Link to Existing User" 
                            CommandName="LinkToUser" />
                    </Columns>
                </asp:GridView>
                
                <asp:Button ID=ManageEmailsSaveButton runat=server Text="Save Changes" 
                    onclick="ManageEmailsSaveButton_Click" />
                
            &nbsp;- <B>Please be patient, saving this screen can take up to a minute.</B></div>
            
            <div id=SendEmails visible=false runat=server>
                Email all users whose debt is over:
                £<asp:TextBox ID=EmailLimit runat=server></asp:TextBox><br />
                <asp:Button ID=SendEmailsButton runat=server Text="Send Emails" onclick="SendEmailsButton_Click" />
                <br /><br />
                <div class=message id=Message runat=server visible=false></div>
            </div>
            
            <!-- END BODY CONTENT -->
        </form>
    </div>
    
</body>
</html>
