<%@ Page Language="C#" AutoEventWireup="true" CodeFile="BallByBall.aspx.cs" Inherits="MobileWeb_BallByBall" MasterPageFile="mobile.master" %>

<asp:Content runat="server" ID="Head" ContentPlaceHolderID="head"></asp:Content>

<asp:Content runat="server" ID="Page" ContentPlaceHolderID="page_content">
<div data-role="header">
    <h1>Ball By Ball Updates</h1>
</div><!-- /header -->

<div data-role="content">
    <label for="flip-a">On strike:</label>
    <select name="striker" id="strikerSelect" data-role="slider">
	    <option value="1">G Pontin</option>
	    <option value="2">O Morgans</option>
    </select> 
<hr />
<div id="overSoFar" style="text-align: center">
    . 2 . W 4 6 .
</div>    
<hr />
<button id="dotBallButton" data-theme="b">Dot Ball</button>
<hr />
<fieldset class="ui-grid-a">
	<input type="range" name="slider-2" id="amountSelect" value="1" min="1" max="6" data-theme="b" data-track-theme="b" />
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
<a href=Wicket.aspx id="wicketButton" data-theme="b" data-role="button" data-rel="dialog">Wicket!</a>
<hr />
<fieldset class="ui-grid-a">
<div class="ui-block-a"><a href=EndOfOver.aspx id="endOfOverButton" data-theme="b" data-role="button" data-icon="check" data-rel="dialog">End of Over</a></div>
<div class="ui-block-b"><button id="undoButton" data-theme="b" data-icon="back">Undo Last</button></div>
</fieldset>
</div><!-- /content -->

<div data-role="footer">
    <h1>(c) The Village CC 2011</h1>
</div><!-- /footer -->

</asp:Content>
