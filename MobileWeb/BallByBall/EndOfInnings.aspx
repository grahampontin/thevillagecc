<%@ Page Title="" Language="C#" MasterPageFile="~/MobileWeb/mobile.master" AutoEventWireup="true" CodeFile="EndOfInnings.aspx.cs" Inherits="MobileWeb_BallByBall_MatchConditions" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="page_content" Runat="Server">
    <div data-role="header">
        <h1>End of Innings</h1>
    </div><!-- /header -->

    <div data-role="content">
        <textarea id="commentary" placeholder="Say something about it..."></textarea>
        <label><input type="checkbox" id="wasDeclared" />Declared?</label>
        <button id="endOfInningsButton" data-theme="a" data-icon="flag">It's over.</button>
    </div>    
        
    <div data-role="popup" id="errorMessage" data-dismissible="true" data-overlay-theme="b" style="min-width:300px;">
		<div data-role="header">
			<h1>Error</h1>
		</div>
		<div data-role="content" id="errorMessageContent">
			Place holder
		</div>
	</div>
        
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="postPageScripts" Runat="Server">
    <script language="javascript" src="../script/ballbyball.endofinnings.js" type="text/javascript"></script>
    <script language="javascript" src="../script/ballbyball.functions.js" type="text/javascript"></script>
</asp:Content>

