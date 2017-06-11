<%@ Page Title="" Language="C#" MasterPageFile="~/MobileWeb/mobile.master" AutoEventWireup="true" CodeFile="HelpMenu.aspx.cs" Inherits="MobileWeb_BallByBall_HelpMenu" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    Help!
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="page_content" Runat="Server">
    <div data-role="header" data-add-back-btn="true">
        <h1>Help!</h1>
    </div><!-- /header -->
    <div data-role="content">
        <ul data-role="listview" data-inset="true">
            <li data-role="list-divider">Available Fixes</li>
            <li data-icon="delete" id="deleteLastOver"><a href="#">Delete Last Over</a></li>
            <li data-icon="edit"><a href="#">Edit Last Over</a></li>
            <li data-icon="ambulance" id="backToMatchSelect"><a href="#">Back to match select</a></li>
        </ul>    
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
</asp:Content>

