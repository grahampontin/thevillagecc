<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Join.aspx.cs" Inherits="Join" %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html lang="en">
<head runat="server">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>The Village Cricket Club Online | Join</title>
    <CC:Styles runat=server ID=styles />    
    
</head>
<body>
    <div id="pageContainer">
        <!-- Head -->
        <CC:Header ID="Header1" runat=server />
        <!-- End Head -->
        <div class=clearer></div>
        <div id="mainContent">
        <form id="form1" runat="server">
            <div id=Form runat=server visible=true class="standardText">
            Joining The Village CC couldn't be easier. Just fill out this helpful form and your details will be forwarded
            on to our committee who will doubtless be in touch. As a rule we're on the look out for all kinds of players:
            batters, bowlers, enthusiasts - whatever you care to describe yourself as.
            <br /><br />
            <div id=Incomplete runat=server visible=false>
                <font color=red>Please complete Name, Email and Details.</font>
                <br /><br />
            </div>
            
            Name: <asp:TextBox id=Name runat=server></asp:TextBox><Br /><Br />
            Email Address: <asp:TextBox ID=Email runat=server></asp:TextBox><Br /><Br />
            Mobile: <asp:TextBox ID=Mobile runat=server></asp:TextBox><Br /><Br />
            Some details about you:<Br />
            <asp:TextBox ID=Details runat=server Height="116px" TextMode="MultiLine" 
                    Width="565px"></asp:TextBox>
                    <Br />
                    <Br />
                    <asp:Button ID=Submit name=Submit Text=submit runat=server 
                    onclick="Submit_Click"/>
            
            </div>
            <div id=ThankYou runat=server visible=false class="standardText">
            Thanks for your submission, someone will be in touch soon.
            <br /><br />
            The Committee
            </div>
        </form>
        </div>
        <!-- Footer -->
        <CC:Footer ID="Footer1" runat="server" />
        <!-- ENd Footer -->
    </div>
</body>
</html>
