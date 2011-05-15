<%@ Page Title="" Language="C#" MasterPageFile="~/MobileWeb/mobile.master" AutoEventWireup="true" CodeFile="chat.aspx.cs" Inherits="MobileWeb_chat" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <title>VCC Mobile Web | Chat</title>
    
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="page_content" Runat="Server">
    <div data-role="header">
        <a href="javascript:loadChat()" data-icon="refresh" class="refresh-button">Update</a>
		<h1>VCC Chat</h1>
        <a href="post.aspx" data-icon="plus" class="post-button ui-btn-right">Post</a>
        <a href="javascript:home();" data-icon="home" class="home-button ui-btn-right" style="display: none;">Today</a>
        
	</div><!-- /header -->

	<div data-role="content">	
		<div id="MobileChatContainer">
        <ul class=ChatContent>
            <!-- AJAX LOAD HERE -->
        </ul>
        </div>

	</div><!-- /content -->

	<div data-role="footer" class="ui-bar ui-header">
        <asp:HyperLink ID="previousDay" runat=server Text="Prev" data-role="button"  data-icon="arrow-l" class="ui-btn-left previous-button"></asp:HyperLink>
        <h4><span class="footerMessage"></span></h4>
        <asp:HyperLink ID="nextDay" runat=server Text="Next" data-role="button" data-icon="arrow-r" class="ui-btn-right footer-btn-fix next-button"></asp:HyperLink>
        
		
	</div><!-- /footer -->
</asp:Content>

