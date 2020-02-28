<%@ Page Title="" Language="C#" MasterPageFile="~/MobileWeb/mobile.master" AutoEventWireup="true" CodeFile="EndOfInnings.aspx.cs" Inherits="MobileWeb_BallByBall_MatchConditions" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
</asp:Content>

<asp:Content ID="Content4" ContentPlaceHolderID="page_name" Runat="Server">endofinnings</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="page_content" Runat="Server">
    <div data-role="header" data-position="fixed">
        <a href="BallByBall.aspx" data-icon="back" data-mini="true" data-transition="slide" data-rel="back" >Cancel</a>
        <h1>End of Innings</h1>
    </div><!-- /header -->

    <div data-role="content">
        <textarea id="endOfInningsPageCommentary" placeholder="Say something about it..."></textarea>
        <label><input type="checkbox" id="endOfInningsPageWasDeclared" />Declared?</label>
        <button id="endOfInningsPageConfirmButton" data-theme="a" data-icon="flag" data-transition="slide">It's over.</button>
    </div>     
</asp:Content>


