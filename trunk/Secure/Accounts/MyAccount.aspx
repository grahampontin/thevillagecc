<%@ Page Language="C#" AutoEventWireup="true" CodeFile="MyAccount.aspx.cs" Inherits="Secure_Accounts_MyAccount" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>VCC Online My Account</title>
    <CC:Styles runat=server ID=styles /> 
    
</head>
<body>
    <div class=AdminPageHeader>
        <div class=AdminPageLogo>
            <a href="/Default.aspx">
            <img src="/Images/logo.jpg" width="200px" />
            </a>
        </div>
        <div class="AdminPageTitle">
            My Account
        </div>
    </div>
    <div class=AdminPageLeftMenu>
        <!-- MENU HERE -->
        <ul>
            <li>
               <a href=MyAccount.aspx>My Account</a>
            </li>
            <li>
               <a href=MyAccount.aspx?action=registerPayment>Register a Payment</a>
            </li>
            <li>
               <a href=MyAccount.aspx?action=claimRinger>Claim a Ringer</a>
            </li>
            
        </ul>
        <!-- END MENU -->
    </div>
    <div class=AdminPageBody>
        <form id="form1" runat="server">
            <!-- BODY CONTENT HERE -->
            <div class="Alert">
                Please remember to register your payments using the link on the left of this page. Parp! is getting grumpy.
            </div>
            <div id=Statement runat=server>
                <asp:GridView ID=AccountSummary runat=server AutoGenerateColumns="False" 
                    onrowdatabound="AccountSummary_RowDataBound">
                    <Columns>
                        <asp:BoundField HeaderText="Type" />
                        <asp:BoundField HeaderText="Paid In" />
                        <asp:BoundField HeaderText="Paid out" />
                        <asp:BoundField HeaderText="Status" />
                        <asp:BoundField HeaderText="Comments" />
                        <asp:BoundField HeaderText="Match" />
                    </Columns>
                </asp:GridView>
                <span id=BalanceSpan runat=server>
                <b>Balance: <asp:Literal ID=Balance runat=server></asp:Literal></b>
                </span>
                <br /><br />
                If you think any of the above payments are incorrect please <a href='mailto:thevillagecc@gmail.com?subject=Payment Dispute'>email the treasurer</a>.
                <br /><br />
                <div id=inCredit runat=server>
                    You are in credit, you don't <i>need</i> to do anything right now.
                    Paying up front does help the club keep ticking over though.
                </div>
                <div id=inDebt runat=server visible=false>
                    According to our records you owe the club money. Please make a transfer to
                    the club account or if you have already sent money / paid in cash or posted
                    a cheque, please <b>complete the "Register Payment" form using the link on the
                    left to let the treasurer know.</b>
                    <br /><br />
                    <b>Payment Details:</b><br />
                    The Village CC<br />
                    s/c: 40-07-13<br />
                    acc no: 11606654
                    
                    
                    
                </div>
            </div>
            
            <div id=RegisterPayment runat=server visible=false>
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
                        <td>Comments:</td>
                        <td><asp:TextBox ID=Comments runat=server Height="108px" TextMode="MultiLine" 
                                Width="285px"></asp:TextBox></td>
                    </tr>
                </table>
                
                <asp:Button ID=RegPayment runat=server Text="Register Payment" 
                    onclick="RegPayment_Click" />
                
            </div>
            
            <div id=ClaimRinger visible=false runat=server>
                This is not currently implemented. If you wish to pay on behalf of a ringer,
                please contact the treasurer and let them know.
            </div>
            
            <!-- END BODY CONTENT -->
        </form>
    </div>
    
</body>
</html>
