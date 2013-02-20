<%@ Page Title="" Language="C#" MasterPageFile="~/MobileWeb/mobile.master" AutoEventWireup="true" CodeFile="ChooseBatsmen.aspx.cs" Inherits="MobileWeb.BallByBall.MobileWeb_ChooseBatsmen" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    Wicket!
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="page_content" Runat="Server">
    <div data-role="header">
        <h1>Choose Batsmen</h1>
    </div><!-- /header -->
    
    <div data-role="content">
        <hr />
        <label for="select-choice-1">Batsman 1:</label>
        <select name="select-choice-1" id="batsman1select" data-native-menu="false" >
        </select>
        <hr />
        <label for="select-choice-2">Batsman 2:</label>
        <select name="select-choice-2" id="batsman2select" data-native-menu="false" >
        </select>
        <hr />
        <button id="chooseBatsmenSaveButton">Done</button>
        <hr />
    </div>
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="postPageScripts" Runat="Server">
    <script language="javascript" src="../script/ballbyball.chooseBatsmen.js" type="text/javascript"></script>
</asp:Content>

