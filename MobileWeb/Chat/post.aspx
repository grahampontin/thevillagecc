<%@ Page Title="" Language="C#" MasterPageFile="~/MobileWeb/mobile.master" AutoEventWireup="true" CodeFile="post.aspx.cs" Inherits="MobileWeb_post" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
   
    <title>Post</title>
    
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="page_content" Runat="Server">
     <div data-role="header">
         <a href=# data-rel="back" data-icon="back">Cancel</a>
		<h1>VCC Chat</h1>
        <a href="javascript:post()" data-icon="check">Post</a>
	</div><!-- /header -->

	<div data-role="content">	
		<input type=text name=username id=username placeholder="enter your name" /><br /><br />
        <textarea name="comment" id=comment placeholder="speak your brains..." rows=20></textarea>
    </div><!-- /content -->

	<div data-role="footer" >
		<script language="javascript" src="~/MobileWeb/script/mobilechat.js" type="text/javascript"></script>
	</div><!-- /footer -->
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="postPageScripts" Runat="Server">
    <script language="javascript" src="~/MobileWeb/script/mobilechat.js" type="text/javascript"></script>
</asp:Content>

