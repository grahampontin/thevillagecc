<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Register.aspx.cs" Inherits="Secure_Register" %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>The Village Cricket Club Online | Register</title>
    <CC:Styles runat=server ID=styles />    
    
</head>
<body>
        <form id="form1" runat="server">
            
        
    <div id="pageContainer">
        <!-- Head -->
        <CC:Header ID="Header1" runat=server />
        <!-- End Head -->
        <div class=clearer></div>
        <div id="mainContent">
            <div id=message runat=server>
            To register for a VCC Account please complete the following information:<br />
            </div>
            <br />
            <table>
                <tr>
                    <td>
                     Username
                    </td>
                    <td>
                    
            <asp:TextBox ID="tbUsername" runat="server" Width="250px"></asp:TextBox>
                    
                    </td>
                </tr>
                <tr>
                    <td>
                    
            Email Address             
                    
                    </td>
                    <td>
                    
                        <asp:TextBox ID="tbEmailAddress" runat="server" Width="250px"></asp:TextBox>
                    
                    </td>
                </tr>
                <tr>
                    <td>
                    
            Display Name             
                    
                    </td>
                    <td>
                    
                        <asp:TextBox ID="tbDisplayName" runat="server" Width="250px"></asp:TextBox>
                    
                    </td>
                </tr>
            </table>
            
            <br />
            <br />
            <asp:Button ID="Button1" runat="server" Text="Create Account" 
                onclick="Button1_Click" />
            <br />
            <br />
        </div>
        <!-- Footer -->
        <CC:Footer ID="Footer1" runat="server" />
        <!-- ENd Footer -->
    </div>
            
        
        </form>
        </body>
</html>
