<%@ Page Language="C#" AutoEventWireup="true" CodeFile="SQLAdmin.aspx.cs" Inherits="SQLAdmin" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Untitled Page</title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    
        <br />
        <asp:TextBox ID="TextBox1" runat="server" ontextchanged="TextBox1_TextChanged" 
            Height="93px" Width="490px"></asp:TextBox>
        &nbsp;&nbsp;&nbsp; Password:
        <asp:TextBox ID="password" runat="server" TextMode="Password" Width="242px"></asp:TextBox>
        <br />
        <br />
        <asp:Button ID="Button1" runat="server" onclick="Button1_Click" 
            Text="Run SQL" />
        <br />
        <br />
        <asp:GridView ID="SQlResults" runat="server">
        </asp:GridView>
        <asp:Literal ID="Message" runat="server"></asp:Literal>
        <br />
        <br />
    
    </div>
    </form>
</body>
</html>
