<%@ Page Title="" Language="C#" MasterPageFile="~/MobileWeb/mobile.master" AutoEventWireup="true" CodeFile="SelectTeam.aspx.cs" Inherits="MobileWeb_BallByBall_SelectTeam" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
</asp:Content>


<asp:Content ID="Content4" ContentPlaceHolderID="page_name" Runat="Server">selectteam</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="page_content" Runat="Server">
    <div data-role="header" data-position="fixed">
        <h1>Select XI</h1>
    </div><!-- /header -->

    <div data-role="content">
        <asp:ListView ID="PlayersListView" runat="server">
                <LayoutTemplate>
                 <div data-role="fieldcontain">
                    <fieldset data-role="controlgroup" data-filter="true">
	                    <div id="itemPlaceholder" runat=server>Something went wrong</div>
                    </fieldset>
                </div>
                </LayoutTemplate>
                <ItemTemplate>
                    <input type="checkbox" name="checkbox-<%#Eval("ID") %>" id="checkbox-<%#Eval("ID") %>" class="custom" playerId="<%#Eval("ID") %>" playerName ="<%#Eval("FirstName") %> <%#Eval("Surname") %>" />
	                <label for="checkbox-<%#Eval("ID") %>"><%#Eval("FirstName") %> <%#Eval("Surname") %> (<%#Eval("NumberOfMatchesPlayedThisSeason") %>)</label>
                </ItemTemplate>       
        </asp:ListView>

        <button id="confirmTeamSelection">Confirm Selection</button>

    </div>    

        
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="postPageScripts" Runat="Server">
    
</asp:Content>

