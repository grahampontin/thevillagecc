<%@ Control Language="C#" AutoEventWireup="true" CodeFile="LastResult.ascx.cs" Inherits="UserControls_LastResult" %>
<div class="headerFixture">
    <div class=hfTitle>Last Result</div>
    <div class=hfHomeTeam><asp:Literal runat="server" ID="HomeTeam" /></div>
    <div class=hfVS><asp:Literal runat="server" ID="ResultText" /></div>
    <div class=hfAwayTeam><asp:Literal runat="server" ID="AwayTeam" /></div>
    <div class=hfVenue><asp:Literal runat="server" ID="WinningMargin" /></div>
    <div class=hfAt>at</div>
    <div class=hfVenue><asp:Literal runat="server" ID="Venue" /></div>
</div>