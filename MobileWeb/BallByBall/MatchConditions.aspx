<%@ Page Title="" Language="C#" MasterPageFile="~/MobileWeb/mobile.master" AutoEventWireup="true" CodeFile="MatchConditions.aspx.cs" Inherits="MobileWeb_BallByBall_MatchConditions" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="page_content" Runat="Server">
    <div data-role="header">
        <h1>Match Conditions</h1>
    </div><!-- /header -->

    <div data-role="content">
        <label for="select-choice-1">Captain:</label>
        <select name="select-choice-1" id="captainSelect" data-native-menu="true" >
        </select>
        <label for="select-choice-2">Wicket Keeper:</label>
        <select name="select-choice-2" id="keeperSelect" data-native-menu="true" >
        </select>
        <hr />
        <fieldset data-role="controlgroup" data-type="horizontal">
        <legend>Who won the toss?</legend>
            <input type="radio" name="tossSelect" id="weWonToss" value="1" checked="checked">
            <label for="weWonToss" id="weWonTossLabel">We did</label>
            <input type="radio" name="tossSelect" id="theyWonToss" value="2">
            <label for="theyWonToss" id="theyWonTossLabel">They did</label>
        </fieldset>
        <fieldset data-role="controlgroup" data-type="horizontal">
        <legend>and they elected to...</legend>
            <input type="radio" name="batOrBowlSelect" id="electedToBat" value="bat" checked="checked">
            <label for="electedToBat" id="electedToBatLabel">Bat</label>
            <input type="radio" name="batOrBowlSelect" id="electedToBowl" value="bowl">
            <label for="electedToBowl" id="electedToBowlLabel">Bowl</label>
        </fieldset>    
        <hr />
        <fieldset data-role="controlgroup" data-type="horizontal">
        <legend>Match format?</legend>
            <input type="radio" name="matchFormatSelect" id="overs" value="overs" checked="checked">
            <label for="overs" id="oversLabel">Limited Overs</label>
            <input type="radio" name="matchFormatSelect" id="declaration" value="declaration">
            <label for="declaration" id="declarationLabel">Declaration</label>
        </fieldset>    
        <label for="numberOfOversInput">Number of overs</label>
        <input name="numberOfOversInput" id="numberOfOversInput" />
        <hr/>
        <button id="confirmMatchConditions">All done, let's get started</button>
    </div>    

        
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="postPageScripts" Runat="Server">
    <script language="javascript" src="../script/ballbyball.selectTeam.js" type="text/javascript"></script>
    <script language="javascript" src="../script/ballbyball.functions.js" type="text/javascript"></script>
</asp:Content>

