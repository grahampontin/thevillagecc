<%@ Page Title="" Language="C#" MasterPageFile="~/MobileWeb/mobile.master" AutoEventWireup="true" CodeFile="OppositionInnings.aspx.cs" Inherits="MobileWeb_BallByBall_MatchConditions" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
</asp:Content>


<asp:Content ID="Content4" ContentPlaceHolderID="page_name" Runat="Server">oppositioninnings</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="page_content" Runat="Server">
    <div data-role="header" data-position="fixed">
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
        
        <button id="submitButton">Post Update</button>
        <hr />
            <button id="endOfOppositionInningsButton" data-theme="a" data-icon="flag">End of Innings</button>
        <hr />
    
    </div>    
    
    <div data-role="popup" id="oppositionInningsConfirmationDialog" data-dismissible="true" data-overlay-theme="b" style="min-width:300px;">
		<div data-role="header">
			<h1>Are you sure?</h1>
		</div>
		<div data-role="content">
			Make sure you've submitted the final update you want recorded before ending the innings. 
            Ending the innings now will not save whatever is on the screen unless you submitted it already.
            <button id="endOfOppositionInningsGoBack" data-theme="a" data-icon="undo">Ah, nuts, take me back</button>
            <button id="endOfOppositionInningsConfirmButton" data-theme="a" data-icon="check">We're good, let's end this thing.</button>
		</div>
	</div>
</asp:Content>


