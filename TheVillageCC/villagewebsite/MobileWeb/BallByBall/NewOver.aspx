<%@ Page Title="" Language="C#" MasterPageFile="~/MobileWeb/mobile.master" AutoEventWireup="true" CodeFile="NewOver.aspx.cs" Inherits="MobileWeb.BallByBall.MobileWeb_ChooseBatsmen" %>

<asp:Content ID="Content4" ContentPlaceHolderID="page_name" Runat="Server">newover</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="page_content" Runat="Server">
    <div data-role="header" data-position="fixed">
        <h1>New Over</h1>
    </div><!-- /header -->
    
    <div data-role="content">
        Bowler for this over:
        <div data-role="controlgroup" id="bowlersControlGroup">
            <%-- bowlers injected here --%> 
        </div>
        <button id="addNewBowlerButton" data-icon="plus">Add New Bowler</button>
        <hr />
        <div id="newOverBatsmenDiv">
            <label for="select-choice-1">On Strike Batsman:</label>
            <select name="select-choice-1" id="batsman1select" data-native-menu="true" >
            </select>
            <hr />
            <label for="select-choice-2">Non-striker:</label>
            <select name="select-choice-2" id="batsman2select" data-native-menu="true" >
            </select>
            <hr />
        </div>
        <button id="newOverConfirmButton">Start Scoring</button>
        <hr />
    </div>

    <div data-role="popup" id="addNewBowler" data-dismissible="false" data-overlay-theme="b" style="min-width:300px;">
        <div data-role="header">
            <h1>New Bowler</h1>
        </div>
        <div data-role="content">
            <label for="newBowlerInput">Bowler Name</label>
            <input name="newBowlerInput" id="newBowlerInput" />
            <hr />
            <button id="chooseBowlerSaveButton" data-icon="check">Add Bowler</button>
            <button id="chooseBowlerCancelButton" data-icon="back">Cancel</button>
            <hr />
        </div>
    </div>

</asp:Content>

