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
                <a href=AccountAdmin.aspx?action=confirmPayment>Confirm Payments</a>
            </li>
            <li>
                <a href=AccountAdmin.aspx?action=changePayment>Ammend a Payment</a>
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
                        <asp:BoundField DataField="Name" HeaderText="Name" />
                        <asp:BoundField HeaderText="Balance" NullDisplayText="£0" />
                    </Columns>
                </asp:GridView>
                </div>
                
                <div class=floatLeft>
                <asp:GridView ID=BalancesGrid2 runat=server AutoGenerateColumns="False" 
                    onrowdatabound="BalancesGrid_RowDataBound">
                    <Columns>
                        <asp:BoundField DataField="Name" HeaderText="Name" />
                        <asp:BoundField HeaderText="Balance" NullDisplayText="£0" />
                    </Columns>
                </asp:GridView>
                </div>
                <div class=floatLeft>
                <asp:GridView ID=BalancesGrid3 runat=server AutoGenerateColumns="False" 
                    onrowdatabound="BalancesGrid_RowDataBound">
                    <Columns>
                        <asp:BoundField DataField="Name" HeaderText="Name" />
                        <asp:BoundField HeaderText="Balance" NullDisplayText="£0" />
                    </Columns>
                </asp:GridView>
                </div>
                <div class=floatLeft>
                <asp:GridView ID=BalancesGrid4 runat=server AutoGenerateColumns="False" 
                    onrowdatabound="BalancesGrid_RowDataBound">
                    <Columns>
                        <asp:BoundField DataField="Name" HeaderText="Name" />
                        <asp:BoundField HeaderText="Balance" NullDisplayText="£0" />
                    </Columns>
                </asp:GridView>
                </div>
                
                <div class=floatLeft>
                    <asp:HyperLink ID=previousLink runat=server><< Previous Page</asp:HyperLink>
                </div>
                <div class=floatRight>
                    <asp:HyperLink ID=NextLink runat=server>Next Page >></asp:HyperLink>
                </div>
                
            </div>
            
            <div id=AddPayments runat=server visible=false>
                <table>
                    <tr>
                        <td>Amount:</td>
                        <td><asp:TextBox ID=amount runat=server>0.00</asp:TextBox></td>
                    </tr>
                    <tr>
                        <td>Type:</td>
                        <td><asp:DropDownList ID=PaymentType runat=server></asp:DropDownList></td>
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
            
            <!-- END BODY CONTENT -->
        </form>
    </div>
    
</body>
</html>
