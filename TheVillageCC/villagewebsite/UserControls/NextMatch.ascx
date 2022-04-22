<%@ Control Language="C#" AutoEventWireup="true" CodeFile="NextMatch.ascx.cs" Inherits="UserControls_NextMatch" %>
<div class="headerFixture">
    <div class=hfTitle>Next Fixture</div>
    <div id=hasFixture runat=server>
        <div class=hfHomeTeam><asp:Literal runat="server" ID="HomeTeam" /> vs <asp:Literal runat="server" ID="AwayTeam" /></div>
        <div class=hfDate><asp:Literal runat="server" ID="MatchDate" /></div>
        <div class=hfVenue>at <asp:Literal runat="server" ID="MatchVenue" /></div>
    </div>
    <div id="noFixture" runat=server visible=false>
        No upcoming fixtures
    </div>
    
</div>