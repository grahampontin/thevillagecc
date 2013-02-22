<%@ Page Language="C#" AutoEventWireup="true" CodeFile="BallByBall.aspx.cs" Inherits="MobileWeb_BallByBall" MasterPageFile="~/MobileWeb/mobile.master" %>

<asp:Content runat="server" ID="Head" ContentPlaceHolderID="head"></asp:Content>

<asp:Content runat="server" ID="Page" ContentPlaceHolderID="page_content">
<div data-role="header">
    <h1>Ball By Ball Updates</h1>
</div><!-- /header -->

<div data-role="content">
    <label for="flip-a">On strike:</label>
    <select name="striker" id="strikerSelect" data-role="slider">
	    <option id="batsman1" value="1">Unknown</option>
	    <option id="batsman2" value="2">Unknown</option>
    </select> 
    <hr />
    <div id="overSoFar" style="text-align: center">
        New Over
    </div>    
    <hr />
    <button id="dotBallButton" data-theme="b">Dot Ball</button>
    <hr />
    <input type="range" name="slider-2" id="amountSelect" value="1" min="1" max="6" data-theme="b" data-track-theme="b" />
    <fieldset class="ui-grid-a">
	    <div class="ui-block-a"><button id="runsButton" data-theme="b">Runs</button></div>
	    <div class="ui-block-b">
        <select name="select-choice-0" id="extrasSelect" data-native-menu="false" >
           <option value="extras" data-placeholder="true">Extras</option>
           <option value="b">Byes</option>
           <option value="lb">Leg Byes</option>
           <option value="wd">Wides</option>
           <option value="nb">No Balls</option>
           <option value="p">Penalty</option>
        </select>
        </div>
    </fieldset>
    <hr />
    <button id="wicketButton" data-theme="b" data-icon="back">Wicket!</button>
    <hr />
    <fieldset class="ui-grid-a">
    <div class="ui-block-a"><a href=EndOfOver.aspx id="endOfOverButton" data-theme="b" data-role="button" data-icon="check" data-rel="dialog">End of Over</a></div>
    <div class="ui-block-b"><button id="undoButton" data-theme="b" data-icon="back">Undo Last</button></div>
    </fieldset>
</div><!-- /content -->



</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="postPageScripts" Runat="Server">
    <script language="javascript" src="../script/ballbyball.ball.js" type="text/javascript"></script>
    <script language="javascript" src="../script/ballbyball.over.js" type="text/javascript"></script>
    <script language="javascript" src="../script/ballbyball.wicket.js" type="text/javascript"></script>
    <script language="javascript" src="../script/ballbyball.matchState.js" type="text/javascript"></script>
    
    <script language="javascript" src="../script/ballbyball.functions.js" type="text/javascript"></script>
    <script language="javascript" src="../script/ballbyball.core.js" type="text/javascript"></script>
    
</asp:Content>
