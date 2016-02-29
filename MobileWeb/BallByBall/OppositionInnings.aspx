<%@ Page Title="" Language="C#" MasterPageFile="~/MobileWeb/mobile.master" AutoEventWireup="true" CodeFile="OppositionInnings.aspx.cs" Inherits="MobileWeb_BallByBall_MatchConditions" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="page_content" Runat="Server">
    <div data-role="header">
        <h1>Opposition Innings</h1>
    </div><!-- /header -->

    <div data-role="content">
        <div class="ui-field-contain">
            <label for="oppositionScoreInput">The opposition are</label>
            <input name="oppositionScoreInput" id="oppositionScoreInput" />
        </div>
        <div class="ui-field-contain">
            <label for="oppositionWicketsInput">for</label>
            <input name="oppositionWicketsInput" id="oppositionWicketsInput" />
        </div>
        <div class="ui-field-contain">
            <label for="oppositionOversInput">from</label>
            <input name="oppositionOversInput" id="oppositionOversInput" size="3" placeholder="overs" />
            
        </div>
        <hr/>
        <textarea id="commentary" placeholder="Say something about it..."></textarea>
        <hr />
        <label><input type="checkbox" id="endOfInnings" />End of Innings?</label>
        <button id="submitButton">Submit</button>
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
    <script language="javascript" src="../script/ballbyball.oppositionInnings.js" type="text/javascript"></script>
    <script language="javascript" src="../script/ballbyball.functions.js" type="text/javascript"></script>
</asp:Content>

