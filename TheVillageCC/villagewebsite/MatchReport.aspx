<%@ Page Language="C#" AutoEventWireup="true" CodeFile="MatchReport.aspx.cs" Inherits="MatchReport" %>
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

    <title>The Village Cricket Club Online | Match Report | <asp:Literal ID="_PageTitle" runat=server></asp:Literal></title>
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
            <H1>
                <asp:Literal runat=server ID="PageHeading"></asp:Literal>
            </H1>
            <div class=Centered>
                <a href="#Report">Report</a> | 
                <a href="#Scorecards">Scorcards</a> | 
                <a href="Gallery.aspx?MatchID=<asp:Literal ID=MatchID1 runat=server></asp:Literal>">Gallery</a> | 
                <a href="Secure/UploadImages.aspx?MatchID=<asp:Literal ID=MatchID2 runat=server></asp:Literal>">Add Photos
                </a>
            </div>
            <div class=scHeading>
                Summary
            </div>
            <div class=standardText>
                <asp:Literal runat=server ID="MatchSummary"></asp:Literal>
            </div>
            
            <div class=scHeading>
                Conditions
            </div>
            <div class=standardText>
                <asp:Literal runat=server ID="Conditions"></asp:Literal>
            
            </div>
            
            <div class=scHeading>
                <a name=Report>Report</a>
            </div>
            <div class=standardText>
                <asp:Literal runat=server ID="ReportText"></asp:Literal>
            
            </div>
            
            <div class=scHeading>
                <a name=Scorecards>The Village CC Innings</a>
            </div>
            <div class=standardText>
                <CC:BattingScorecard ID=OurBatting runat=server />
            </div>
            <div class="floatLeft scBowlingDiv">
                <CC:BowlingScorecard ID=TheirBowing runat=server />
            </div>
            <div class=scFoWDiv>
                <CC:FoWScorecard ID=OurFoWCard runat=server />
            </div>
            <div class=clearer></div>
            <div class=scHeading>
                <asp:Literal ID=OppositionName runat=server></asp:Literal> Innings
            </div>
            
            <div class=standardText id=Div1>
                <CC:BattingScorecard ID=TheirBatting runat=server />
            </div>
            <div class="floatLeft scBowlingDiv">
                <CC:BowlingScorecard ID=OurBowling runat=server />
            </div>
            <div class=scFoWDiv>
                <CC:FoWScorecard ID=TheirFoWCard runat=server />
            </div>
            <div class=clearer></div>
            
            
            
            
        </form>
        </div>
        <!-- Footer -->
        <CC:Footer ID="Footer1" runat="server" />
        <!-- ENd Footer -->
    </div>
</body>
</html>
