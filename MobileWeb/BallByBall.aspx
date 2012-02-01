<%@ Page Language="C#" AutoEventWireup="true" CodeFile="BallByBall.aspx.cs" Inherits="MobileWeb_BallByBall" MasterPageFile="mobile.master" %>

<asp:Content runat="server" ID="Head" ContentPlaceHolderID="head"></asp:Content>

<asp:Content runat="server" ID="Page" ContentPlaceHolderID="page_content">
<div data-role="header">
    <h1>Ball By Ball Updates</h1>
</div><!-- /header -->

<div data-role="content">	


<button type="submit" data-theme="a">Dot Ball</button>

<hr />

	<fieldset data-role="controlgroup" data-type="horizontal">
    	
         	<input type="radio" name="radio-choice-1" id="radio-choice-1" value="choice-1" checked="checked" />
         	<label for="radio-choice-1">1</label>

         	<input type="radio" name="radio-choice-1" id="radio-choice-2" value="choice-2"  />
         	<label for="radio-choice-2">2</label>

         	<input type="radio" name="radio-choice-1" id="radio-choice-3" value="choice-3"  />
         	<label for="radio-choice-3">3</label>
            
         	<input type="radio" name="radio-choice-1" id="radio1" value="choice-4" />
         	<label for="radio-choice-4">4</label>

         	<input type="radio" name="radio-choice-1" id="radio2" value="choice-5"  />
         	<label for="radio-choice-5">5</label>

         	<input type="radio" name="radio-choice-1" id="radio3" value="choice-6"  />
         	<label for="radio-choice-6">6</label>
    </fieldset>

<div data-role="controlgroup" data-type="horizontal">
	<button type="submit" data-theme="a">4</button>
	<button type="submit" data-theme="a">5</button>
	<button type="submit" data-theme="a">6</button>	   
</div>
<hr />
<fieldset class="ui-grid-a">
	<div class="ui-block-a"><button type="submit" data-theme="a">Runs</button></div>
	<div class="ui-block-b"><button type="submit" data-theme="a">Extras</button></div>
</fieldset>
<hr />
<button type="submit" data-theme="a">Wicket!</button>

</div><!-- /content -->

<div data-role="footer">
    <h1>(c) The Village CC 2011</h1>
</div><!-- /footer -->

</asp:Content>
