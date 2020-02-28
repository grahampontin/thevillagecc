<%@ Page Title="" Language="C#" MasterPageFile="~/MobileWeb/mobile.master" AutoEventWireup="true" CodeFile="GameOver.aspx.cs" Inherits="MobileWeb_BallByBall_MatchConditions" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="page_content" Runat="Server">
    <div data-role="header" data-position="fixed">
        <h1>Game Over</h1>
    </div><!-- /header -->

    <div data-role="content">
        We're all done here. Pub time.
        <a href="../Scorecards/Start.aspx" id="enterScorecardButton" data-icon="plus">Complete Scorecard Now</a>
    </div>
        
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="postPageScripts" Runat="Server">
</asp:Content>

