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
           <option value="1">O Morgans</option>
           <option value="2">G Pontin</option>
        </select>
        <hr />
        <label for="select-choice-2">How out:</label>
        <select name="select-choice-2" id="modeOfDismissal" data-native-menu="false" >
           <option value="b">Bowled</option>
           <option value="ct">Caught</option>
        </select>
        <hr />
        Score: <input type="range" name="slider-3" id="scoreSelect" value="30" min="0" max="150" data-theme="b" data-track-theme="b" />
        <hr />
        <textarea id="wicketDescription"></textarea>
        <button id="saveWicketButton">Done</button>
        <hr />
    </div>

</asp:Content>

