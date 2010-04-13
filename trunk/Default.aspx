<%@ Page Language="C#" AutoEventWireup="true"  CodeFile="Default.aspx.cs" Inherits="_Default" %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<%@ Register TagPrefix="CC" TagName="Carousel" Src="~/UserControls/PictureCarousel.ascx" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>The Village Cricket Club Online | Home</title>
    <CC:Styles runat=server ID=styles /> 
    
</head>
<body>
    <div id="pageContainer">
        <!-- Head -->
        <CC:Header runat=server />
        <!-- End Head -->
        <div class=clearer></div>
        <div id="mainContent">
        <form id="form1" runat="server">
            <div id=pictureCar>
                <CC:Carousel runat=server />
            </div>
            <div id=introText>
                <div id="introTextInner">
                    <b><asp:Literal ID=ReportHeadline runat=server></asp:Literal></b> 
                    <br /><br />
                    <p>
                    <asp:Literal ID=ReportBody runat=server></asp:Literal>...
                </div>
                <a href=./MatchReport.aspx?MatchID=<asp:Literal runat=server ID=ReportID></asp:Literal> >read more...</a>
                    
            </div>
            
            <div class="horizontalDivider"></div>
            <br /><b>About Us</b><br /><br />
            <p>
            The Village Cricket Club is a small club based loosely around its roots in North East London.
            We were formed in 2004 by a bunch of singularly talentless but enthusiastic cricketers who decided
            that they wanted to continue their summer passtime beyond the end of their university days.
            </p>
            <p>
            One bizarre meeting in Stamford Hill&#39;s Birdcage later, the Village CC was formed and enrolled
            in the North East London Cricket League which sustained it for its first few seasons.
            </p>
            <p>
            Since then, much has changed, the club has grown and left the league behind, perferring to follow
            its instincts in the world of friendly London cricket.
            </p>
            <p>
            We tend to play our home games at the Albert Road Recreation ground near Bounds Green tube and are
            always on the lookout for new members of any ability - enthusiasm for the game is our only selection
            criteria. You can contact us via the "Join" link up above, or a few of us hang out in the "chat" section
            when work isn't keeping us too busy.
            </p>
        </form>
        </div>
        <!-- Footer -->
        <CC:Footer runat="server" />
        <!-- ENd Footer -->
    </div>
</body>
</html>
