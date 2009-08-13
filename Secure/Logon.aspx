<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Logon.aspx.cs" Inherits="Secure_Logon" %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<%@ Register TagPrefix="CC" TagName="Carousel" Src="~/UserControls/PictureCarousel.ascx" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>
<%@ Register TagPrefix="CC" TagName="Security" Src="~/UserControls/Security.ascx" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
    <head id="Head1" runat="server">
		<title>The Village Cricket Club Online | Logon</title>
		<CC:Styles runat=server ID=styles /> 
	</head>
	<body>
        <form id="form1" runat="server">
    <div id="pageContainer">
        <!-- Head -->
        <cc:header ID="Header1" runat=server />
        <!-- End Head -->
        <div class=clearer></div>
        <div id="mainContent">
		    <div class="standardText" enableviewstate="True">
		        <div runat=server id=welcomeMessage>
		        In order to access the url "<asp:Literal ID=Redirect runat="server"></asp:Literal>" you must be logged on
		        with you VCC Account. Once you have logged on your credentials will be stored in 
                your browser for a month.
                </div>
                <br />
                <BR />Username:
                <asp:TextBox ID="Username" runat="server" Width="250px"></asp:TextBox>
                <br />
                <br />
                Password:
                <asp:TextBox ID="Password" runat="server" TextMode="Password" Width="250px"></asp:TextBox>
                <br />
                <br />
                <asp:Button ID="Button1" runat="server" onclick="Button1_Click" Text="Logon" />
                <br />
                <br />
                Don&#39;t have a VCC account yet? Register for one <a href="Register.aspx">here</a>.<br />
                <br />
                Forgotten you password? Click
                <asp:Button ID="Button2" runat="server" onclick="Button2_Click" Text="here" />
&nbsp;to resend it to your email address.<br />
		        
		        
		        
		        
		    </div>
        </div>
        <!-- Footer -->
        <CC:Footer ID="Footer1" runat="server" />
        <!-- ENd Footer -->
    </div>
		</form>
        </body>
</html>
