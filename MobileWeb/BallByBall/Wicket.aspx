<%@ Page Title="" Language="C#" MasterPageFile="~/MobileWeb/mobile.master" AutoEventWireup="true" CodeFile="Wicket.aspx.cs" Inherits="MobileWeb_Wicket" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    Wicket!
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="page_content" Runat="Server">
    <div data-role="header">
        <h1>Wicket!</h1>
    </div><!-- /header -->
    
    <div data-role="content">
        <hr />
        <label for="select-choice-1">Batsman:</label>
        <select name="select-choice-1" id="outBatsmanSelect" data-native-menu="false" >
           <option value=" " data-placeholder="true">Choose...</option>
           <option value="1">O Morgans</option>
           <option value="2">G Pontin</option>
        </select>
        <hr />
        <label for="select-choice-2">How out:</label>
        <select name="select-choice-2" id="modeOfDismissal" data-native-menu="false" >
           <option value=" " data-placeholder="true">Choose...</option>
           <option value="b">Bowled</option>
           <option value="ct">Caught</option>
           <option value="lbw">LBW</option>
           <option value="ro">Run Out</option>
           <option value="st">Stumped</option>
           <option value="hw">Hit Wicket</option>
           <option value="htb">Handled the Ball</option>
        </select>
        <div id="runsForThisBallContainer">
        <hr />
        <label for="select-choice-3">Score for this ball:</label>
        <fieldset class="ui-grid-a">
            <div class="ui-block-a"><input type="range" name="slider-2" id="scoreForWicketBallAmount" value="1" min="1" max="6" data-theme="b" data-track-theme="b" /></div>
	        <div class="ui-block-b">
                <select name="select-choice-0" id="wicketRunsSelect" data-native-menu="false" >
                   <option value=" ">Runs</option>
                   <option value="b">Byes</option>
                   <option value="lb">Leg Byes</option>
                   <option value="wd">Wides</option>
                   <option value="nb">No Balls</option>
                   <option value="p">Penalty</option>
                </select>
            </div>
        </fieldset>
        </div>
        <hr />
        <label for="fielder">Fielder:</label>
        <input type="text" name="fielder" id="fielder" />
        <hr />
        <textarea id="wicketDescription" placeholder="What the hell happened?"></textarea>
        <hr />
        <label for="select-choice-2">Next in:</label>
        <select name="select-choice-2" id="nextManInSelect" data-native-menu="false" >
        </select>
        <hr />
        <label><input type="checkbox" id="tweetThis" checked />Tweet this?</label>
        <hr />
        <button id="saveWicketButton">Done</button>
        <hr />
    </div>

    <div data-role="popup" id="errorMessage">
		<div data-role="header">
			<h1>Error</h1>
		</div>
		<div data-role="content" id="errorMessageContent">
			Place holder
		</div>
	</div>
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="postPageScripts" Runat="Server">
    <script language="javascript" src="../script/ballbyball.wicket.page.js" type="text/javascript"></script>
</asp:Content>

