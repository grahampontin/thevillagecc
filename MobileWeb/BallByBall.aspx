<%@ Page Language="C#" AutoEventWireup="true" CodeFile="BallByBall.aspx.cs" Inherits="MobileWeb_BallByBall" MasterPageFile="mobile.master" %>

<asp:Content runat="server" ID="Head" ContentPlaceHolderID="head"></asp:Content>

<asp:Content runat="server" ID="Page" ContentPlaceHolderID="page_content">
<div data-role="header">
    <h1>Ball By Ball Updates</h1>
</div><!-- /header -->

<div data-role="content">
    <label for="flip-a">On strike:</label>
    <select name="striker" id="flip-a" data-role="slider">
	    <option value="off">G Pontin</option>
	    <option value="on">O Morgans</option>
    </select> 
<hr />
<div id="overSoFar" style="text-align: center">
    . 2 . W 4 6 .
</div>    
<hr />
<button type="submit" data-theme="b">Dot Ball</button>
<hr />
<fieldset class="ui-grid-a">
	<input type="range" name="slider-2" id="slider-2" value="1" min="1" max="6" data-theme="b" data-track-theme="b" />
    <div class="ui-block-a"><button type="submit" data-theme="b">Runs</button></div>
	<div class="ui-block-b">
    <select name="select-choice-0" id="select-choice-1" data-native-menu="false" >
       <option value="extras" data-placeholder="true">Extras</option>
       <option value="byes">Byes</option>
       <option value="legbyes">Leg Byes</option>
       <option value="wides">Wides</option>
       <option value="noballs">No Balls</option>
       <option value="penalty">Penalty</option>
    </select>
    </div>
</fieldset>
<hr />
<button type="submit" data-theme="b">Wicket!</button>
<hr />
<fieldset class="ui-grid-a">
<div class="ui-block-a"><button type="submit" data-theme="b" data-icon="check">End of Over</button></div>
<div class="ui-block-b"><button type="submit" data-theme="b" data-icon="back">Undo Last</button></div>
</fieldset>
</div><!-- /content -->

<div data-role="footer">
    <h1>(c) The Village CC 2011</h1>
</div><!-- /footer -->

</asp:Content>
