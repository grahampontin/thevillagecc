<%@ Page Language="C#" AutoEventWireup="true" CodeFile="CreateMatchReport.aspx.cs" Inherits="CreateMatchReport" ValidateRequest="false" %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>
<%@ Register TagPrefix="CC" TagName="BattingScorecard" Src="~/UserControls/BattingScorecard.ascx" %>
<%@ Register TagPrefix="CC" TagName="BowlingScorecard" Src="~/UserControls/BowlingScorecard.ascx" %>
<%@ Register TagPrefix="CC" TagName="FoWScorecard" Src="~/UserControls/FoWScorecard.ascx" %>


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html lang="en">
<head runat="server">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>The Village Cricket Club Online | Match Report | Create</title>
    <CC:Styles runat=server ID=styles />
    <script type="text/javascript" src="./plugins/fckeditor/fckeditor.js"></script>
</head>
<body>
        <form id="form1" runat="server">
    <div id="pageContainer">
        <!-- Head -->
        <CC:Header ID="Header1" runat=server />
        <!-- End Head -->
        <div class=clearer></div>
        <div id="mainContent">
            <div class="PageHeading">
                Create Report: <asp:Literal runat=server ID="PageHeading"></asp:Literal>
            </div>
            <div id=Login runat=server>
                
                <asp:TextBox ID="Password" runat="server" TextMode="Password"></asp:TextBox>
                <asp:Button ID="LoginButton" runat="server" onclick="LoginButton_Click" 
                    Text="Login" />
                
            </div>
            <div id=AlreadyCreated runat=server visible=false>
                The Report has already been created.
            </div>
            
            <div id=Create runat=server visible=false>
            Check <a href="MatchReport.aspx?MatchID=<asp:Literal ID=MatchID runat=server></asp:Literal>" target="_blank">here</a> for scorecards<br /><br />
            <div class=scHeading>
                Conditions:
            </div>
            <script type="text/javascript">
                    var oFCKeditor = new FCKeditor( 'FCKeditor1' ) ;
                    oFCKeditor.BasePath	= "./plugins/fckeditor/";
                    oFCKeditor.Height	= 180;
                    oFCKeditor.Width = 840;
                    oFCKeditor.ToolbarSet = "Basic";
                    oFCKeditor.Value	= '' ;
                    oFCKeditor.Create() ;
		        </script>
            <br /><br />
            <div class=scHeading>Report:</div>
            <script type="text/javascript">
                    var oFCKeditor = new FCKeditor( 'FCKeditor2' ) ;
                    oFCKeditor.BasePath	= "./plugins/fckeditor/";
                    oFCKeditor.Height	= 500;
                    oFCKeditor.Width = 840;
                    oFCKeditor.ToolbarSet = "Basic";
                    oFCKeditor.Value	= '' ;
                    oFCKeditor.Create() ;
		        </script>
            
            <asp:Button ID="SubmitButton" runat="server" Text="Submit Report" 
                    onclick="SubmitButton_Click" />  
            </div>
            
            
            
              
        </div>
        <!-- Footer -->
        <CC:Footer ID="Footer1" runat="server" />
        <!-- ENd Footer -->
    </div>
            
            
            
            
        </form>
        </body>
</html>
