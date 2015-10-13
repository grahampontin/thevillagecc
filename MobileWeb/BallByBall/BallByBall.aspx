<%@ Page Language="C#" AutoEventWireup="true" CodeFile="BallByBall.aspx.cs" Inherits="MobileWeb_BallByBall" MasterPageFile="~/MobileWeb/mobile.master" %>

<asp:Content runat="server" ID="Head" ContentPlaceHolderID="head"></asp:Content>

<asp:Content runat="server" ID="Page" ContentPlaceHolderID="page_content">
<div data-role="header">
    <h1>VCC vs <span id="oppositionName"></span>  <span id="score"></span>/<span id="wickets"></span> (<span id="overs"></span> ovs)</h1>
</div><!-- /header -->

<div data-role="content">
    <select name="bowler" id="bowlerSelect">
	</select>
<%--    <label for="flip-a">to:</label>--%>
<%--    <select name="striker" id="strikerSelect" data-role="flipswitch" data-wrapper-class="full-width-flipswitch">--%>
<%--	    <option id="batsman1" value="1" selected>Unknown 1</option>--%>
<%--	    <option id="batsman2" value="2">Unknown 2</option>--%>
<%--    </select> --%>
<div id="full-width-radio">
    <fieldset data-role="controlgroup" data-type="horizontal">
        <legend>to</legend>
        <input type="radio" name="strikerSelect" id="batsman1" value="1" checked="checked">
        <label for="batsman1" id="batsman1Label">batsman 1</label>
        <input type="radio" name="strikerSelect" id="batsman2" value="2">
        <label for="batsman2" id="batsman2Label">batsman 2</label>
    </fieldset>
</div>
    <hr />
    <div id="overSoFar" style="text-align: center">
        New Over
    </div>    
    <hr />
    <div data-role="navbar">
        <ul>
            <li><button id="dotBallButton" data-theme="b">Dot Ball</button></li>
            <li><button id="singleButton" data-theme="b">Single</button>   </li>
            <li><button id="fourButton" data-theme="b">Four</button>       </li>
            <li><button id="sixButton" data-theme="b">Six</button>         </li>

        </ul>
        
    </div>
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
    <a id="wicketButton" data-theme="a" data-icon="hand-o-up" href="./Wicket.aspx" data-role="button">Wicket!</a>
    <hr />
    <fieldset class="ui-grid-a">
    <div class="ui-block-a"><a href=EndOfOver.aspx id="endOfOverButton" data-theme="b" data-role="button" data-icon="check">End of Over</a></div>
    <div class="ui-block-b"><button id="undoButton" data-theme="b" data-icon="back">Undo Last</button></div>
    </fieldset>

    <div data-role="popup" id="chooseBatsmen" data-dismissible="false" data-overlay-theme="b" style="min-width:300px;">
        <div data-role="header">
            <h1>Choose Batsmen</h1>
        </div>
        <div data-role="content">
            <hr />
            <label for="select-choice-1">Batsman 1:</label>
            <select name="select-choice-1" id="batsman1select" data-native-menu="true" >
            </select>
            <hr />
            <label for="select-choice-2">Batsman 2:</label>
            <select name="select-choice-2" id="batsman2select" data-native-menu="true" >
            </select>
            <hr />
            <div id="chooseBatsmenSaveButton">Done</div>
            <hr />
        </div>
    </div>

    <div data-role="popup" id="chooseNewBowler" data-dismissible="false" data-overlay-theme="b" style="min-width:300px;">
        <div data-role="header">
            <h1>New Bowler</h1>
        </div>
        <div data-role="content">
            <label for="newBowlerInput">Bowler Name</label>
            <input name="newBowlerInput" id="newBowlerInput" />
            <hr />
            <div id="chooseBowlerSaveButton">Done</div>
            <hr />
        </div>
    </div>

    <div data-role="popup" id="wagonWheel" data-dismissible="false" data-overlay-theme="b">
        <div data-role="header">
            <h1>Wagon Wheel</h1>
        </div>
        <div data-role="content">
            <div id="wagonWheelCanvas">

            </div>
        </div>    
    </div>

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
