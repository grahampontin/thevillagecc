<%@ Page Title="" Language="C#" MasterPageFile="~/MobileWeb/mobile.master" AutoEventWireup="true" CodeFile="EndOfOver.aspx.cs" Inherits="MobileWeb_EndOfOver" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="page_content" Runat="Server">
    <div data-role="header">
        <h1>End of Over</h1>
    </div><!-- /header -->
    <div data-role="content">
    
    <ul data-role="listview" data-inset="true" id="overDetailUl">
		<li data-role="list-divider">End of over 1 (<span id="overTotalScore"></span>) VCC <span id="inningsScore"></span>/<span id="inningsWickets"></span> (RR: <span id="inningsRunRate"></span>)</li>
		<span id="overPlaceHolder">
            
        </span>
	</ul>


     
    
            <button id="submitToServerButton">Submit to Server</button>
        <hr />
    </div>
</asp:Content>

