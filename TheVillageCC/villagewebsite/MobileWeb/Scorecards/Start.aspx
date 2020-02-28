<%@ Page Title="" Language="C#" MasterPageFile="~/MobileWeb/mobile.master" AutoEventWireup="true" CodeFile="Start.aspx.cs" Inherits="MobileWeb_BallByBall_MatchConditions" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="page_content" Runat="Server">
    <div data-role="header" data-position="fixed">
        <h1>Enter Scorecard</h1>
    </div><!-- /header -->

    <div data-role="content">
        use js here + command handler
        <div id="matchesListView">

        </div>
        

        <button id="showAllMatchesButton" data-icon="plus">Add New Bowler</button>
        button for show all / show season
        
        auto move if match id specified.
    </div>
        
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="postPageScripts" Runat="Server">
</asp:Content>

