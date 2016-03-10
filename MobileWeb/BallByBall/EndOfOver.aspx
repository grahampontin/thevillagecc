<%@ Page Title="" Language="C#" MasterPageFile="~/MobileWeb/mobile.master" AutoEventWireup="true" CodeFile="EndOfOver.aspx.cs" Inherits="MobileWeb_EndOfOver" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="page_content" Runat="Server">
    <div data-role="header">
        <a href="BallByBall.aspx" data-icon="back" data-mini="true">Cancel</a>
        <h1>End of Over</h1>
    </div><!-- /header -->
    <div data-role="content">
    
    <ul data-role="listview" data-inset="true" id="overDetailUl">
		<li data-role="list-divider">End of over 1 (<span id="overTotalScore"></span>) VCC <span id="inningsScore"></span>/<span id="inningsWickets"></span> (RR: <span id="inningsRunRate"></span>)</li>
		<span id="overPlaceHolder">
            
        </span>
	</ul>


    <textarea id="overCommentery" placeholder="Fancy adding a spot of chit chat? Do it here."></textarea>
    <label><input type="checkbox" id="tweetThis" />Tweet this?</label>
    <button id="submitToServerButton">Submit to Server</button>
        <hr />
    </div>
    
    <div data-role="popup" id="errorMessage" data-dismissible="true" data-overlay-theme="b" style="min-width:300px;">
		<div data-role="header">
			<h1>Error</h1>
		</div>
		<div data-role="content" id="errorMessageContent">
			Place holder
		</div>
	</div>

</asp:Content>


<asp:Content ID="Content3" ContentPlaceHolderID="postPageScripts" Runat="Server">
    <script language="javascript" src="../script/ballbyball.endofover.js" type="text/javascript"></script>
</asp:Content>