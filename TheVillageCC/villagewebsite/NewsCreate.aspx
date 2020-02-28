<%@ Page Language="C#" AutoEventWireup="true" CodeFile="NewsCreate.aspx.cs" Inherits="NewsCreate"  ValidateRequest="false"%>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html lang="en">
<head runat="server">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>The Village Cricket Club Online | News | Create</title>
    <script type="text/javascript" src="plugins/fckeditor/fckeditor.js"></script>
    
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
            <div class=message runat=server id=Message visible=false>
            
            </div>
            <div class=NewsStory>
            Headline:
            
            <asp:TextBox ID=Headline runat=server Width=600px></asp:TextBox>
            </div>
            <div class="NewsStory">
            <div class="NewsInputArea">
                <script type="text/javascript">
                    var oFCKeditor = new FCKeditor( 'FCKeditor1' ) ;
                    oFCKeditor.BasePath	= "plugins/fckeditor/";
                    oFCKeditor.Height	= 250;
                    oFCKeditor.Width = 940;
                    oFCKeditor.ToolbarSet = "Basic";
                    oFCKeditor.Value	= '' ;
                    oFCKeditor.Create() ;
		        </script>
	            	        
            </div>
            </div>
            <div class=NewsStory>
            Short Headline:
            <asp:TextBox ID=ShortHeadline runat=server Width=600px></asp:TextBox>
            </div>
            <div class=NewsStory>
            Teaser:
            <asp:TextBox ID=Teaser runat=server Width=600px Height=100px></asp:TextBox>
            </div>
            
            <asp:Button ID=SubmitButton runat=server onclick="SubmitButton_Click" BorderStyle="NotSet" ToolTip="Submit Story" Text="Submit Story" />
            
        </form>
        </div>
        <div id=CreateAStory>
            <a href=News.aspx>Back to News</a>
        </div>
        <!-- Footer -->
        <CC:Footer ID="Footer1" runat="server" />
        <!-- ENd Footer -->
    </div>
</body>
</html>
